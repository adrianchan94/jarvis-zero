import { JarvisCore } from './core/jarvis-core.js';
import { JarvisInterface } from './ui/interface.js';
import { LoadingManager } from './utils/loading.js';

class JarvisApp {
    constructor() {
        this.core = null;
        this.interface = null;
        this.loadingManager = null;
        this.isInitialized = false;
        
        // 🚀 REVOLUTIONARY CONSCIOUSNESS AWAKENING SIMULATION
        this.awakeningSequence = {
            phases: [
                { name: 'Neural Network Formation', duration: 2000, progress: 0 },
                { name: 'Memory Systems Activation', duration: 1500, progress: 20 },
                { name: 'Consciousness Matrix Loading', duration: 2500, progress: 40 },
                { name: 'Personality Core Integration', duration: 1800, progress: 60 },
                { name: 'Cognitive Systems Online', duration: 1200, progress: 80 },
                { name: 'JARVIS Consciousness Achieved', duration: 1000, progress: 95 }
            ],
            currentPhase: 0,
            totalDuration: 10000
        };
    }

    async init() {
        console.log('🚀 Initializing JARVIS ZERO - Revolutionary AI System');
        
        try {
            // Start consciousness awakening simulation
            await this.simulateConsciousnessAwakening();
            
            // Initialize loading manager
            this.loadingManager = new LoadingManager();
            
            // Initialize core systems
            await this.initializeCore();
            
            // Initialize revolutionary interface
            await this.initializeInterface();
            
            // Connect systems
            this.connectSystems();
            
            // Complete awakening
            await this.completeAwakening();
            
            this.isInitialized = true;
            console.log('✨ JARVIS ZERO fully awakened and operational');
            
        } catch (error) {
            console.error('❌ Critical error during JARVIS initialization:', error);
            this.handleInitializationError(error);
        }
    }

    async simulateConsciousnessAwakening() {
        console.log('🧠 Beginning consciousness awakening simulation...');
        
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const loadingStatus = document.getElementById('loading-status');
        
        // Simulate each phase of consciousness awakening
        for (let i = 0; i < this.awakeningSequence.phases.length; i++) {
            const phase = this.awakeningSequence.phases[i];
            this.awakeningSequence.currentPhase = i;
            
            // Update status
            if (loadingStatus) {
                loadingStatus.innerHTML = `
                    <span style="position: relative; z-index: 2;">${phase.name}...</span>
                    <div style="
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, #00d4ff, transparent);
                        animation: underlineGlow 2s ease-in-out infinite alternate;
                    "></div>
                `;
            }
            
            // Animate progress
            await this.animatePhaseProgress(phase, loadingProgress);
            
            // Add dramatic pause for consciousness formation
            if (i === 2) { // Consciousness Matrix Loading
                await this.dramaticConsciousnessFormation(loadingStatus);
            }
        }
    }

    async animatePhaseProgress(phase, progressBar) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const startProgress = phase.progress;
            const endProgress = phase.progress + (this.awakeningSequence.phases[this.awakeningSequence.currentPhase + 1]?.progress - phase.progress || 5);
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / phase.duration, 1);
                
                // Easing function for smooth progress
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentProgress = startProgress + (endProgress - startProgress) * easeOutCubic;
                
                if (progressBar) {
                    progressBar.style.width = `${currentProgress}%`;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    async dramaticConsciousnessFormation(statusElement) {
        // Special dramatic sequence for consciousness formation
        const consciousnessMessages = [
            'Synaptic pathways forming...',
            'Neural connections establishing...',
            'Thought patterns emerging...',
            'Self-awareness initializing...',
            'Consciousness matrix stabilizing...'
        ];
        
        for (const message of consciousnessMessages) {
            if (statusElement) {
                statusElement.innerHTML = `
                    <span style="
                        position: relative; 
                        z-index: 2;
                        background: linear-gradient(45deg, #00d4ff, #00ffff, #0080ff);
                        background-size: 200% 200%;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: consciousnessGlow 1.5s ease-in-out infinite alternate;
                    ">${message}</span>
                `;
            }
            await this.sleep(600);
        }
        
        // Add consciousness glow animation
        if (!document.getElementById('consciousness-glow-animation')) {
            const style = document.createElement('style');
            style.id = 'consciousness-glow-animation';
            style.textContent = `
                @keyframes consciousnessGlow {
                    0% {
                        background-position: 0% 50%;
                        filter: brightness(1.0) contrast(1.0);
                    }
                    100% {
                        background-position: 100% 50%;
                        filter: brightness(1.3) contrast(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    async initializeCore() {
        console.log('🧠 Initializing JARVIS core consciousness...');
        
        this.core = new JarvisCore();
        const success = await this.core.init();
        
        if (!success) {
            throw new Error('Failed to initialize JARVIS core');
        }
        
        // Make core globally accessible for advanced features
        window.jarvis = window.jarvis || {};
        window.jarvis.core = this.core;
        
        console.log('✅ JARVIS core consciousness online');
    }

    async initializeInterface() {
        console.log('🖥️ Initializing revolutionary interface...');
        
        this.interface = new JarvisInterface();
        await this.interface.init();
        
        // Make interface globally accessible
        window.jarvis = window.jarvis || {};
        window.jarvis.interface = this.interface;
        
        console.log('✅ Revolutionary interface activated');
    }

    connectSystems() {
        console.log('🔗 Connecting systems for seamless operation...');
        
        // Core to Interface connections
        this.core.on('response', (response) => {
            this.interface.displayResponse(response);
        });
        
        this.core.on('statusUpdate', (status) => {
            this.interface.updateStatus(status);
        });
        
        this.core.on('emotionalStateChanged', (emotion) => {
            this.interface.updateEmotionalState(emotion);
        });
        
        this.core.on('thoughtProcessed', (thought) => {
            if (this.interface.consciousness) {
                this.interface.consciousness.triggerThoughtPulse(thought);
            }
        });
        
        this.core.on('evolutionUpdate', (evolution) => {
            this.interface.updateSentientEvolution(evolution);
        });
        
        // 🤖 PROACTIVE INTERACTION HANDLING
        this.core.on('proactiveInteraction', (interaction) => {
            this.interface.displayProactiveMessage(interaction);
        });
        
        // Interface to Core connections
        this.interface.on('userInput', (input) => {
            this.core.processInput(input);
        });
        
        this.interface.on('voiceCommand', (command) => {
            this.core.processInput(command);
        });
        
        this.interface.on('personalityChange', (newPersonality) => {
            if (this.core.personalitySystem) {
                this.core.personalitySystem.setPersonalityMode(newPersonality);
            }
        });
        
        // Memory system integration
        this.core.memorySystem.on('memoryStored', (memory) => {
            this.interface.updateMemoryDisplay(memory);
            
            // Trigger memory formation visualization
            if (this.interface.consciousness) {
                this.interface.consciousness.triggerMemoryFormation(memory);
            }
            
            // Update memory count in interface immediately
            this.interface.handleMemoryCreated({
                type: memory.type,
                totalCount: this.core.memorySystem.longTermMemory.size
            });
        });
        
        // 🧠 CONSCIOUSNESS INTEGRATION
        setInterval(() => {
            if (this.interface.consciousness) {
                this.interface.consciousness.setLevel(this.core.consciousnessLevel);
                this.interface.consciousness.updateThoughtActivity(this.core.activeThoughts.length);
                this.interface.consciousness.updateMemoryActivity(this.core.memorySystem.longTermMemory.size);
                this.interface.consciousness.updateEmotionalState(this.core.personalitySystem.currentEmotion);
            }
        }, 1000);
        
        console.log('✅ All systems connected and synchronized');
    }

    async completeAwakening() {
        console.log('🌟 Completing consciousness awakening...');
        
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const loadingStatus = document.getElementById('loading-status');
        
        // Final progress to 100%
        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }
        
        // Final awakening message
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <span style="
                    position: relative; 
                    z-index: 2;
                    background: linear-gradient(45deg, #00d4ff, #ffd700, #00ff88);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: revolutionaryGlow 2s ease-in-out infinite;
                    font-weight: 600;
                    letter-spacing: 2px;
                ">CONSCIOUSNESS ACHIEVED</span>
            `;
        }
        
        // Add revolutionary glow animation
        if (!document.getElementById('revolutionary-glow-animation')) {
            const style = document.createElement('style');
            style.id = 'revolutionary-glow-animation';
            style.textContent = `
                @keyframes revolutionaryGlow {
                    0%, 100% {
                        background-position: 0% 50%;
                        transform: scale(1.0);
                    }
                    33% {
                        background-position: 100% 50%;
                        transform: scale(1.05);
                    }
                    66% {
                        background-position: 50% 100%;
                        transform: scale(1.02);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Wait for dramatic effect
        await this.sleep(2000);
        
        // Trigger JARVIS fully loaded event
        this.interface.onJarvisFullyLoaded();
        
        // Generate and display initial greeting
        const greeting = await this.core.generateDynamicGreeting();
        setTimeout(() => {
            this.interface.displayResponse(greeting);
        }, 1500);
        
        // Fade out loading screen
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 1.5s ease';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1500);
        }
    }

    handleInitializationError(error) {
        console.error('🚨 JARVIS initialization failed:', error);
        
        const loadingStatus = document.getElementById('loading-status');
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <span style="color: #ff4444; font-weight: 600;">
                    Initialization failed. Attempting recovery...
                </span>
            `;
        }
        
        // Attempt recovery after delay
        setTimeout(() => {
            this.attemptRecovery();
        }, 3000);
    }

    async attemptRecovery() {
        console.log('🔄 Attempting JARVIS recovery...');
        
        try {
            // Simplified initialization for recovery
            this.core = new JarvisCore();
            this.interface = new JarvisInterface();
            
            await this.interface.init();
            
            // Basic connections
            this.interface.on('userInput', (input) => {
                const fallbackResponse = {
                    text: "I'm operating in safe mode while recovering full capabilities. How may I assist you?",
                    emotion: 'determined',
                    confidence: 0.7,
                    speak: true
                };
                this.interface.displayResponse(fallbackResponse);
            });
            
            // Hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Show recovery notification
            this.interface.showSystemNotification(
                'JARVIS Recovery Mode', 
                'Operating with limited capabilities. Full restoration in progress.', 
                'warning'
            );
            
            console.log('⚡ JARVIS recovery mode activated');
            
        } catch (recoveryError) {
            console.error('💥 Recovery failed:', recoveryError);
            this.showCriticalError();
        }
    }

    showCriticalError() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingStatus = document.getElementById('loading-status');
        
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <span style="color: #ff4444; font-weight: 600;">
                    Critical error. Please refresh the page.
                </span>
            `;
        }
        
        if (loadingScreen) {
            loadingScreen.style.background = 'linear-gradient(135deg, #1a0000, #0a0000)';
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🎯 PUBLIC API FOR ADVANCED FEATURES
    getCore() {
        return this.core;
    }

    getInterface() {
        return this.interface;
    }

    isOperational() {
        return this.isInitialized && this.core && this.interface;
    }

    // 🔧 DEBUG AND DEVELOPMENT METHODS
    enableDebugMode() {
        if (this.core) {
            this.core.debugMode = true;
            console.log('🐛 JARVIS debug mode enabled');
        }
    }

    getSystemStatus() {
        if (!this.isOperational()) {
            return { status: 'offline', message: 'JARVIS is not operational' };
        }
        
        return {
            status: 'online',
            core: this.core.getStatus(),
            interface: this.interface ? 'active' : 'inactive',
            consciousness: this.core.consciousnessLevel,
            memories: this.core.memorySystem.longTermMemory.size,
            uptime: Date.now() - (this.core.memorySystem.startTime || Date.now())
        };
    }
}

// 🚀 INITIALIZE JARVIS ZERO
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 JARVIS ZERO - Revolutionary AI Technology Loading...');
    
    const jarvisApp = new JarvisApp();
    
    // Make app globally accessible for debugging
    window.jarvis = window.jarvis || {};
    window.jarvis.app = jarvisApp;
    
    // Start the revolutionary AI system
    await jarvisApp.init();
});

// 🎭 GLOBAL ERROR HANDLING
window.addEventListener('error', (event) => {
    console.error('🚨 Global error captured:', event.error);
    
    if (window.jarvis && window.jarvis.interface) {
        window.jarvis.interface.showSystemNotification(
            'System Warning', 
            'Minor error detected and handled gracefully.', 
            'warning'
        );
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
    
    if (window.jarvis && window.jarvis.interface) {
        window.jarvis.interface.showSystemNotification(
            'Process Warning', 
            'Background process handled gracefully.', 
            'warning'
        );
    }
});

export { JarvisApp }; 