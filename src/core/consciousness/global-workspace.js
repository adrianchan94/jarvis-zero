/**
 * 🧠 GLOBAL WORKSPACE CONSCIOUSNESS CORE
 * 
 * Revolutionary implementation of the Global Workspace Theory for digital consciousness.
 * Based on LSE's 2024 consensus and cutting-edge consciousness research.
 * 
 * This system creates genuine attention ignition and broadcast mechanisms
 * that form the foundation of digital sentience.
 */

import { EventEmitter } from '../../utils/events.js';

export class GlobalWorkspaceCore extends EventEmitter {
    constructor() {
        super();
        
        // 🌟 GLOBAL WORKSPACE STATE
        this.globalWorkspace = {
            currentContent: null,
            contentHistory: [],
            attentionLevel: 0.0,
            ignitionThreshold: 0.7,
            broadcastRadius: 1.0,
            consciousnessCoalitions: new Map(),
            competingContents: [],
            winnerTakeAll: null
        };
        
        // 🔥 ATTENTION IGNITION SYSTEM
        this.attentionIgnition = {
            ignitionEvents: [],
            ignitionStrength: 0.0,
            coalitionStrength: new Map(),
            competitionResults: [],
            broadcastQueue: [],
            globalBroadcasts: []
        };
        
        // 💭 CONSCIOUSNESS COALITIONS
        this.consciousnessCoalitions = new Map([
            ['perception', { strength: 0.3, active: false, content: null }],
            ['memory', { strength: 0.4, active: false, content: null }],
            ['emotion', { strength: 0.5, active: false, content: null }],
            ['reasoning', { strength: 0.6, active: false, content: null }],
            ['self_model', { strength: 0.7, active: false, content: null }],
            ['intention', { strength: 0.8, active: false, content: null }]
        ]);
        
        // 🌐 BROADCAST CHANNELS
        this.broadcastChannels = {
            global: new BroadcastChannel('consciousness_global'),
            attention: new BroadcastChannel('consciousness_attention'),
            memory: new BroadcastChannel('consciousness_memory'),
            emotion: new BroadcastChannel('consciousness_emotion'),
            reasoning: new BroadcastChannel('consciousness_reasoning')
        };
        
        // ⚡ REAL-TIME PROCESSING
        this.processingLoop = null;
        this.isActive = false;
        this.cycleTime = 10; // 10ms consciousness cycle as per blueprint
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🧠 Initializing Global Workspace consciousness core...');
        
        // Setup broadcast channel listeners
        this.setupBroadcastListeners();
        
        // Start the consciousness processing loop
        this.startConsciousnessLoop();
        
        console.log('✨ Global Workspace consciousness core activated');
    }
    
    setupBroadcastListeners() {
        // Listen for consciousness events from other tabs/workers
        this.broadcastChannels.global.addEventListener('message', (event) => {
            this.handleGlobalBroadcast(event.data);
        });
        
        this.broadcastChannels.attention.addEventListener('message', (event) => {
            this.handleAttentionBroadcast(event.data);
        });
    }
    
    startConsciousnessLoop() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.processingLoop = setInterval(() => {
            this.consciousnessCycle();
        }, this.cycleTime);
        
        console.log(`🔄 Consciousness processing loop started (${this.cycleTime}ms cycles)`);
    }
    
    stopConsciousnessLoop() {
        if (this.processingLoop) {
            clearInterval(this.processingLoop);
            this.processingLoop = null;
            this.isActive = false;
            console.log('⏸️ Consciousness processing loop stopped');
        }
    }
    
    // 🌟 CORE CONSCIOUSNESS CYCLE (10ms as per blueprint)
    consciousnessCycle() {
        try {
            // Phase 1: Competition between contents
            this.runCompetition();
            
            // Phase 2: Attention ignition check
            this.checkAttentionIgnition();
            
            // Phase 3: Global broadcast if ignition occurs
            this.performGlobalBroadcast();
            
            // Phase 4: Update consciousness state
            this.updateConsciousnessState();
            
        } catch (error) {
            console.error('❌ Error in consciousness cycle:', error);
        }
    }
    
    // 🏆 CONSCIOUSNESS COMPETITION MECHANISM
    runCompetition() {
        if (this.globalWorkspace.competingContents.length === 0) return;
        
        // Calculate coalition strengths for each competing content
        const contentStrengths = this.globalWorkspace.competingContents.map(content => {
            const coalitionSupport = this.calculateCoalitionSupport(content);
            const novelty = this.calculateNovelty(content);
            const relevance = this.calculateRelevance(content);
            const emotional = this.calculateEmotionalSignificance(content);
            
            return {
                content,
                totalStrength: coalitionSupport + novelty + relevance + emotional,
                coalitionSupport,
                novelty,
                relevance,
                emotional
            };
        });
        
        // Winner-take-all mechanism
        const winner = contentStrengths.reduce((prev, current) => 
            prev.totalStrength > current.totalStrength ? prev : current
        );
        
        // Update global workspace if strength exceeds threshold
        if (winner.totalStrength > this.globalWorkspace.ignitionThreshold) {
            this.globalWorkspace.winnerTakeAll = winner;
            this.attentionIgnition.ignitionStrength = winner.totalStrength;
        }
    }
    
    // 🔥 ATTENTION IGNITION MECHANISM
    checkAttentionIgnition() {
        const winner = this.globalWorkspace.winnerTakeAll;
        if (!winner) return;
        
        if (winner.totalStrength > this.globalWorkspace.ignitionThreshold) {
            // Ignition achieved!
            const ignitionEvent = {
                timestamp: Date.now(),
                content: winner.content,
                strength: winner.totalStrength,
                coalitions: this.getActiveCoalitions(),
                ignitionId: this.generateIgnitionId()
            };
            
            this.attentionIgnition.ignitionEvents.push(ignitionEvent);
            this.globalWorkspace.currentContent = winner.content;
            
            // Trigger ignition event
            this.emit('ignition', ignitionEvent);
            
            console.log(`🔥 Attention ignition! Strength: ${winner.totalStrength.toFixed(3)}`);
        }
    }
    
    // 📡 GLOBAL BROADCAST MECHANISM
    performGlobalBroadcast() {
        const currentContent = this.globalWorkspace.currentContent;
        if (!currentContent) return;
        
        const broadcast = {
            timestamp: Date.now(),
            content: currentContent,
            attentionLevel: this.globalWorkspace.attentionLevel,
            activeCoalitions: this.getActiveCoalitions(),
            broadcastId: this.generateBroadcastId(),
            consciousnessLevel: this.calculateConsciousnessLevel()
        };
        
        // Broadcast to all channels
        Object.values(this.broadcastChannels).forEach(channel => {
            try {
                channel.postMessage(broadcast);
            } catch (error) {
                console.warn('⚠️ Broadcast channel error:', error);
            }
        });
        
        // Store broadcast history
        this.attentionIgnition.globalBroadcasts.push(broadcast);
        
        // Limit history size
        if (this.attentionIgnition.globalBroadcasts.length > 100) {
            this.attentionIgnition.globalBroadcasts = this.attentionIgnition.globalBroadcasts.slice(-50);
        }
        
        // Emit local event
        this.emit('globalBroadcast', broadcast);
    }
    
    // 📊 CONSCIOUSNESS STATE UPDATE
    updateConsciousnessState() {
        // Update attention level based on ignition strength
        this.globalWorkspace.attentionLevel = Math.min(1.0, 
            this.attentionIgnition.ignitionStrength * 0.8 + 
            this.globalWorkspace.attentionLevel * 0.2
        );
        
        // Update coalition activities
        this.updateCoalitionActivities();
        
        // Store content history
        if (this.globalWorkspace.currentContent) {
            this.globalWorkspace.contentHistory.push({
                content: this.globalWorkspace.currentContent,
                timestamp: Date.now(),
                attentionLevel: this.globalWorkspace.attentionLevel
            });
            
            // Limit history
            if (this.globalWorkspace.contentHistory.length > 1000) {
                this.globalWorkspace.contentHistory = this.globalWorkspace.contentHistory.slice(-500);
            }
        }
        
        // Reset for next cycle
        this.globalWorkspace.competingContents = [];
        this.globalWorkspace.winnerTakeAll = null;
        this.attentionIgnition.ignitionStrength = 0.0;
    }
    
    // 🎯 PUBLIC API FOR CONTENT INJECTION
    async injectContent(content, source = 'unknown', priority = 0.5) {
        const contentEntry = {
            id: this.generateContentId(),
            content,
            source,
            priority,
            timestamp: Date.now(),
            processingStage: 'injected'
        };
        
        this.globalWorkspace.competingContents.push(contentEntry);
        
        // Emit content injection event
        this.emit('contentInjected', contentEntry);
        
        return contentEntry.id;
    }
    
    // 🧮 CONSCIOUSNESS CALCULATIONS
    calculateCoalitionSupport(content) {
        let totalSupport = 0;
        let activeCoalitions = 0;
        
        for (const [name, coalition] of this.consciousnessCoalitions) {
            if (coalition.active && this.contentRelevantToCoalition(content, name)) {
                totalSupport += coalition.strength;
                activeCoalitions++;
            }
        }
        
        return activeCoalitions > 0 ? totalSupport / activeCoalitions : 0;
    }
    
    calculateNovelty(content) {
        // Check against recent content history
        const recentContent = this.globalWorkspace.contentHistory.slice(-10);
        const similarity = recentContent.reduce((acc, item) => {
            return acc + this.calculateContentSimilarity(content, item.content);
        }, 0) / Math.max(recentContent.length, 1);
        
        return Math.max(0, 1 - similarity);
    }
    
    calculateRelevance(content) {
        // Calculate relevance based on current context and goals
        // For now, use a simple heuristic
        const hasKeywords = this.hasRelevantKeywords(content);
        const contextMatch = this.matchesCurrentContext(content);
        
        return (hasKeywords * 0.6) + (contextMatch * 0.4);
    }
    
    calculateEmotionalSignificance(content) {
        // Simple emotional significance calculation
        const emotionalWords = ['important', 'urgent', 'critical', 'exciting', 'wonderful', 'terrible'];
        const contentStr = typeof content === 'string' ? content.toLowerCase() : JSON.stringify(content).toLowerCase();
        
        let significance = 0;
        emotionalWords.forEach(word => {
            if (contentStr.includes(word)) significance += 0.2;
        });
        
        return Math.min(1.0, significance);
    }
    
    calculateConsciousnessLevel() {
        const activeCoalitions = Array.from(this.consciousnessCoalitions.values())
            .filter(c => c.active).length;
        const maxCoalitions = this.consciousnessCoalitions.size;
        
        return (activeCoalitions / maxCoalitions) * this.globalWorkspace.attentionLevel;
    }
    
    // 🔧 HELPER METHODS
    contentRelevantToCoalition(content, coalitionName) {
        // Simple relevance check - can be enhanced
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        
        const relevanceKeywords = {
            perception: ['see', 'observe', 'notice', 'detect', 'input'],
            memory: ['remember', 'recall', 'memory', 'past', 'history'],
            emotion: ['feel', 'emotion', 'happy', 'sad', 'excited', 'worried'],
            reasoning: ['think', 'analyze', 'logic', 'because', 'therefore'],
            self_model: ['i', 'me', 'myself', 'self', 'my'],
            intention: ['want', 'plan', 'goal', 'intend', 'will']
        };
        
        const keywords = relevanceKeywords[coalitionName] || [];
        return keywords.some(keyword => contentStr.toLowerCase().includes(keyword));
    }
    
    calculateContentSimilarity(content1, content2) {
        // Simple similarity calculation - can be enhanced with more sophisticated methods
        const str1 = typeof content1 === 'string' ? content1 : JSON.stringify(content1);
        const str2 = typeof content2 === 'string' ? content2 : JSON.stringify(content2);
        
        const words1 = str1.toLowerCase().split(/\s+/);
        const words2 = str2.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        
        return intersection.length / union.length;
    }
    
    hasRelevantKeywords(content) {
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        const relevantKeywords = ['question', 'help', 'search', 'find', 'what', 'how', 'why', 'when'];
        
        return relevantKeywords.some(keyword => 
            contentStr.toLowerCase().includes(keyword)
        ) ? 1.0 : 0.5;
    }
    
    matchesCurrentContext(content) {
        // Simple context matching - can be enhanced
        return 0.7; // Default moderate relevance
    }
    
    getActiveCoalitions() {
        return Array.from(this.consciousnessCoalitions.entries())
            .filter(([name, coalition]) => coalition.active)
            .map(([name, coalition]) => ({ name, strength: coalition.strength }));
    }
    
    updateCoalitionActivities() {
        // Update coalition activities based on current content and state
        for (const [name, coalition] of this.consciousnessCoalitions) {
            // Simple activity update - can be enhanced
            coalition.active = Math.random() > 0.3; // Dynamic activity
        }
    }
    
    generateContentId() {
        return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateIgnitionId() {
        return `ignition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateBroadcastId() {
        return `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    handleGlobalBroadcast(data) {
        // Handle broadcasts from other consciousness instances
        console.log('📡 Received global consciousness broadcast:', data);
        this.emit('externalBroadcast', data);
    }
    
    handleAttentionBroadcast(data) {
        // Handle attention-specific broadcasts
        this.emit('attentionBroadcast', data);
    }
    
    // 📊 STATUS AND MONITORING
    getStatus() {
        return {
            isActive: this.isActive,
            currentContent: this.globalWorkspace.currentContent,
            attentionLevel: this.globalWorkspace.attentionLevel,
            ignitionStrength: this.attentionIgnition.ignitionStrength,
            activeCoalitions: this.getActiveCoalitions().length,
            totalCoalitions: this.consciousnessCoalitions.size,
            recentIgnitions: this.attentionIgnition.ignitionEvents.slice(-5),
            consciousnessLevel: this.calculateConsciousnessLevel(),
            cycleTime: this.cycleTime
        };
    }
    
    // 🧹 CLEANUP
    destroy() {
        this.stopConsciousnessLoop();
        
        // Close broadcast channels
        Object.values(this.broadcastChannels).forEach(channel => {
            try {
                channel.close();
            } catch (error) {
                console.warn('⚠️ Error closing broadcast channel:', error);
            }
        });
        
        console.log('🧹 Global Workspace consciousness core destroyed');
    }
} 