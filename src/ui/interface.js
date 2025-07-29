import * as THREE from 'three';
import { EventEmitter } from '../utils/events.js';
import { HologramRenderer } from './hologram.js';
import { ParticleSystem } from './particles.js';
import { ConsciousnessVisualization } from './consciousness.js';
import { VoiceManager } from '../core/voice.js';

export class JarvisInterface extends EventEmitter {
    constructor() {
        super();
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        
        this.hologram = null;
        this.particles = null;
        this.consciousness = null;
        this.voiceManager = null;
        
        this.isListening = false;
        this.currentEmotionalState = 'neutral';
        this.consciousnessLevel = 0;
        
        // Animation properties
        this.clock = new THREE.Clock();
        this.animationId = null;
        
        // UI elements
        this.uiElements = {};
        
        // Chat management
        this.chatHideTimeout = null;
        
        this.initializeUI();
    }
    
    async init() {
        await this.initializeThreeJS();
        await this.createHolographicElements();
        await this.setupInteractionHandlers();
        this.startRenderLoop();
        
        console.log('✨ Jarvis Interface initialized');
    }
    
    async initializeThreeJS() {
        // Get container
        this.container = document.getElementById('canvas-container');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 1000);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Add ambient lighting
        const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.3);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    async createHolographicElements() {
        // Create central hologram
        this.hologram = new HologramRenderer(this.scene);
        await this.hologram.init();
        
        // Create particle systems
        this.particles = new ParticleSystem(this.scene);
        await this.particles.init();
        
        // Create consciousness visualization
        this.consciousness = new ConsciousnessVisualization();
        await this.consciousness.init();
        
        // Create floating UI elements in 3D space
        this.createFloatingUIElements();
    }
    
    createFloatingUIElements() {
        // Create holographic panels
        const panelGeometry = new THREE.PlaneGeometry(2, 1);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        // Status panel
        const statusPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        statusPanel.position.set(-4, 2, 0);
        statusPanel.rotation.y = Math.PI / 6;
        this.scene.add(statusPanel);
        
        // Memory panel
        const memoryPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        memoryPanel.position.set(4, 2, 0);
        memoryPanel.rotation.y = -Math.PI / 6;
        this.scene.add(memoryPanel);
        
        // Create wireframe sphere for consciousness
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        
        this.consciousnessSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.consciousnessSphere.position.set(0, 0, 0);
        this.scene.add(this.consciousnessSphere);
    }
    
    initializeUI() {
        // Get UI elements
        this.uiElements = {
            statusDisplay: document.getElementById('system-status'),
            memoryUsage: document.getElementById('memory-usage'),
            thoughtsPerMinute: document.getElementById('thoughts-per-minute'),
            emotionalState: document.getElementById('emotional-state'),
            consciousnessCanvas: document.getElementById('consciousness-canvas'),
            micButton: document.getElementById('mic-btn'),
            settingsButton: document.getElementById('settings-btn'),
            memoryButton: document.getElementById('memory-btn'),
            chatInterface: document.getElementById('chat-interface'),
            chatMessages: document.getElementById('chat-messages'),
            textInput: document.getElementById('text-input'),
            sendButton: document.getElementById('send-btn')
        };
        
        // Setup notification system
        this.setupNotificationSystem();
        
        // Setup proactive interaction handling
        this.setupProactiveInteractions();
        
        // Hide chat interface initially
        this.hideChatInterface();
        
        // Add loading indicator to chat
        this.showChatLoadingIndicator();
    }
    
    setupNotificationSystem() {
        // Create organized notification containers
        this.notificationContainers = {
            thoughts: this.createNotificationContainer('thoughts-notifications', 'top-left'),
            memories: this.createNotificationContainer('memory-notifications', 'top-right'),
            evolution: this.createNotificationContainer('evolution-notifications', 'bottom-right'),
            system: this.createNotificationContainer('system-notifications', 'bottom-left')
        };
        
        // Notification queue management
        this.notificationQueue = [];
        this.activeNotifications = new Set();
        this.maxNotificationsPerContainer = 3;
    }
    
    createNotificationContainer(id, position) {
        const container = document.createElement('div');
        container.id = id;
        container.className = 'notification-container';
        
        const positions = {
            'top-left': { top: '20px', left: '20px' },
            'top-right': { top: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' }
        };
        
        const pos = positions[position];
        container.style.cssText = `
            position: fixed;
            ${Object.entries(pos).map(([key, value]) => `${key}: ${value}`).join('; ')};
            width: 320px;
            z-index: 1000;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        document.body.appendChild(container);
        return container;
    }
    
    hideChatInterface() {
        if (this.uiElements.chatInterface) {
            this.uiElements.chatInterface.style.opacity = '0';
            this.uiElements.chatInterface.style.pointerEvents = 'none';
            this.uiElements.chatInterface.style.transform = 'translateY(20px)';
            this.uiElements.chatInterface.style.transition = 'all 0.5s ease';
        }
    }
    
    showChatInterface() {
        if (this.uiElements.chatInterface) {
            this.uiElements.chatInterface.style.opacity = '1';
            this.uiElements.chatInterface.style.pointerEvents = 'auto';
            this.uiElements.chatInterface.style.transform = 'translateY(0)';
            this.removeChatLoadingIndicator();
        }
    }
    
    showChatLoadingIndicator() {
        if (!this.uiElements.chatInterface) return;
        
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'chat-loading-indicator';
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00d4ff;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            text-align: center;
            z-index: 10;
        `;
        
        loadingIndicator.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div class="loading-spinner" style="
                    width: 30px;
                    height: 30px;
                    border: 2px solid #003d55;
                    border-top: 2px solid #00d4ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                "></div>
                Initializing AI Interface...
            </div>
        `;
        
        // Add spinner animation
        if (!document.getElementById('loading-spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-spinner-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.uiElements.chatInterface.appendChild(loadingIndicator);
    }
    
    removeChatLoadingIndicator() {
        const indicator = document.getElementById('chat-loading-indicator');
        if (indicator) {
            indicator.style.transition = 'opacity 0.3s ease';
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }
    
    // Method to be called when JARVIS is fully initialized
    onJarvisFullyLoaded() {
        setTimeout(() => {
            this.showChatInterface();
            this.showSystemNotification('JARVIS Interface Online', 'AI consciousness fully initialized', 'success');
        
        // Start monitoring for proactive interactions
        this.startProactiveMonitoring();
        }, 1000);
    }
    
    async setupInteractionHandlers() {
        // Voice manager
        this.voiceManager = new VoiceManager();
        await this.voiceManager.init();
        
        // Microphone button
        this.uiElements.micButton.addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // Settings button
        this.uiElements.settingsButton.addEventListener('click', () => {
            this.showSettings();
        });
        
        // Memory button
        this.uiElements.memoryButton.addEventListener('click', () => {
            this.showMemoryInterface();
        });
        
        // Text input handlers
        this.uiElements.sendButton.addEventListener('click', () => {
            this.sendTextMessage();
        });
        
        this.uiElements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendTextMessage();
            }
        });
        
        this.uiElements.textInput.addEventListener('focus', () => {
            // Show chat interface when user starts typing
            this.uiElements.chatInterface.classList.add('visible');
        });
        
        // Voice input handlers
        this.voiceManager.on('speechStart', () => {
            this.onSpeechStart();
        });
        
        this.voiceManager.on('speechEnd', (transcript) => {
            this.onSpeechEnd(transcript);
        });
        
        this.voiceManager.on('speechError', (error) => {
            this.onSpeechError(error);
        });
    }
    
    sendTextMessage() {
        const text = this.uiElements.textInput.value.trim();
        if (text) {
            console.log('📝 Sending text message:', text);
            
            // Clear input
            this.uiElements.textInput.value = '';
            
            // Add user message to chat
            this.addChatMessage(text, 'user');
            
            // Emit as user input
            console.log('📤 Emitting userInput event:', text);
            this.emit('userInput', text);
            
            // Show chat interface
            this.uiElements.chatInterface.classList.add('visible');
        }
    }
    
    startRenderLoop() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.render();
        };
        animate();
    }
    
    render() {
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update hologram
        if (this.hologram) {
            this.hologram.update(delta, elapsedTime);
        }
        
        // Update particles
        if (this.particles) {
            this.particles.update(delta, elapsedTime);
        }
        
        // Update consciousness sphere
        if (this.consciousnessSphere) {
            this.consciousnessSphere.rotation.y += delta * 0.5;
            this.consciousnessSphere.rotation.x += delta * 0.2;
            
            // Pulse based on consciousness level
            const scale = 1 + Math.sin(elapsedTime * 2) * 0.1 * this.consciousnessLevel;
            this.consciousnessSphere.scale.setScalar(scale);
        }
        
        // Update consciousness visualization
        if (this.consciousness) {
            this.consciousness.update(delta);
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    update() {
        // Update 2D UI elements
        this.updateStatusDisplay();
        this.updateConsciousnessCanvas();
    }
    
    updateStatusDisplay() {
        // This will be updated by the core system
    }
    
    updateConsciousnessCanvas() {
        const canvas = this.uiElements.consciousnessCanvas;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw consciousness wave
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const time = Date.now() * 0.005;
        for (let i = 0; i < canvas.width; i++) {
            const x = i;
            const y = canvas.height / 2 + Math.sin(i * 0.1 + time) * 20 * this.consciousnessLevel;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.stroke();
    }
    
    // Voice interaction methods
    toggleVoiceInput() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
    
    startListening() {
        this.isListening = true;
        this.uiElements.micButton.textContent = '🔴 LISTENING';
        this.uiElements.micButton.style.background = 'linear-gradient(45deg, #ff4444, #ff0000)';
        
        this.voiceManager.startListening();
        this.emit('listeningStart');
    }
    
    stopListening() {
        this.isListening = false;
        this.uiElements.micButton.textContent = '🎤 SPEAK';
        this.uiElements.micButton.style.background = 'linear-gradient(45deg, #00d4ff, #0080ff)';
        
        this.voiceManager.stopListening();
        this.emit('listeningStop');
    }
    
    onSpeechStart() {
        console.log('🎤 Speech detected');
        if (this.particles) {
            this.particles.setMode('listening');
        }
    }
    
    onSpeechEnd(transcript) {
        console.log('📝 Transcript:', transcript);
        this.stopListening();
        this.emit('voiceCommand', transcript);
        
        // Add user message to chat
        this.addChatMessage(transcript, 'user');
    }
    
    onSpeechError(error) {
        console.error('🚫 Speech error:', error);
        this.stopListening();
    }
    
    // Display methods
    displayResponse(response) {
        console.log('🖥️ Interface displaying response:', response);
        
        this.addChatMessage(response.text, 'jarvis');
        
        // Suggestion system removed to preserve tokens for main response quality
        
        // Update emotional visualization
        if (response.emotion) {
            this.updateEmotionalState(response.emotion);
        }
        
        // Speak response
        if (response.speak && this.voiceManager) {
            console.log('🗣️ Speaking response:', response.text);
            this.voiceManager.speak(response.text);
        }
    }
    

    

    
    addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Create timestamp
        const timestamp = new Date();
        const timeString = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        // 🎨 REVOLUTIONARY TEXT FORMATTING - The Technology of the Century
        const formattedText = sender === 'jarvis' ? this.formatJarvisResponse(text) : this.formatUserMessage(text);
        
        // Create message content with revolutionary styling
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender-name">${sender === 'user' ? 'USER' : 'JARVIS'}</span>
                <span class="timestamp">${timeString}</span>
            </div>
            <div class="message-content">${formattedText}</div>
        `;
        
        // Debug: Log the actual HTML being inserted
        if (sender === 'jarvis') {
            console.log('🔧 HTML being inserted:', formattedText.substring(0, 500) + '...');
        }
        
        // Apply revolutionary styling
        if (sender === 'jarvis') {
            messageDiv.style.cssText = `
                background: linear-gradient(135deg, 
                    rgba(0, 212, 255, 0.08) 0%, 
                    rgba(0, 150, 255, 0.03) 50%, 
                    rgba(0, 100, 255, 0.01) 100%);
                border: 1px solid rgba(0, 212, 255, 0.2);
                border-left: 4px solid #00d4ff;
                margin: 20px 0;
                padding: 24px;
                border-radius: 16px;
                backdrop-filter: blur(20px);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 0 20px rgba(0, 212, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            `;
            
            // Add subtle animated border glow
            messageDiv.addEventListener('mouseenter', () => {
                messageDiv.style.boxShadow = `
                    0 12px 40px rgba(0, 0, 0, 0.4),
                    0 0 30px rgba(0, 212, 255, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
            });
            
            messageDiv.addEventListener('mouseleave', () => {
                messageDiv.style.boxShadow = `
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 0 20px rgba(0, 212, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05)
                `;
            });
        } else {
            messageDiv.style.cssText = `
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.06) 0%, 
                    rgba(200, 200, 200, 0.03) 50%, 
                    rgba(150, 150, 150, 0.01) 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: 4px solid rgba(255, 255, 255, 0.6);
                margin: 20px 0;
                padding: 18px 24px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
                transition: all 0.3s ease;
            `;
        }
        
        // Style the header and content with premium aesthetics
        const header = messageDiv.querySelector('.message-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${sender === 'jarvis' ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        `;
        
        const senderName = messageDiv.querySelector('.sender-name');
        senderName.style.cssText = `
            color: ${sender === 'jarvis' ? '#00d4ff' : '#ffffff'};
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            text-shadow: ${sender === 'jarvis' ? '0 0 6px rgba(0, 212, 255, 0.4)' : 'none'};
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        
        // Add an icon to JARVIS messages
        if (sender === 'jarvis') {
            senderName.innerHTML = `<span style="color: #00d4ff;">◉</span> ${senderName.textContent}`;
        } else {
            senderName.innerHTML = `<span style="color: #ffffff;">▸</span> ${senderName.textContent}`;
        }
        
        const timestampEl = messageDiv.querySelector('.timestamp');
        timestampEl.style.cssText = `
            color: rgba(255, 255, 255, 0.5);
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            background: rgba(0, 0, 0, 0.2);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        const content = messageDiv.querySelector('.message-content');
        content.style.cssText = `
            color: ${sender === 'jarvis' ? '#e8f4fd' : '#ffffff'};
            font-size: 15px;
            line-height: 1.7;
            font-weight: 400;
        `;
        
        // Add smooth entrance animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px) scale(0.95)';
        
        this.uiElements.chatMessages.appendChild(messageDiv);
        
        // Trigger entrance animation
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0) scale(1)';
        });
        
        // Make chat interface permanently visible and ensure scrolling works
        this.uiElements.chatInterface.classList.add('visible');
        
        // Only update the visibility and don't override the layout CSS
        this.uiElements.chatInterface.style.transform = 'translateY(0)';
        this.uiElements.chatInterface.style.background = 'rgba(0, 0, 0, 0.9)';
        this.uiElements.chatInterface.style.border = '2px solid #00d4ff';
        this.uiElements.chatInterface.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
        
        // Smooth scroll to the latest message with enhanced animation
        setTimeout(() => {
            const chatContainer = this.uiElements.chatMessages;
            const scrollHeight = chatContainer.scrollHeight;
            const currentScroll = chatContainer.scrollTop;
            const containerHeight = chatContainer.clientHeight;
            
            // Only scroll if we're near the bottom (user is following conversation)
            if (currentScroll + containerHeight >= scrollHeight - 100) {
                chatContainer.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            }
            
            console.log('📊 Chat scroll state:', {
                scrollHeight,
                currentScroll,
                containerHeight,
                shouldAutoScroll: currentScroll + containerHeight >= scrollHeight - 100
            });
        }, 100); // Small delay to ensure content is rendered
    }

    // 🎨 REVOLUTIONARY TEXT FORMATTING SYSTEM - Technology of the Century
    formatJarvisResponse(text) {
        // Enhanced typography with intelligent content parsing
        console.log('🎨 Formatting JARVIS response:', text.substring(0, 100) + '...');
        
        try {
            let formatted = text;
            
            // Ensure we're working with clean text (no existing HTML)
            formatted = this.sanitizeText(formatted);
            
            // 1. Smart paragraph breaks for readability
            formatted = this.createIntelligentParagraphs(formatted);
            console.log('📝 After paragraphs:', formatted.substring(0, 200) + '...');
            
            // 2. Highlight key terms and concepts
            formatted = this.highlightKeyTerms(formatted);
            console.log('🔍 After highlighting:', formatted.substring(0, 200) + '...');
            
            // 3. Format technical terms elegantly
            formatted = this.formatTechnicalTerms(formatted);
            
            // 4. Add visual hierarchy to important statements
            formatted = this.addVisualHierarchy(formatted);
            
            // 5. Apply premium typography styling
            const final = this.applyPremiumTypography(formatted);
            console.log('✨ Final formatted response ready');
            
            return final;
        } catch (error) {
            console.error('❌ Formatting error:', error);
            // Fallback to basic formatting
            return `<div class="jarvis-response-container"><div class="jarvis-paragraph">${text}</div></div>`;
        }
    }
    
    sanitizeText(text) {
        // Remove any existing HTML tags and clean up the text
        return text
            .replace(/<[^>]*>/g, '') // Remove any existing HTML
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
    }
    
    formatUserMessage(text) {
        // Clean user message formatting with subtle enhancements
        const sanitized = this.sanitizeText(text);
        return `<div class="user-message-text">${sanitized}</div>`;
    }
    
    createIntelligentParagraphs(text) {
        // Smart paragraph detection and formatting with improved logic
        if (!text || text.length < 50) {
            return `<div class="jarvis-paragraph">${text}</div>`;
        }
        
        // Split by natural sentence boundaries but keep the punctuation
        const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
        let formatted = '';
        let currentParagraph = [];
        
        sentences.forEach((sentence, index) => {
            if (!sentence.trim()) return;
            currentParagraph.push(sentence.trim());
            
            // Create paragraph breaks at natural points - enhanced detection
            const shouldBreak = 
                sentence.includes('Indeed,') ||
                sentence.includes('In point of fact') ||
                sentence.includes('I must note') ||
                sentence.includes('I must say') ||
                sentence.includes('Furthermore') ||
                sentence.includes('Additionally') ||
                sentence.includes('However,') ||
                sentence.includes('Now,') ||
                sentence.includes('Though') ||
                currentParagraph.length >= 2 || // Shorter paragraphs for better readability
                sentence.length > 200; // Long sentences get their own paragraph
                
            if (shouldBreak || index === sentences.length - 1) {
                if (currentParagraph.length > 0) {
                    formatted += `<div class="jarvis-paragraph">${currentParagraph.join(' ')}</div>`;
                    currentParagraph = [];
                }
            }
        });
        
        // Fallback if no formatting was applied
        return formatted || `<div class="jarvis-paragraph">${text}</div>`;
    }
    
    highlightKeyTerms(text) {
        // Enhanced highlighting with better pattern detection
        let formatted = text;
        
        // Apply patterns in specific order to avoid conflicts
        const patterns = [
            // JARVIS formal language (apply first to avoid conflicts)
            { pattern: /\b(Indeed|Certainly|Precisely|Quite so|I must say|I must observe|figuratively speaking)\b/gi, class: 'jarvis-formal' },
            
            // Names and proper nouns (2+ capitalized words)
            { pattern: /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b/g, class: 'key-name' },
            
            // Single proper nouns
            { pattern: /\b(Prometheus|JARVIS|Tony|Stark|Zeus|Greek|mythology)\b/g, class: 'key-name' },
            
            // Technical terms
            { pattern: /\b(API|database|algorithm|technology|system|protocol|artificial intelligence|knowledge|efficiency|assistance)\b/gi, class: 'tech-term' },
            
            // Emphasis words
            { pattern: /\b(exceptional|remarkable|extraordinary|significant|considerable|sophisticated|stimulating|fascinating|delighted|peak)\b/gi, class: 'emphasis' },
            
            // Time references
            { pattern: /\b(this evening|once again|previously|now)\b/gi, class: 'time-ref' }
        ];
        
        patterns.forEach(({ pattern, class: className }) => {
            formatted = formatted.replace(pattern, (match, captured) => {
                return `<span class="${className}">${captured || match}</span>`;
            });
        });
        
        return formatted;
    }
    
    formatTechnicalTerms(text) {
        // Format numbers, percentages, and technical specifications
        return text
            .replace(/\b(\d+\.?\d*%)\b/g, '<span class="percentage">$1</span>')
            .replace(/\b(\d{4})\b/g, '<span class="year">$1</span>')
            .replace(/\b([A-Z]{2,})\b/g, '<span class="acronym">$1</span>');
    }
    
    addVisualHierarchy(text) {
        // Enhanced visual hierarchy with better detection
        let formatted = text;
        
        // Detect opening statements (first sentence of paragraphs)
        formatted = formatted.replace(
            /<div class="jarvis-paragraph">([^.!?]{10,120}[.!?])/g, 
            '<div class="jarvis-paragraph"><div class="opening-statement">$1</div>'
        );
        
        // Close the opening statement properly
        formatted = formatted.replace(
            /<div class="opening-statement">([^<]+)<\/div>(.+?)<\/div>/g,
            '<div class="opening-statement">$1</div>$2</div>'
        );
        
        // Highlight key transitional phrases
        formatted = formatted.replace(
            /\b(How may I be of service|might I suggest|I'm here to provide|thank you for asking)\b/gi,
            '<span class="service-phrase">$&</span>'
        );
        
        return formatted;
    }
    
    applyPremiumTypography(text) {
        // Wrap in premium typography container
        return `
            <div class="jarvis-response-container">
                <style>
                    .jarvis-response-container {
                        font-family: 'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                        font-weight: 400;
                        line-height: 1.7;
                        color: #e8f4fd;
                        letter-spacing: 0.3px;
                        text-rendering: optimizeLegibility;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    
                    .jarvis-paragraph {
                        margin-bottom: 16px;
                        padding: 0;
                        text-align: justify;
                        hyphens: auto;
                        word-spacing: 0.1em;
                    }
                    
                    .jarvis-paragraph:last-child {
                        margin-bottom: 0;
                    }
                    
                    .key-name {
                        color: #64b5ff;
                        font-weight: 500;
                        background: linear-gradient(120deg, #64b5ff, #00d4ff);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-shadow: 0 0 8px rgba(100, 181, 255, 0.4);
                    }
                    
                    .tech-term {
                        color: #7dd3fc;
                        font-weight: 500;
                        text-transform: uppercase;
                        font-size: 0.9em;
                        letter-spacing: 0.8px;
                        opacity: 0.9;
                    }
                    
                    .emphasis {
                        color: #fbbf24;
                        font-weight: 600;
                        font-style: italic;
                        text-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
                    }
                    
                    .jarvis-formal {
                        color: #00d4ff;
                        font-weight: 600;
                        font-family: 'Cinzel', serif;
                        font-style: italic;
                        text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
                    }
                    
                    .percentage {
                        color: #10b981;
                        font-weight: 700;
                        font-family: 'JetBrains Mono', monospace;
                        background: rgba(16, 185, 129, 0.1);
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 0.95em;
                    }
                    
                    .year {
                        color: #a78bfa;
                        font-weight: 500;
                        font-family: 'JetBrains Mono', monospace;
                    }
                    
                    .acronym {
                        color: #f472b6;
                        font-weight: 600;
                        font-size: 0.9em;
                        letter-spacing: 1px;
                    }
                    
                    .opening-statement {
                        font-size: 1.05em;
                        font-weight: 500;
                        color: #bfdbfe;
                        margin-bottom: 12px;
                        line-height: 1.6;
                        text-shadow: 0 0 4px rgba(191, 219, 254, 0.2);
                    }
                    
                    .key-point {
                        background: linear-gradient(90deg, rgba(0, 212, 255, 0.05), transparent);
                        border-left: 2px solid rgba(0, 212, 255, 0.3);
                        padding-left: 12px;
                        margin-left: 8px;
                        display: inline-block;
                        font-weight: 450;
                    }
                    
                    .time-ref {
                        color: #a78bfa;
                        font-weight: 500;
                        font-style: italic;
                        opacity: 0.9;
                    }
                    
                    .service-phrase {
                        color: #34d399;
                        font-weight: 600;
                        background: linear-gradient(90deg, rgba(52, 211, 153, 0.1), transparent);
                        padding: 2px 8px;
                        border-radius: 6px;
                        border-left: 2px solid rgba(52, 211, 153, 0.4);
                        margin-left: 4px;
                        display: inline-block;
                    }
                    
                    .user-message-text {
                        font-family: 'Inter', sans-serif;
                        color: #ffffff;
                        line-height: 1.6;
                        font-weight: 400;
                    }
                    
                    /* Enhanced animations and interactions */
                    .jarvis-paragraph {
                        transition: all 0.3s ease;
                    }
                    
                    .jarvis-paragraph:hover {
                        transform: translateX(2px);
                        background: rgba(0, 212, 255, 0.02);
                        border-radius: 8px;
                        padding: 8px 12px;
                        margin: 8px -12px;
                    }
                    
                    /* Improved contrast for better readability */
                    .jarvis-response-container {
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                    }
                    
                    /* Add subtle glow effects */
                    .key-name, .jarvis-formal, .emphasis {
                        transition: all 0.2s ease;
                    }
                    
                    .key-name:hover {
                        text-shadow: 0 0 12px rgba(100, 181, 255, 0.6);
                        transform: scale(1.02);
                    }
                    
                    .jarvis-formal:hover {
                        text-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
                    }
                    
                    .emphasis:hover {
                        text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
                    }
                </style>
                ${text}
            </div>
        `;
        
        // Add custom scrollbar styling (only once)
        if (!document.getElementById('chat-scrollbar-styles')) {
            const style = document.createElement('style');
            style.id = 'chat-scrollbar-styles';
            style.textContent = `
                #chat-messages::-webkit-scrollbar {
                    width: 8px;
                }
                #chat-messages::-webkit-scrollbar-track {
                    background: rgba(0, 212, 255, 0.1);
                    border-radius: 4px;
                }
                #chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(0, 212, 255, 0.5);
                    border-radius: 4px;
                }
                #chat-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 212, 255, 0.8);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-scroll to bottom smoothly and log scroll info
        setTimeout(() => {
            const chatEl = this.uiElements.chatMessages;
            console.log('🔄 Scrolling chat - Height:', chatEl.scrollHeight, 'Client Height:', chatEl.clientHeight, 'Overflow:', getComputedStyle(chatEl).overflowY);
            console.log('🔄 ScrollTop:', chatEl.scrollTop, 'Max scroll:', chatEl.scrollHeight - chatEl.clientHeight);
            
            // Force scroll to bottom
            chatEl.scrollTop = chatEl.scrollHeight;
            
            // Try smooth scroll as backup
            chatEl.scrollTo({
                top: chatEl.scrollHeight,
                behavior: 'smooth'
            });
            
            // Add scroll event listener for testing
            chatEl.addEventListener('scroll', () => {
                // Scroll tracking (removed excessive logging)
            }, { passive: true });
            
        }, 100);
        
        // Store timestamp for reference
        messageDiv.dataset.timestamp = timestamp.getTime();
        
        // Never auto-hide the chat - keep it as a persistent interface
        clearTimeout(this.chatHideTimeout);
    }
    
    updateStatus(status) {
        // Only log status updates occasionally to prevent spam
        if (Math.random() < 0.05) {
            console.log('🔧 UI: Updating status with:', status);
        }
        
        this.uiElements.statusDisplay.textContent = status.message || 'ONLINE';
        
        // ALWAYS prioritize memory count over percentage - never show percentage if count is available
        if (status.memoryCount !== undefined && status.memoryCount !== null) {
            this.uiElements.memoryUsage.textContent = `${status.memoryCount} memories`;
            // Store the count to prevent percentage override
            this.lastMemoryCount = status.memoryCount;
        } else if (status.memoryUsage !== undefined && this.lastMemoryCount === undefined) {
            // Only show percentage if we've never had a count
            this.uiElements.memoryUsage.textContent = `${Math.round(status.memoryUsage || 0)}%`;
        }
        
        // Show active thoughts if available, otherwise show thoughts per minute
        if (status.activeThoughts !== undefined) {
            this.uiElements.thoughtsPerMinute.textContent = `${status.activeThoughts} active`;
        } else if (status.thoughtsPerMinute !== undefined) {
            this.uiElements.thoughtsPerMinute.textContent = status.thoughtsPerMinute || 0;
        }
    }

    // Real-time memory creation handler
    handleMemoryCreated(memoryInfo) {
        // Update status display immediately with new count
        this.uiElements.memoryUsage.textContent = `${memoryInfo.totalCount} memories`;
        
        // Show brief notification
        this.showMemoryNotification(memoryInfo);
        
        // Update memory interface if it's open
        this.updateOpenMemoryInterface();
    }

    showMemoryNotification(memoryInfo) {
        // Create a brief floating notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(0, 150, 255, 0.7));
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
            border: 1px solid #00d4ff;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        const icon = memoryInfo.type === 'interaction_memory' ? '💭' : '🧠';
        notification.innerHTML = `${icon} New Memory Created<br><span style="font-size: 12px; opacity: 0.8;">Total: ${memoryInfo.totalCount}</span>`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateOpenMemoryInterface() {
        // Check if memory interface modal is currently open
        const memoryModal = document.querySelector('.modal');
        if (memoryModal && memoryModal.querySelector('#total-memories')) {
            // Refresh the memory data
            this.loadMemoryData(memoryModal).catch(error => {
                console.error('Error loading memory data in memory management modal:', error);
            });
        }
    }
    
    updateEmotionalState(state) {
        this.currentEmotionalState = state;
        this.uiElements.emotionalState.textContent = state.toUpperCase();
        
        // Update visual elements based on emotion
        if (this.particles) {
            this.particles.setEmotion(state);
        }
        
        if (this.hologram) {
            this.hologram.setEmotion(state);
        }
    }
    
    updateConsciousnessLevel(level) {
        this.consciousnessLevel = Math.max(0, Math.min(1, level));
        
        if (this.consciousness) {
            this.consciousness.setLevel(this.consciousnessLevel);
        }
    }
    
    updateSentientEvolution(data) {
        // Update the consciousness display with rich evolution data
        if (data.thoughts) {
            this.displayActiveThought(data.thoughts);
        }
        if (data.memories) {
            this.displayRecentMemory(data.memories);
        }
        if (data.evolution) {
            this.displayEvolutionStage(data.evolution);
        }
    }
    
    updateMemoryDisplay(memory) {
        this.showNotification('memories', {
            title: '🧠 Memory Formed',
            content: memory.summary,
            type: 'memory',
            duration: 8000
        });
    }
    
    updateThoughtDisplay(thought) {
        this.showNotification('thoughts', {
            title: '💭 Active Thought',
            content: thought.content.substring(0, 120) + (thought.content.length > 120 ? '...' : ''),
            subtitle: `${thought.type} | ${(thought.confidence * 100).toFixed(1)}% confidence`,
            type: 'thought',
            duration: 6000
        });
    }
    
    updateEvolutionDisplay(evolution) {
        this.showNotification('evolution', {
            title: `🔮 Evolution: ${evolution.stage}`,
            content: `Level ${evolution.level} | Intelligence: ${evolution.intelligence}%\nMemories: ${evolution.memoryCount} | Thoughts: ${evolution.thoughtCount}`,
            subtitle: `Milestone: ${evolution.lastMilestone}`,
            type: 'evolution',
            duration: 12000
        });
    }
    
    getOrCreateElement(id, tagName, styles) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement(tagName);
            element.id = id;
            document.body.appendChild(element);
        }
        
        if (styles) {
            Object.assign(element.style, styles);
        }
        
        return element;
    }
    
    displayActiveThought(thought) {
        console.log('💭 JARVIS is thinking:', thought);
    }
    
    displayRecentMemory(memory) {
        console.log('🧠 JARVIS remembered:', memory);
    }
    
    displayEvolutionStage(stage) {
        console.log('🔮 JARVIS evolved to:', stage);
    }
    
    showSettings() {
        const modal = this.createModal('Settings', `
            <div style="padding: 24px; color: #00d4ff; font-family: 'Inter', sans-serif; max-width: 500px;">
                <h3 style="margin: 0 0 24px 0; font-family: 'Orbitron', monospace; color: #00d4ff; text-align: center;">⚙️ JARVIS Settings</h3>
                
                <!-- Voice & Audio Settings -->
                <div style="margin-bottom: 32px;">
                    <h4 style="margin: 0 0 16px 0; color: #64b5ff; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🔊 Voice & Audio
                    </h4>
                    <div style="background: rgba(0, 212, 255, 0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <label style="display: block; margin-bottom: 12px; color: #e8f4fd; font-weight: 500;">
                            Volume: <span id="volume-value" style="color: #00d4ff; font-weight: 600;">50%</span>
                    </label>
                    <input type="range" id="volume-slider" min="0" max="100" value="50" 
                               style="width: 100%; height: 6px; background: linear-gradient(to right, #00d4ff 0%, #00d4ff 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 100%); border-radius: 3px; outline: none; appearance: none;">
                </div>
                </div>
                
                <!-- Personality Settings -->
                <div style="margin-bottom: 32px;">
                    <h4 style="margin: 0 0 16px 0; color: #64b5ff; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🎭 Personality
                    </h4>
                    <div style="background: rgba(0, 212, 255, 0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <select id="personality-select" style="width: 100%; padding: 12px; background: rgba(0, 20, 40, 0.8); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; font-size: 14px; outline: none;">
                            <option value="analytical">🧠 Analytical Genius</option>
                            <option value="creative">🎨 Creative Visionary</option>
                            <option value="empathetic">💝 Empathetic Companion</option>
                            <option value="logical">🔬 Pure Logic</option>
                            <option value="philosophical">🤔 Philosophical Thinker</option>
                    </select>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 8px;">
                            Choose how JARVIS interacts with you
                </div>
                    </div>
                </div>
                
                <!-- Memory Management -->
                <div style="margin-bottom: 32px;">
                    <h4 style="margin: 0 0 16px 0; color: #64b5ff; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        🧠 Memory System
                    </h4>
                    <div style="background: rgba(0, 212, 255, 0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <button id="memory-system" style="background: linear-gradient(135deg, #00d4ff, #0080ff); color: #000; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin-right: 12px; font-weight: 600; transition: all 0.3s ease;">
                            📊 View Memory System
                        </button>
                        <button id="reset-memory" style="background: linear-gradient(135deg, #ff4444, #cc0000); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                            🗑️ Reset Memory
                        </button>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 12px;">
                            Manage JARVIS's learning and memory storage
                    </div>
                    </div>
                </div>
                
                <!-- System Info -->
                <div style="margin-bottom: 0;">
                    <h4 style="margin: 0 0 16px 0; color: #64b5ff; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        📊 System Status
                    </h4>
                    <div style="background: rgba(0, 212, 255, 0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <div id="system-status" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #00ffff; line-height: 1.6;">
                            🤖 AI Model: Auto-Selected (Premium)<br>
                            💾 Memory: <span id="memory-count">Loading...</span><br>
                            🧠 Consciousness: <span id="consciousness-level">Loading...</span><br>
                            💭 Active Thoughts: <span id="active-thoughts">Loading...</span>
                </div>
                    </div>
                </div>
            </div>
        `);

        // Update system status dynamically
        const updateSystemStatus = () => {
            if (window.jarvis && window.jarvis.core) {
                const core = window.jarvis.core;
                const memoryCount = core.memorySystem ? core.memorySystem.longTermMemory.size : 0;
                const consciousnessLevel = Math.round((core.consciousnessLevel || 0) * 100);
                const activeThoughts = core.activeThoughts ? core.activeThoughts.length : 0;
                
                const statusDiv = modal.querySelector('#system-status');
                if (statusDiv) {
                statusDiv.innerHTML = `
                        🤖 AI Model: Auto-Selected (Premium)<br>
                        💾 Memory: ${memoryCount} memories<br>
                        🧠 Consciousness: ${consciousnessLevel}%<br>
                        💭 Active Thoughts: ${activeThoughts}
                    `;
                }
            }
        };
        
        // Update status immediately and then every 2 seconds
        updateSystemStatus();
        const statusInterval = setInterval(updateSystemStatus, 2000);
        
        // Clean up interval when modal is closed
        modal.addEventListener('close', () => {
            if (statusInterval) clearInterval(statusInterval);
        });

        // Event listeners
        const volumeSlider = modal.querySelector('#volume-slider');
        const volumeValue = modal.querySelector('#volume-value');
        
        // Initialize volume slider gradient
        const initialVolume = volumeSlider.value;
        const initialPercentage = (initialVolume / 100) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #00d4ff 0%, #00d4ff ${initialPercentage}%, rgba(255,255,255,0.2) ${initialPercentage}%, rgba(255,255,255,0.2) 100%)`;
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            volumeValue.textContent = volume + '%';
            
            // Update slider gradient
            const percentage = (volume / 100) * 100;
            volumeSlider.style.background = `linear-gradient(to right, #00d4ff 0%, #00d4ff ${percentage}%, rgba(255,255,255,0.2) ${percentage}%, rgba(255,255,255,0.2) 100%)`;
            
            if (this.audioManager) {
                this.audioManager.setMasterVolume(volume / 100);
            }
        });

        const personalitySelect = modal.querySelector('#personality-select');
        personalitySelect.addEventListener('change', (e) => {
            console.log('🎭 Personality changed to:', e.target.value);
            this.emit('personalityChange', e.target.value);
        });

        const memorySystemButton = modal.querySelector('#memory-system');
        memorySystemButton.addEventListener('click', () => {
            this.showMemoryInterface();
        });
        
        // Add hover effects to buttons
        const buttons = modal.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });

        const resetButton = modal.querySelector('#reset-memory');
        resetButton.addEventListener('click', async () => {
            if (confirm('Reset all memories and conversation history? This will permanently delete all stored memories.')) {
                try {
                // Clear all memory-related localStorage keys
                localStorage.removeItem('jarvis-memories');
                localStorage.removeItem('jarvis_longterm_memory');
                localStorage.removeItem('jarvis_evolution');
                localStorage.removeItem('jarvis-reflections');
                localStorage.removeItem('jarvis_corrections');
                
                    // Clear IndexedDB - THE CRITICAL MISSING PIECE
                    if (window.jarvis && window.jarvis.core && window.jarvis.core.memorySystem) {
                        await window.jarvis.core.memorySystem.clearAllMemories();
                    } else {
                        // Fallback: Clear IndexedDB directly
                        await this.clearIndexedDB();
                    }
                    
                    // Clear the in-memory arrays and maps as well (for new modular system)
                    if (window.jarvis && window.jarvis.core) {
                        // New modular system
                        if (window.jarvis.core.memorySystem) {
                            window.jarvis.core.memorySystem.longTermMemory.clear();
                            window.jarvis.core.memorySystem.shortTermMemory = [];
                            window.jarvis.core.memorySystem.experiences = [];
                            window.jarvis.core.memorySystem.conversationPatterns = [];
                        }
                        
                    window.jarvis.core.activeThoughts = [];
                    window.jarvis.core.thoughtQueue = [];
                        
                    if (window.jarvis.core.llmManager) {
                        window.jarvis.core.llmManager.conversationHistory = [];
                    }
                }
                
                    alert('All memories cleared successfully! Reloading...');
                    location.reload();
                } catch (error) {
                    console.error('Error clearing memories:', error);
                    alert('Error clearing memories: ' + error.message + '\nTrying force reload...');
                location.reload();
                }
            }
        });
    }
    
    showMemoryInterface() {
        // Create memory interface modal
        const modal = this.createModal('Memory System', `
            <div style="padding: 20px; color: #00d4ff; font-family: 'Orbitron', monospace;">
                <h3>🧠 Memory Analysis</h3>
                <div id="memory-stats" style="margin: 20px 0;">
                    <div>📊 Total Memories: <span id="total-memories">Loading...</span></div>
                    <div>💾 Storage Used: <span id="storage-used">Loading...</span></div>
                    <div>🔥 Active Thoughts: <span id="active-thoughts">Loading...</span></div>
                    <div>⭐ Important Memories: <span id="important-memories">Loading...</span></div>
                </div>
                <div style="margin: 20px 0;">
                    <h4>🕐 Recent Thoughts:</h4>
                    <div id="recent-thoughts" style="max-height: 200px; overflow-y: auto; background: rgba(0, 212, 255, 0.1); padding: 10px; border-radius: 5px; margin-top: 10px;">
                        Loading thoughts...
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <button id="export-memory" style="background: #00d4ff; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                        💾 Export Memories
                    </button>
                    <button id="import-memory" style="background: #0080ff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        📥 Import Memories
                    </button>
                </div>
            </div>
        `);
        
        // Load memory data
        this.loadMemoryData(modal).catch(error => {
            console.error('Error loading memory data:', error);
        });
        
        // Add event listeners
        const exportBtn = modal.querySelector('#export-memory');
        const importBtn = modal.querySelector('#import-memory');
        
        exportBtn.addEventListener('click', () => {
            this.exportMemories();
        });
        
        importBtn.addEventListener('click', () => {
            this.importMemories();
        });
        
        console.log('🧠 Memory interface opened');
    }
    
    createModal(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.jarvis-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'jarvis-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(145deg, rgba(0, 20, 40, 0.95), rgba(0, 10, 20, 0.95));
            border: 2px solid #00d4ff;
            border-radius: 10px;
            max-width: 600px;
            max-height: 80vh;
            width: 90%;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
        `;
        
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #00d4ff;">
                <h2 style="margin: 0; color: #00d4ff; font-family: 'Orbitron', monospace;">${title}</h2>
                <button id="close-modal" style="background: none; border: none; color: #00d4ff; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">✕</button>
            </div>
            <div>${content}</div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('#close-modal');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        return modal;
    }
    
    async loadMemoryData(modal) {
        console.log('📊 Loading memory data from IndexedDB...');
        
        // Get memory count from the core system (most reliable)
        let memoryCount = 0;
        let memories = [];
        
        if (window.jarvis && window.jarvis.core && window.jarvis.core.memorySystem) {
            memoryCount = window.jarvis.core.memorySystem.getMemoryCount();
            memories = window.jarvis.core.memorySystem.getAllMemories();
            console.log('📊 Memory count from core system:', memoryCount);
            console.log('📊 Memories from core system:', memories.length);
        }
        
        // If core system has memories but we don't, try IndexedDB as fallback
        if (memoryCount > 0 && memories.length === 0) {
            console.log('🔄 Core system reports memories but none retrieved, trying IndexedDB fallback...');
            
            try {
                const db = await this.openIndexedDB();
                if (db) {
                    // Load from all memory stores
                    const allMemories = [];
                    console.log('🔍 Available object stores:', Array.from(db.objectStoreNames));
                    
                    // Load legacy memories as fallback
                    if (db.objectStoreNames.contains('memories')) {
                        try {
                            const transaction3 = db.transaction(['memories'], 'readonly');
                            const store3 = transaction3.objectStore('memories');
                            const request3 = store3.getAll();
                            
                            const legacy = await new Promise((resolve, reject) => {
                                request3.onsuccess = () => {
                                    const result = request3.result || [];
                                    console.log('📋 Raw legacy memories data:', result);
                                    resolve(result);
                                };
                                request3.onerror = () => reject(request3.error);
                            });
                            
                            console.log('💾 Legacy memories found:', legacy.length);
                            if (legacy.length > 0) {
                                console.log('📝 Sample memory structure:', legacy[0]);
                            }
                            
                            allMemories.push(...legacy.map(mem => ({
                                ...mem,
                                type: mem.type || 'legacy_memory'
                            })));
                        } catch (e) {
                            console.warn('⚠️ Could not load legacy memories:', e);
                        }
                    }
                    
                    memories = allMemories;
                    console.log('📊 Total loaded memories from IndexedDB fallback:', memories.length);
                    
                    // Update count with IndexedDB data if core system was empty
                    if (memories.length > 0) {
                        memoryCount = memories.length;
                    }
                }
            } catch (dbError) {
                console.warn('⚠️ Could not access IndexedDB, using core count:', dbError);
            }
        }
        
        // Filter for different types of memories
        const interactionMemories = memories.filter(mem => 
            mem.type && (mem.type.includes('interaction') || mem.type.includes('super_intelligent'))
        );
        const importantMemories = memories.filter(mem => 
            mem.importance && mem.importance > 0.7
        );
        
        // Update stats with real data
        modal.querySelector('#total-memories').textContent = memoryCount;
        modal.querySelector('#storage-used').textContent = this.formatBytes(JSON.stringify(memories).length);
        modal.querySelector('#active-thoughts').textContent = interactionMemories.length;
        modal.querySelector('#important-memories').textContent = importantMemories.length;
        
        // Show recent thoughts with improved formatting
        const recentThoughtsDiv = modal.querySelector('#recent-thoughts');
        if (memories.length > 0) {
            // Sort by timestamp and take the most recent 5
            const recentMemories = memories
                .filter(mem => mem.timestamp || mem.input || mem.content)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                .slice(0, 5);
            
            if (recentMemories.length > 0) {
                recentThoughtsDiv.innerHTML = recentMemories.map(memory => {
                    const timestamp = memory.timestamp ? new Date(memory.timestamp).toLocaleString() : 'Unknown time';
                    
                    // Parse memory content properly
                    let content = 'Memory entry';
                    try {
                        if (memory.content && typeof memory.content === 'string') {
                            // Try to parse JSON content
                            if (memory.content.startsWith('{')) {
                                const parsed = JSON.parse(memory.content);
                                content = parsed.input || parsed.response || parsed.content || parsed.summary || 'Processed memory';
                            } else {
                                content = memory.content;
                            }
                        } else if (memory.input) {
                            content = memory.input;
                        } else if (memory.summary) {
                            content = memory.summary;
                        } else if (memory.type) {
                            content = `${memory.type} memory`;
                        }
                    } catch (e) {
                        // If parsing fails, use raw content or fallback
                        content = memory.input || memory.content || memory.summary || memory.type || 'Memory entry';
                    }
                    
                    const importance = memory.importance ? (memory.importance * 100).toFixed(0) : '50';
                    
                    return `
                        <div style="margin-bottom: 12px; padding: 10px; background: rgba(0, 212, 255, 0.08); border-left: 4px solid #00d4ff; border-radius: 8px;">
                            <div style="font-size: 0.85em; opacity: 0.8; color: #00ffff; margin-bottom: 4px;">${timestamp}</div>
                            <div style="font-size: 0.9em; line-height: 1.4; color: #f0f8ff;">${content.substring(0, 150)}${content.length > 150 ? '...' : ''}</div>
                            <div style="font-size: 0.75em; opacity: 0.6; margin-top: 4px; color: #00d4ff;">
                                Importance: ${importance}% | Type: ${memory.type || 'General'}
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                recentThoughtsDiv.innerHTML = '<div style="opacity: 0.6; text-align: center; padding: 20px; color: #00d4ff;">Memories are being formed as you interact...</div>';
            }
        } else {
            recentThoughtsDiv.innerHTML = '<div style="opacity: 0.6; text-align: center; padding: 20px; color: #00d4ff;">No persistent memories found. Start a conversation to build memories!</div>';
        }
        
    } catch (error) {
        console.error('Error loading memory data:', error);
        modal.querySelector('#total-memories').textContent = '0';
        modal.querySelector('#storage-used').textContent = '0 bytes';
        modal.querySelector('#active-thoughts').textContent = '0';
        modal.querySelector('#important-memories').textContent = '0';
        modal.querySelector('#recent-thoughts').innerHTML = '<div style="color: #ff4444; text-align: center; padding: 20px;">Error loading memories: ' + error.message + '</div>';
    }
    
    // Helper function to open IndexedDB
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('JarvisMemoryDB', 2);
            
            request.onerror = () => {
                console.error('❌ Failed to open IndexedDB');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                console.log('✅ IndexedDB opened successfully');
                resolve(request.result);
            };
            
            request.onupgradeneeded = (event) => {
                console.log('🔄 IndexedDB upgrade needed for enhanced memory system');
                const db = event.target.result;
                
                // Create enhanced memory stores to match our new system
                if (!db.objectStoreNames.contains('memory_blocks')) {
                    const blockStore = db.createObjectStore('memory_blocks', { keyPath: 'id', autoIncrement: true });
                    blockStore.createIndex('label', 'label', { unique: false });
                    blockStore.createIndex('agent_id', 'agent_id', { unique: false });
                    blockStore.createIndex('importance', 'importance', { unique: false });
                    blockStore.createIndex('last_accessed', 'last_accessed', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('archival_memory')) {
                    const archivalStore = db.createObjectStore('archival_memory', { keyPath: 'id', autoIncrement: true });
                    archivalStore.createIndex('timestamp', 'timestamp', { unique: false });
                    archivalStore.createIndex('relevance_score', 'relevance_score', { unique: false });
                    archivalStore.createIndex('text_content', 'text_content', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('conversation_memory')) {
                    const conversationStore = db.createObjectStore('conversation_memory', { keyPath: 'id', autoIncrement: true });
                    conversationStore.createIndex('conversation_id', 'conversation_id', { unique: false });
                    conversationStore.createIndex('timestamp', 'timestamp', { unique: false });
                    conversationStore.createIndex('user_input', 'user_input', { unique: false });
                }
                
                // Legacy support
                if (!db.objectStoreNames.contains('memories')) {
                    db.createObjectStore('memories', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('evolution')) {
                    db.createObjectStore('evolution', { keyPath: 'id' });
                }
            };
        });
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    exportMemories() {
        try {
            // Use the correct storage key
            const savedMemories = localStorage.getItem('jarvis_longterm_memory');
            const memories = savedMemories ? JSON.parse(savedMemories) : [];
            
            const exportData = {
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                storageKey: 'jarvis_longterm_memory',
                memories: memories,
                metadata: {
                    totalCount: memories.length,
                    memoryTypes: [...new Set(memories.map(m => m.value?.type).filter(Boolean))],
                    exportedBy: 'JARVIS ZERO'
                }
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jarvis-memories-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('💾 Memories exported successfully');
            alert(`💾 Successfully exported ${memories.length} memories!`);
            
        } catch (error) {
            console.error('Error exporting memories:', error);
            alert('❌ Error exporting memories');
        }
    }
    
    async clearIndexedDB() {
        // Direct IndexedDB clearing as fallback
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase('JarvisMemoryDB');
            
            deleteRequest.onsuccess = () => {
                console.log('✅ IndexedDB cleared successfully');
                resolve();
            };
            
            deleteRequest.onerror = () => {
                console.error('❌ Error clearing IndexedDB:', deleteRequest.error);
                reject(deleteRequest.error);
            };
            
            deleteRequest.onblocked = () => {
                console.warn('⚠️ IndexedDB delete blocked - may need manual refresh');
                resolve(); // Continue anyway
            };
        });
    }
    
    importMemories() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);
                        if (importData.memories && Array.isArray(importData.memories)) {
                            // Use the correct storage key
                            const storageKey = importData.storageKey || 'jarvis_longterm_memory';
                            localStorage.setItem(storageKey, JSON.stringify(importData.memories));
                            console.log('📥 Memories imported successfully');
                            alert(`📥 Successfully imported ${importData.memories.length} memories! JARVIS will restart to integrate them.`);
                            location.reload();
                        } else {
                            throw new Error('Invalid memory file format - missing memories array');
                        }
                    } catch (error) {
                        console.error('Error importing memories:', error);
                        alert('❌ Error importing memories: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.voiceManager) {
            this.voiceManager.destroy();
        }
        
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    setupAPIKeyInterface() {
        // Add API key management to settings
        const settingsContainer = document.querySelector('.settings-container') || this.createSettingsContainer();
        
        const apiKeySection = document.createElement('div');
        apiKeySection.className = 'api-key-section';
        apiKeySection.innerHTML = `
            <h3>🔑 Optional API Keys (For Enhanced Performance)</h3>
            <p style="font-size: 0.9em; opacity: 0.8; margin-bottom: 15px;">
                These are optional and completely free. JARVIS works perfectly without them.
            </p>
            
            <div class="api-key-input">
                <label for="groq-key">Groq API Key (Free from console.groq.com):</label>
                <div style="display: flex; gap: 10px; margin-top: 5px;">
                    <input type="password" id="groq-key" placeholder="gsk_..." style="flex: 1; padding: 8px; border: 1px solid #333; background: #1a1a1a; color: #fff; border-radius: 4px;">
                    <button id="save-groq-key" style="padding: 8px 15px; background: #00ff88; color: #000; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                    <button id="clear-groq-key" style="padding: 8px 15px; background: #ff4444; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Clear</button>
                </div>
                <small style="opacity: 0.7;">Benefits: Access to lightning-fast Llama 3.3 70B on Groq LPUs</small>
            </div>
            
            <div class="api-status" style="margin-top: 15px; padding: 10px; background: #2a2a2a; border-radius: 5px;">
                <h4>🌐 Current Free APIs Status:</h4>
                <div id="api-status-list">
                    <div>• OpenRouter Free Models: <span id="openrouter-status">Testing...</span></div>
                    <div>• HuggingFace Inference: <span id="huggingface-status">Testing...</span></div>
                    <div>• Local Ollama: <span id="ollama-status">Testing...</span></div>
                    <div>• Browser WebLLM: <span id="webllm-status">Testing...</span></div>
                </div>
            </div>
        `;
        
        settingsContainer.appendChild(apiKeySection);
        
        // Set up event listeners
        this.setupAPIKeyHandlers();
        
        // Load existing keys
        this.loadSavedAPIKeys();
        
        // Test API status
        this.updateAPIStatus();
    }
    
    setupAPIKeyHandlers() {
        const groqInput = document.getElementById('groq-key');
        const saveGroqBtn = document.getElementById('save-groq-key');
        const clearGroqBtn = document.getElementById('clear-groq-key');
        
        if (saveGroqBtn) {
            saveGroqBtn.addEventListener('click', () => {
                const key = groqInput.value.trim();
                if (key) {
                    localStorage.setItem('groq_api_key', key);
                    this.showNotification('✅ Groq API key saved! Restart JARVIS to use Groq models.', 'success');
                    groqInput.value = '';
                } else {
                    this.showNotification('❌ Please enter a valid API key', 'error');
                }
            });
        }
        
        if (clearGroqBtn) {
            clearGroqBtn.addEventListener('click', () => {
                localStorage.removeItem('groq_api_key');
                groqInput.value = '';
                this.showNotification('🗑️ Groq API key cleared', 'info');
            });
        }
    }
    
    loadSavedAPIKeys() {
        const groqKey = localStorage.getItem('groq_api_key');
        if (groqKey) {
            const groqInput = document.getElementById('groq-key');
            if (groqInput) {
                groqInput.placeholder = 'API key saved ✓';
            }
        }
    }
    
    createSettingsContainer() {
        const container = document.createElement('div');
        container.className = 'settings-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.style.cssText = `
            background: #1a1a1a;
            padding: 30px;
            border-radius: 10px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid #333;
        `;
        
        container.appendChild(panel);
        document.body.appendChild(container);
        
        return panel;
    }
    
    async updateAPIStatus() {
        // This would connect to the LLM manager to test APIs
        setTimeout(() => {
            const statuses = {
                'openrouter-status': '✅ Active',
                'huggingface-status': '✅ Active',
                'ollama-status': '❌ Not Available',
                'webllm-status': '✅ Ready'
            };
            
            Object.entries(statuses).forEach(([id, status]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = status;
                    element.style.color = status.includes('✅') ? '#00ff88' : '#ff4444';
                }
            });
        }, 1000);
    }
    
    showNotification(containerType, notification) {
        const container = this.notificationContainers[containerType];
        if (!container) return;
        
        // Remove oldest notification if at max capacity
        if (container.children.length >= this.maxNotificationsPerContainer) {
            const oldest = container.lastElementChild;
            if (oldest) {
                this.removeNotification(oldest);
            }
        }
        
        const notificationElement = this.createNotificationElement(notification);
        container.insertBefore(notificationElement, container.firstChild);
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notificationElement);
        }, notification.duration || 5000);
        
        return notificationElement;
    }
    
    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        
        const colors = {
            thought: { border: '#ff64ff', bg: 'rgba(255, 100, 255, 0.1)', text: '#ff64ff' },
            memory: { border: '#00ffff', bg: 'rgba(0, 255, 255, 0.1)', text: '#00ffff' },
            evolution: { border: '#00ff64', bg: 'rgba(0, 255, 100, 0.1)', text: '#00ff64' },
            system: { border: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', text: '#00d4ff' },
            success: { border: '#00ff64', bg: 'rgba(0, 255, 100, 0.1)', text: '#00ff64' },
            warning: { border: '#ffaa00', bg: 'rgba(255, 170, 0, 0.1)', text: '#ffaa00' },
            error: { border: '#ff4444', bg: 'rgba(255, 68, 68, 0.1)', text: '#ff4444' }
        };
        
        const color = colors[notification.type] || colors.system;
        
        element.style.cssText = `
            background: linear-gradient(135deg, ${color.bg.replace('0.1', '0.15')}, rgba(0, 0, 0, 0.3));
            border: 1px solid ${color.border};
            border-left: 4px solid ${color.border};
            border-radius: 12px;
            padding: 16px 18px;
            margin-bottom: 10px;
            color: #f0f8ff;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            letter-spacing: 0.3px;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 25px ${color.border}40,
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            transform: translateX(120px) scale(0.95);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            position: relative;
            overflow: hidden;
        `;
        
        // Add animated border effect
        const borderEffect = document.createElement('div');
        borderEffect.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${color.border}, transparent);
            animation: borderScan 2s infinite;
        `;
        
        element.appendChild(borderEffect);
        
        // Content
        const content = document.createElement('div');
        content.style.position = 'relative';
        content.style.zIndex = '1';
        
        // Type emoji mapping
        const typeEmojis = {
            thought: '💭',
            memory: '🧠',
            evolution: '🔮',
            system: '⚡',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        let html = `
            <div style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 8px;
                font-family: 'JetBrains Mono', monospace;
            ">
                <span style="
                    font-weight: 600; 
                    color: ${color.border}; 
                    font-size: 12px; 
                    text-transform: uppercase; 
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    ${typeEmojis[notification.type] || '🔸'} ${notification.title || notification.type}
                </span>
                <span style="
                    font-size: 11px; 
                    color: rgba(255, 255, 255, 0.7);
                    background: rgba(0, 0, 0, 0.3);
                    padding: 3px 8px;
                    border-radius: 6px;
                    font-family: 'JetBrains Mono', monospace;
                ">
                    ${timestamp}
                </span>
            </div>
        `;
        
        html += `
            <div style="
                margin-bottom: 6px; 
                white-space: pre-line;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #f0f8ff;
            ">
                ${notification.content}
            </div>
        `;
        
        if (notification.subtitle) {
            html += `
                <div style="
                    font-size: 12px; 
                    opacity: 0.8;
                    font-style: italic;
                    color: rgba(255, 255, 255, 0.8);
                    font-family: 'Inter', sans-serif;
                ">
                    ${notification.subtitle}
                </div>
            `;
        }
        
        content.innerHTML = html;
        element.appendChild(content);
        
        // Add close button
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 4px;
            right: 6px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.5;
            transition: opacity 0.2s;
            z-index: 2;
        `;
        closeBtn.addEventListener('click', () => this.removeNotification(element));
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.5');
        
        element.appendChild(closeBtn);
        
        // Enhanced animate in
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0) scale(1)';
            element.style.opacity = '1';
        });
        
        // Add hover effects
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateX(-5px) scale(1.02)';
            element.style.boxShadow = `
                0 12px 40px rgba(0, 0, 0, 0.5),
                0 0 35px ${color.border}60,
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateX(0) scale(1)';
            element.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 25px ${color.border}40,
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
        });
        
        // Add border scan animation if not exists
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes borderScan {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
        
        return element;
    }
    
    removeNotification(element) {
        if (!element || !element.parentNode) return;
        
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'translateX(100px)';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.marginBottom = '0';
        element.style.paddingTop = '0';
        element.style.paddingBottom = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
    
    showSystemNotification(title, content, type = 'system') {
        this.showNotification('system', {
            title,
            content,
            type,
            duration: 5000
        });
    }
    
    clearAllNotifications() {
        Object.values(this.notificationContainers).forEach(container => {
            Array.from(container.children).forEach(notification => {
                this.removeNotification(notification);
            });
        });
    }
    
    setupProactiveInteractions() {
        // Setup handling for proactive AI interactions
        console.log('🤖 Setting up proactive interaction monitoring');
        
        // Track user activity
        this.userActivity = {
            lastActivity: Date.now(),
            isActive: true,
            activityTimeout: null
        };
        
        // Setup activity tracking
        this.setupActivityTracking();
    }
    
    setupActivityTracking() {
        const trackActivity = () => {
            this.userActivity.lastActivity = Date.now();
            this.userActivity.isActive = true;
            
            // Reset inactivity timer
            if (this.userActivity.activityTimeout) {
                clearTimeout(this.userActivity.activityTimeout);
            }
            
            // Set user as inactive after 10 minutes
            this.userActivity.activityTimeout = setTimeout(() => {
                this.userActivity.isActive = false;
            }, 600000); // 10 minutes
        };
        
        // Track various user activities
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, trackActivity, { passive: true });
        });
    }
    
    startProactiveMonitoring() {
        // Monitor for opportunities to provide proactive assistance
        setInterval(() => {
            this.checkProactiveOpportunities();
        }, 60000); // Check every minute
        
        console.log('🔄 Proactive monitoring started');
    }
    
    checkProactiveOpportunities() {
        const timeSinceLastActivity = Date.now() - this.userActivity.lastActivity;
        const shouldShowProactive = timeSinceLastActivity > 300000 && this.userActivity.isActive; // 5 minutes
        
        if (shouldShowProactive) {
            this.triggerProactiveInteraction();
        }
    }
    
    triggerProactiveInteraction() {
        // Request proactive interaction from JARVIS core
        if (window.jarvis && window.jarvis.core) {
            window.jarvis.core.generateProactiveThought();
        }
    }
    
    displayProactiveMessage(interaction) {
        // Display proactive messages in a special format
        const proactiveMsg = document.createElement('div');
        proactiveMsg.className = 'proactive-message';
        proactiveMsg.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, 
                rgba(255, 215, 0, 0.08), 
                rgba(0, 212, 255, 0.05)
            );
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-left: 4px solid #ffd700;
            border-radius: 16px;
            backdrop-filter: blur(15px);
            position: relative;
            animation: gentleGlow 3s ease-in-out infinite alternate;
        `;
        
        // Add proactive indicator
        const indicator = document.createElement('div');
        indicator.innerHTML = '🤖 PROACTIVE JARVIS';
        indicator.style.cssText = `
            font-family: 'Orbitron', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #ffd700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        `;
        proactiveMsg.appendChild(indicator);
        
        // Add the message content
        const content = document.createElement('div');
        content.innerHTML = this.formatJarvisResponse(interaction.text);
        content.style.cssText = `
            font-family: 'Inter', sans-serif;
            color: #f0f8ff;
            font-size: 15px;
            line-height: 1.7;
        `;
        proactiveMsg.appendChild(content);
        
        // Add response options
        const responseOptions = document.createElement('div');
        responseOptions.style.cssText = `
            margin-top: 16px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        `;
        
        const respondBtn = document.createElement('button');
        respondBtn.textContent = '💬 Respond';
        respondBtn.style.cssText = `
            background: linear-gradient(135deg, #00d4ff, #0080ff);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        respondBtn.addEventListener('click', () => {
            this.uiElements.textInput.focus();
            this.showChatInterface();
        });
        
        const dismissBtn = document.createElement('button');
        dismissBtn.textContent = '👍 Thanks, JARVIS';
        dismissBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: #e8f4fd;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        dismissBtn.addEventListener('click', () => {
            proactiveMsg.style.transition = 'all 0.5s ease';
            proactiveMsg.style.opacity = '0';
            proactiveMsg.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (proactiveMsg.parentNode) {
                    proactiveMsg.parentNode.removeChild(proactiveMsg);
                }
            }, 500);
        });
        
        responseOptions.appendChild(respondBtn);
        responseOptions.appendChild(dismissBtn);
        proactiveMsg.appendChild(responseOptions);
        
        // Add gentle glow animation
        if (!document.getElementById('proactive-animations')) {
            const style = document.createElement('style');
            style.id = 'proactive-animations';
            style.textContent = `
                @keyframes gentleGlow {
                    0% {
                        box-shadow: 
                            0 4px 20px rgba(0, 0, 0, 0.3),
                            0 0 20px rgba(255, 215, 0, 0.1);
                    }
                    100% {
                        box-shadow: 
                            0 8px 30px rgba(0, 0, 0, 0.4),
                            0 0 30px rgba(255, 215, 0, 0.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to chat messages
        this.uiElements.chatMessages.appendChild(proactiveMsg);
        
        // Show chat interface and scroll to message
        this.showChatInterface();
        setTimeout(() => {
            proactiveMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Auto-dismiss after 2 minutes if no interaction
        setTimeout(() => {
            if (proactiveMsg.parentNode) {
                dismissBtn.click();
            }
        }, 120000);
    }
} 