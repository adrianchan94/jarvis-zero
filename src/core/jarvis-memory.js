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
        // Initialize IndexedDB for persistent memory storage
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('JarvisMemoryDB', 1);
            
            request.onerror = () => {
                console.error('❌ Error opening IndexedDB:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized for persistent memory');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
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

    findMemoryConnections(input) {
        const inputLower = input.toLowerCase();
        const keywords = this.extractKeywords(inputLower);
        const connections = [];
        
        // Search through memories for connections
        for (const [key, memory] of this.longTermMemory) {
            if (memory.content) {
                const memoryLower = memory.content.toLowerCase();
                let relevanceScore = 0;
                
                // Calculate semantic relevance
                for (const keyword of keywords) {
                    if (memoryLower.includes(keyword)) {
                        relevanceScore += 0.3;
                    }
                }
                
                // Add temporal relevance
                const daysSince = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
                const temporalBonus = Math.max(0, 1 - daysSince / 30) * 0.2;
                relevanceScore += temporalBonus;
                
                if (relevanceScore > 0.3) {
                    connections.push({
                        memory: memory,
                        relevance: relevanceScore,
                        keywords: keywords.filter(k => memoryLower.includes(k))
                    });
                }
            }
        }
        
        return connections
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 5);
    }

    async getRelevantConversationHistory(input) {
        if (this.experiences.length === 0) return null;
        
        const inputLower = input.toLowerCase();
        const relevantExperiences = [];
        
        // Get recent experiences (last 10)
        const recentExperiences = this.experiences.slice(-10);
        
        for (const exp of recentExperiences) {
            let relevance = 0;
            
            // Calculate semantic relevance
            relevance += this.calculateSemanticRelevance(inputLower, exp.input?.toLowerCase() || '');
            
            // Calculate personal relevance
            relevance += this.calculatePersonalRelevance(exp, input);
            
            // Calculate temporal relevance (more recent = more relevant)
            relevance += this.calculateTemporalRelevance(exp.timestamp);
            
            if (relevance > 0.3) {
                relevantExperiences.push({
                    experience: exp,
                    relevance: relevance
                });
            }
        }
        
        // Sort by relevance and take top 3
        relevantExperiences.sort((a, b) => b.relevance - a.relevance);
        const topExperiences = relevantExperiences.slice(0, 3);
        
        if (topExperiences.length === 0) return null;
        
        // Format for context
        const contextString = topExperiences
            .map(item => this.formatMemoryForContext(item.experience))
            .join('\n');
        
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

    initializeConversationThread() {
        this.currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return this.currentConversationId;
    }

    getConversationalHistory() {
        return this.experiences
            .slice(-5)
            .map(exp => ({
                input: exp.input,
                timestamp: exp.timestamp,
                emotion: exp.emotionalState
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
} 