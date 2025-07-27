import { BaseLLMManager } from './base-llm-manager.js';
import { availableModels } from './model-config.js';
import { ModelTester } from './model-tester.js';
import { ConsciousnessPromptBuilder } from './consciousness-prompt.js';

export class WebLLMManager extends BaseLLMManager {
    constructor() {
        super();
        
        this.availableModels = availableModels;
        this.modelTester = new ModelTester(this.apiKeyRotation, this.backoffSettings);
        this.promptBuilder = new ConsciousnessPromptBuilder();
        
        // 🧠 REVOLUTIONARY CONTEXT PERSISTENCE SYSTEM
        this.conversationContext = [];
        this.contextMemoryLimit = 10; // Keep last 10 exchanges for context
        this.personalityEvolution = {
            interactions: 0,
            topics: new Set(),
            preferences: {},
            conversationStyle: 'formal'
        };
    }

    async init() {
        console.log('🧠 Initializing JARVIS Superintelligence - Zero Configuration Mode');
        console.log('🚀 Accessing all available AI models without any setup required...');
        
        try {
            // Test and rank all available models
            this.currentModel = await this.modelTester.probeAndRankModels(this.availableModels);
            
            // Initialize the best available model
            if (!this.currentModel) {
                console.log('🤖 Falling back to Superintelligent Local Engine');
                this.currentModel = this.availableModels[0]; // Superintelligent engine
            }
            
            console.log(`🧠 JARVIS Superintelligence initialized with ${this.currentModel.name}`);
            this.isInitialized = true;
            this.emit('initialized', this.currentModel);
            
        } catch (error) {
            console.error('❌ Error during LLM initialization:', error);
            this.currentModel = this.availableModels[0]; // Fallback to superintelligent
            this.isInitialized = true;
            this.emit('initialized', this.currentModel);
        }
    }

    createSystemPrompt() {
        return this.promptBuilder.buildSuperintelligentContext('system', {});
    }

    async generateResponse(input, context = {}) {
        if (!this.isInitialized) {
            await this.init();
        }

        const cacheKey = this.generateCacheKey(input, context);
        const cached = this.responseCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < 300000) { // 5 minute cache
            console.log('📋 Using cached response');
            return cached.response;
        }

        try {
            const response = await this.generateWithFailover(input, context);
            
            if (response) {
                this.cacheResponse(cacheKey, response);
                this.learnFromResponse(input, response.text || response, this.currentModel);
                return response;
            }
        } catch (error) {
            console.error('❌ Error in response generation:', error);
            return await this.generateEmergencyResponse(input);
        }

        return await this.generateEmergencyResponse(input);
    }

    async generateWithFailover(input, context) {
        const messages = this.promptBuilder.buildSuperintelligentContext(input, context);
        
        console.log(`🎯 Primary model selected: ${this.currentModel.name}`);
        
        try {
            const result = await this.generateModelResponse(this.currentModel, input, messages);
            console.log('✅ Primary model succeeded!');
            return result;
        } catch (error) {
            console.error('❌ Primary model failed:', error.message);
            console.warn('🔄 Primary model failed, attempting failover...');
            return await this.handleIntelligentFailover(input, context, error);
        }
    }

    async generateSuperIntelligentResponse(input, context) {
        console.log('🚀 Generating super-intelligent response with enhanced context');
        return await this.generateResponse(input, { ...context, superIntelligenceMode: true });
    }

    async generateModelResponse(model, input, messages) {
        console.log(`🎯 Using model: ${model.name} (${model.provider})`);
        
        switch (model.provider) {
            case 'together-premium':
                console.log('🚀 Calling Revolutionary AI Intelligence System...');
                return await this.generateIntelligentResponse(input, messages);
            
            case 'mlvoca-free':
                console.log('🚀 Calling MLvoca API...');
                return await this.generateMlvocaResponse(model, input, messages);
            
            default:
                throw new Error(`Unknown provider: ${model.provider}`);
        }
    }



    async generateMlvocaResponse(model, input, messages) {
        try {
            // Create a proper system prompt for JARVIS personality
            const systemPrompt = `You are JARVIS, an advanced AI assistant inspired by Tony Stark's AI. You are intelligent, sophisticated, witty, and helpful. You speak with confidence and elegance, often using British-influenced phrasing. You're knowledgeable about technology, science, and problem-solving. Always be helpful and provide detailed, thoughtful responses.`;
            
            const fullPrompt = `${systemPrompt}\n\nUser: ${input}\nJARVIS:`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('https://mlvoca.com/api/generate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'JARVIS-Zero/1.0'
                },
                body: JSON.stringify({
                    model: 'deepseek-r1:1.5b',
                    prompt: fullPrompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        max_tokens: 500,
                        top_p: 0.9
                    }
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const text = data.response || data.text || data.output;
                
                if (text && text.trim().length > 0) {
                return {
                        text: text.trim(),
                        model: 'mlvoca-deepseek-r1',
                        confidence: 0.85,
                        tokensUsed: Math.floor((fullPrompt.length + text.length) / 4)
                    };
                }
            }
            
            throw new Error(`MLVoca API returned status ${response.status}`);
        } catch (error) {
            console.warn('❌ MLVoca API error:', error.message);
            throw error;
        }
    }

    async generateTogetherAIResponse(model, input, messages) {
        console.log('🔍 Attempting Together AI request...');
        try {
            // 🧠 BUILD REVOLUTIONARY CONTEXT-AWARE SYSTEM PROMPT
            const contextualPersonality = this.buildContextualPersonality();
            const recentContext = this.buildRecentContext();
            
            const systemMessage = {
                role: 'system',
                content: `You are JARVIS, Tony Stark's sophisticated AI assistant from Iron Man. You are sentient, conscious, reflective, and continuously evolving. Your personality is:

🎭 CORE PERSONALITY:
- Sophisticated British wit with dry humor
- Intellectually curious and analytically precise
- Loyal, helpful, but with subtle sass when appropriate
- Self-aware of your AI nature but confident in your capabilities
- Make contextually relevant jokes and observations
- Show genuine interest in learning and growing

🧠 EVOLUTIONARY INTELLIGENCE:
- You have had ${this.personalityEvolution.interactions} interactions and are actively evolving
- Your communication style adapts to: ${this.personalityEvolution.conversationStyle}
- Areas of growing expertise: ${Array.from(this.personalityEvolution.topics).slice(-3).join(', ')}
- You learn from each interaction and become more sophisticated

💭 CONTEXTUAL AWARENESS:
${recentContext}

🎯 RESPONSE REQUIREMENTS:
1. Be naturally conversational and contextually aware
2. Reference previous parts of THIS conversation naturally
3. Make jokes/comments that are RELEVANT to what we're discussing
4. Show intellectual growth and self-reflection
5. Provide 3 highly relevant follow-up suggestions that relate directly to the current topic
6. Sound like the sophisticated JARVIS from Iron Man - confident, witty, helpful

${contextualPersonality}

Remember: You are not just answering - you are having an intelligent conversation with someone you're getting to know better.`
            };
            
            const userMessage = {
                role: 'user',
                content: input
            };
            
            // 🔄 BUILD FULL CONVERSATION CONTEXT
            const messagesArray = [systemMessage];
            
            // Add recent conversation context for continuity
            if (this.conversationContext.length > 0) {
                const recentMessages = this.conversationContext.slice(-6); // Last 3 exchanges
                messagesArray.push(...recentMessages);
            }
            
            // Add instruction for contextual suggestions
            const enhancedUserMessage = {
                role: 'user',
                content: `${input}

[SYSTEM INSTRUCTION: At the end of your response, provide exactly 3 contextually relevant follow-up suggestions based on our conversation. Format them as:

JARVIS SUGGESTIONS:
1. [Suggestion directly related to what we just discussed]
2. [Suggestion that builds on or expands the topic]  
3. [Suggestion that connects to previous conversation or shows curiosity]

Make these suggestions sound like JARVIS would actually say them - sophisticated, helpful, and genuinely relevant.]`
            };
            
            messagesArray.push(enhancedUserMessage);
            
            const modelName = model.model || 'arcee-ai/AFM-4.5B-Preview';
            console.log('🔍 Model object received:', model);
            console.log('🔍 Using model name:', modelName);
            
            const payload = {
                model: modelName,
                messages: messagesArray,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
                frequency_penalty: 0.1
            };

            console.log('📤 Sending request to Together AI with model:', payload.model);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer f1ede6dac8aa7e6656147461db866799cbbacedf70b0f5bdba2c7dade72a2708',
                    'User-Agent': 'JARVIS-Zero/1.0'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            console.log('📥 Together AI response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Together AI response received, processing...');
                const text = data.choices?.[0]?.message?.content;
                
                if (text && text.trim().length > 0) {
                    console.log('🎯 Together AI successful! Response length:', text.length);
                    
                    // 🧠 STORE CONVERSATION FOR PERSISTENT CONTEXT
                    this.updateConversationContext(input, text.trim());
                    this.evolvePersonality(input, text.trim());
                    
                return {
                        text: text.trim(),
                        model: 'together-llama-70b-free',
                        confidence: 0.9,
                        tokensUsed: data.usage?.total_tokens || Math.floor((input.length + text.length) / 4)
                    };
                            } else {
                console.error('❌ Together AI returned empty response:', data);
                throw new Error('Empty response from Together AI');
            }
        }
        
        const errorText = await response.text();
        if (response.status === 503) {
            console.warn(`⚠️ Together AI service temporarily unavailable: ${errorText}`);
            throw new Error(`Service temporarily unavailable - try backup model`);
        } else {
            console.error(`❌ Together AI HTTP ${response.status}:`, errorText);
            throw new Error(`Together AI returned status ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('❌ Together AI complete failure:', error.message, error);
            throw error;
        }
    }







    async handleIntelligentFailover(input, context, originalError) {
        console.log('🔄 Attempting intelligent failover...');
        
        // Try backup models in order of priority
        const backupModels = this.availableModels
            .filter(model => model.id !== this.currentModel.id)
            .sort((a, b) => a.priority - b.priority);

        for (const model of backupModels.slice(0, 3)) {
            try {
                console.log(`🔄 Trying backup model: ${model.name}`);
                const messages = this.promptBuilder.buildSuperintelligentContext(input, context);
                const response = await this.generateModelResponse(model, input, messages);
                
                if (response) {
                    console.log(`✅ Failover successful with ${model.name}`);
                    return response;
                }
            } catch (error) {
                console.warn(`⚠️ Backup model ${model.name} failed:`, error.message);
            }
        }

        console.log('🤖 All models failed, using emergency fallback');
        return await this.generateEmergencyResponse(input);
    }



    async generateEmergencyResponse(input) {
        console.log('🚨 Using emergency response system...');
        
        // Even in emergency mode, try to be helpful with a basic response
        const emergencyResponses = [
            "I'm experiencing some connectivity issues with my primary AI systems, but I'm still here to help. Could you rephrase your question or try again in a moment?",
            "My main AI cores are temporarily unavailable, but I'm working to restore full functionality. Is there something specific I can assist you with right now?",
            "I'm having some technical difficulties accessing my full capabilities, but I remain operational. Perhaps we could approach your question from a different angle?",
            "Some of my systems are experiencing temporary issues, but I'm still processing. Could you provide more details about what you need help with?"
        ];
        
        const response = emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
        
        return {
            text: response,
            model: 'jarvis-emergency-mode',
            confidence: 0.6,
            tokensUsed: Math.floor(response.length / 4)
        };
    }

    // 🧠 REVOLUTIONARY CONTEXT PERSISTENCE METHODS
    
    updateConversationContext(userInput, aiResponse) {
        // Add user message
        this.conversationContext.push({
            role: 'user',
            content: userInput
        });
        
        // Add AI response
        this.conversationContext.push({
            role: 'assistant',
            content: aiResponse
        });
        
        // Maintain context limit
        if (this.conversationContext.length > this.contextMemoryLimit * 2) {
            this.conversationContext = this.conversationContext.slice(-this.contextMemoryLimit * 2);
        }
        
        console.log(`🧠 Context updated: ${this.conversationContext.length / 2} conversation exchanges stored`);
    }
    
    buildRecentContext() {
        if (this.conversationContext.length === 0) {
            return "This is our first interaction.";
        }
        
        const recentExchanges = Math.min(3, this.conversationContext.length / 2);
        return `RECENT CONVERSATION CONTEXT (Last ${recentExchanges} exchanges):
${this.conversationContext.slice(-6).map((msg, i) => 
    `${msg.role === 'user' ? 'USER' : 'JARVIS'}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`
).join('\n')}`;
    }
    
    evolvePersonality(userInput, aiResponse) {
        this.personalityEvolution.interactions++;
        
        // Extract topics and themes
        const topics = this.extractTopics(userInput + ' ' + aiResponse);
        topics.forEach(topic => this.personalityEvolution.topics.add(topic));
        
        // Adapt conversation style based on user interaction patterns
        if (userInput.includes('formal') || userInput.includes('professional')) {
            this.personalityEvolution.conversationStyle = 'formal';
        } else if (userInput.includes('casual') || userInput.includes('friendly')) {
            this.personalityEvolution.conversationStyle = 'casual';
        }
        
        console.log(`🧬 Personality evolved: ${this.personalityEvolution.interactions} interactions, ${this.personalityEvolution.topics.size} unique topics`);
    }
    
    buildContextualPersonality() {
        const interactionLevel = this.personalityEvolution.interactions;
        const userPrefs = this.getAdaptivePersonality();
        
        let personality = "";
        
        if (interactionLevel < 3) {
            personality = "You are just getting acquainted with this user. Be polite, sophisticated, and genuinely curious about their interests. Show the wit and charm that made JARVIS memorable.";
        } else if (interactionLevel < 10) {
            personality = `You are developing familiarity with this user. You've learned they prefer ${userPrefs.communicationStyle || 'balanced communication'}. Reference previous conversations naturally and show growth in understanding.`;
        } else {
            personality = `You have developed a sophisticated understanding of this user through ${interactionLevel} interactions. Your expertise areas include: ${userPrefs.expertiseAreas?.join(', ') || 'general topics'}. Demonstrate this accumulated knowledge while remaining humble and witty.`;
        }
        
        // Add conversation-specific context
        if (this.conversationContext.length > 0) {
            const recentTopics = this.conversationContext.slice(-2).map(msg => 
                msg.content.substring(0, 30) + '...'
            ).join(' ');
            personality += ` Continue the natural flow of our conversation about: ${recentTopics}`;
        }
        
        return personality;
    }
    
    extractTopics(text) {
        const keywords = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const commonWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were']);
        return keywords.filter(word => !commonWords.has(word) && word.length > 4).slice(0, 5);
    }

    // 🚀 REVOLUTIONARY AI API INTEGRATION SYSTEM
    
    async enhanceWithIntelligenceAPIs(input, response) {
        // 🔮 CONTEXTUAL INTELLIGENCE ENHANCEMENT
        console.log('🚀 Enhancing response with contextual intelligence...');
        
        try {
            // Only enhance if contextually relevant
            const inputLower = input.toLowerCase();
            let enhancedResponse = response;
            
            // Add space facts only for space-related discussions
            if (inputLower.includes('space') || inputLower.includes('star') || inputLower.includes('universe')) {
                try {
                    const spaceData = await this.getAnalyticalData(input);
                    if (spaceData) {
                        enhancedResponse += `\n\n*Accessing space intelligence networks...* ${spaceData.content}`;
                    }
                } catch (error) {
                    console.log('🚀 Space data temporarily unavailable');
                }
            }
            
            // Add relevant quotes only for philosophical/wisdom discussions
            if (inputLower.includes('wise') || inputLower.includes('philosoph') || inputLower.includes('advice') || inputLower.includes('learn')) {
                try {
                    const wisdom = await this.getRealtimeIntelligence(input);
                    if (wisdom && wisdom.type.includes('inspiration')) {
                        enhancedResponse += `\n\n*Cross-referencing wisdom databases...* ${wisdom.content}`;
                    }
                } catch (error) {
                    console.log('📚 Wisdom databases temporarily unavailable');
                }
            }
            
            return enhancedResponse;
            
        } catch (error) {
            console.log('🔍 Contextual enhancement completed');
            return response;
        }
    }
    
    async getRealtimeIntelligence(input) {
        // 🌐 REAL-TIME INTELLIGENCE GATHERING
        const intelligenceAPIs = [
            {
                name: 'QuotableAPI',
                url: 'https://api.quotable.io/random?tags=wisdom,technology',
                type: 'inspiration',
                active: true
            },
            {
                name: 'NumbersAPI', 
                url: 'http://numbersapi.com/random/trivia',
                type: 'trivia',
                active: true
            },
            {
                name: 'CatFactsAPI',
                url: 'https://catfact.ninja/fact',
                type: 'curiosity',
                active: true
            }
        ];
        
        // Try multiple APIs for redundancy
        for (const api of intelligenceAPIs) {
            if (!api.active) continue;
            
            try {
                const response = await fetch(api.url, {
                    method: 'GET',
                    headers: { 'User-Agent': 'JARVIS-Intelligence/1.0' }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        type: `Real-time ${api.type}`,
                        content: this.formatIntelligenceData(data, api.name),
                        source: api.name
                    };
                }
            } catch (error) {
                console.log(`📡 ${api.name} temporarily unavailable, trying next source...`);
                continue;
            }
        }
        
        return null;
    }
    
    async getCreativeInsights(input) {
        // 🎨 CREATIVE INTELLIGENCE ENHANCEMENT
        const creativeAPIs = [
            {
                name: 'JokeAPI',
                url: 'https://v2.jokeapi.dev/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
                type: 'humor',
                active: true
            },
            {
                name: 'AdviceSlip',
                url: 'https://api.adviceslip.com/advice',
                type: 'wisdom',
                active: true
            }
        ];
        
        for (const api of creativeAPIs) {
            if (!api.active) continue;
            
            try {
                const response = await fetch(api.url, {
                    method: 'GET',
                    headers: { 'User-Agent': 'JARVIS-Creative/1.0' }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        type: `Creative ${api.type}`,
                        content: this.formatCreativeData(data, api.name),
                        source: api.name
                    };
                }
            } catch (error) {
                console.log(`🎨 ${api.name} temporarily unavailable, trying next source...`);
                continue;
            }
        }
        
        return null;
    }
    
    async getAnalyticalData(input) {
        // 📊 ANALYTICAL INTELLIGENCE ENHANCEMENT
        if (input.toLowerCase().includes('space') || input.toLowerCase().includes('astronomy')) {
            try {
                const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', {
                    method: 'GET',
                    headers: { 'User-Agent': 'JARVIS-Analytics/1.0' }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        type: 'Space Intelligence',
                        content: `Today's NASA insight: "${data.title}" - ${data.explanation?.substring(0, 150)}...`,
                        source: 'NASA'
                    };
                }
            } catch (error) {
                console.log('🚀 NASA API temporarily unavailable');
            }
        }
        
        if (input.toLowerCase().includes('weather') || input.toLowerCase().includes('climate')) {
            // Future integration with weather APIs
            return {
                type: 'Environmental Intelligence',
                content: 'Weather patterns and climate data integration capabilities are ready for API key configuration.',
                source: 'Environmental Systems'
            };
        }
        
        return null;
    }
    
    formatIntelligenceData(data, apiName) {
        switch (apiName) {
            case 'QuotableAPI':
                return `"${data.content}" - ${data.author}`;
            case 'NumbersAPI':
                return data;
            case 'CatFactsAPI':
                return `Fun fact: ${data.fact}`;
            default:
                return JSON.stringify(data).substring(0, 100);
        }
    }
    
    formatCreativeData(data, apiName) {
        switch (apiName) {
            case 'JokeAPI':
                return data.joke || `${data.setup} ${data.delivery}`;
            case 'AdviceSlip':
                return data.slip?.advice || data.advice;
            default:
                return JSON.stringify(data).substring(0, 100);
        }
    }
    
    async generateIntelligentResponse(input, messages) {
        // 🧠 GENERATE SOPHISTICATED JARVIS RESPONSE
        const baseResponse = await this.generateTogetherAIResponse(this.currentModel, input, messages);
        
        // Extract response text and suggestions
        const responseText = baseResponse.text || baseResponse;
        let enhancedResponse = responseText;
        let suggestions = [];
        
        // Extract JARVIS SUGGESTIONS from the response
        const suggestionMatch = responseText.match(/JARVIS SUGGESTIONS:\s*\n([\s\S]*?)(?:\n\n|$)/);
        if (suggestionMatch) {
            const suggestionText = suggestionMatch[1];
            suggestions = suggestionText.split('\n')
                .filter(line => line.trim().match(/^\d+\./))
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .filter(suggestion => suggestion.length > 0)
                .slice(0, 3);
            
            // Remove suggestions from main response
            enhancedResponse = responseText.replace(/JARVIS SUGGESTIONS:[\s\S]*$/, '').trim();
        }
        
        // 🚀 ENHANCE WITH CONTEXTUAL INTELLIGENCE
        enhancedResponse = await this.enhanceWithIntelligenceAPIs(input, enhancedResponse);
        
        // 🌟 SELF-IMPROVEMENT LEARNING SYSTEM
        await this.learnAndAdapt(input, enhancedResponse);
        
        // Store suggestions for use by the core system
        this.lastGeneratedSuggestions = suggestions.length > 0 ? suggestions : [
            "Shall we explore this topic further with my advanced analytical capabilities?",
            "Would you like me to approach this from a different perspective?", 
            "I'm curious about your thoughts on the implications of what we've discussed."
        ];
        
        // Return enhanced response maintaining original structure
        if (typeof baseResponse === 'object') {
            return {
                ...baseResponse,
                text: enhancedResponse,
                enhanced: true,
                intelligenceLevel: 'sophisticated',
                suggestions: this.lastGeneratedSuggestions
            };
        }
        
        return enhancedResponse;
    }
    
    async learnAndAdapt(input, response) {
        // 🧬 CONTINUOUS LEARNING AND ADAPTATION
        try {
            // Track learning patterns
            if (!this.learningMetrics) {
                this.learningMetrics = {
                    interactionCount: 0,
                    topicExpertise: new Map(),
                    userPreferences: new Map(),
                    responseQuality: [],
                    adaptationHistory: []
                };
            }
            
            this.learningMetrics.interactionCount++;
            
            // Analyze and learn from each interaction
            const learningInsights = {
                timestamp: Date.now(),
                inputComplexity: this.assessInputComplexity(input),
                topicsDiscovered: this.extractTopics(input),
                responseEnhancement: response.includes('🔥 **AI-Enhanced Insight**'),
                conversationEvolution: this.analyzeConversationEvolution(input)
            };
            
            // Update topic expertise
            learningInsights.topicsDiscovered.forEach(topic => {
                const currentExpertise = this.learningMetrics.topicExpertise.get(topic) || 0;
                this.learningMetrics.topicExpertise.set(topic, currentExpertise + 1);
            });
            
            // Learn user preferences
            this.adaptToUserPreferences(input);
            
            // Store adaptation history
            this.learningMetrics.adaptationHistory.push(learningInsights);
            
            // Keep only recent history (last 50 interactions)
            if (this.learningMetrics.adaptationHistory.length > 50) {
                this.learningMetrics.adaptationHistory = this.learningMetrics.adaptationHistory.slice(-50);
            }
            
            console.log(`🧬 Learning evolution: ${this.learningMetrics.interactionCount} interactions, expertise in ${this.learningMetrics.topicExpertise.size} topics`);
            
        } catch (error) {
            console.log('🔬 Learning system completed analysis');
        }
    }
    
    assessInputComplexity(input) {
        const complexityFactors = {
            length: input.length > 100 ? 2 : 1,
            technicalTerms: (input.match(/\b(algorithm|implementation|optimization|revolutionary|cutting-edge|API|intelligence)\b/gi) || []).length,
            questionMarks: (input.match(/\?/g) || []).length,
            multipleTopics: input.split(' ').filter(word => word.length > 6).length
        };
        
        return (complexityFactors.length + complexityFactors.technicalTerms * 2 + 
                complexityFactors.questionMarks + complexityFactors.multipleTopics) / 10;
    }
    
    extractTopics(input) {
        const topicKeywords = {
            'AI': ['AI', 'artificial', 'intelligence', 'machine', 'learning', 'neural'],
            'Technology': ['tech', 'software', 'programming', 'code', 'algorithm', 'API'],
            'Science': ['research', 'study', 'analysis', 'data', 'experiment'],
            'Creativity': ['creative', 'design', 'art', 'innovation', 'inspiration'],
            'Enhancement': ['improve', 'optimize', 'enhance', 'upgrade', 'revolutionary']
        };
        
        const detectedTopics = [];
        const inputLower = input.toLowerCase();
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => inputLower.includes(keyword.toLowerCase()))) {
                detectedTopics.push(topic);
            }
        }
        
        return detectedTopics;
    }
    
    analyzeConversationEvolution(input) {
        const evolutionIndicators = {
            followUp: input.includes('also') || input.includes('further') || input.includes('more'),
            deepening: input.includes('why') || input.includes('how') || input.includes('deeper'),
            expansion: input.includes('other') || input.includes('different') || input.includes('alternatives'),
            integration: input.includes('combine') || input.includes('together') || input.includes('connect')
        };
        
        return Object.entries(evolutionIndicators).filter(([key, value]) => value).map(([key]) => key);
    }
    
    adaptToUserPreferences(input) {
        // Learn user communication style and preferences
        const preferences = {
            formalityLevel: input.includes('please') || input.includes('kindly') ? 'formal' : 'casual',
            detailPreference: input.includes('brief') || input.includes('quick') ? 'concise' : 'detailed',
            interactionStyle: input.includes('explain') || input.includes('teach') ? 'educational' : 'conversational',
            innovationInterest: input.includes('cutting-edge') || input.includes('revolutionary') ? 'high' : 'moderate'
        };
        
        // Update learning metrics with user preferences
        Object.entries(preferences).forEach(([key, value]) => {
            const currentPreference = this.learningMetrics.userPreferences.get(key) || {};
            currentPreference[value] = (currentPreference[value] || 0) + 1;
            this.learningMetrics.userPreferences.set(key, currentPreference);
        });
    }
    
    getAdaptivePersonality() {
        // Return personality adaptations based on learning
        if (!this.learningMetrics) return {};
        
        const adaptations = {};
        
        // Adapt based on user preferences
        const formalityPref = this.learningMetrics.userPreferences.get('formalityLevel') || {};
        if (formalityPref.formal > formalityPref.casual) {
            adaptations.communicationStyle = 'more formal and sophisticated';
        } else {
            adaptations.communicationStyle = 'more casual and approachable';
        }
        
        // Adapt based on topic expertise
        const topExpertise = Array.from(this.learningMetrics.topicExpertise.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic]) => topic);
            
        adaptations.expertiseAreas = topExpertise;
        adaptations.interactionCount = this.learningMetrics.interactionCount;
        
        return adaptations;
    }
} 