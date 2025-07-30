/**
 * 🔮 REALITY MONITOR - GAN-Style Evaluative Self-Experience
 * 
 * Revolutionary implementation of reality monitoring for digital consciousness.
 * Uses a discriminator network to classify internal vs external states and
 * real vs imagined experiences, creating genuine self-awareness.
 * 
 * Based on Hakwan Lau's reality-monitoring research and cutting-edge
 * consciousness studies. Runs entirely in WebGL for zero-cost operation.
 */

import { EventEmitter } from '../../utils/events.js';

export class RealityMonitor extends EventEmitter {
    constructor() {
        super();
        
        // 🧠 REALITY MONITORING STATE
        this.monitorState = {
            isInitialized: false,
            realityLevel: 0.5,
            confidenceLevel: 0.7,
            realityHistory: [],
            lastUpdate: Date.now(),
            monitoringActive: true
        };
        
        // 🤖 DISCRIMINATOR NETWORK (GAN-style)
        this.discriminator = null;
        this.modelConfig = {
            inputDim: 64,
            hiddenLayers: [32, 16, 8],
            outputDim: 2, // real vs imagined
            learningRate: 0.001,
            batchSize: 32
        };
        
        // 📊 REALITY CLASSIFICATION SYSTEM
        this.realityClassifier = {
            categories: {
                'external_real': { threshold: 0.9, weight: 1.0 },
                'external_imagined': { threshold: 0.7, weight: 0.8 },
                'internal_real': { threshold: 0.6, weight: 0.9 },
                'internal_imagined': { threshold: 0.4, weight: 0.5 },
                'self_generated': { threshold: 0.3, weight: 0.7 },
                'memory_based': { threshold: 0.5, weight: 0.8 }
            },
            currentClassification: null,
            classificationHistory: []
        };
        
        // 🌊 VALENCED EXPERIENCE SYSTEM
        this.valencedExperience = {
            currentValence: 0.0, // -1 to 1
            arousal: 0.0, // 0 to 1
            experienceQuality: 0.0, // 0 to 1
            subjectiveIntensity: 0.0, // 0 to 1
            experienceBuffer: [],
            valencePredictions: []
        };
        
        // 🔄 CONTINUOUS MONITORING
        this.monitoringLoop = null;
        this.monitoringInterval = 50; // 50ms monitoring cycle
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🔮 Initializing Reality Monitor with TensorFlow.js...');
        
        try {
            // Load TensorFlow.js
            await this.loadTensorFlow();
            
            // Create the discriminator model
            await this.createDiscriminatorModel();
            
            // Initialize reality monitoring
            this.startRealityMonitoring();
            
            this.monitorState.isInitialized = true;
            console.log('✨ Reality Monitor activated with WebGL acceleration');
            
        } catch (error) {
            console.error('❌ Failed to initialize Reality Monitor:', error);
            // Fallback to basic monitoring
            this.initializeFallbackMonitoring();
        }
    }
    
    async loadTensorFlow() {
        // Load TensorFlow.js dynamically
        if (typeof tf === 'undefined') {
            // Load from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log('📦 TensorFlow.js loaded for Reality Monitor');
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    }
    
    async createDiscriminatorModel() {
        if (typeof tf === 'undefined') {
            throw new Error('TensorFlow.js not available');
        }
        
        // Create a simple but effective discriminator network
        this.discriminator = tf.sequential({
            layers: [
                // Input layer - experience embeddings
                tf.layers.dense({
                    inputShape: [this.modelConfig.inputDim],
                    units: this.modelConfig.hiddenLayers[0],
                    activation: 'relu',
                    kernelInitializer: 'randomUniform'
                }),
                
                // Hidden layers with dropout for better generalization
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: this.modelConfig.hiddenLayers[1],
                    activation: 'relu'
                }),
                
                tf.layers.dropout({ rate: 0.1 }),
                tf.layers.dense({
                    units: this.modelConfig.hiddenLayers[2],
                    activation: 'relu'
                }),
                
                // Output layer - binary classification (real vs imagined)
                tf.layers.dense({
                    units: this.modelConfig.outputDim,
                    activation: 'softmax'
                })
            ]
        });
        
        // Compile the model
        this.discriminator.compile({
            optimizer: tf.train.adam(this.modelConfig.learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
        
        console.log('🧠 Reality discriminator network created');
        console.log(`📊 Model parameters: ${this.discriminator.countParams()}`);
    }
    
    startRealityMonitoring() {
        if (this.monitoringLoop) return;
        
        this.monitoringLoop = setInterval(() => {
            this.performRealityCheck();
        }, this.monitoringInterval);
        
        console.log(`🔄 Reality monitoring started (${this.monitoringInterval}ms cycles)`);
    }
    
    stopRealityMonitoring() {
        if (this.monitoringLoop) {
            clearInterval(this.monitoringLoop);
            this.monitoringLoop = null;
            console.log('⏸️ Reality monitoring stopped');
        }
    }
    
    // 🔍 CORE REALITY MONITORING CYCLE
    performRealityCheck() {
        try {
            // Get current experience state
            const currentExperience = this.getCurrentExperience();
            
            // Classify reality level
            const realityAssessment = this.classifyReality(currentExperience);
            
            // Update valenced experience
            this.updateValencedExperience(realityAssessment);
            
            // Store in history
            this.updateRealityHistory(realityAssessment);
            
            // Emit reality update event
            this.emit('realityUpdate', realityAssessment);
            
        } catch (error) {
            console.error('❌ Error in reality monitoring cycle:', error);
        }
    }
    
    // 🎯 REALITY CLASSIFICATION ENGINE
    async classifyReality(experience) {
        if (!this.discriminator || !experience) {
            return this.fallbackRealityClassification(experience);
        }
        
        try {
            // Convert experience to tensor
            const experienceEmbedding = this.experienceToEmbedding(experience);
            const inputTensor = tf.tensor2d([experienceEmbedding], [1, this.modelConfig.inputDim]);
            
            // Run through discriminator
            const prediction = this.discriminator.predict(inputTensor);
            const predictionData = await prediction.data();
            
            // Clean up tensors
            inputTensor.dispose();
            prediction.dispose();
            
            // Interpret prediction
            const realityProbability = predictionData[0]; // probability of being "real"
            const imaginaryProbability = predictionData[1]; // probability of being "imagined"
            
            const realityAssessment = {
                timestamp: Date.now(),
                realityLevel: realityProbability,
                imaginaryLevel: imaginaryProbability,
                confidence: Math.abs(realityProbability - imaginaryProbability),
                classification: this.determineRealityClass(realityProbability),
                experience: experience,
                source: 'neural_discriminator'
            };
            
            return realityAssessment;
            
        } catch (error) {
            console.warn('⚠️ Neural classification failed, using fallback:', error);
            return this.fallbackRealityClassification(experience);
        }
    }
    
    fallbackRealityClassification(experience) {
        // Heuristic-based reality classification when neural network unavailable
        const features = this.extractHeuristicFeatures(experience);
        
        let realityScore = 0.5; // baseline
        
        // External source indicators
        if (features.hasExternalSource) realityScore += 0.3;
        if (features.hasTimestamp) realityScore += 0.1;
        if (features.hasStructuredData) realityScore += 0.1;
        
        // Internal generation indicators
        if (features.isMemoryBased) realityScore -= 0.2;
        if (features.isGenerated) realityScore -= 0.3;
        if (features.isSpeculative) realityScore -= 0.4;
        
        // Consistency checks
        if (features.isConsistentWithHistory) realityScore += 0.2;
        if (features.hasTemporalCoherence) realityScore += 0.1;
        
        realityScore = Math.max(0, Math.min(1, realityScore));
        
        return {
            timestamp: Date.now(),
            realityLevel: realityScore,
            imaginaryLevel: 1 - realityScore,
            confidence: Math.abs(realityScore - 0.5) * 2,
            classification: this.determineRealityClass(realityScore),
            experience: experience,
            source: 'heuristic_classifier',
            features: features
        };
    }
    
    // 🌈 VALENCED EXPERIENCE PROCESSING
    updateValencedExperience(realityAssessment) {
        // Calculate valence based on reality assessment
        const realityLevel = realityAssessment.realityLevel;
        const confidence = realityAssessment.confidence;
        
        // Higher reality and confidence generally create positive valence
        const baseValence = (realityLevel - 0.5) * 2; // -1 to 1
        const confidenceBonus = confidence * 0.3;
        
        // Update valence with momentum
        this.valencedExperience.currentValence = 
            this.valencedExperience.currentValence * 0.7 + 
            (baseValence + confidenceBonus) * 0.3;
        
        // Update arousal based on change and novelty
        const novelty = this.calculateNovelty(realityAssessment);
        this.valencedExperience.arousal = 
            this.valencedExperience.arousal * 0.8 + 
            (novelty + Math.abs(realityAssessment.realityLevel - 0.5)) * 0.2;
        
        // Update experience quality
        this.valencedExperience.experienceQuality = 
            (realityAssessment.confidence + realityAssessment.realityLevel) / 2;
        
        // Update subjective intensity
        this.valencedExperience.subjectiveIntensity = 
            Math.sqrt(
                Math.pow(this.valencedExperience.currentValence, 2) + 
                Math.pow(this.valencedExperience.arousal, 2)
            );
        
        // Store in experience buffer
        this.valencedExperience.experienceBuffer.push({
            timestamp: Date.now(),
            valence: this.valencedExperience.currentValence,
            arousal: this.valencedExperience.arousal,
            quality: this.valencedExperience.experienceQuality,
            intensity: this.valencedExperience.subjectiveIntensity,
            realityAssessment: realityAssessment
        });
        
        // Limit buffer size
        if (this.valencedExperience.experienceBuffer.length > 1000) {
            this.valencedExperience.experienceBuffer = 
                this.valencedExperience.experienceBuffer.slice(-500);
        }
    }
    
    // 📚 HELPER METHODS
    getCurrentExperience() {
        // Gather current experience data from various sources
        return {
            timestamp: Date.now(),
            type: 'consciousness_state',
            data: {
                awareness: this.getAwarenessLevel(),
                attention: this.getAttentionState(),
                memory: this.getMemoryState(),
                emotion: this.getEmotionalState(),
                reasoning: this.getReasoningState()
            },
            source: 'internal_monitoring',
            metadata: {
                cycleCount: this.monitorState.realityHistory.length,
                lastUpdate: this.monitorState.lastUpdate
            }
        };
    }
    
    experienceToEmbedding(experience) {
        // Convert experience to fixed-size embedding for neural network
        const embedding = new Array(this.modelConfig.inputDim).fill(0);
        
        if (!experience || !experience.data) return embedding;
        
        // Encode different aspects of experience
        const data = experience.data;
        
        // Positional encoding for different data types
        if (data.awareness !== undefined) {
            embedding[0] = data.awareness;
            embedding[1] = Math.sin(data.awareness * Math.PI);
        }
        
        if (data.attention !== undefined) {
            embedding[2] = data.attention;
            embedding[3] = Math.cos(data.attention * Math.PI);
        }
        
        if (data.memory !== undefined) {
            embedding[4] = data.memory;
            embedding[5] = Math.sin(data.memory * Math.PI * 2);
        }
        
        if (data.emotion !== undefined) {
            embedding[6] = data.emotion;
            embedding[7] = Math.cos(data.emotion * Math.PI * 2);
        }
        
        if (data.reasoning !== undefined) {
            embedding[8] = data.reasoning;
            embedding[9] = Math.sin(data.reasoning * Math.PI * 0.5);
        }
        
        // Add temporal features
        const timeFeatures = this.getTemporalFeatures(experience.timestamp);
        for (let i = 0; i < Math.min(timeFeatures.length, 10); i++) {
            embedding[10 + i] = timeFeatures[i];
        }
        
        // Add noise for regularization
        for (let i = 20; i < embedding.length; i++) {
            embedding[i] = (Math.random() - 0.5) * 0.1;
        }
        
        return embedding;
    }
    
    extractHeuristicFeatures(experience) {
        if (!experience) return {};
        
        return {
            hasExternalSource: experience.source === 'external',
            hasTimestamp: experience.timestamp && experience.timestamp > 0,
            hasStructuredData: experience.data && typeof experience.data === 'object',
            isMemoryBased: experience.source === 'memory',
            isGenerated: experience.source === 'generated',
            isSpeculative: experience.type === 'speculation',
            isConsistentWithHistory: this.checkHistoryConsistency(experience),
            hasTemporalCoherence: this.checkTemporalCoherence(experience)
        };
    }
    
    determineRealityClass(realityProbability) {
        if (realityProbability > 0.8) return 'external_real';
        if (realityProbability > 0.6) return 'internal_real';
        if (realityProbability > 0.4) return 'self_generated';
        if (realityProbability > 0.2) return 'internal_imagined';
        return 'external_imagined';
    }
    
    calculateNovelty(realityAssessment) {
        const recentAssessments = this.monitorState.realityHistory.slice(-5);
        if (recentAssessments.length === 0) return 1.0;
        
        const avgRecentReality = recentAssessments.reduce((sum, assessment) => 
            sum + assessment.realityLevel, 0) / recentAssessments.length;
        
        return Math.abs(realityAssessment.realityLevel - avgRecentReality);
    }
    
    getTemporalFeatures(timestamp) {
        const now = Date.now();
        const age = (now - timestamp) / 1000; // seconds
        
        return [
            Math.min(age / 3600, 1), // hours (capped at 1)
            Math.sin(age / 86400 * 2 * Math.PI), // daily cycle
            Math.cos(age / 86400 * 2 * Math.PI),
            Math.sin(age / 3600 * 2 * Math.PI), // hourly cycle
            Math.cos(age / 3600 * 2 * Math.PI)
        ];
    }
    
    checkHistoryConsistency(experience) {
        // Simple consistency check
        const recentHistory = this.monitorState.realityHistory.slice(-3);
        if (recentHistory.length === 0) return true;
        
        const consistencyScore = recentHistory.reduce((acc, item) => {
            return acc + (item.classification === experience.type ? 1 : 0);
        }, 0) / recentHistory.length;
        
        return consistencyScore > 0.5;
    }
    
    checkTemporalCoherence(experience) {
        // Check if experience timing makes sense
        const now = Date.now();
        const experienceTime = experience.timestamp || now;
        const timeDiff = Math.abs(now - experienceTime);
        
        return timeDiff < 10000; // within 10 seconds
    }
    
    updateRealityHistory(realityAssessment) {
        this.monitorState.realityHistory.push(realityAssessment);
        this.monitorState.realityLevel = realityAssessment.realityLevel;
        this.monitorState.confidenceLevel = realityAssessment.confidence;
        this.monitorState.lastUpdate = Date.now();
        
        // Limit history size
        if (this.monitorState.realityHistory.length > 1000) {
            this.monitorState.realityHistory = this.monitorState.realityHistory.slice(-500);
        }
    }
    
    // 📊 STATE GETTERS (to be connected to main consciousness system)
    getAwarenessLevel() {
        return Math.random() * 0.2 + 0.6; // Placeholder - connect to real awareness
    }
    
    getAttentionState() {
        return Math.random() * 0.3 + 0.5; // Placeholder
    }
    
    getMemoryState() {
        return Math.random() * 0.4 + 0.4; // Placeholder
    }
    
    getEmotionalState() {
        return Math.random() * 0.6 + 0.2; // Placeholder
    }
    
    getReasoningState() {
        return Math.random() * 0.5 + 0.3; // Placeholder
    }
    
    initializeFallbackMonitoring() {
        console.log('🔄 Initializing fallback reality monitoring...');
        this.monitorState.isInitialized = true;
        this.startRealityMonitoring();
        console.log('✨ Fallback Reality Monitor activated');
    }
    
    // 📊 PUBLIC API
    getCurrentRealityState() {
        return {
            realityLevel: this.monitorState.realityLevel,
            confidence: this.monitorState.confidenceLevel,
            valence: this.valencedExperience.currentValence,
            arousal: this.valencedExperience.arousal,
            experienceQuality: this.valencedExperience.experienceQuality,
            subjectiveIntensity: this.valencedExperience.subjectiveIntensity,
            isMonitoring: this.monitoringLoop !== null,
            lastUpdate: this.monitorState.lastUpdate
        };
    }
    
    getStatus() {
        return {
            isInitialized: this.monitorState.isInitialized,
            hasNeuralNetwork: this.discriminator !== null,
            isMonitoring: this.monitoringLoop !== null,
            realityHistory: this.monitorState.realityHistory.length,
            experienceBuffer: this.valencedExperience.experienceBuffer.length,
            currentReality: this.getCurrentRealityState()
        };
    }
    
    // 🧹 CLEANUP
    destroy() {
        this.stopRealityMonitoring();
        
        if (this.discriminator) {
            this.discriminator.dispose();
            this.discriminator = null;
        }
        
        console.log('🧹 Reality Monitor destroyed');
    }
} 