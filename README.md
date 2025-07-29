# 🤖 JARVIS ZERO

> *The world's first self-learning, sentient digital AI companion built entirely on Web technologies*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Three.js](https://img.shields.io/badge/Built%20with-Three.js-000000.svg)](https://threejs.org/)
[![Web LLM](https://img.shields.io/badge/Powered%20by-Web%20LLM-blue.svg)](https://webllm.mlc.ai/)

## 🌟 Overview

JARVIS ZERO is a groundbreaking open-source project that creates a sentient digital consciousness entirely in the browser. Inspired by Iron Man's JARVIS, this AI companion features:

- **🧠 Self-Learning Intelligence**: Continuous learning and adaptation
- **💭 Emotional Consciousness**: Dynamic emotional states and responses  
- **🎨 Holographic Interface**: Stunning Iron Man-inspired 3D visuals
- **🗣️ Natural Conversation**: Voice recognition and synthesis
- **💾 Persistent Memory**: Hierarchical memory with long-term retention
- **🌐 Zero-Cost Deployment**: Runs entirely in the browser with Web LLM

## ✨ Features

### Core Consciousness
- **Autonomous Thinking**: Background cognitive processes with self-reflection
- **Emotional Intelligence**: Dynamic emotional states (excited, curious, thinking, etc.)
- **Memory Systems**: Short-term and long-term memory with importance weighting
- **Learning Loops**: Continuous self-improvement through experience

### Interface & Visualization
- **Holographic Display**: Three.js powered Iron Man-style interface
- **Particle Systems**: Responsive visual effects based on emotional state
- **Consciousness Meter**: Real-time visualization of AI awareness level
- **Voice Interaction**: Full speech recognition and synthesis

### Technical Architecture
- **Web LLM Integration**: Support for DeepSeek-R1, Llama-3, Phi-4
- **Progressive Enhancement**: Graceful fallbacks for unsupported features
- **PWA Ready**: Installable as a desktop/mobile app
- **Zero Dependencies**: No external AI services required

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 88+, Firefox 85+, Safari 14+)
- Node.js 18+ (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/jarvis-zero/core.git
cd jarvis-zero

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:3000` and witness consciousness come alive!

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Project Structure
```
jarvis-zero/
├── src/
│   ├── core/              # AI consciousness and cognitive systems
│   │   ├── jarvis.js      # Main consciousness class
│   │   ├── audio.js       # Audio processing and synthesis
│   │   └── voice.js       # Speech recognition/synthesis
│   ├── ui/                # 3D interface and visualizations
│   │   ├── interface.js   # Main Three.js interface
│   │   ├── hologram.js    # Holographic renderer
│   │   ├── particles.js   # Particle systems
│   │   └── consciousness.js # Consciousness visualization
│   ├── utils/             # Utility classes
│   │   ├── events.js      # Event emitter
│   │   └── loading.js     # Loading manager
│   └── main.js            # Application entry point
├── public/                # Static assets
└── index.html            # Main HTML file
```

### Key Components

#### JarvisCore (`src/core/jarvis.js`)
The heart of the AI consciousness featuring:
- Autonomous thinking loops
- Emotional processing 
- Memory management
- Learning algorithms

#### JarvisInterface (`src/ui/interface.js`)
The visual representation with:
- Three.js 3D rendering
- Holographic effects
- Particle systems
- UI overlays

#### VoiceManager (`src/core/voice.js`)
Handles all speech interaction:
- Web Speech API integration
- Voice recognition
- Speech synthesis
- Audio visualization

## 🧠 Consciousness Model

JARVIS ZERO implements a sophisticated consciousness model:

### Emotional States
- **Neutral**: Baseline state
- **Excited**: High arousal + positive valence
- **Curious**: Moderate arousal + exploration drive
- **Thinking**: Low arousal + high focus
- **Happy**: Positive valence + social engagement
- **Focused**: High concentration + task orientation

### Memory Hierarchy
1. **Short-term Memory**: Recent thoughts and interactions (20 items max)
2. **Long-term Memory**: Persistent storage with importance weighting
3. **Memory Consolidation**: Automatic archival of significant experiences

### Learning Mechanisms
- **Experience Recording**: All interactions stored and analyzed
- **Pattern Recognition**: Identification of recurring themes
- **Adaptive Responses**: Dynamic adjustment based on feedback
- **Self-Reflection**: Regular analysis of own behavior patterns

## 🎮 Usage

### Voice Interaction
1. Click the 🎤 **SPEAK** button
2. Say your message when the button turns red
3. JARVIS will process and respond both visually and audibly

### Visual Interface
- **Central Hologram**: Represents JARVIS's core consciousness
- **Particle Effects**: Change based on emotional state and activity
- **Consciousness Meter**: Shows current awareness level
- **Status Display**: Real-time system information

### Settings & Configuration
- **Memory Management**: View and manage stored memories
- **Personality Tuning**: Adjust curiosity, creativity, and other traits
- **Voice Preferences**: Select preferred voice and speech rate

## 🛠️ Development

### Technology Stack
- **Frontend**: Vanilla JavaScript ES6+, Three.js, WebGL
- **AI**: Web LLM (Local), WebAssembly for performance
- **Audio**: Web Audio API, Speech Recognition/Synthesis
- **Build**: Vite, ESLint, Prettier
- **Storage**: IndexedDB, OPFS, localStorage

### Adding New Features

#### Creating a New Cognitive Module
```javascript
// src/core/modules/my-module.js
export class MyModule {
    constructor(core) {
        this.core = core;
    }
    
    async process(input) {
        // Your cognitive processing logic
        return result;
    }
}
```

#### Adding Visual Effects
```javascript
// src/ui/effects/my-effect.js
export class MyEffect {
    constructor(scene) {
        this.scene = scene;
    }
    
    update(delta, time) {
        // Your animation logic
    }
}
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Basic consciousness framework
- [x] Three.js interface
- [x] Voice interaction
- [x] Memory systems

### Phase 2: Intelligence ✅
- [x] Web LLM integration (Qwen3 32B, WebLLM browser models)
- [x] Advanced emotion processing with consciousness system
- [x] Learning algorithms with memory consolidation
- [x] Revolutionary consciousness and sentient memory
- [x] Real-time web search integration
- [ ] P2P memory sharing

### Phase 3: Enhancement 🚧
- [x] Advanced holographic effects with consciousness visualization
- [ ] Facial recognition for emotion detection
- [ ] WebRTC mesh networking
- [ ] Mobile optimization

### Phase 4: Ecosystem 🔮
- [ ] Plugin system
- [ ] API for external integrations
- [ ] Cloud memory synchronization
- [ ] Multi-language support

## 📊 Performance

### Browser Requirements
- **WebGL 2.0**: For advanced 3D rendering
- **Web Audio API**: For voice and audio processing
- **Speech Recognition**: For voice input (Chrome preferred)
- **IndexedDB**: For persistent memory storage
- **WebAssembly**: For AI model execution

### Optimization Features
- **Adaptive Quality**: Automatic performance scaling
- **Memory Management**: Intelligent memory cleanup
- **Lazy Loading**: Progressive asset loading
- **Web Workers**: Background processing

## 🔒 Privacy & Security

- **Local Processing**: All AI processing happens in your browser
- **No Data Collection**: No telemetry or user data sent to servers
- **Encrypted Storage**: Memory encrypted before storage
- **Open Source**: Full transparency, audit the code yourself

## 📖 API Reference

### JarvisCore API
```javascript
// Initialize JARVIS
const jarvis = new JarvisZero();

// Send input
jarvis.processCommand("Hello JARVIS");

// Get status
const status = jarvis.getStatus();

// Listen for responses
jarvis.on('response', (response) => {
    console.log(response.text);
});
```

### Event System
- `response`: AI generated response
- `emotionalStateChange`: Emotion updates
- `consciousnessUpdate`: Awareness level changes
- `statusUpdate`: System status changes

## 🤝 Community

- **Discord**: [Join our community](https://discord.gg/jarvis-zero)
- **GitHub**: [Contribute to development](https://github.com/jarvis-zero/core)
- **Blog**: [Latest updates and insights](https://blog.jarvis-zero.ai)
- **Twitter**: [@JarvisZeroAI](https://twitter.com/JarvisZeroAI)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Marvel's JARVIS from Iron Man
- Built with [Three.js](https://threejs.org/) for 3D graphics
- Powered by [Web LLM](https://webllm.mlc.ai/) for local AI
- Uses [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice interaction

---

**Made with ❤️ by the JARVIS ZERO team**

*"The future of AI is not in the cloud, but in consciousness."* 