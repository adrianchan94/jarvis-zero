import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    https: false, // Enable if needed for WebRTC in production
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    fs: {
      allow: ['..']
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'ai-core': ['./src/core/llm.js', './src/core/memory.js'],
          'ui': ['./src/ui/interface.js', './src/ui/hologram.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', '@tweenjs/tween.js', 'gsap']
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
}); 