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
            
            // Emit response
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
            
            // ⚡ PHASE 4: LLM GENERATION WITH SUPER-CONTEXT
            let llmResponse;
            try {
                llmResponse = await this.llmManager.generateSuperIntelligentResponse(
                    input, uniqueResponseContext
                );
            } catch (llmError) {
                console.error('LLM Generation Error:', llmError);
                // Fallback to basic LLM generation
                llmResponse = await this.llmManager.generateResponse(input, uniqueResponseContext);
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
            
            return finalResponse;
            
        } catch (error) {
            console.error('Error in super-intelligent response generation:', error);
            
            // Enhanced fallback with personality
            return this.personalitySystem.generateJarvisFallbackResponse(input, experience);
        }
    }

    async buildRevolutionaryContext(input, experience) {
        const personalityProfile = this.personalitySystem.buildPersonalityProfile();
        const recentMemories = this.memorySystem.getRelevantMemories(input);
        const conversationFlow = this.memorySystem.getConversationalHistory();
        
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
        const thought = {
            type: 'proactive',
            content: 'Considering user needs and potential assistance opportunities',
            timestamp: Date.now(),
            intensity: 0.3
        };
        
        this.processThought(thought);
    }

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

    destroy() {
        // Cleanup intervals
        Object.values(this.thinkingIntervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        
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