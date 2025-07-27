import { EventEmitter } from '../utils/events.js';

export class VoiceManager extends EventEmitter {
    constructor() {
        super();
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isSupported = false;
    }
    
    async init() {
        // Check for Web Speech API support
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        if (!this.isSupported) {
            console.warn('⚠️ Speech recognition not supported in this browser');
            return;
        }
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        // Set up event handlers
        this.recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            this.emit('speechStart');
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('📝 Speech result:', transcript);
            this.emit('speechEnd', transcript);
        };
        
        this.recognition.onerror = (event) => {
            console.error('🚫 Speech recognition error:', event.error);
            this.emit('speechError', event.error);
        };
        
        this.recognition.onend = () => {
            console.log('🛑 Speech recognition ended');
            this.isListening = false;
        };
        
        // Initialize speech synthesis
        this.synthesis = window.speechSynthesis;
        
        console.log('🎙️ Voice manager initialized');
    }
    
    startListening() {
        if (!this.isSupported || this.isListening) return;
        
        try {
            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
        }
    }
    
    stopListening() {
        if (!this.isSupported || !this.isListening) return;
        
        try {
            this.recognition.stop();
            this.isListening = false;
        } catch (error) {
            console.error('Failed to stop speech recognition:', error);
        }
    }
    
    speak(text, options = {}) {
        if (!this.synthesis) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice options
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 0.8;
        
        // Try to use a more robotic/AI voice if available
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Alex') || 
            voice.name.includes('Daniel') ||
            voice.name.includes('Microsoft') ||
            voice.lang.includes('en')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.onstart = () => {
            console.log('🔊 Speech synthesis started');
            this.emit('speechSynthesisStart');
        };
        
        utterance.onend = () => {
            console.log('🔇 Speech synthesis ended');
            this.emit('speechSynthesisEnd');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.emit('speechSynthesisError', event.error);
        };
        
        this.synthesis.speak(utterance);
    }
    
    getAvailableVoices() {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    }
    
    destroy() {
        if (this.recognition) {
            this.recognition.abort();
        }
        
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        this.removeAllListeners();
    }
} 