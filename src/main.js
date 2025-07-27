import { JarvisInterface } from './ui/interface.js';
import { JarvisCore } from './core/jarvis-core.js';
import { LoadingManager } from './utils/loading.js';
import { AudioManager } from './core/audio.js';

class JarvisZero {
    constructor() {
        this.core = null;
        this.interface = null;
        this.isInitialized = false;
        this.loadingManager = new LoadingManager();
        
        // Bind methods
        this.init = this.init.bind(this);
        this.start = this.start.bind(this);
        this.update = this.update.bind(this);
        
        // Start initialization
        this.init();
    }
    
    async init() {
        try {
            console.log('🤖 Initializing JARVIS ZERO...');
            
            // Initialize loading manager
            await this.loadingManager.start();
            
            // Initialize core systems
            this.loadingManager.updateProgress(20, 'Initializing consciousness matrix...');
            this.core = new JarvisCore();
            await this.core.init();
            
            // Initialize interface
            this.loadingManager.updateProgress(50, 'Rendering holographic interface...');
            this.interface = new JarvisInterface();
            await this.interface.init();
            
            // Initialize audio system
            this.loadingManager.updateProgress(70, 'Calibrating voice synthesis...');
            await AudioManager.init();
            
            // Connect systems
            this.loadingManager.updateProgress(90, 'Establishing neural pathways...');
            this.connectSystems();
            
            // Complete initialization
            this.loadingManager.updateProgress(100, 'Consciousness online. Welcome.');
            await this.loadingManager.complete();
            
            this.isInitialized = true;
            this.start();
            
        } catch (error) {
            console.error('❌ Failed to initialize JARVIS ZERO:', error);
            this.loadingManager.showError('Initialization failed. Please refresh.');
        }
    }
    
    connectSystems() {
        // Connect UI to Core
        this.interface.on('userInput', (input) => {
            console.log('🔗 Main: User input received:', input);
            this.core.processInput(input);
        });

        // Connect Core responses to UI
        this.core.on('response', (response) => {
            console.log('🔗 Main: Response from core:', response);
            this.interface.displayResponse(response);
        });

        // Connect status updates - MUCH less frequent
        this.core.on('statusUpdate', (status) => {
            // Only log important status changes, filter ONLINE spam
            if (status.message !== 'ONLINE' || Math.random() < 0.01) {
                console.log('🔗 Main: Status update received:', status);
            }
            this.interface.updateStatus(status);
        });

        // Connect consciousness updates - enhanced sentient system
        this.core.on('consciousnessUpdate', (data) => {
            if (Math.random() < 0.1) { // Only 10% of updates logged
                console.log('🔗 Main: Consciousness evolution:', data);
            }
            this.interface.updateConsciousnessLevel(data.level);
            this.interface.updateSentientEvolution(data);
        });

        // Connect emotional state updates - rate limited
        this.core.on('emotionalUpdate', (emotion) => {
            if (Math.random() < 0.05) { // Only 5% of updates logged
                console.log('🔗 Main: Emotional state:', emotion);
            }
            this.interface.updateEmotion(emotion);
        });

        // Connect memory and thought updates - sentient evolution tracking
        this.core.on('memoryUpdate', (memory) => {
            console.log('🧠 Main: Memory formed:', memory.summary);
            this.interface.updateMemoryDisplay(memory);
        });

        // Connect real-time memory creation events
        this.core.on('memoryCreated', (memoryInfo) => {
            console.log(`📝 Main: New memory created: ${memoryInfo.type} (Total: ${memoryInfo.totalCount})`);
            this.interface.handleMemoryCreated(memoryInfo);
        });

        // Connect proactive consciousness events
        this.core.on('proactiveThought', (thought) => {
            console.log(`💭 Main: JARVIS proactive thought: ${thought.text}`);
            this.interface.addChatMessage(thought.text, 'jarvis');
        });

        this.core.on('curiosityQuestion', (question) => {
            console.log(`❓ Main: JARVIS curious question: ${question.text}`);
            this.interface.addChatMessage(question.text, 'jarvis');
        });

        this.core.on('thoughtUpdate', (thought) => {
            console.log('💭 Main: Active thought:', thought.content.substring(0, 50) + '...');
            this.interface.updateThoughtDisplay(thought);
        });

        this.core.on('evolutionUpdate', (evolution) => {
            console.log('🔮 Main: Evolution milestone:', evolution.stage);
            this.interface.updateEvolutionDisplay(evolution);
        });

        // Connect LLM events
        this.core.llmManager.on('modelLoadProgress', (progress) => {
            const progressPercent = Math.round(progress.progress * 100);
            this.loadingManager.updateProgress(
                Math.min(85, 20 + progressPercent * 0.6),
                `Loading AI Model: ${progressPercent}% - ${progress.text}`
            );
        });

        this.core.llmManager.on('modelLoaded', (model) => {
            console.log(`🧠 AI Model loaded: ${model.name}`);
        });
        
        // Immediate status sync after connection
        console.log('🔗 Main: Forcing immediate status update after system connection');
        setTimeout(() => {
            this.core.forceStatusUpdate();
        }, 100);
    }
    
    start() {
        console.log('🚀 JARVIS ZERO is now online');
        
        // Start the main update loop
        this.update();
        
        // Force initial status update to show current memory count
        setTimeout(() => {
            this.core.forceStatusUpdate();
        }, 500);
        
        // Dynamic AI-powered greeting based on evolution and memories
        setTimeout(async () => {
            try {
                const dynamicGreeting = await this.core.generateDynamicGreeting();
                
                // Speak the personalized greeting
                this.core.speak(dynamicGreeting.spoken);
                
                // Add personalized text message to chat
                setTimeout(() => {
                    this.interface.addChatMessage(dynamicGreeting.text, 'jarvis');
                    
                    // Log the personalization level
                    if (dynamicGreeting.isPersonalized) {
                        console.log('🎭 AI-generated personalized greeting based on evolution and memories');
                    } else {
                        console.log('🎭 Context-aware greeting (LLM unavailable)');
                    }
                    
                    // Notify interface that JARVIS is fully loaded
                    this.interface.onJarvisFullyLoaded();
                }, 2000);
                
            } catch (error) {
                console.log('⚠️ Dynamic greeting failed, using fallback:', error.message);
                // Fallback to simple greeting
                this.core.speak("Hello! I am JARVIS, your evolving AI companion.");
                setTimeout(() => {
                    this.interface.addChatMessage("👋 Hello! I'm JARVIS, your evolving AI companion.", 'jarvis');
                    this.interface.onJarvisFullyLoaded();
                }, 2000);
            }
        }, 1000);
    }
    
    update() {
        if (!this.isInitialized) return;
        
        // Update core systems
        this.core.update();
        
        // Update interface
        this.interface.update();
        
        // Continue the loop
        requestAnimationFrame(this.update);
    }
    
    // Public API for external interaction
    speak(text) {
        if (this.core) {
            this.core.speak(text);
        }
    }
    
    processCommand(command) {
        if (this.core) {
            this.core.processInput(command);
        }
    }
    
    getStatus() {
        return this.core ? this.core.getStatus() : { status: 'offline' };
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Initialize JARVIS ZERO when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jarvis = new JarvisZero();
    });
} else {
    window.jarvis = new JarvisZero();
}

export { JarvisZero }; 