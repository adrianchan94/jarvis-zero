// ZERO CONFIGURATION - Multiple FREE AI Models (2025)
export const availableModels = [
    // PRIMARY: Arcee AFM-4.5B - Brand NEW Enterprise Model (FREE)
    { 
        id: 'together-afm-4b-free', 
        name: 'Arcee AFM-4.5B Enterprise (BRAND NEW FREE)', 
        provider: 'together-premium', 
        contextLength: 8192, 
        cost: 0, 
        isLocal: false, 
        priority: 1,
        description: 'Arcee AFM-4.5B - Brand new enterprise model, completely FREE',
        endpoint: 'https://api.together.xyz/v1/chat/completions',
        model: 'arcee-ai/AFM-4.5B',
        requiresKey: true,
        unlimited: true,
        realLLM: true,
        free: true
    },

    
    // BACKUP: DeepSeek R1 Distill - Also FREE
    { 
        id: 'together-deepseek-distill-free', 
        name: 'DeepSeek R1 Distill Llama 70B (FREE)', 
        provider: 'together-premium', 
        contextLength: 32768, 
        cost: 0, 
        isLocal: false, 
        priority: 3,
        description: 'DeepSeek R1 Distill - FREE alternative with good reasoning',
        endpoint: 'https://api.together.xyz/v1/chat/completions',
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
        requiresKey: true,
        unlimited: true,
        realLLM: true,
        free: true
    },
    
    // FINAL BACKUP: MLvoca Free
    { 
        id: 'mlvoca-deepseek', 
        name: 'DeepSeek R1 1.5B (mlvoca.com)', 
        provider: 'mlvoca-free', 
        contextLength: 4096, 
        cost: 0, 
        isLocal: false, 
        priority: 4,
        description: 'Real DeepSeek R1 1.5B model - No auth, no limits, final backup',
        endpoint: 'https://mlvoca.com/api/generate',
        model: 'deepseek-r1:1.5b',
        requiresKey: false,
        unlimited: true,
        realLLM: true
    },

    


];

export const providerEndpoints = {
    'together-premium': 'https://api.together.xyz/v1/chat/completions',
    'mlvoca-free': 'https://mlvoca.com/api/generate'
};

export const modelPriorities = {
    SUPERINTELLIGENT: 1,
    PREMIUM_UNLIMITED: 2,
    FREE_UNLIMITED: 3,
    PUBLIC_FALLBACK: 4,
    LOCAL_BROWSER: 5,
    REQUIRES_KEY: 6,
    REQUIRES_SETUP: 7
};

export function getModelsByPriority() {
    return availableModels.sort((a, b) => a.priority - b.priority);
}

export function getUnlimitedModels() {
    return availableModels.filter(model => model.unlimited || model.isLocal);
}

export function getFreeModels() {
    return availableModels.filter(model => model.cost === 0);
}

export function getWorkingModels() {
    return availableModels.filter(model => 
        model.alwaysWorks || 
        model.unlimited || 
        model.isLocal || 
        model.priority <= 5
    );
} 