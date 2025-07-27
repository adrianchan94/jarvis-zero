export class AudioManager {
    static instance = null;
    
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }
        
        this.audioContext = null;
        this.sounds = new Map();
        this.isInitialized = false;
        this.masterVolume = 0.5;
        
        AudioManager.instance = this;
    }
    
    static async init() {
        const instance = new AudioManager();
        await instance.initialize();
        return instance;
    }
    
    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle audio context state
            if (this.audioContext.state === 'suspended') {
                // Will be resumed on first user interaction
                document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
                document.addEventListener('keydown', this.resumeAudioContext.bind(this), { once: true });
            }
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Load default sounds
            await this.loadDefaultSounds();
            
            this.isInitialized = true;
            console.log('🔊 Audio manager initialized');
            
        } catch (error) {
            console.error('Failed to initialize audio manager:', error);
        }
    }
    
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            console.log('🔊 Audio context resumed');
        }
    }
    
    async loadDefaultSounds() {
        // Create synthetic sounds for the Jarvis interface
        const sounds = {
            startup: this.createSynthSound('startup', 440, 0.5, 'sawtooth'),
            notification: this.createSynthSound('notification', 880, 0.3, 'sine'),
            error: this.createSynthSound('error', 220, 0.8, 'square'),
            thinking: this.createSynthSound('thinking', 660, 0.4, 'triangle'),
            response: this.createSynthSound('response', 550, 0.3, 'sine')
        };
        
        // Store sounds
        for (const [name, soundBuffer] of Object.entries(sounds)) {
            this.sounds.set(name, soundBuffer);
        }
    }
    
    createSynthSound(name, frequency, duration, waveType = 'sine') {
        if (!this.audioContext) return null;
        
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // Generate waveform
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            switch (waveType) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'sawtooth':
                    sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
                    break;
                case 'square':
                    sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'triangle':
                    sample = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1;
                    break;
            }
            
            // Apply envelope (fade in/out)
            const envelope = Math.min(t * 10, (duration - t) * 10, 1);
            channelData[i] = sample * envelope * 0.1; // Lower volume
        }
        
        return buffer;
    }
    
    playSound(name, volume = 1, pitch = 1) {
        if (!this.isInitialized || !this.audioContext || !this.sounds.has(name)) {
            return;
        }
        
        try {
            const buffer = this.sounds.get(name);
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.playbackRate.value = pitch;
            gainNode.gain.value = volume * this.masterVolume;
            
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            source.start();
            
            // Clean up after playback
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
            };
            
        } catch (error) {
            console.error(`Failed to play sound ${name}:`, error);
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    // Audio analysis for voice input visualization
    createAudioAnalyser() {
        if (!this.audioContext) return null;
        
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        return analyser;
    }
    
    async getMicrophoneStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            const source = this.audioContext.createMediaStreamSource(stream);
            return { stream, source };
            
        } catch (error) {
            console.error('Failed to get microphone access:', error);
            return null;
        }
    }
    
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.sounds.clear();
        this.isInitialized = false;
        AudioManager.instance = null;
    }
} 