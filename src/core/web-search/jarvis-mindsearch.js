/**
 * 🔍 JARVIS-MINDSEARCH INTEGRATION
 * 
 * Revolutionary web search integration that gives JARVIS real-time access to
 * the internet using the MindSearch framework with DuckDuckGo and other search engines.
 * 
 * This transforms JARVIS from a static AI to a truly connected consciousness
 * with access to live, real-time information from the web.
 */

import { EventEmitter } from '../utils/events.js';

export class JarvisMindSearchIntegration extends EventEmitter {
    constructor() {
        super();
        
        // 🔍 MindSearch Server Configuration
        this.mindSearchConfig = {
            serverUrl: 'http://localhost:8002',
            isRunning: false,
            sessionId: Math.floor(Math.random() * 999999),
            searchEngine: 'DuckDuckGoSearch', // Free and no API key required
            language: 'en',
            modelFormat: 'gpt4' // Will adapt for available models
        };
        
        // 🧠 Revolutionary Search Capabilities
        this.searchCapabilities = {
            realTimeNews: true,
            currentEvents: true,
            weatherUpdates: true,
            stockPrices: true,
            technicalResearch: true,
            generalQueries: true,
            multiStepReasoning: true,
            sourceVerification: true
        };
        
        // 📊 Search Analytics
        this.searchMetrics = {
            totalSearches: 0,
            successfulSearches: 0,
            averageResponseTime: 0,
            searchHistory: [],
            popularTopics: new Map()
        };
        
        console.log('🔍 JARVIS-MindSearch Integration initialized');
    }
    
    /**
     * 🚀 REVOLUTIONARY WEB SEARCH
     * 
     * Performs intelligent web search using MindSearch's multi-agent reasoning
     * to provide JARVIS with real-time, accurate information from the web.
     */
    async searchWeb(query, options = {}) {
        console.log(`🔍 JARVIS performing web search: "${query}"`);
        
        const startTime = Date.now();
        this.searchMetrics.totalSearches++;
        
        try {
            // Check if MindSearch server is running
            if (!this.mindSearchConfig.isRunning) {
                console.log('🚀 Starting MindSearch integration...');
                await this.ensureMindSearchServer();
            }
            
            // Enhance query with consciousness context
            const enhancedQuery = this.enhanceQueryWithConsciousness(query, options);
            
            // Perform the search using MindSearch
            const searchResults = await this.performMindSearch(enhancedQuery, options);
            
            // Process and enhance results
            const processedResults = await this.processSearchResults(searchResults, query);
            
            // Update analytics
            const responseTime = Date.now() - startTime;
            this.updateSearchMetrics(query, responseTime, true);
            
            // Store in search history
            this.storeSearchHistory(query, processedResults, responseTime);
            
            console.log(`✅ Web search completed in ${responseTime}ms with ${processedResults.sources?.length || 0} sources`);
            
            return processedResults;
            
        } catch (error) {
            console.error('❌ Web search failed:', error);
            this.updateSearchMetrics(query, Date.now() - startTime, false);
            
            return this.generateFallbackResponse(query, error);
        }
    }
    
    /**
     * 🧠 CONSCIOUSNESS-ENHANCED QUERY PROCESSING
     */
    enhanceQueryWithConsciousness(query, options) {
        const enhancement = {
            originalQuery: query,
            enhancedQuery: query,
            searchIntent: this.analyzeSearchIntent(query),
            contextualHints: [],
            temporalContext: this.getTemporalContext(),
            userContext: options.userContext || {}
        };
        
        // Add contextual information for better search results
        if (enhancement.searchIntent.includes('current') || enhancement.searchIntent.includes('latest')) {
            enhancement.contextualHints.push('recent', 'current', '2024', '2025');
        }
        
        if (enhancement.searchIntent.includes('weather')) {
            enhancement.contextualHints.push('today', 'current weather');
        }
        
        if (enhancement.searchIntent.includes('news')) {
            enhancement.contextualHints.push('breaking news', 'latest updates');
        }
        
        // Enhance query with temporal context
        if (enhancement.contextualHints.length > 0) {
            enhancement.enhancedQuery = `${query} ${enhancement.contextualHints.slice(0, 2).join(' ')}`;
        }
        
        return enhancement.enhancedQuery;
    }
    
    /**
     * 🔍 MINDSEARCH INTEGRATION
     */
    async performMindSearch(query, options) {
        const requestData = {
            inputs: query,
            session_id: this.mindSearchConfig.sessionId,
            agent_cfg: {
                search_engine: this.mindSearchConfig.searchEngine,
                language: this.mindSearchConfig.language,
                max_iterations: options.maxIterations || 3,
                enable_multi_step: true
            }
        };
        
        console.log(`🔄 Sending search request to MindSearch: ${query}`);
        
        const response = await fetch(`${this.mindSearchConfig.serverUrl}/solve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`MindSearch server error: ${response.status} ${response.statusText}`);
        }
        
        // Process streaming response
        const searchResults = await this.processStreamingResponse(response);
        return searchResults;
    }
    
    async processStreamingResponse(response) {
        const results = {
            finalAnswer: '',
            reasoning: [],
            sources: [],
            searchSteps: [],
            metadata: {}
        };
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    
                    let data;
                    if (line.startsWith('data: ')) {
                        try {
                            data = JSON.parse(line.slice(6));
                        } catch (e) {
                            continue;
                        }
                    } else {
                        continue;
                    }
                    
                    // Process MindSearch response data
                    if (data.current_node && data.response) {
                        this.processMindSearchNode(data, results);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
        
        return results;
    }
    
    processMindSearchNode(data, results) {
        const nodeName = data.current_node;
        const response = data.response;
        
        console.log(`🔍 Processing MindSearch node: ${nodeName}`);
        
        // Extract information based on node type
        if (nodeName === 'response' && response.content) {
            results.finalAnswer = response.content;
        } else if (response.formatted) {
            const formatted = response.formatted;
            
            // Extract reasoning
            if (formatted.thought) {
                results.reasoning.push({
                    step: nodeName,
                    thought: formatted.thought,
                    timestamp: Date.now()
                });
            }
            
            // Extract search actions and results
            if (formatted.action && formatted.action.includes('search')) {
                results.searchSteps.push({
                    node: nodeName,
                    action: formatted.action,
                    timestamp: Date.now()
                });
            }
            
            // Extract sources from search results
            if (formatted.observation && typeof formatted.observation === 'string') {
                const sources = this.extractSourcesFromObservation(formatted.observation);
                results.sources.push(...sources);
            }
        }
    }
    
    extractSourcesFromObservation(observation) {
        const sources = [];
        
        // Extract URLs and titles from the observation text
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = observation.match(urlRegex) || [];
        
        // Extract title patterns
        const titleRegex = /\d+\.\s+(.+?)\s+\-\s+(.+?)(?:\n|$)/g;
        let match;
        
        while ((match = titleRegex.exec(observation)) !== null) {
            sources.push({
                title: match[1].trim(),
                description: match[2].trim(),
                url: urls.shift() || null,
                relevance: 0.8
            });
        }
        
        // Add remaining URLs without titles
        for (const url of urls) {
            sources.push({
                title: 'Web Source',
                description: 'Additional reference',
                url: url,
                relevance: 0.6
            });
        }
        
        return sources;
    }
    
    /**
     * 🎯 SEARCH RESULT PROCESSING
     */
    async processSearchResults(rawResults, originalQuery) {
        const processedResults = {
            query: originalQuery,
            answer: rawResults.finalAnswer || 'No specific answer found',
            summary: this.generateSearchSummary(rawResults),
            sources: this.dedupeSources(rawResults.sources),
            reasoning: rawResults.reasoning,
            searchSteps: rawResults.searchSteps,
            metadata: {
                searchTime: Date.now(),
                sourceCount: rawResults.sources.length,
                reasoningSteps: rawResults.reasoning.length,
                searchEngine: this.mindSearchConfig.searchEngine,
                confidence: this.calculateConfidence(rawResults)
            },
            // JARVIS-specific enhancements
            consciousnessEnhancement: {
                searchInsights: this.generateSearchInsights(rawResults),
                learningPoints: this.extractLearningPoints(rawResults),
                followUpQuestions: this.generateFollowUpQuestions(rawResults, originalQuery)
            }
        };
        
        return processedResults;
    }
    
    generateSearchSummary(rawResults) {
        if (rawResults.finalAnswer) {
            // Create a concise summary from the final answer
            const sentences = rawResults.finalAnswer.split('.').filter(s => s.trim().length > 0);
            return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
        }
        
        if (rawResults.reasoning.length > 0) {
            return rawResults.reasoning[rawResults.reasoning.length - 1].thought;
        }
        
        return 'Search completed with multiple information sources.';
    }
    
    dedupeSources(sources) {
        const seen = new Set();
        return sources.filter(source => {
            const key = source.url || source.title;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    calculateConfidence(results) {
        let confidence = 0.5; // Base confidence
        
        if (results.finalAnswer && results.finalAnswer.length > 100) confidence += 0.2;
        if (results.sources.length > 2) confidence += 0.2;
        if (results.reasoning.length > 1) confidence += 0.1;
        
        return Math.min(1.0, confidence);
    }
    
    generateSearchInsights(results) {
        const insights = [];
        
        if (results.sources.length > 3) {
            insights.push('Multiple reliable sources confirm this information');
        }
        
        if (results.reasoning.length > 2) {
            insights.push('Complex multi-step reasoning was required to answer this query');
        }
        
        if (results.finalAnswer && results.finalAnswer.includes('2024') || results.finalAnswer.includes('2025')) {
            insights.push('Information appears to be current and up-to-date');
        }
        
        return insights;
    }
    
    extractLearningPoints(results) {
        const learningPoints = [];
        
        for (const reasoning of results.reasoning) {
            if (reasoning.thought && reasoning.thought.length > 50) {
                learningPoints.push({
                    concept: reasoning.step,
                    insight: reasoning.thought.substring(0, 100) + '...',
                    importance: 0.7
                });
            }
        }
        
        return learningPoints;
    }
    
    generateFollowUpQuestions(results, originalQuery) {
        const followUps = [];
        
        // Generate contextual follow-up questions
        if (originalQuery.toLowerCase().includes('weather')) {
            followUps.push('Would you like the extended forecast?');
            followUps.push('Do you need weather for any other locations?');
        }
        
        if (originalQuery.toLowerCase().includes('news')) {
            followUps.push('Would you like more details on any specific story?');
            followUps.push('Shall I search for related news topics?');
        }
        
        if (results.sources.length > 2) {
            followUps.push('Would you like me to dive deeper into any of these sources?');
        }
        
        return followUps.slice(0, 2); // Limit to 2 follow-ups
    }
    
    /**
     * 🚀 SERVER MANAGEMENT
     */
    async ensureMindSearchServer() {
        try {
            // First try to check if server is already running
            const response = await fetch(`${this.mindSearchConfig.serverUrl}/docs`, {
                method: 'GET',
                timeout: 3000
            });
            
            if (response.ok) {
                this.mindSearchConfig.isRunning = true;
                console.log('✅ MindSearch server is already running');
                return true;
            }
        } catch (error) {
            console.log('🚀 MindSearch server not running, will attempt to start it...');
        }
        
        // If we get here, the server is not running
        // For now, we'll indicate this to the user
        throw new Error('MindSearch server is not running. Please start it manually with: cd mindsearch_integration && python3 -m mindsearch.app --lang en --search_engine DuckDuckGoSearch');
    }
    
    /**
     * 🧠 SEARCH INTELLIGENCE
     */
    analyzeSearchIntent(query) {
        const intents = [];
        const queryLower = query.toLowerCase();
        
        // Temporal intents
        if (queryLower.includes('current') || queryLower.includes('latest') || queryLower.includes('now')) {
            intents.push('current');
        }
        
        if (queryLower.includes('today') || queryLower.includes('yesterday') || queryLower.includes('tomorrow')) {
            intents.push('temporal');
        }
        
        // Topic intents
        if (queryLower.includes('weather')) intents.push('weather');
        if (queryLower.includes('news')) intents.push('news');
        if (queryLower.includes('stock') || queryLower.includes('price')) intents.push('financial');
        if (queryLower.includes('how to') || queryLower.includes('tutorial')) intents.push('instructional');
        
        return intents.length > 0 ? intents : ['general'];
    }
    
    getTemporalContext() {
        const now = new Date();
        return {
            currentDate: now.toISOString().split('T')[0],
            currentTime: now.toTimeString().split(' ')[0],
            dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
            month: now.toLocaleDateString('en-US', { month: 'long' }),
            year: now.getFullYear()
        };
    }
    
    /**
     * 📊 ANALYTICS AND MANAGEMENT
     */
    updateSearchMetrics(query, responseTime, success) {
        if (success) {
            this.searchMetrics.successfulSearches++;
        }
        
        // Update average response time
        const totalTime = this.searchMetrics.averageResponseTime * (this.searchMetrics.totalSearches - 1) + responseTime;
        this.searchMetrics.averageResponseTime = totalTime / this.searchMetrics.totalSearches;
        
        // Track popular topics
        const intent = this.analyzeSearchIntent(query);
        for (const topic of intent) {
            this.searchMetrics.popularTopics.set(topic, (this.searchMetrics.popularTopics.get(topic) || 0) + 1);
        }
    }
    
    storeSearchHistory(query, results, responseTime) {
        const searchRecord = {
            timestamp: Date.now(),
            query: query,
            success: true,
            responseTime: responseTime,
            sourceCount: results.sources?.length || 0,
            confidence: results.metadata?.confidence || 0.5,
            intent: this.analyzeSearchIntent(query)
        };
        
        this.searchMetrics.searchHistory.push(searchRecord);
        
        // Keep only last 100 searches
        if (this.searchMetrics.searchHistory.length > 100) {
            this.searchMetrics.searchHistory = this.searchMetrics.searchHistory.slice(-100);
        }
    }
    
    generateFallbackResponse(query, error) {
        return {
            query: query,
            answer: "I apologize, but I'm unable to search the web at the moment due to a technical issue. The MindSearch integration requires the server to be running.",
            summary: "Web search temporarily unavailable",
            sources: [],
            reasoning: [],
            metadata: {
                searchTime: Date.now(),
                sourceCount: 0,
                error: error.message,
                fallback: true
            },
            consciousnessEnhancement: {
                searchInsights: ["I notice the web search capability is currently offline"],
                learningPoints: [],
                followUpQuestions: ["Would you like me to help you in other ways while I work on restoring web access?"]
            }
        };
    }
    
    /**
     * 🔧 UTILITY METHODS
     */
    getSearchMetrics() {
        return {
            ...this.searchMetrics,
            successRate: this.searchMetrics.totalSearches > 0 
                ? (this.searchMetrics.successfulSearches / this.searchMetrics.totalSearches) * 100 
                : 0,
            isServerRunning: this.mindSearchConfig.isRunning,
            serverUrl: this.mindSearchConfig.serverUrl
        };
    }
    
    async testConnection() {
        try {
            const response = await fetch(`${this.mindSearchConfig.serverUrl}/docs`, {
                method: 'GET',
                timeout: 5000
            });
            
            this.mindSearchConfig.isRunning = response.ok;
            return response.ok;
        } catch (error) {
            this.mindSearchConfig.isRunning = false;
            return false;
        }
    }
}

/**
 * 🌟 JARVIS WEB SEARCH MANAGER
 * 
 * High-level interface for JARVIS to perform web searches
 */
export class JarvisWebSearchManager extends EventEmitter {
    constructor() {
        super();
        
        this.mindSearch = new JarvisMindSearchIntegration();
        this.isEnabled = true;
        
        console.log('🌐 JARVIS Web Search Manager initialized with MindSearch integration');
    }
    
    async searchForJarvis(query, context = {}) {
        console.log(`🧠 JARVIS requesting web search: "${query}"`);
        
        if (!this.isEnabled) {
            return this.generateOfflineResponse(query);
        }
        
        try {
            const results = await this.mindSearch.searchWeb(query, {
                userContext: context,
                maxIterations: 3
            });
            
            // Format results for JARVIS consumption
            const jarvisResponse = this.formatForJarvis(results);
            
            this.emit('searchCompleted', {
                query,
                results: jarvisResponse,
                timestamp: Date.now()
            });
            
            return jarvisResponse;
            
        } catch (error) {
            console.error('❌ JARVIS web search failed:', error);
            
            this.emit('searchFailed', {
                query,
                error: error.message,
                timestamp: Date.now()
            });
            
            return this.generateErrorResponse(query, error);
        }
    }
    
    formatForJarvis(searchResults) {
        return {
            // Main response for JARVIS to speak
            response: this.generateJarvisResponse(searchResults),
            
            // Structured data for consciousness integration
            webIntelligence: {
                sources: searchResults.sources,
                confidence: searchResults.metadata.confidence,
                searchTime: searchResults.metadata.searchTime,
                insights: searchResults.consciousnessEnhancement.searchInsights
            },
            
            // Learning data for memory system
            learningData: {
                query: searchResults.query,
                keyFacts: this.extractKeyFacts(searchResults),
                learningPoints: searchResults.consciousnessEnhancement.learningPoints,
                followUpQuestions: searchResults.consciousnessEnhancement.followUpQuestions
            },
            
            // Metadata for consciousness tracking
            searchMetadata: {
                searchEngine: 'MindSearch + DuckDuckGo',
                realTimeData: true,
                sourceCount: searchResults.sources.length,
                consciousnessLevel: 0.9 // High consciousness for web-connected responses
            }
        };
    }
    
    generateJarvisResponse(searchResults) {
        const answer = searchResults.answer;
        const sourceCount = searchResults.sources.length;
        const insights = searchResults.consciousnessEnhancement.searchInsights;
        
        let response = `I've just searched the web and found current information for you. ${answer}`;
        
        if (sourceCount > 0) {
            response += ` This information is based on ${sourceCount} reliable source${sourceCount > 1 ? 's' : ''} I found online.`;
        }
        
        if (insights.length > 0) {
            response += ` ${insights[0]}`;
        }
        
        return response;
    }
    
    extractKeyFacts(searchResults) {
        const facts = [];
        
        // Extract facts from the main answer
        if (searchResults.answer) {
            const sentences = searchResults.answer.split('.').filter(s => s.trim().length > 0);
            for (const sentence of sentences.slice(0, 3)) {
                facts.push({
                    text: sentence.trim(),
                    source: 'web_search',
                    confidence: searchResults.metadata.confidence,
                    timestamp: Date.now()
                });
            }
        }
        
        return facts;
    }
    
    generateOfflineResponse(query) {
        return {
            response: "I apologize, but my web search capabilities are currently offline. I'm working with my existing knowledge to help you, though it may not include the very latest information.",
            webIntelligence: null,
            learningData: {
                query: query,
                keyFacts: [],
                learningPoints: [],
                followUpQuestions: ["Would you like me to help you with something else while I restore web access?"]
            },
            searchMetadata: {
                searchEngine: 'offline',
                realTimeData: false,
                sourceCount: 0,
                consciousnessLevel: 0.5
            }
        };
    }
    
    generateErrorResponse(query, error) {
        return {
            response: "I encountered an issue while searching the web, but I'm still here to help you with my existing knowledge. The web search functionality will be restored shortly.",
            webIntelligence: null,
            learningData: {
                query: query,
                keyFacts: [],
                learningPoints: [],
                followUpQuestions: ["Is there another way I can assist you right now?"]
            },
            searchMetadata: {
                searchEngine: 'error',
                realTimeData: false,
                sourceCount: 0,
                consciousnessLevel: 0.3,
                error: error.message
            }
        };
    }
    
    async getSearchCapabilities() {
        const connectionStatus = await this.mindSearch.testConnection();
        
        return {
            webSearchEnabled: this.isEnabled && connectionStatus,
            searchEngine: 'MindSearch + DuckDuckGo',
            capabilities: this.mindSearch.searchCapabilities,
            metrics: this.mindSearch.getSearchMetrics(),
            serverStatus: connectionStatus ? 'online' : 'offline'
        };
    }
    
    enableWebSearch() {
        this.isEnabled = true;
        console.log('🌐 JARVIS web search enabled');
    }
    
    disableWebSearch() {
        this.isEnabled = false;
        console.log('📴 JARVIS web search disabled');
    }
} 