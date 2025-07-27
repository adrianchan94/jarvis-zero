import { EventEmitter } from '../../utils/events.js';

export class BaseLLMManager extends EventEmitter {
    constructor() {
        super();
        
        this.isInitialized = false;
        this.currentModel = null;
        this.engine = null;
        
        // Initialize response cache and cache management
        this.responseCache = new Map();
        this.maxCacheSize = 100;
        
        // Rate limiting data
        this.rateLimitData = new Map();
        
        // API key rotation system (now unused since we focus on free APIs)
        this.apiKeyRotation = {
            currentIndex: 0
        };
        
        // Exponential backoff settings
        this.backoffSettings = {
            initialDelay: 1000, // 1 second
            maxDelay: 60000,    // 1 minute  
            multiplier: 2,
            maxRetries: 5
        };
    }

    async generateWithRetryAndBackoff(apiCall) {
        let delay = this.backoffSettings.initialDelay;
        let lastError;

        for (let attempt = 0; attempt < this.backoffSettings.maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error;
                console.warn(`🔄 Attempt ${attempt + 1} failed:`, error.message);
                
                if (attempt < this.backoffSettings.maxRetries - 1) {
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay = Math.min(delay * this.backoffSettings.multiplier, this.backoffSettings.maxDelay);
                }
            }
        }
        
        throw lastError;
    }



    generateCacheKey(input, context) {
        return `${input}_${JSON.stringify(context)}`.substring(0, 100);
    }

    cacheResponse(cacheKey, response) {
        if (this.responseCache.size >= this.maxCacheSize) {
            const firstKey = this.responseCache.keys().next().value;
            this.responseCache.delete(firstKey);
        }
        this.responseCache.set(cacheKey, {
            response,
            timestamp: Date.now()
        });
    }

    extractParameterCount(modelName) {
        const match = modelName.match(/(\d+\.?\d*)[bB]/);
        return match ? parseFloat(match[1]) : 0;
    }

    getModelName(model) {
        return model.name || model.id || 'Unknown Model';
    }

    learnFromResponse(input, response, model) {
        // Store response patterns for learning
        const pattern = {
            input: input.substring(0, 100),
            response: response.substring(0, 100),
            model: this.getModelName(model),
            timestamp: Date.now(),
            success: true
        };
        
        // Simple learning storage
        const patterns = JSON.parse(localStorage.getItem('llm_patterns') || '[]');
        patterns.push(pattern);
        
        // Keep only last 50 patterns
        if (patterns.length > 50) {
            patterns.splice(0, patterns.length - 50);
        }
        
        localStorage.setItem('llm_patterns', JSON.stringify(patterns));
    }

    extractTopicFromInput(input) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('weather')) return 'weather';
        if (lowerInput.includes('time') || lowerInput.includes('date')) return 'time';
        if (lowerInput.includes('help') || lowerInput.includes('assist')) return 'assistance';
        if (lowerInput.includes('code') || lowerInput.includes('program')) return 'programming';
        if (lowerInput.includes('explain') || lowerInput.includes('what is')) return 'explanation';
        
        return 'general';
    }

    isRelatedToTopic(input, topic) {
        const inputTopic = this.extractTopicFromInput(input);
        return inputTopic === topic;
    }

    checkRateLimitReset() {
        const now = Date.now();
        for (const [provider, data] of this.rateLimitData.entries()) {
            if (data.resetTime && now > data.resetTime) {
                data.requests = 0;
                data.resetTime = null;
                console.log(`🔄 Rate limit reset for ${provider}`);
            }
        }
    }

    getTimeUntilReset() {
        this.checkRateLimitReset();
        
        const rateLimitEntries = Array.from(this.rateLimitData.values())
            .filter(data => data.resetTime)
            .map(data => data.resetTime - Date.now())
            .filter(time => time > 0);
        
        return rateLimitEntries.length > 0 ? Math.min(...rateLimitEntries) : 0;
    }

    clearRateLimitData() {
        this.rateLimitData.clear();
        console.log('🧹 Rate limit data cleared');
    }
} 