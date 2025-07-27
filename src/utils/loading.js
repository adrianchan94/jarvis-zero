export class LoadingManager {
    constructor() {
        this.progressElement = null;
        this.statusElement = null;
        this.loadingScreen = null;
        this.currentProgress = 0;
        this.isComplete = false;
    }
    
    async start() {
        this.progressElement = document.getElementById('loading-progress');
        this.statusElement = document.getElementById('loading-status');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Show loading screen
        this.loadingScreen.classList.remove('hidden');
        
        console.log('🔄 Starting loading sequence...');
    }
    
    updateProgress(progress, status) {
        this.currentProgress = Math.max(0, Math.min(100, progress));
        
        if (this.progressElement) {
            this.progressElement.style.width = `${this.currentProgress}%`;
        }
        
        if (this.statusElement && status) {
            this.statusElement.textContent = status;
        }
        
        console.log(`📊 Loading progress: ${this.currentProgress}% - ${status}`);
    }
    
    async complete() {
        this.updateProgress(100, 'Initialization complete');
        
        // Wait a moment before hiding
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 1000);
        }
        
        this.isComplete = true;
        console.log('✅ Loading complete');
    }
    
    showError(message) {
        if (this.statusElement) {
            this.statusElement.textContent = `ERROR: ${message}`;
            this.statusElement.style.color = '#ff4444';
        }
        
        console.error('❌ Loading error:', message);
    }
} 