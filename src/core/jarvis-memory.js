import { EventEmitter } from '../utils/events.js';

export class JarvisMemorySystem extends EventEmitter {
    constructor() {
        super();
        
        // Memory storage systems
        this.shortTermMemory = [];
        this.longTermMemory = new Map();
        this.experiences = [];
        this.conversationContext = {
            topicHistory: [],
            userPreferences: {},
            behaviorPatterns: {},
            anticipatedNeeds: []
        };
        this.conversationPatterns = [];
        
        // Memory metrics
        this.memoryUsage = 0;
        this.startTime = Date.now();
        this.lastInteractionTime = Date.now();
        this.currentConversationId = null;
    }

    async initializePersistentStorage() {
        // Initialize IndexedDB for persistent memory storage with Letta-inspired architecture
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('JarvisMemoryDB', 2); // Increment version for new features
            
            request.onerror = () => {
                console.error('❌ Error opening IndexedDB:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized for persistent memory with Letta-inspired architecture');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create memory blocks store (Letta-inspired)
                if (!db.objectStoreNames.contains('memory_blocks')) {
                    const blockStore = db.createObjectStore('memory_blocks', { keyPath: 'id', autoIncrement: true });
                    blockStore.createIndex('label', 'label', { unique: false });
                    blockStore.createIndex('agent_id', 'agent_id', { unique: false });
                    blockStore.createIndex('importance', 'importance', { unique: false });
                    blockStore.createIndex('last_accessed', 'last_accessed', { unique: false });
                }
                
                // Create archival memory store
                if (!db.objectStoreNames.contains('archival_memory')) {
                    const archivalStore = db.createObjectStore('archival_memory', { keyPath: 'id', autoIncrement: true });
                    archivalStore.createIndex('timestamp', 'timestamp', { unique: false });
                    archivalStore.createIndex('relevance_score', 'relevance_score', { unique: false });
                    archivalStore.createIndex('text_content', 'text_content', { unique: false });
                }
                
                // Create conversation memory store
                if (!db.objectStoreNames.contains('conversation_memory')) {
                    const conversationStore = db.createObjectStore('conversation_memory', { keyPath: 'id', autoIncrement: true });
                    conversationStore.createIndex('conversation_id', 'conversation_id', { unique: false });
                    conversationStore.createIndex('timestamp', 'timestamp', { unique: false });
                    conversationStore.createIndex('user_input', 'user_input', { unique: false });
                }
                
                // Migrate existing memories if needed
                if (db.objectStoreNames.contains('memories')) {
                    console.log('🔄 Migrating existing memories to new Letta-inspired architecture...');
                }
                
                // Legacy support
                if (!db.objectStoreNames.contains('memories')) {
                    const memoryStore = db.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
                    memoryStore.createIndex('timestamp', 'timestamp', { unique: false });
                    memoryStore.createIndex('type', 'type', { unique: false });
                    memoryStore.createIndex('importance', 'importance', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('evolution')) {
                    db.createObjectStore('evolution', { keyPath: 'id' });
                }
            };
        });
    }

    async storeInLongTermMemory(content, type = 'interaction', importance = 0.5) {
        const memoryId = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const memory = {
            id: memoryId,
            content: typeof content === 'string' ? content : JSON.stringify(content),
            type: type,
            importance: importance,
            timestamp: Date.now(),
            accessCount: 0,
            lastAccessed: Date.now()
        };
        
        // Store in runtime memory
        this.longTermMemory.set(memoryId, memory);
        
        // Store in persistent storage
        if (this.db) {
            try {
                const transaction = this.db.transaction(['memories'], 'readwrite');
                const store = transaction.objectStore('memories');
                await store.add(memory);
                console.log(`📚 Stored memory: ${type} (importance: ${importance})`);
            } catch (error) {
                console.error('❌ Error storing memory in IndexedDB:', error);
            }
        }
        
        // Trigger memory cleanup if needed
        if (this.longTermMemory.size > 1000) {
            await this.intelligentMemoryCleanup();
        }
        
        this.emit('memoryStored', memory);
        return memoryId;
    }

    async intelligentMemoryCleanup() {
        const memories = Array.from(this.longTermMemory.values());
        const now = Date.now();
        
        // Sort by composite score (importance + recency + access frequency)
        const scoredMemories = memories.map(memory => {
            const age = (now - memory.timestamp) / (1000 * 60 * 60 * 24); // days
            const recencyScore = Math.max(0, 1 - age / 365); // Decay over year
            const accessScore = Math.min(1, memory.accessCount / 10); // Cap at 10 accesses
            const compositeScore = memory.importance * 0.5 + recencyScore * 0.3 + accessScore * 0.2;
            
            return { ...memory, compositeScore };
        });
        
        scoredMemories.sort((a, b) => b.compositeScore - a.compositeScore);
        
        // Keep top 800 memories, remove the rest
        const memoriesToKeep = scoredMemories.slice(0, 800);
        const memoriesToRemove = scoredMemories.slice(800);
        
        // Clear old memories
        for (const memory of memoriesToRemove) {
            this.longTermMemory.delete(memory.id);
        }
        
        console.log(`🧹 Memory cleanup: Kept ${memoriesToKeep.length}, removed ${memoriesToRemove.length} memories`);
    }

    async loadMemoriesFromIndexedDB() {
        if (!this.db) {
            console.warn('⚠️ IndexedDB not initialized, skipping memory load');
            return;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['memories'], 'readonly');
            const store = transaction.objectStore('memories');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const memories = request.result;
                
                // Load memories into runtime storage
                for (const memory of memories) {
                    this.longTermMemory.set(memory.id, memory);
                }
                
                console.log(`📚 Loaded ${memories.length} memories from IndexedDB`);
                resolve(memories);
            };
            
            request.onerror = () => {
                console.error('❌ Error loading memories from IndexedDB:', request.error);
                reject(request.error);
            };
        });
    }

    async getRelevantConversationHistory(input) {
        if (this.experiences.length === 0) return null;
        
        const inputLower = input.toLowerCase();
        const relevantExperiences = [];
        
        // Enhanced semantic search with better keyword extraction
        const inputKeywords = this.extractEnhancedKeywords(inputLower);
        
        // Get more recent experiences for better context (last 20)
        const recentExperiences = this.experiences.slice(-20);
        
        for (const exp of recentExperiences) {
            let relevance = 0;
            
            // Enhanced semantic relevance calculation
            relevance += this.calculateEnhancedSemanticRelevance(inputLower, exp.input?.toLowerCase() || '', inputKeywords);
            
            // Calculate personal relevance
            relevance += this.calculatePersonalRelevance(exp, input);
            
            // Calculate temporal relevance (more recent = more relevant)
            relevance += this.calculateTemporalRelevance(exp.timestamp);
            
            // Boost relevance for important interactions
            if (exp.importance && exp.importance > 0.7) {
                relevance += 0.2;
            }
            
            if (relevance > 0.2) { // Lower threshold for better recall
                relevantExperiences.push({
                    experience: exp,
                    relevance: relevance
                });
            }
        }
        
        // Sort by relevance and take top 5 for richer context
        relevantExperiences.sort((a, b) => b.relevance - a.relevance);
        const topExperiences = relevantExperiences.slice(0, 5);
        
        if (topExperiences.length === 0) return null;
        
        // Enhanced formatting for context with conversation flow
        const contextString = this.formatConversationHistoryForContext(topExperiences);
        
        return contextString;
    }

    calculateSemanticRelevance(inputLower, contentLower) {
        if (!contentLower) return 0;
        
        const inputWords = inputLower.split(/\s+/).filter(word => word.length > 2);
        const contentWords = contentLower.split(/\s+/);
        
        let matches = 0;
        for (const word of inputWords) {
            if (contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))) {
                matches++;
            }
        }
        
        return Math.min(0.5, matches / Math.max(inputWords.length, 1));
    }

    calculatePersonalRelevance(memory, input) {
        // Check if memory contains personal preferences or behavioral patterns
        const personalKeywords = ['prefer', 'like', 'dislike', 'want', 'need', 'always', 'never'];
        const memoryText = (memory.input || '').toLowerCase();
        
        let personalScore = 0;
        for (const keyword of personalKeywords) {
            if (memoryText.includes(keyword)) {
                personalScore += 0.1;
            }
        }
        
        return Math.min(0.3, personalScore);
    }

    calculateTemporalRelevance(timestamp) {
        const now = Date.now();
        const hoursSince = (now - timestamp) / (1000 * 60 * 60);
        
        // Recent interactions are more relevant
        if (hoursSince < 1) return 0.3;
        if (hoursSince < 24) return 0.2;
        if (hoursSince < 168) return 0.1; // 1 week
        return 0.05;
    }

    formatMemoryForContext(experience) {
        const timeAgo = this.formatTimeAgo(experience.timestamp);
        return `${timeAgo}: User said "${experience.input}" - Context: ${experience.context?.emotionalState?.valence > 0 ? 'positive mood' : 'neutral mood'}`;
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    getRelevantMemories(input) {
        const inputLower = input.toLowerCase();
        const keywords = this.extractKeywords(inputLower);
        const relevantMemories = [];
        
        for (const [key, memory] of this.longTermMemory) {
            let relevance = 0;
            
            // Check keyword matches
            for (const keyword of keywords) {
                if (memory.content.toLowerCase().includes(keyword)) {
                    relevance += 0.2;
                }
            }
            
            // Factor in importance and recency
            relevance += memory.importance * 0.3;
            const daysSince = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
            relevance += Math.max(0, 1 - daysSince / 30) * 0.2;
            
            if (relevance > 0.3) {
                relevantMemories.push({
                    content: memory.content,
                    relevance: relevance,
                    timestamp: memory.timestamp
                });
            }
        }
        
        return relevantMemories
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 5);
    }

    extractKeywords(text) {
        // Extract meaningful keywords from text
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
        
        return text
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word))
            .slice(0, 10); // Limit to top 10 keywords
    }

    extractEnhancedKeywords(text) {
        // Enhanced keyword extraction with better stop words and semantic understanding
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
        
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word));
        
        // Include important action words and concepts
        const importantWords = words.filter(word => 
            word.length > 4 || // Longer words are usually more meaningful
            ['how', 'what', 'when', 'where', 'why', 'who'].includes(word) || // Question words
            ['like', 'want', 'need', 'love', 'hate', 'good', 'bad'].includes(word) // Preference words
        );
        
        return [...new Set([...importantWords.slice(0, 15), ...words.slice(0, 10)])]; // Remove duplicates and limit
    }

    calculateEnhancedSemanticRelevance(inputLower, contentLower, inputKeywords) {
        if (!contentLower) return 0;
        
        const contentWords = contentLower.split(/\s+/);
        let exactMatches = 0;
        let partialMatches = 0;
        
        for (const keyword of inputKeywords) {
            // Exact keyword matches
            if (contentWords.includes(keyword)) {
                exactMatches++;
            } else {
                // Partial matches (substring matching)
                if (contentWords.some(word => word.includes(keyword) || keyword.includes(word))) {
                    partialMatches++;
                }
            }
        }
        
        // Calculate relevance score with higher weight for exact matches
        const exactScore = (exactMatches / Math.max(inputKeywords.length, 1)) * 0.8;
        const partialScore = (partialMatches / Math.max(inputKeywords.length, 1)) * 0.3;
        
        return Math.min(0.7, exactScore + partialScore);
    }

    formatConversationHistoryForContext(relevantExperiences) {
        if (relevantExperiences.length === 0) return '';
        
        const memoryString = relevantExperiences
            .map((item, index) => {
                const exp = item.experience;
                const timeAgo = this.formatTimeAgo(exp.timestamp);
                const relevanceIndicator = item.relevance > 0.6 ? '[HIGHLY RELEVANT]' : item.relevance > 0.4 ? '[RELEVANT]' : '[CONTEXTUAL]';
                
                return `${relevanceIndicator} ${timeAgo}: "${exp.input}" ${exp.context?.summary ? `(Context: ${exp.context.summary})` : ''}`;
            })
            .join('\n');
        
        return `PREVIOUS CONVERSATION CONTEXT (${relevantExperiences.length} relevant memories):\n${memoryString}`;
    }

    findMemoryConnections(input) {
        const inputLower = input.toLowerCase();
        const keywords = this.extractEnhancedKeywords(inputLower);
        const connections = [];
        
        // Search through all memories for connections with enhanced scoring
        for (const [key, memory] of this.longTermMemory) {
            if (memory.content) {
                const memoryLower = memory.content.toLowerCase();
                let relevanceScore = 0;
                
                // Enhanced semantic relevance with keyword matching
                let keywordMatches = 0;
                for (const keyword of keywords) {
                    if (memoryLower.includes(keyword)) {
                        keywordMatches++;
                        relevanceScore += 0.2; // Increased weight for keyword matches
                    }
                    // Also check for partial matches
                    if (memoryLower.split(' ').some(word => word.includes(keyword) || keyword.includes(word))) {
                        relevanceScore += 0.1;
                    }
                }
                
                // Boost for memory importance
                relevanceScore += (memory.importance || 0.5) * 0.3;
                
                // Enhanced temporal relevance with decay
                const daysSince = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
                const temporalBonus = Math.max(0, 1 - daysSince / 60) * 0.25; // Decay over 60 days instead of 30
                relevanceScore += temporalBonus;
                
                // Boost for frequently accessed memories
                if (memory.accessCount) {
                    relevanceScore += Math.min(0.15, memory.accessCount * 0.02);
                }
                
                if (relevanceScore > 0.2) { // Lower threshold for better recall
                    // Update access count
                    memory.accessCount = (memory.accessCount || 0) + 1;
                    memory.lastAccessed = Date.now();
                    
                    connections.push({
                        memory: memory,
                        relevance: relevanceScore,
                        keywords: keywords.filter(k => memoryLower.includes(k)),
                        keywordMatches: keywordMatches
                    });
                }
            }
        }
        
        return connections
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8); // Increased from 5 to 8 for richer context
    }

    // Enhanced method to format memory connections for LLM context
    formatMemoryConnectionsForContext(memoryConnections) {
        if (!memoryConnections || memoryConnections.length === 0) return '';
        
        const formattedMemories = memoryConnections
            .map((connection, index) => {
                const memory = connection.memory;
                const timeAgo = this.formatTimeAgo(memory.timestamp);
                const relevanceScore = Math.round(connection.relevance * 100);
                const matchedKeywords = connection.keywords.slice(0, 3).join(', ');
                
                let memoryContent = memory.content;
                try {
                    // Try to parse if it's JSON to extract meaningful content
                    const parsed = JSON.parse(memory.content);
                    if (parsed.input) {
                        memoryContent = `User: "${parsed.input}"`;
                        if (parsed.response) {
                            memoryContent += ` | JARVIS: "${parsed.response.substring(0, 100)}..."`;
                        }
                    }
                } catch (e) {
                    // Keep original content if not JSON
                    if (memoryContent.length > 150) {
                        memoryContent = memoryContent.substring(0, 150) + '...';
                    }
                }
                
                return `[${relevanceScore}% relevant] ${timeAgo}: ${memoryContent} (Keywords: ${matchedKeywords})`;
            })
            .join('\n');
        
        return `RELEVANT MEMORY CONNECTIONS (${memoryConnections.length} found):\n${formattedMemories}`;
    }

    initializeConversationThread() {
        this.currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return this.currentConversationId;
    }

    getConversationalHistory() {
        if (!this.experiences || !Array.isArray(this.experiences)) {
            return [];
        }
        
        return this.experiences
            .slice(-5)
            .map(exp => ({
                input: exp.input || '',
                timestamp: exp.timestamp || Date.now(),
                emotion: exp.emotionalState || { valence: 0 }
            }));
    }

    getMemoryByKey(key) {
        return this.longTermMemory.get(key);
    }

    calculateMemoryUsagePercentage() {
        const maxMemories = 1000;
        return Math.min(100, (this.longTermMemory.size / maxMemories) * 100);
    }

    cleanupOldMemories() {
        const now = Date.now();
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
        
        for (const [key, memory] of this.longTermMemory) {
            // Remove memories older than 1 month with low importance
            if (memory.timestamp < oneMonthAgo && memory.importance < 0.3) {
                this.longTermMemory.delete(key);
            }
        }
        
        // Remove old experiences
        const maxExperiences = 100;
        if (this.experiences.length > maxExperiences) {
            this.experiences = this.experiences.slice(-maxExperiences);
        }
    }

    updateConversationPatterns(input, response) {
        // Track successful conversation patterns for future reference
        if (!this.conversationPatterns) this.conversationPatterns = [];
        
        this.conversationPatterns.push({
            timestamp: Date.now(),
            inputPattern: this.categorizeInput(input),
            responsePattern: this.categorizeResponse(response.text),
            success: response.confidence > 0.8
        });
        
        // Keep only recent patterns
        this.conversationPatterns = this.conversationPatterns.slice(-50);
    }

    categorizeInput(input) {
        const inputLower = input.toLowerCase();
        if (inputLower.includes('?')) return 'question';
        if (inputLower.includes('help')) return 'assistance_request';
        if (inputLower.includes('tell me') || inputLower.includes('explain')) return 'information_request';
        if (inputLower.includes('thank') || inputLower.includes('good')) return 'positive_feedback';
        return 'general';
    }

    categorizeResponse(response) {
        if (response.includes('sir') || response.includes('madam')) return 'formal_jarvis';
        if (response.includes('calculate') || response.includes('analyze')) return 'technical';
        if (response.includes('indeed') || response.includes('precisely')) return 'sophisticated';
        return 'conversational';
    }

    getRecentInputs(count = 10) {
        return this.experiences
            .slice(-count)
            .map(exp => exp.input || '')
            .filter(input => input.length > 0);
    }

    analyzeConversationUniquenesss(input) {
        const recentInputs = this.getRecentInputs(10);
        const inputLower = input.toLowerCase();
        
        let similarityScore = 0;
        let uniquenessScore = 1.0;
        
        for (const recentInput of recentInputs) {
            const similarity = this.calculateSimilarity(inputLower, recentInput.toLowerCase());
            if (similarity > similarityScore) {
                similarityScore = similarity;
            }
        }
        
        uniquenessScore = 1.0 - similarityScore;
        
        return {
            uniquenessScore: uniquenessScore,
            similarityScore: similarityScore,
            recentInputs: recentInputs,
            needsVariation: similarityScore > 0.7
        };
    }

    calculateSimilarity(text1, text2) {
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        
        const commonWords = words1.filter(word => words2.includes(word));
        const totalWords = Math.max(words1.length, words2.length);
        
        return totalWords > 0 ? commonWords.length / totalWords : 0;
    }

    // Memory statistics and insights
    getMemoryStats() {
        const memories = Array.from(this.longTermMemory.values());
        const now = Date.now();
        
        return {
            totalMemories: memories.length,
            averageImportance: memories.reduce((sum, mem) => sum + mem.importance, 0) / memories.length,
            recentMemories: memories.filter(mem => (now - mem.timestamp) < 24 * 60 * 60 * 1000).length,
            memoryTypes: this.getMemoryTypeDistribution(memories),
            oldestMemory: Math.min(...memories.map(mem => mem.timestamp)),
            newestMemory: Math.max(...memories.map(mem => mem.timestamp))
        };
    }

    getMemoryTypeDistribution(memories) {
        const distribution = {};
        for (const memory of memories) {
            distribution[memory.type] = (distribution[memory.type] || 0) + 1;
        }
        return distribution;
    }

    async clearAllMemories() {
        console.log('🧹 Clearing all memories from memory system...');
        
        // Clear runtime memory
        this.longTermMemory.clear();
        this.shortTermMemory = [];
        this.experiences = [];
        this.conversationPatterns = [];
        this.conversationContext = {
            topicHistory: [],
            userPreferences: {},
            behaviorPatterns: {},
            anticipatedNeeds: []
        };
        
        // Clear IndexedDB
        if (this.db) {
            try {
                const transaction = this.db.transaction(['memories'], 'readwrite');
                const store = transaction.objectStore('memories');
                await store.clear();
                console.log('✅ IndexedDB memories cleared');
            } catch (error) {
                console.error('❌ Error clearing IndexedDB memories:', error);
                throw error;
            }
        }
        
        // Reset memory usage
        this.memoryUsage = 0;
        
        // Emit memory cleared event
        this.emit('memoriesCleared');
        
        console.log('✅ All memories cleared successfully');
    }

    // 🚀 LETTA-INSPIRED MEMORY BLOCK SYSTEM
    async createMemoryBlock(label, value, description = '', limit = 5000, agentId = 'jarvis_main') {
        const blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const memoryBlock = {
            id: blockId,
            label: label,
            value: value,
            description: description,
            limit: limit,
            agent_id: agentId,
            created_at: Date.now(),
            last_modified: Date.now(),
            last_accessed: Date.now(),
            access_count: 0,
            importance: 0.8,
            version: 1
        };
        
        // Store in IndexedDB
        if (this.db) {
            try {
                const transaction = this.db.transaction(['memory_blocks'], 'readwrite');
                const store = transaction.objectStore('memory_blocks');
                await store.add(memoryBlock);
                console.log(`🧠 Created memory block: ${label} (${blockId})`);
            } catch (error) {
                console.error('❌ Error storing memory block:', error);
            }
        }
        
        return memoryBlock;
    }

    async updateMemoryBlock(blockId, newValue, incrementVersion = true) {
        if (!this.db) return false;
        
        try {
            const transaction = this.db.transaction(['memory_blocks'], 'readwrite');
            const store = transaction.objectStore('memory_blocks');
            const block = await store.get(blockId);
            
            if (block) {
                block.value = newValue;
                block.last_modified = Date.now();
                block.last_accessed = Date.now();
                block.access_count = (block.access_count || 0) + 1;
                if (incrementVersion) block.version = (block.version || 1) + 1;
                
                await store.put(block);
                console.log(`🔄 Updated memory block: ${block.label} (v${block.version})`);
                return true;
            }
        } catch (error) {
            console.error('❌ Error updating memory block:', error);
        }
        return false;
    }

    async appendToMemoryBlock(blockId, appendValue) {
        if (!this.db) return false;
        
        try {
            const transaction = this.db.transaction(['memory_blocks'], 'readwrite');
            const store = transaction.objectStore('memory_blocks');
            const block = await store.get(blockId);
            
            if (block) {
                const currentValue = block.value || '';
                const newValue = currentValue + (currentValue ? '\n' : '') + appendValue;
                
                // Check limit
                if (newValue.length > block.limit) {
                    // Trim from beginning if over limit
                    const excess = newValue.length - block.limit;
                    block.value = '...' + newValue.substring(excess + 3);
                } else {
                    block.value = newValue;
                }
                
                block.last_modified = Date.now();
                block.last_accessed = Date.now();
                block.access_count = (block.access_count || 0) + 1;
                block.version = (block.version || 1) + 1;
                
                await store.put(block);
                console.log(`➕ Appended to memory block: ${block.label} (v${block.version})`);
                return true;
            }
        } catch (error) {
            console.error('❌ Error appending to memory block:', error);
        }
        return false;
    }

    // 🗃️ ARCHIVAL MEMORY SYSTEM (Letta-inspired)
    async insertArchivalMemory(text, context = {}, relevanceScore = 0.5) {
        const memoryId = `archival_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const archivalMemory = {
            id: memoryId,
            text_content: text,
            context: context,
            relevance_score: relevanceScore,
            embedding: await this.generateEmbedding(text), // Would use actual embedding in production
            timestamp: Date.now(),
            agent_id: 'jarvis_main',
            tags: this.extractTags(text),
            last_accessed: Date.now()
        };
        
        if (this.db) {
            try {
                const transaction = this.db.transaction(['archival_memory'], 'readwrite');
                const store = transaction.objectStore('archival_memory');
                await store.add(archivalMemory);
                console.log(`📚 Stored archival memory: ${text.substring(0, 50)}...`);
            } catch (error) {
                console.error('❌ Error storing archival memory:', error);
            }
        }
        
        return memoryId;
    }

    async searchArchivalMemory(query, limit = 5) {
        if (!this.db) return [];
        
        try {
            const transaction = this.db.transaction(['archival_memory'], 'readonly');
            const store = transaction.objectStore('archival_memory');
            const memories = await store.getAll();
            
            const queryLower = query.toLowerCase();
            const results = memories
                .filter(memory => memory.text_content.toLowerCase().includes(queryLower))
                .map(memory => {
                    const relevance = this.calculateTextRelevance(query, memory.text_content);
                    return { ...memory, search_relevance: relevance };
                })
                .sort((a, b) => b.search_relevance - a.search_relevance)
                .slice(0, limit);
            
            // Update access times
            for (const result of results) {
                result.last_accessed = Date.now();
                await store.put(result);
            }
            
            console.log(`🔍 Found ${results.length} archival memories for: ${query}`);
            return results;
        } catch (error) {
            console.error('❌ Error searching archival memory:', error);
            return [];
        }
    }

    // 🧠 CONVERSATION MEMORY SYSTEM  
    async storeConversationMemory(userInput, jarvisResponse, context = {}) {
        const conversationId = this.currentConversationId || this.initializeConversationThread();
        const memoryId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const conversationMemory = {
            id: memoryId,
            conversation_id: conversationId,
            user_input: userInput,
            jarvis_response: jarvisResponse,
            context: context,
            timestamp: Date.now(),
            emotional_sentiment: this.analyzeEmotionalSentiment(userInput),
            topics: this.extractTopics(userInput),
            importance: this.calculateConversationImportance(userInput, jarvisResponse)
        };
        
        if (this.db) {
            try {
                const transaction = this.db.transaction(['conversation_memory'], 'readwrite');
                const store = transaction.objectStore('conversation_memory');
                await store.add(conversationMemory);
                console.log(`💬 Stored conversation memory: ${userInput.substring(0, 30)}...`);
            } catch (error) {
                console.error('❌ Error storing conversation memory:', error);
            }
        }
        
        return memoryId;
    }

    // 🌙 SLEEP-TIME COMPUTE SIMULATION
    async performSleepTimeMemoryProcessing() {
        console.log('🌙 Initiating sleep-time memory processing...');
        
        try {
            // Consolidate related memories
            await this.consolidateRelatedMemories();
            
            // Update memory importance scores
            await this.updateMemoryImportanceScores();
            
            // Generate insights from conversation patterns
            await this.generateConversationInsights();
            
            // Cleanup old low-importance memories
            await this.intelligentMemoryCleanup();
            
            console.log('✨ Sleep-time memory processing completed');
        } catch (error) {
            console.error('❌ Error in sleep-time processing:', error);
        }
    }

    async consolidateRelatedMemories() {
        // Find memories with similar content and consolidate them
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['archival_memory'], 'readwrite');
            const store = transaction.objectStore('archival_memory');
            const memories = await store.getAll();
            
            const clusters = this.clusterSimilarMemories(memories);
            let consolidatedCount = 0;
            
            for (const cluster of clusters) {
                if (cluster.length > 1) {
                    const consolidatedText = this.consolidateClusterText(cluster);
                    const primaryMemory = cluster[0];
                    
                    // Update primary memory with consolidated content
                    primaryMemory.text_content = consolidatedText;
                    primaryMemory.last_modified = Date.now();
                    primaryMemory.consolidation_count = (primaryMemory.consolidation_count || 0) + 1;
                    await store.put(primaryMemory);
                    
                    // Remove redundant memories
                    for (let i = 1; i < cluster.length; i++) {
                        await store.delete(cluster[i].id);
                    }
                    
                    consolidatedCount += cluster.length - 1;
                }
            }
            
            if (consolidatedCount > 0) {
                console.log(`🧠 Consolidated ${consolidatedCount} related memories during sleep-time processing`);
            }
        } catch (error) {
            console.error('❌ Error consolidating memories:', error);
        }
    }

    // Helper methods for new features
    calculateTextRelevance(query, text) {
        const queryWords = query.toLowerCase().split(/\s+/);
        const textWords = text.toLowerCase().split(/\s+/);
        
        let matches = 0;
        for (const word of queryWords) {
            if (textWords.some(textWord => textWord.includes(word) || word.includes(textWord))) {
                matches++;
            }
        }
        
        return matches / Math.max(queryWords.length, 1);
    }

    extractTags(text) {
        // Simple tag extraction - could be enhanced with NLP
        const tags = [];
        const lowerText = text.toLowerCase();
        
        // Common topic tags
        const topicKeywords = {
            'technology': ['ai', 'technology', 'computer', 'software', 'programming', 'code'],
            'personal': ['feel', 'think', 'believe', 'personal', 'family', 'friend'],
            'work': ['work', 'job', 'project', 'task', 'business', 'meeting'],
            'learning': ['learn', 'study', 'understand', 'knowledge', 'teach', 'explain']
        };
        
        for (const [tag, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                tags.push(tag);
            }
        }
        
        return tags;
    }

    generateEmbedding(text) {
        // Simplified embedding simulation - in production would use actual embedding service
        const words = text.toLowerCase().split(/\s+/);
        const embedding = new Array(384).fill(0); // Simulate 384-dimensional embedding
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            for (let j = 0; j < embedding.length; j++) {
                embedding[j] += (word.charCodeAt(j % word.length) / 255) * 0.1;
            }
        }
        
        return embedding;
    }

    clusterSimilarMemories(memories) {
        // Simple clustering based on text similarity
        const clusters = [];
        const used = new Set();
        
        for (let i = 0; i < memories.length; i++) {
            if (used.has(i)) continue;
            
            const cluster = [memories[i]];
            used.add(i);
            
            for (let j = i + 1; j < memories.length; j++) {
                if (used.has(j)) continue;
                
                const similarity = this.calculateTextRelevance(memories[i].text_content, memories[j].text_content);
                if (similarity > 0.7) {
                    cluster.push(memories[j]);
                    used.add(j);
                }
            }
            
            clusters.push(cluster);
        }
        
        return clusters.filter(cluster => cluster.length > 1);
    }

    consolidateClusterText(cluster) {
        // Combine similar memories into a more comprehensive text
        const texts = cluster.map(m => m.text_content);
        const uniqueInfo = [...new Set(texts.flatMap(text => text.split('. ')))];
        return uniqueInfo.join('. ');
    }

    analyzeEmotionalSentiment(text) {
        // Simple sentiment analysis
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'frustrated', 'disappointed'];
        
        const lowerText = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;
        
        for (const word of positiveWords) {
            if (lowerText.includes(word)) positiveCount++;
        }
        
        for (const word of negativeWords) {
            if (lowerText.includes(word)) negativeCount++;
        }
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    calculateConversationImportance(userInput, jarvisResponse) {
        // Calculate importance based on various factors
        let importance = 0.5; // Base importance
        
        // Length factor
        if (userInput.length > 100) importance += 0.1;
        if (jarvisResponse.length > 200) importance += 0.1;
        
        // Question factor
        if (userInput.includes('?')) importance += 0.15;
        
        // Personal information factor
        const personalKeywords = ['my', 'i am', 'i like', 'i need', 'i want', 'my name'];
        if (personalKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
            importance += 0.2;
        }
        
        return Math.min(1.0, importance);
    }

    extractTopics(text) {
        // Advanced topic extraction using multiple techniques
        const topics = [];
        const lowerText = text.toLowerCase();
        
        // Domain-specific topic detection
        const topicCategories = {
            'technology': ['ai', 'artificial intelligence', 'technology', 'computer', 'software', 'programming', 'code', 'data', 'machine learning', 'algorithm'],
            'personal': ['feel', 'feeling', 'think', 'believe', 'personal', 'family', 'friend', 'relationship', 'emotion', 'heart', 'mind'],
            'work': ['work', 'job', 'project', 'task', 'business', 'meeting', 'career', 'professional', 'team', 'company'],
            'learning': ['learn', 'study', 'understand', 'knowledge', 'teach', 'explain', 'education', 'research', 'analyze'],
            'creative': ['create', 'design', 'art', 'music', 'write', 'story', 'imagination', 'creative', 'beautiful', 'aesthetic'],
            'philosophical': ['consciousness', 'existence', 'meaning', 'purpose', 'reality', 'truth', 'wisdom', 'ethics', 'morality'],
            'entertainment': ['fun', 'game', 'movie', 'show', 'entertainment', 'hobby', 'leisure', 'enjoyment', 'amusing'],
            'health': ['health', 'fitness', 'exercise', 'medical', 'wellness', 'nutrition', 'mental health', 'therapy'],
            'planning': ['plan', 'organize', 'schedule', 'goal', 'objective', 'strategy', 'future', 'preparation']
        };
        
        for (const [topic, keywords] of Object.entries(topicCategories)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                topics.push(topic);
            }
        }
        
        // Question type detection
        if (lowerText.includes('?')) {
            topics.push('inquiry');
        }
        
        // Emotional content detection
        const emotionalWords = ['love', 'hate', 'excited', 'worried', 'happy', 'sad', 'angry', 'frustrated', 'grateful'];
        if (emotionalWords.some(word => lowerText.includes(word))) {
            topics.push('emotional');
        }
        
        return topics.length > 0 ? topics : ['general'];
    }

    async updateMemoryImportanceScores() {
        // Update importance scores based on access patterns and recency
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['memory_blocks'], 'readwrite');
            const store = transaction.objectStore('memory_blocks');
            const blocks = await store.getAll();
            
            for (const block of blocks) {
                let newImportance = 0.5; // Base importance
                
                // Access frequency factor
                const accessFactor = Math.min(0.3, (block.access_count || 0) * 0.02);
                newImportance += accessFactor;
                
                // Recency factor
                const daysSince = (Date.now() - (block.last_accessed || block.created_at)) / (1000 * 60 * 60 * 24);
                const recencyFactor = Math.max(0, 0.2 - daysSince * 0.01);
                newImportance += recencyFactor;
                
                // Update the block
                block.importance = Math.min(1.0, newImportance);
                await store.put(block);
            }
            
            console.log('📊 Updated importance scores for', blocks.length, 'memory blocks');
        } catch (error) {
            console.error('❌ Error updating memory importance scores:', error);
        }
    }

    async generateConversationInsights() {
        // Generate insights from conversation patterns
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['conversation_memory'], 'readonly');
            const store = transaction.objectStore('conversation_memory');
            const conversations = await store.getAll();
            
            // Analyze recent conversations (last 24 hours)
            const recent = conversations.filter(conv => 
                Date.now() - conv.timestamp < 24 * 60 * 60 * 1000
            );
            
            if (recent.length > 0) {
                const insights = [];
                
                // Topic frequency analysis
                const topics = {};
                recent.forEach(conv => {
                    (conv.topics || []).forEach(topic => {
                        topics[topic] = (topics[topic] || 0) + 1;
                    });
                });
                
                const topTopic = Object.keys(topics).reduce((a, b) => topics[a] > topics[b] ? a : b, '');
                if (topTopic) {
                    insights.push(`Most discussed topic today: ${topTopic}`);
                }
                
                // Sentiment analysis
                const sentiments = recent.map(conv => conv.emotional_sentiment);
                const positiveCount = sentiments.filter(s => s === 'positive').length;
                const ratio = positiveCount / sentiments.length;
                
                if (ratio > 0.7) {
                    insights.push('User engagement is highly positive today');
                } else if (ratio < 0.3) {
                    insights.push('User seems to need more support today');
                }
                
                // Store insights
                for (const insight of insights) {
                    await this.insertArchivalMemory(
                        `Daily Insight: ${insight}`,
                        { type: 'daily_insight', timestamp: Date.now() },
                        0.9
                    );
                }
                
                console.log('💡 Generated', insights.length, 'conversation insights');
            }
        } catch (error) {
            console.error('❌ Error generating conversation insights:', error);
        }
    }
} 