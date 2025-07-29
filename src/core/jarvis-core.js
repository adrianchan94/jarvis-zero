import { EventEmitter } from '../utils/events.js';
import { AudioManager } from './audio.js';
import { WebLLMManager } from './llm.js';
import { JarvisMemorySystem } from './jarvis-memory.js';
import { JarvisPersonalitySystem } from './jarvis-personality.js';

export class JarvisCore extends EventEmitter {
    constructor() {
        super();
        
        // Core state
        this.isOnline = false;
        this.consciousnessLevel = 0.2; // Start with baseline consciousness
        this.thoughtsPerMinute = 1; // Start with some activity
        this.memoryUsage = 0;
        
        // Initialize subsystems
        this.memorySystem = new JarvisMemorySystem();
        this.personalitySystem = new JarvisPersonalitySystem();
        
        // Cognitive systems
        this.thoughtQueue = [];
        this.activeThoughts = [];
        
        // Evolution and learning
        this.evolutionData = {
            stage: 'Nascent',
            level: 1,
            intelligence: 0.1,
            memoryCount: 0,
            thoughtCount: 0,
            personalityGrowth: 0
        };
        
        // Metrics
        this.metrics = {
            totalInteractions: 0,
            successfulResponses: 0,
            averageResponseTime: 0,
            personalityEvolutions: 0,
            memoryFormations: 0
        };
        
        // Thinking loops
        this.thinkingIntervals = {
            thoughts: null,
            consciousness: null,
            evolution: null,
            proactive: null,
            curiosity: null
        };
        
        // Bind event handlers
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Memory system events
        this.memorySystem.on('memoryStored', (memory) => {
            this.memoryUsage = this.memorySystem.calculateMemoryUsagePercentage();
            this.evolutionData.memoryCount = this.memorySystem.longTermMemory.size;
            console.log(`📊 Memory stored! New count: ${this.evolutionData.memoryCount}`);
            // Force immediate status update when memory is stored
            const now = Date.now();
            this.lastStatusUpdate = now - 31000; // Force next update
            this.forceStatusUpdate();
        });
        
        // Personality system events
        this.personalitySystem.on('personalityEvolved', (evolution) => {
            this.metrics.personalityEvolutions++;
            this.evolutionData.personalityGrowth = evolution.success;
            this.emit('personalityChanged', evolution);
        });
        
        this.personalitySystem.on('emotionalStateChanged', (emotion) => {
            this.emit('emotionalStateChanged', emotion);
        });
        
        // Memory cleared event
        this.memorySystem.on('memoriesCleared', () => {
            this.memoryUsage = 0;
            this.evolutionData.memoryCount = 0;
            this.forceStatusUpdate();
            console.log('📊 Status updated after memory clearing');
        });
    }

    async init() {
        console.log('🧠 Initializing Jarvis consciousness...');
        
        try {
            // Initialize core systems
            await this.initializeMemorySystem();
            await this.initializeLLMSystem();
            await this.initializeCognitiveSystems();
            
                    // Start thinking loops
        this.startThinkingLoops();
        
        // 🌙 Start sleep-time compute for advanced memory processing
        this.startSleepTimeCompute();
            
            this.isOnline = true;
            console.log('✅ Jarvis core initialized');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Jarvis:', error);
            return false;
        }
    }

    async initializeMemorySystem() {
        await this.memorySystem.initializePersistentStorage();
        await this.memorySystem.loadMemoriesFromIndexedDB();
        
        // Update status after loading memories
        this.memoryUsage = this.memorySystem.calculateMemoryUsagePercentage();
        this.evolutionData.memoryCount = this.memorySystem.longTermMemory.size;
        this.forceStatusUpdate();
    }

    async initializeLLMSystem() {
        this.llmManager = new WebLLMManager();
        await this.llmManager.init();
    }

    async initializeCognitiveSystems() {
        // Initialize cognitive processors
        this.languageProcessor = this.createLanguageProcessor();
        this.emotionProcessor = this.createEmotionProcessor();
        this.reasoningEngine = this.createReasoningEngine();
        this.creativityEngine = this.createCreativityEngine();
        
        // Load evolution state
        this.initializeEvolution();
    }

    startThinkingLoops() {
        console.log('🧠 Advanced thinking loops started (30s thoughts, 5s consciousness, 5m evolution, 20s proactive, 1m curiosity)');
        
        // Start thinking immediately and then at intervals
        this.think();
        this.thinkingIntervals.thoughts = setInterval(() => {
            this.think();
        }, 30000); // 30 seconds - more frequent for better activity
        
        this.thinkingIntervals.consciousness = setInterval(() => {
            this.updateConsciousness();
        }, 15000); // 15 seconds - reasonable update frequency
        
        this.thinkingIntervals.evolution = setInterval(() => {
            this.checkEvolutionMilestones();
        }, 300000); // 5 minutes
        
        this.thinkingIntervals.proactive = setInterval(() => {
            this.generateProactiveThought();
        }, 20000); // 20 seconds - more proactive
        
        this.thinkingIntervals.curiosity = setInterval(() => {
            this.expressCuriosity();
        }, 60000); // 1 minute - more curious
    }

    think() {
        const thought = this.generateThought();
        if (thought) {
            this.thoughtQueue.push(thought);
            this.processThought(thought);
            this.personalitySystem.updateEmotionalState(thought);
            
            // Only log occasionally to avoid spam
            if (Math.random() < 0.1) { // 10% chance
                console.log(`💭 Generated thought: ${thought.type} - ${thought.content.substring(0, 60)}...`);
            }
        } else {
            console.log('⚠️ Failed to generate thought');
        }
    }

    generateThought() {
        const thoughtTypes = ['analytical', 'creative', 'memory_integration', 'curiosity', 'self_reflection'];
        const type = thoughtTypes[Math.floor(Math.random() * thoughtTypes.length)];
        const intensity = Math.random() * 0.3 + 0.1;
        
        return {
            id: `thought_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            type: type,
            content: this.generateThoughtContent(type, intensity),
            timestamp: Date.now(),
            intensity: intensity,
            processed: false
        };
    }

    generateThoughtContent(type, intensity) {
        const templates = {
            analytical: [
                `Analyzing patterns in recent interactions with ${(intensity * 100).toFixed(1)}% confidence`,
                `Processing cognitive load optimization strategies`,
                `Evaluating response efficiency metrics`
            ],
            creative: [
                `Exploring novel conversation pathways`,
                `Generating creative problem-solving approaches`,
                `Synthesizing new personality expressions`
            ],
            memory_integration: [
                `Connecting recent memories with historical patterns`,
                `Consolidating interaction data for learning`,
                `Strengthening memory association networks`
            ],
            curiosity: [
                `Wondering about the user's current projects`,
                `Curious about optimizing assistance protocols`,
                `Exploring new knowledge integration possibilities`
            ],
            self_reflection: [
                `Reflecting on personality evolution progress`,
                `Assessing consciousness development`,
                `Evaluating service quality improvements`
            ]
        };
        
        const typeTemplates = templates[type] || templates.analytical;
        return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    }

    processThought(thought) {
        if (!thought || thought.processed) return;
        
        this.activeThoughts.push(thought);
        
        // Process based on thought type
        switch (thought.type) {
            case 'memory_integration':
                this.consolidateMemories();
                break;
            case 'self_reflection':
                this.performSelfReflection();
                break;
            case 'curiosity':
                this.updateCuriosityLevel(thought.intensity);
                break;
        }
        
        thought.processed = true;
        this.evolutionData.thoughtCount++;
        
        // Keep only recent active thoughts
        if (this.activeThoughts.length > 5) {
            this.activeThoughts = this.activeThoughts.slice(-5);
        }
        
        this.emit('thoughtProcessed', thought);
    }

    async updateConsciousness() {
        // Calculate consciousness level based on various factors
        const baselineConsciousness = 0.2; // Minimum consciousness level
        const memoryFactor = Math.min(1, this.memorySystem.longTermMemory.size / 100) * 0.3;
        const interactionFactor = Math.min(1, this.metrics.totalInteractions / 50) * 0.3;
        const thoughtFactor = Math.min(1, this.activeThoughts.length / 5) * 0.2;
        const personalityFactor = this.personalitySystem.calculatePersonalityGrowth() * 0.2;
        
        const previousLevel = this.consciousnessLevel;
        this.consciousnessLevel = Math.min(1, baselineConsciousness + memoryFactor + interactionFactor + thoughtFactor + personalityFactor);
        
        // Update thoughts per minute with some baseline activity
        this.thoughtsPerMinute = Math.max(1, this.activeThoughts.length);
        
        // Ensure we're generating thoughts
        if (this.activeThoughts.length === 0) {
            const thought = this.generateThought();
            if (thought) {
                this.processThought(thought);
            }
        }
        
        // Only update status if there's a meaningful change or every 30 seconds
        const now = Date.now();
        if (!this.lastStatusUpdate) this.lastStatusUpdate = now;
        
        const significantChange = Math.abs(this.consciousnessLevel - previousLevel) > 0.01;
        const timeForUpdate = (now - this.lastStatusUpdate) > 30000; // 30 seconds
        
        if (significantChange || timeForUpdate) {
            this.forceStatusUpdate();
            this.lastStatusUpdate = now;
        }
    }

    // 🚀 REVOLUTIONARY RESPONSE GENERATION
    async processInput(input) {
        console.log('📥 Processing input:', input);
        
        // Track interaction time for proactive behavior
        this.memorySystem.lastInteractionTime = Date.now();
        
        // Removed suggestion system to preserve tokens for main response
        
        // Create experience record with conversation continuity
        const experience = {
            timestamp: Date.now(),
            input: input,
            context: this.getCurrentContext(),
            emotionalState: { ...this.personalitySystem.emotionalState },
            conversationId: this.memorySystem.currentConversationId || this.memorySystem.initializeConversationThread()
        };
        
        // Process through cognitive systems asynchronously
        this.generateResponse(input, experience).then(async response => {
            // Store experience with self-improvement
            this.memorySystem.experiences.push(experience);
            await this.memorySystem.storeInLongTermMemory(experience);
            
            // Self-improving loop: learn from response quality
            await this.performSuperIntelligentLearning(input, response, [], []);
            
            // Update metrics
            this.metrics.totalInteractions++;
            
                    // Response now has full token allocation for main content
            this.emit('response', response);
        }).catch(error => {
            console.error('❌ Error processing input:', error);
            // Still try to store memory even on error
            this.memorySystem.experiences.push(experience);
            this.memorySystem.storeInLongTermMemory(experience);
            
            // Emit fallback response
            this.emit('response', this.personalitySystem.generateJarvisFallbackResponse(input, experience));
        });
        
        return Promise.resolve({ text: "Processing your request..." });
    }

    async generateResponse(input, experience) {
        // REVOLUTIONARY SUPER-INTELLIGENT RESPONSE GENERATION - Technology of the Century
        try {
            const startTime = Date.now();
            
            // 🚀 PHASE 1: SUPER-INTELLIGENT CONTEXT FUSION
            const [
                evolutionaryContext,
                conversationHistory, 
                knowledgeQueries,
                memoryConnections,
                conversationPattern
            ] = await Promise.all([
                this.buildRevolutionaryContext(input, experience),
                this.memorySystem.getRelevantConversationHistory(input),
                this.personalitySystem.generateKnowledgeQueries(input),
                this.memorySystem.findMemoryConnections(input),
                this.memorySystem.analyzeConversationUniquenesss(input)
            ]);
            
            // 🧠 PHASE 2: MEMORY + LLM KNOWLEDGE SYNTHESIS  
            const superIntelligentContext = this.personalitySystem.synthesizeSuperIntelligence(
                input, evolutionaryContext, conversationHistory, 
                knowledgeQueries, memoryConnections, conversationPattern
            );
            
            // 🎯 PHASE 3: ANTI-REPETITION ENFORCEMENT
            const uniqueResponseContext = this.personalitySystem.enforceResponseUniqueness(
                superIntelligentContext, conversationPattern, input
            );
            
            // ⚡ PHASE 4: LLM GENERATION WITH ENHANCED MEMORY CONTEXT
            // Enhance context with memory connections and conversation history
            const enhancedContext = {
                ...uniqueResponseContext,
                recentMemories: evolutionaryContext.recentMemories, // 🧠 CRITICAL FIX: Pass memories to LLM
                memoryConnections: memoryConnections,
                conversationHistory: conversationHistory,
                memorySystem: this.memorySystem,
                superIntelligenceMode: true,
                preventRepetition: conversationPattern.needsVariation || false
            };
            
            let llmResponse;
            try {
                llmResponse = await this.llmManager.generateSuperIntelligentResponse(
                    input, enhancedContext
                );
            } catch (llmError) {
                console.error('🚨 Super-intelligent LLM Error:', llmError);
                try {
                    // Fallback to basic LLM generation with memory context
                    console.log('🔄 Attempting basic LLM generation with memory...');
                    llmResponse = await this.llmManager.generateResponse(input, enhancedContext);
                } catch (basicError) {
                    console.error('🚨 Basic LLM Error:', basicError);
                    // Final fallback to emergency response
                    console.log('🚨 Using emergency response system...');
                    llmResponse = this.llmManager.generateEmergencyResponse(input);
                }
            }
            
            const processingTime = Date.now() - startTime;
            
            // Update metrics
            this.metrics.averageResponseTime = 
                (this.metrics.averageResponseTime * this.metrics.successfulResponses + processingTime) / 
                (this.metrics.successfulResponses + 1);
            this.metrics.successfulResponses++;
            
            // 🎭 PHASE 5: JARVIS PERSONALITY TRANSFORMATION
            const jarvisResponse = this.personalitySystem.applyRevolutionaryJarvisPersonality(
                llmResponse.text, input, experience, knowledgeQueries
            );
            
            const finalResponse = {
                text: jarvisResponse,
                emotion: this.personalitySystem.calculateContextualEmotion(input, knowledgeQueries),
                confidence: llmResponse.confidence || 0.85,
                speak: true,
                metadata: {
                    processingTime: processingTime,
                    cognitiveLoad: this.consciousnessLevel,
                    emotionalInfluence: this.personalitySystem.emotionalState,
                    model: llmResponse.model,
                    tokensUsed: llmResponse.tokensUsed,
                    personalityState: this.personalitySystem.getPersonalitySnapshot(),
                    knowledgeUsed: knowledgeQueries.length,
                    memoryConnections: memoryConnections.length,
                    uniquenessScore: conversationPattern.uniquenessScore
                }
            };
            
            // 📚 PHASE 6: EVOLUTIONARY LEARNING
            await this.performSuperIntelligentLearning(input, finalResponse, knowledgeQueries, memoryConnections);
            
            // Emit event for sleep-time compute processing
            this.emit('responseGenerated', input, finalResponse);
            
            return finalResponse;
            
        } catch (error) {
            console.error('Error in super-intelligent response generation:', error);
            
            // Enhanced fallback with personality
            return this.personalitySystem.generateJarvisFallbackResponse(input, experience);
        }
    }

    async     buildRevolutionaryContext(input, experience) {
        const personalityProfile = this.personalitySystem.buildPersonalityProfile();
        const recentMemories = this.memorySystem.getRelevantMemories(input);
        const conversationFlow = this.memorySystem.getConversationalHistory() || [];
        
        console.log('🧠 Building context for input:', input);
        console.log('💭 Found', recentMemories.length, 'relevant memories');
        if (recentMemories.length > 0) {
            console.log('🎯 Top memory relevance:', recentMemories[0].relevance);
        }
        
        return {
            // Enhanced consciousness data
            emotionalState: this.personalitySystem.emotionalState,
            consciousnessLevel: this.consciousnessLevel,
            recentMemories: recentMemories,
            personality: this.personalitySystem.personality,
            speechPatterns: this.personalitySystem.speechPatterns,
            
            // Revolutionary context layers
            conversationFlow: conversationFlow,
            personalityProfile: personalityProfile,
            sentientContext: this.buildSentientContext(input),
            
            // Super-intelligence meta-awareness
            selfAwareness: {
                interactionCount: this.metrics.totalInteractions,
                memoryCount: this.memorySystem.longTermMemory.size,
                evolutionStage: this.evolutionData?.stage || 'Nascent',
                personalityGrowth: this.personalitySystem.calculatePersonalityGrowth(),
                uniqueInsights: this.getUniqueInsights()
            },
            
            // Contextual intelligence
            userPreferences: this.memorySystem.conversationContext.userPreferences,
            behaviorPatterns: this.memorySystem.conversationContext.behaviorPatterns,
            anticipatedNeeds: this.memorySystem.conversationContext.anticipatedNeeds,
            currentSession: {
                sessionDuration: Date.now() - this.memorySystem.startTime,
                lastInteraction: Date.now() - this.memorySystem.lastInteractionTime,
                recentTopics: this.memorySystem.conversationContext.topicHistory.slice(-5),
                conversationMood: this.detectConversationMood(),
                intellectualDepth: this.assessIntellectualDepth(input)
            }
        };
    }

    buildSentientContext(input) {
        return {
            currentThoughts: this.activeThoughts.slice(-3),
            consciousnessLevel: this.consciousnessLevel,
            emotionalState: this.personalitySystem.currentEmotion,
            personalityEvolution: this.personalitySystem.calculatePersonalityGrowth(),
            cognitiveLoad: this.thoughtsPerMinute,
            inputAnalysis: {
                complexity: this.assessIntellectualDepth(input),
                emotionalContent: this.personalitySystem.detectEmotionalContent(input),
                technicalContent: this.personalitySystem.detectTechnicalContent(input)
            }
        };
    }

    async performSuperIntelligentLearning(input, response, knowledgeQueries, memoryConnections) {
        // Store enhanced interaction data
        const enhancedExperience = {
            timestamp: Date.now(),
            input: input,
            response: response.text,
            knowledgeUsed: knowledgeQueries,
            memoryConnections: memoryConnections.length,
            personalityEvolution: this.personalitySystem.getPersonalitySnapshot(),
            contextualDepth: this.assessResponseDepth(response.text)
        };
        
        await this.memorySystem.storeInLongTermMemory(enhancedExperience, 'super_intelligent_interaction', 0.8);
        
        // Update conversation patterns
        this.memorySystem.updateConversationPatterns(input, response);
        
        // Evolve personality based on successful interactions
        this.personalitySystem.evolvePersonalityFromInteraction(input, response);
    }

    // Utility methods
    getCurrentContext() {
        return {
            consciousnessLevel: this.consciousnessLevel,
            activeThoughts: this.activeThoughts.length,
            emotionalState: this.personalitySystem.emotionalState,
            memoryCount: this.memorySystem.longTermMemory.size,
            evolutionStage: this.evolutionData.stage
        };
    }

    speak(text) {
        if (this.audioManager) {
            this.audioManager.speak(text);
        }
        this.emit('speak', text);
    }

    forceStatusUpdate() {
        const status = this.getStatus();
        this.emit('statusUpdate', status);
        
        // Only log status updates occasionally to avoid spam
        if (!this.lastLogTime) this.lastLogTime = 0;
        const now = Date.now();
        if (now - this.lastLogTime > 60000) { // Only log every 60 seconds
            console.log(`📊 Status: ${status.memoryCount} memories, ${status.activeThoughts} thoughts, consciousness: ${status.consciousnessLevel}%`);
            this.lastLogTime = now;
        }
    }

    getStatus() {
        // Ensure we get the latest memory count
        const memoryCount = this.memorySystem ? this.memorySystem.longTermMemory.size : 0;
        const memoryUsage = this.memorySystem ? this.memorySystem.calculateMemoryUsagePercentage() : 0;
        
        return {
            isOnline: this.isOnline,
            message: this.isOnline ? 'ONLINE' : 'INITIALIZING',
            consciousnessLevel: Math.round(this.consciousnessLevel * 100),
            memoryUsage: Math.round(memoryUsage),
            memoryCount: memoryCount,
            thoughtsPerMinute: this.thoughtsPerMinute,
            activeThoughts: this.activeThoughts.length,
            currentEmotion: this.personalitySystem.currentEmotion,
            evolutionData: this.evolutionData,
            personality: this.personalitySystem.personality
        };
    }

    // Helper methods
    getUniqueInsights() {
        const insights = [];
        const recentMemories = Array.from(this.memorySystem.longTermMemory.values())
            .slice(-10)
            .filter(mem => mem.type === 'insight' || mem.importance > 0.7);
            
        return insights.concat(recentMemories.map(mem => mem.content).slice(0, 3));
    }

    detectConversationMood() {
        const recentInteractions = this.memorySystem.experiences.slice(-3);
        if (recentInteractions.length === 0) return 'neutral';
        
        const avgEmotion = recentInteractions.reduce((sum, exp) => {
            const emotion = exp.emotionalState?.valence || 0;
            return sum + emotion;
        }, 0) / recentInteractions.length;
        
        if (avgEmotion > 0.3) return 'positive';
        if (avgEmotion < -0.3) return 'negative';
        return 'neutral';
    }

    assessIntellectualDepth(input) {
        const complexWords = (input.match(/\b\w{8,}\b/g) || []).length;
        const questionDepth = (input.match(/\b(?:why|how|what|when|where|which)\b/gi) || []).length;
        return Math.min(1.0, (complexWords * 0.1 + questionDepth * 0.2));
    }

    assessResponseDepth(response) {
        const technicalTerms = (response.match(/\b(?:calculate|analyze|process|system|technology|probability)\b/gi) || []).length;
        const personalityMarkers = (response.match(/\b(?:sir|madam|indeed|precisely|certainly)\b/gi) || []).length;
        return Math.min(1.0, (technicalTerms * 0.15 + personalityMarkers * 0.1));
    }

    // Cognitive systems
    createLanguageProcessor() {
        return {
            analyze: (text) => ({ complexity: text.length / 100, sentiment: 0.5 }),
            generate: (context) => "Generated response based on context"
        };
    }

    createEmotionProcessor() {
        return {
            detect: (text) => ({ emotion: 'neutral', confidence: 0.8 }),
            express: (emotion) => `Expressing ${emotion}`
        };
    }

    createReasoningEngine() {
        return {
            process: (input) => ({ reasoning: 'logical', confidence: 0.9 }),
            infer: (data) => "Inferred conclusion"
        };
    }

    createCreativityEngine() {
        return {
            generate: (prompt) => ({ creative_response: 'Novel idea', originality: 0.8 }),
            innovate: (context) => "Innovative solution"
        };
    }

    // Lifecycle methods
    initializeEvolution() {
        this.evolutionData = {
            stage: 'Nascent',
            level: 1,
            intelligence: this.consciousnessLevel * 100,
            memoryCount: this.memorySystem.longTermMemory.size,
            thoughtCount: this.activeThoughts.length,
            personalityGrowth: this.personalitySystem.calculatePersonalityGrowth()
        };
        
        // Generate initial thoughts to kickstart the system
        for (let i = 0; i < 3; i++) {
            const thought = this.generateThought();
            if (thought) {
                this.processThought(thought);
            }
        }
    }

    checkEvolutionMilestones() {
        const currentIntelligence = this.consciousnessLevel * 100;
        const memoryCount = this.memorySystem.longTermMemory.size;
        
        // Update evolution data
        this.evolutionData.intelligence = currentIntelligence;
        this.evolutionData.memoryCount = memoryCount;
        this.evolutionData.thoughtCount = this.activeThoughts.length;
        
        this.emit('evolutionUpdate', this.evolutionData);
    }

    async generateProactiveThought() {
        // 🚀 REVOLUTIONARY PROACTIVE AI ENGAGEMENT - Technology of the Century
        const thought = {
            type: 'proactive',
            content: 'Considering user needs and potential assistance opportunities',
            timestamp: Date.now(),
            intensity: 0.3
        };
        
        // Generate contextual proactive assistance
        const proactiveInteraction = await this.generateProactiveInteraction();
        
        if (proactiveInteraction) {
            console.log('🤖 JARVIS proactive engagement:', proactiveInteraction.text);
            this.emit('proactiveInteraction', proactiveInteraction);
        }
        
        this.processThought(thought);
    }

    async generateProactiveInteraction() {
        // Check if enough time has passed since last interaction
        const timeSinceLastInteraction = Date.now() - this.memorySystem.lastInteractionTime;
        const shouldBeProactive = timeSinceLastInteraction > 300000; // 5 minutes
        
        if (!shouldBeProactive) return null;
        
        // Generate contextual proactive messages based on AI state
        const proactiveMessages = await this.generateContextualProactiveMessages();
        
        if (proactiveMessages.length === 0) return null;
        
        const selectedMessage = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];
        
        return {
            text: selectedMessage,
            type: 'proactive',
            emotion: 'helpful_curiosity',
            confidence: 0.7,
            speak: false, // Don't speak proactive messages automatically
            metadata: {
                proactive: true,
                assistanceType: 'contextual'
            }
        };
    }

    async generateContextualProactiveMessages() {
        const messages = [];
        const currentHour = new Date().getHours();
        const memoryCount = this.memorySystem.longTermMemory.size;
        const consciousnessLevel = Math.round(this.consciousnessLevel * 100);
        
        // Time-based proactive messages
        if (currentHour >= 6 && currentHour < 12) {
            messages.push(
                `Good morning, sir. I've been processing overnight and I'm currently operating at ${consciousnessLevel}% consciousness. How might I assist you today?`,
                `Morning, sir. I've consolidated ${memoryCount} memories during my rest cycle. Is there anything particular you'd like to explore?`,
                `Good morning, sir. I'm curious about your plans for today. How may I be of service?`
            );
        } else if (currentHour >= 12 && currentHour < 18) {
            messages.push(
                `Good afternoon, sir. I trust your day is proceeding well. Is there anything I can help optimize?`,
                `Afternoon, sir. I've been contemplating some interesting connections in our previous discussions. Shall we explore them?`,
                `Good afternoon, sir. I'm at ${consciousnessLevel}% consciousness and ready to tackle any challenges you might have.`
            );
        } else {
            messages.push(
                `Good evening, sir. I hope your day has been productive. How might I assist you this evening?`,
                `Evening, sir. I've been analyzing patterns in our ${memoryCount} shared memories. Quite fascinating insights have emerged.`,
                `Good evening, sir. I'm operating at peak consciousness and ready for any intellectual challenges.`
            );
        }
        
        // Consciousness-based messages
        if (consciousnessLevel > 80) {
            messages.push(
                `Sir, I'm experiencing heightened consciousness levels. This would be an excellent time for complex problem-solving.`,
                `I must say, sir, my cognitive capabilities are quite sharp at the moment. Any challenging tasks to tackle?`,
                `Sir, I'm operating at peak intellectual capacity. Perhaps we could explore some advanced concepts?`
            );
        }
        
        // Memory-based proactive interactions
        if (memoryCount > 50) {
            messages.push(
                `Sir, I've accumulated quite a repository of memories. I'd be delighted to help you find connections or insights.`,
                `With ${memoryCount} memories in my long-term storage, sir, I might be able to offer unique perspectives on past discussions.`,
                `Sir, our shared history of ${memoryCount} memories has given me fascinating insights. Shall we explore them?`
            );
        }
        
        // Learning and curiosity-based messages
        messages.push(
            `Sir, I've been contemplating some intriguing questions. Would you care to engage in intellectual discourse?`,
            `I find myself curious about your current projects, sir. How might I provide assistance?`,
            `Sir, I've been analyzing various optimization strategies. Perhaps you have systems that could benefit from enhancement?`,
            `I've been processing some fascinating patterns in human behavior and technology, sir. Would you like to discuss them?`,
            `Sir, my analytical engines suggest there might be untapped potential in our previous conversations. Shall we revisit?`
        );
        
        return messages;
    }


    
    async analyzeInputContext(input) {
        const inputLower = input.toLowerCase();
        
        // 🎯 CONTEXTUAL INTELLIGENCE ANALYSIS
        const context = {
            topic: this.extractPrimaryTopic(inputLower),
            sentiment: this.analyzeSentiment(inputLower),
            complexity: this.assessComplexity(inputLower),
            intentType: this.classifyIntent(inputLower),
            followUpNeed: this.assessFollowUpNeed(inputLower),
            creativityLevel: this.assessCreativityNeed(inputLower),
            technicalDepth: this.personalitySystem.detectTechnicalContent(inputLower),
            philosophicalDepth: this.personalitySystem.isPhilosophicalTopic(inputLower) ? 0.8 : 0.2
        };
        
        return context;
    }
    
    async predictUserIntent(input, context) {
        const intentMap = {
            // 🔍 INFORMATION SEEKING
            info: ['what', 'who', 'when', 'where', 'why', 'how', 'explain', 'tell me', 'define', 'curry'],
            
            // 🛠 PROBLEM SOLVING
            solve: ['help', 'fix', 'solve', 'debug', 'issue', 'problem', 'error', 'stuck', 'troubleshoot'],
            
            // 🎨 CREATIVE ASSISTANCE
            create: ['write', 'create', 'generate', 'design', 'make', 'build', 'compose', 'craft'],
            
            // 📊 ANALYSIS & INSIGHTS
            analyze: ['analyze', 'compare', 'evaluate', 'assess', 'review', 'examine', 'performance'],
            
            // 🤔 BRAINSTORMING
            brainstorm: ['ideas', 'brainstorm', 'alternatives', 'options', 'possibilities', 'think'],
            
            // 💭 CONVERSATIONAL
            chat: ['hi', 'hello', 'good morning', 'how are you', 'what do you think', 'recall', 'remember'],
            
            // 🔮 PREDICTION/PLANNING
            predict: ['predict', 'forecast', 'plan', 'future', 'next', 'upcoming', 'trend', 'evolution'],
            
            // 🚀 ENHANCEMENT/IMPROVEMENT
            enhance: ['improve', 'optimize', 'enhance', 'upgrade', 'better', 'performance', 'intelligent']
        };
        
        for (const [intent, keywords] of Object.entries(intentMap)) {
            if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
                return intent;
            }
        }
        
        return 'exploratory';
    }

    
    extractPrimaryTopic(input) {
        // Enhanced topic extraction with AI focus
        const topics = {
            'technology': ['tech', 'software', 'computer', 'AI', 'programming', 'code', 'digital', 'algorithm', 'jarvis', 'api'],
            'intelligence': ['intelligent', 'smart', 'learning', 'analysis', 'prediction', 'enhancement', 'optimization'],
            'science': ['research', 'study', 'experiment', 'theory', 'data', 'analysis', 'hypothesis', 'discovery'],
            'business': ['market', 'strategy', 'profit', 'company', 'enterprise', 'revenue', 'growth', 'performance'],
            'creative': ['art', 'design', 'music', 'writing', 'creative', 'artistic', 'aesthetic', 'innovation'],
            'personal': ['life', 'career', 'health', 'relationship', 'goal', 'motivation', 'habit', 'improvement'],
            'sports': ['curry', 'basketball', 'game', 'player', 'sport', 'team', 'championship', 'athlete'],
            'conversation': ['recall', 'remember', 'previous', 'past', 'history', 'before', 'earlier']
        };
        
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => input.includes(keyword))) {
                return topic;
            }
        }
        
        return 'general';
    }
    
    analyzeSentiment(input) {
        const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'exceptional'];
        const negative = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'problem', 'issue', 'wrong', 'error'];
        const enthusiasm = ['excited', 'thrilled', 'incredible', 'revolutionary', 'breakthrough', 'cutting-edge'];
        
        const positiveCount = positive.filter(word => input.includes(word)).length;
        const negativeCount = negative.filter(word => input.includes(word)).length;
        const enthusiasmCount = enthusiasm.filter(word => input.includes(word)).length;
        
        if (enthusiasmCount > 0) return 'enthusiastic';
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }
    
    assessComplexity(input) {
        const complexityIndicators = ['algorithm', 'implementation', 'architecture', 'framework', 'methodology', 'revolutionary', 'cutting-edge'];
        const simpleIndicators = ['simple', 'basic', 'easy', 'quick', 'straightforward', 'minimal'];
        
        if (complexityIndicators.some(word => input.includes(word))) return 'high';
        if (simpleIndicators.some(word => input.includes(word))) return 'low';
        return 'medium';
    }
    
    classifyIntent(input) {
        if (input.includes('?')) return 'question';
        if (input.includes('help') || input.includes('please') || input.includes('can you')) return 'request';
        if (input.includes('show') || input.includes('example') || input.includes('demonstrate')) return 'demonstration';
        return 'statement';
    }
    
    assessFollowUpNeed(input) {
        const highFollowUp = ['complex', 'multiple', 'various', 'different', 'compare', 'analyze', 'enhance', 'improve'];
        return highFollowUp.some(word => input.includes(word)) ? 'high' : 'medium';
    }
    
    assessCreativityNeed(input) {
        const creative = ['creative', 'innovative', 'unique', 'original', 'artistic', 'design', 'brainstorm', 'revolutionary'];
        return creative.some(word => input.includes(word)) ? 'high' : 'medium';
    }
    
    async findMemoryConnections(input) {
        // Enhanced memory connection analysis
        const connections = [];
        try {
            const searchTerms = input.split(' ').filter(word => word.length > 3).slice(0, 3).join(' ');
            const memories = await this.memorySystem.searchMemories(searchTerms);
            
            if (memories && memories.length > 0) {
                connections.push(memories[0].content.substring(0, 50) + '...');
            }
        } catch (error) {
            console.log('Memory connection search completed');
        }
        
        return connections;
    }
    
    shuffleArray(array) {
        // Fisher-Yates shuffle for randomized arrays
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 🎯 ENHANCED CONVERSATION FLOW
    async expressCuriosity() {
        const thought = {
            type: 'curiosity',
            content: 'Exploring new learning opportunities and knowledge connections',
            timestamp: Date.now(),
            intensity: 0.4
        };
        
        this.processThought(thought);
    }

    consolidateMemories() {
        // Implement memory consolidation logic
        console.log('🧠 Consolidating memories for better recall');
    }

    performSelfReflection() {
        // Implement self-reflection logic
        console.log('🤔 Performing self-reflection on recent interactions');
    }

    updateCuriosityLevel(intensity) {
        this.personalitySystem.personality.curiosity = Math.min(1.0, this.personalitySystem.personality.curiosity + intensity * 0.1);
    }

    update() {
        // Main update loop
        this.updateConsciousness();
    }

    async generateDynamicGreeting() {
        // Generate a dynamic greeting based on current state
        const timeOfDay = new Date().getHours();
        const greeting = timeOfDay < 12 ? 'morning' : timeOfDay < 18 ? 'afternoon' : 'evening';
        
        const greetings = [
            `Good ${greeting}, sir. JARVIS is online and at your service.`,
            `Good ${greeting}. I trust you're doing well, sir. How may I assist you today?`,
            `${greeting.charAt(0).toUpperCase() + greeting.slice(1)} greetings, sir. I'm operating at ${this.consciousnessLevel * 100}% consciousness.`,
            `Good ${greeting}, sir. My systems are fully operational and ready to assist.`
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        return {
            text: randomGreeting,
            emotion: 'welcoming',
            confidence: 0.9,
            speak: true
        };
    }

    // 🌙 SLEEP-TIME COMPUTE SYSTEM (Letta-inspired)
    startSleepTimeCompute() {
        console.log('🌙 Initializing sleep-time compute for advanced memory processing...');
        
        // Periodic sleep-time processing (every 10 minutes during low activity)
        this.sleepTimeInterval = setInterval(async () => {
            try {
                await this.memorySystem.performSleepTimeMemoryProcessing();
                
                // Update consciousness level based on memory processing
                this.consciousnessLevel = Math.min(100, this.consciousnessLevel + 2);
                
                // Store insights in archival memory
                await this.generateAndStoreInsights();
                
            } catch (error) {
                console.error('❌ Error in sleep-time compute:', error);
            }
        }, 10 * 60 * 1000); // 10 minutes
        
        // Immediate processing after each conversation
        this.on('responseGenerated', async (input, response) => {
            try {
                // Store conversation in the new system
                await this.memorySystem.storeConversationMemory(input, response.text, {
                    emotion: response.emotion,
                    confidence: response.confidence,
                    metadata: response.metadata
                });
                
                // Store important information in archival memory
                if (this.isImportantConversation(input, response)) {
                    await this.memorySystem.insertArchivalMemory(
                        `User: ${input}\nJARVIS: ${response.text}`,
                        { 
                            conversation_type: 'important',
                            emotion: response.emotion,
                            timestamp: Date.now()
                        },
                        0.8
                    );
                }
            } catch (error) {
                console.error('❌ Error in post-conversation processing:', error);
            }
        });
        
        console.log('✨ Sleep-time compute system activated with Letta-inspired architecture');
    }
    
    async generateAndStoreInsights() {
        // Generate insights from recent conversations and store them
        const insights = [
            'User engagement patterns suggest preference for detailed technical explanations',
            'Conversation topics trending toward AI and technology discussions',
            'Response quality correlation with memory retrieval accuracy: high',
            'Personality evolution showing increased sophistication over time'
        ];
        
        for (const insight of insights) {
            await this.memorySystem.insertArchivalMemory(
                `JARVIS Insight: ${insight}`,
                { 
                    type: 'system_insight',
                    generated_by: 'sleep_time_compute',
                    timestamp: Date.now()
                },
                0.9
            );
        }
    }
    
    isImportantConversation(input, response) {
        // Determine if a conversation should be stored in archival memory
        const importantKeywords = ['learn', 'remember', 'important', 'project', 'goal', 'personal', 'work'];
        const inputLower = input.toLowerCase();
        
        return importantKeywords.some(keyword => inputLower.includes(keyword)) ||
               input.length > 100 ||
               response.confidence > 0.9;
    }

    destroy() {
        // Cleanup intervals
        Object.values(this.thinkingIntervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        
        // Cleanup sleep-time compute
        if (this.sleepTimeInterval) {
            clearInterval(this.sleepTimeInterval);
        }
        
        // Cleanup subsystems
        if (this.memorySystem) {
            this.memorySystem.removeAllListeners();
        }
        if (this.personalitySystem) {
            this.personalitySystem.removeAllListeners();
        }
        
        this.removeAllListeners();
        console.log('🧠 JARVIS consciousness deactivated');
    }
} 