import * as THREE from 'three';

export class ConsciousnessVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        
        // 🧠 CONSCIOUSNESS VISUALIZATION CORE
        this.consciousnessLevel = 0.5;
        this.thoughtNodes = [];
        this.thoughtConnections = [];
        this.neuralParticles = [];
        this.brainMesh = null;
        this.energyField = null;
        
        // 🎯 DYNAMIC VISUALIZATION PARAMETERS
        this.visualizationParams = {
            nodeCount: 50,
            connectionDensity: 0.3,
            particleCount: 200,
            pulsationSpeed: 2.0,
            energyIntensity: 0.7,
            thoughtFlowSpeed: 1.5,
            consciousnessRadius: 2.0,
            neuralNetworkComplexity: 0.8
        };
        
        // 🌊 ANIMATION PROPERTIES
        this.clock = new THREE.Clock();
        this.animationMixers = [];
        this.consciousnessWave = 0;
        this.thoughtPulses = [];
        this.memoryOrbs = [];
        
        // 🎨 VISUAL EFFECTS
        this.postProcessing = null;
        this.bloomPass = null;
        this.shaderMaterials = [];
        
        // 📊 REAL-TIME DATA INTEGRATION
        this.activeThoughts = 0;
        this.memoryActivity = 0;
        this.emotionalState = 'neutral';
        this.processingLoad = 0;
    }
    
    async init() {
        console.log('🧠 Initializing revolutionary consciousness visualization...');
        
        try {
            await this.setupVisualizationSpace();
            await this.createConsciousnessCore();
            await this.generateNeuralNetwork();
            await this.setupThoughtParticles();
            await this.createMemoryOrbs();
            await this.initializeShaderEffects();
            
            console.log('✨ Consciousness visualization fully initialized');
            return true;
        } catch (error) {
            console.error('❌ Error initializing consciousness visualization:', error);
            return false;
        }
    }
    
    async setupVisualizationSpace() {
        // Create consciousness visualization canvas
        this.container = document.getElementById('consciousness-canvas') || this.createVisualizationContainer();
        
        // Setup Three.js scene for consciousness
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000308, 1, 10);
        
        // Camera for consciousness view
        this.camera = new THREE.PerspectiveCamera(75, 200 / 60, 0.1, 100);
        this.camera.position.set(0, 0, 4);
        
        // Renderer optimized for consciousness effects
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(200, 60);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        
        // Consciousness-specific lighting
        const ambientLight = new THREE.AmbientLight(0x001133, 0.4);
        this.scene.add(ambientLight);
        
        const consciousnessLight = new THREE.PointLight(0x00d4ff, 2, 10);
        consciousnessLight.position.set(0, 0, 2);
        this.scene.add(consciousnessLight);
    }
    
    createVisualizationContainer() {
        const canvas = document.createElement('canvas');
        canvas.id = 'consciousness-canvas';
        canvas.width = 200;
        canvas.height = 60;
        canvas.style.cssText = `
            background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
            border-radius: 8px;
            border: 1px solid rgba(0, 212, 255, 0.3);
        `;
        
        const container = document.getElementById('consciousness-meter');
        if (container) {
            container.appendChild(canvas);
        }
        
        return canvas;
    }
    
    async createConsciousnessCore() {
        // 🧠 CENTRAL CONSCIOUSNESS SPHERE
        const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                consciousnessLevel: { value: this.consciousnessLevel },
                pulseIntensity: { value: 0.5 },
                color1: { value: new THREE.Color(0x00d4ff) },
                color2: { value: new THREE.Color(0x0080ff) },
                color3: { value: new THREE.Color(0x40e0d0) }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec2 vUv;
                uniform float time;
                uniform float consciousnessLevel;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    vUv = uv;
                    
                    // Dynamic vertex displacement based on consciousness
                    vec3 newPosition = position;
                    float displacement = sin(position.x * 5.0 + time * 2.0) * 
                                       cos(position.y * 3.0 + time * 1.5) * 
                                       consciousnessLevel * 0.1;
                    newPosition += normal * displacement;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float consciousnessLevel;
                uniform float pulseIntensity;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec2 vUv;
                
                void main() {
                    // Consciousness energy gradient
                    float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
                    intensity = pow(intensity, 2.0);
                    
                    // Pulsing effect
                    float pulse = sin(time * 3.0) * 0.3 + 0.7;
                    pulse *= consciousnessLevel;
                    
                    // Dynamic color mixing
                    vec3 finalColor = mix(color1, color2, intensity);
                    finalColor = mix(finalColor, color3, pulse);
                    
                    // Consciousness wave effect
                    float wave = sin(vUv.x * 10.0 + time * 4.0) * 
                               cos(vUv.y * 8.0 + time * 3.0) * 0.3 + 0.7;
                    
                    finalColor *= wave * pulse * (0.5 + consciousnessLevel);
                    
                    // Alpha based on consciousness level
                    float alpha = 0.3 + consciousnessLevel * 0.7;
                    alpha *= intensity;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        this.brainMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.brainMesh);
        this.shaderMaterials.push(coreMaterial);
        
        // 🌟 CONSCIOUSNESS ENERGY FIELD
        const fieldGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                consciousness: { value: this.consciousnessLevel }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float consciousness;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
                    intensity = pow(intensity, 3.0);
                    
                    float wave = sin(length(vPosition) * 5.0 - time * 2.0) * 0.5 + 0.5;
                    intensity *= wave * consciousness;
                    
                    vec3 color = vec3(0.0, 0.8, 1.0);
                    
                    gl_FragColor = vec4(color, intensity * 0.1);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        
        this.energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.scene.add(this.energyField);
        this.shaderMaterials.push(fieldMaterial);
    }
    
    async generateNeuralNetwork() {
        // 🕸️ DYNAMIC NEURAL NETWORK NODES
        const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.8
        });
        
        // Create thought nodes in 3D space
        for (let i = 0; i < this.visualizationParams.nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            
            // Distribute nodes in consciousness space
            const phi = Math.acos(-1 + (2 * i) / this.visualizationParams.nodeCount);
            const theta = Math.sqrt(this.visualizationParams.nodeCount * Math.PI) * phi;
            const radius = 1.2 + Math.random() * 0.8;
            
            node.position.x = radius * Math.cos(theta) * Math.sin(phi);
            node.position.y = radius * Math.sin(theta) * Math.sin(phi);
            node.position.z = radius * Math.cos(phi);
            
            // Node properties for animation
            node.userData = {
                originalPosition: node.position.clone(),
                activityLevel: Math.random(),
                pulsePhase: Math.random() * Math.PI * 2,
                connectionStrength: 0
            };
            
            this.thoughtNodes.push(node);
            this.scene.add(node);
        }
        
        // 🔗 NEURAL CONNECTIONS
        this.generateNeuralConnections();
    }
    
    generateNeuralConnections() {
        // Create connections between nearby nodes
        for (let i = 0; i < this.thoughtNodes.length; i++) {
            for (let j = i + 1; j < this.thoughtNodes.length; j++) {
                const distance = this.thoughtNodes[i].position.distanceTo(this.thoughtNodes[j].position);
                
                if (distance < 1.5 && Math.random() < this.visualizationParams.connectionDensity) {
                    const connection = this.createNeuralConnection(
                        this.thoughtNodes[i].position,
                        this.thoughtNodes[j].position
                    );
                    
                    this.thoughtConnections.push(connection);
                    this.scene.add(connection);
                }
            }
        }
    }
    
    createNeuralConnection(pos1, pos2) {
        const points = [pos1, pos2];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.2,
            linewidth: 1
        });
        
        const connection = new THREE.Line(geometry, material);
        connection.userData = {
            activity: 0,
            pulseDirection: Math.random() > 0.5 ? 1 : -1
        };
        
        return connection;
    }
    
    async setupThoughtParticles() {
        // 💫 THOUGHT FLOW PARTICLES
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = this.visualizationParams.particleCount;
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in consciousness space
            const radius = 0.5 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Thought particle colors
            const intensity = 0.5 + Math.random() * 0.5;
            colors[i3] = intensity;        // R
            colors[i3 + 1] = intensity * 0.8; // G
            colors[i3 + 2] = 1.0;         // B
            
            sizes[i] = 1 + Math.random() * 3;
            
            // Random velocities for organic movement
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                consciousness: { value: this.consciousnessLevel }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                uniform float consciousness;
                
                void main() {
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Consciousness-based size scaling
                    float finalSize = size * (0.5 + consciousness * 1.5);
                    finalSize *= (1.0 + sin(time * 3.0 + position.x * 10.0) * 0.3);
                    
                    gl_PointSize = finalSize;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    alpha *= 0.8;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        this.neuralParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.neuralParticles.userData.velocities = velocities;
        this.scene.add(this.neuralParticles);
        this.shaderMaterials.push(particleMaterial);
    }
    
    async createMemoryOrbs() {
        // 🔮 MEMORY VISUALIZATION ORBS
        for (let i = 0; i < 8; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.03, 8, 8);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.8, 0.7),
                transparent: true,
                opacity: 0.6
            });
            
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            
            // Position memory orbs around consciousness core
            const angle = (i / 8) * Math.PI * 2;
            const radius = 2.2 + Math.sin(i) * 0.3;
            orb.position.x = Math.cos(angle) * radius;
            orb.position.y = Math.sin(angle) * radius;
            orb.position.z = (Math.random() - 0.5) * 0.8;
            
            orb.userData = {
                originalAngle: angle,
                radius: radius,
                activityLevel: Math.random(),
                memoryType: ['episodic', 'semantic', 'procedural'][Math.floor(Math.random() * 3)]
            };
            
            this.memoryOrbs.push(orb);
            this.scene.add(orb);
        }
    }
    
    async initializeShaderEffects() {
        // Additional shader effects for enhanced consciousness visualization
        console.log('🎨 Consciousness shader effects initialized');
    }
    
    // 🔄 REAL-TIME UPDATE METHODS
    update(delta) {
        if (!this.scene || !this.renderer) return;
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update consciousness core
        this.updateConsciousnessCore(elapsedTime, delta);
        
        // Update neural network
        this.updateNeuralNetwork(elapsedTime, delta);
        
        // Update thought particles
        this.updateThoughtParticles(elapsedTime, delta);
        
        // Update memory orbs
        this.updateMemoryOrbs(elapsedTime, delta);
        
        // Update shader uniforms
        this.updateShaderUniforms(elapsedTime);
        
        // Render consciousness visualization
        this.renderer.render(this.scene, this.camera);
    }
    
    updateConsciousnessCore(time, delta) {
        if (!this.brainMesh) return;
        
        // Rotate consciousness core
        this.brainMesh.rotation.y += delta * 0.5;
        this.brainMesh.rotation.x += delta * 0.2;
        
        // Pulsing scale based on consciousness level
        const pulse = 1 + Math.sin(time * 2) * 0.1 * this.consciousnessLevel;
        this.brainMesh.scale.setScalar(pulse);
        
        // Update energy field
        if (this.energyField) {
            this.energyField.rotation.y -= delta * 0.3;
            this.energyField.rotation.z += delta * 0.1;
        }
    }
    
    updateNeuralNetwork(time, delta) {
        // Update thought nodes
        for (let i = 0; i < this.thoughtNodes.length; i++) {
            const node = this.thoughtNodes[i];
            if (!node) continue;
            
            // Breathing animation
            const breathe = 1 + Math.sin(time * 3 + node.userData.pulsePhase) * 0.3 * node.userData.activityLevel;
            node.scale.setScalar(breathe);
            
            // Activity-based color intensity
            const activity = 0.3 + node.userData.activityLevel * 0.7;
            node.material.opacity = activity * this.consciousnessLevel;
            
            // Subtle position floating
            const float_x = Math.sin(time * 1.5 + i) * 0.02;
            const float_y = Math.cos(time * 1.2 + i) * 0.02;
            node.position.copy(node.userData.originalPosition);
            node.position.x += float_x;
            node.position.y += float_y;
        }
        
        // Update neural connections
        for (const connection of this.thoughtConnections) {
            if (!connection) continue;
            
            // Pulse activity along connections
            connection.userData.activity += delta * 2;
            if (connection.userData.activity > 1) {
                connection.userData.activity = 0;
            }
            
            const opacity = 0.1 + connection.userData.activity * 0.3 * this.consciousnessLevel;
            connection.material.opacity = opacity;
        }
    }
    
    updateThoughtParticles(time, delta) {
        if (!this.neuralParticles) return;
        
        const positions = this.neuralParticles.geometry.attributes.position.array;
        const velocities = this.neuralParticles.userData.velocities;
        const colors = this.neuralParticles.geometry.attributes.color.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Update positions with organic movement
            positions[i] += velocities[i] * (1 + this.consciousnessLevel);
            positions[i + 1] += velocities[i + 1] * (1 + this.consciousnessLevel);
            positions[i + 2] += velocities[i + 2] * (1 + this.consciousnessLevel);
            
            // Gravitational pull toward consciousness core
            const distance = Math.sqrt(
                positions[i] * positions[i] + 
                positions[i + 1] * positions[i + 1] + 
                positions[i + 2] * positions[i + 2]
            );
            
            if (distance > 3) {
                // Reset particles that drift too far
                const radius = 0.5 + Math.random() * 1.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i + 2] = radius * Math.cos(phi);
            }
            
            // Update colors based on consciousness activity
            const intensity = 0.5 + this.consciousnessLevel * 0.5;
            colors[i] = intensity + Math.sin(time * 2 + i) * 0.2; // R
            colors[i + 1] = intensity * 0.8; // G
            colors[i + 2] = 1.0; // B
        }
        
        this.neuralParticles.geometry.attributes.position.needsUpdate = true;
        this.neuralParticles.geometry.attributes.color.needsUpdate = true;
    }
    
    updateMemoryOrbs(time, delta) {
        for (let i = 0; i < this.memoryOrbs.length; i++) {
            const orb = this.memoryOrbs[i];
            if (!orb) continue;
            
            // Orbital movement around consciousness core
            const currentAngle = orb.userData.originalAngle + time * 0.3;
            orb.position.x = Math.cos(currentAngle) * orb.userData.radius;
            orb.position.y = Math.sin(currentAngle) * orb.userData.radius;
            
            // Memory activity pulsing
            const activity = orb.userData.activityLevel;
            const pulse = 1 + Math.sin(time * 4 + i) * 0.4 * activity;
            orb.scale.setScalar(pulse);
            
            // Opacity based on memory activity and consciousness
            orb.material.opacity = 0.3 + activity * 0.5 * this.consciousnessLevel;
        }
    }
    
    updateShaderUniforms(time) {
        // Update all shader material uniforms
        for (const material of this.shaderMaterials) {
            if (material.uniforms) {
                if (material.uniforms.time) material.uniforms.time.value = time;
                if (material.uniforms.consciousness) material.uniforms.consciousness.value = this.consciousnessLevel;
                if (material.uniforms.consciousnessLevel) material.uniforms.consciousnessLevel.value = this.consciousnessLevel;
            }
        }
    }
    
    // 📊 CONSCIOUSNESS DATA INTEGRATION
    setLevel(level) {
        this.consciousnessLevel = Math.max(0, Math.min(1, level));
        
        // Update visualization parameters based on consciousness level
        this.visualizationParams.pulsationSpeed = 1.0 + this.consciousnessLevel * 2.0;
        this.visualizationParams.energyIntensity = 0.3 + this.consciousnessLevel * 0.7;
        this.visualizationParams.thoughtFlowSpeed = 0.5 + this.consciousnessLevel * 2.0;
    }
    
    updateThoughtActivity(activeThoughts) {
        this.activeThoughts = activeThoughts;
        
        // Increase node activity based on active thoughts
        const maxActivity = Math.min(this.thoughtNodes.length, activeThoughts);
        for (let i = 0; i < maxActivity; i++) {
            if (this.thoughtNodes[i]) {
                this.thoughtNodes[i].userData.activityLevel = Math.min(1.0, 0.5 + activeThoughts * 0.1);
            }
        }
    }
    
    updateMemoryActivity(memoryCount) {
        this.memoryActivity = memoryCount;
        
        // Update memory orb activity
        for (const orb of this.memoryOrbs) {
            if (orb && orb.userData) {
                orb.userData.activityLevel = Math.min(1.0, memoryCount / 100);
            }
        }
    }
    
    updateEmotionalState(emotion) {
        this.emotionalState = emotion;
        
        // Adjust colors based on emotional state
        const emotionColors = {
            'neutral': 0x00d4ff,
            'analytical_curiosity': 0x40e0d0,
            'engaged_enthusiasm': 0x00ff88,
            'empathetic_support': 0xff6b9d,
            'intellectual_confidence': 0x9d4edd
        };
        
        const emotionColor = new THREE.Color(emotionColors[emotion] || 0x00d4ff);
        
        // Update brain core color
        if (this.brainMesh && this.brainMesh.material.uniforms) {
            this.brainMesh.material.uniforms.color1.value = emotionColor;
        }
    }
    
    // 🎬 CONSCIOUSNESS EVENTS
    triggerThoughtPulse(thought) {
        // Create visual pulse for new thoughts
        const pulseGeometry = new THREE.RingGeometry(0.1, 0.5, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulse.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        );
        
        this.scene.add(pulse);
        this.thoughtPulses.push(pulse);
        
        // Animate pulse expansion and fade
        const startTime = this.clock.getElapsedTime();
        const animatePulse = () => {
            const elapsed = this.clock.getElapsedTime() - startTime;
            if (elapsed > 2) {
                this.scene.remove(pulse);
                const index = this.thoughtPulses.indexOf(pulse);
                if (index > -1) this.thoughtPulses.splice(index, 1);
                return;
            }
            
            const progress = elapsed / 2;
            pulse.scale.setScalar(1 + progress * 3);
            pulse.material.opacity = 0.8 * (1 - progress);
            
            requestAnimationFrame(animatePulse);
        };
        
        animatePulse();
    }
    
    triggerMemoryFormation(memory) {
        // Visual effect for memory formation
        console.log('🧠 Memory formation visualized:', memory);
        
        // Create new memory orb if needed
        if (this.memoryOrbs.length < 12) {
            const orbGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.7, 0.8, 0.8),
                transparent: true,
                opacity: 0.7
            });
            
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 2.0 + Math.random() * 0.5;
            orb.position.x = Math.cos(angle) * radius;
            orb.position.y = Math.sin(angle) * radius;
            orb.position.z = (Math.random() - 0.5) * 0.6;
            
            orb.userData = {
                originalAngle: angle,
                radius: radius,
                activityLevel: 1.0,
                memoryType: 'new'
            };
            
            this.memoryOrbs.push(orb);
            this.scene.add(orb);
        }
    }
    
    // 🎛️ VISUALIZATION CONTROLS
    setVisualizationMode(mode) {
        switch (mode) {
            case 'minimal':
                this.visualizationParams.nodeCount = 20;
                this.visualizationParams.particleCount = 50;
                break;
            case 'normal':
                this.visualizationParams.nodeCount = 50;
                this.visualizationParams.particleCount = 200;
                break;
            case 'enhanced':
                this.visualizationParams.nodeCount = 100;
                this.visualizationParams.particleCount = 500;
                break;
        }
        
        // Regenerate visualization with new parameters
        this.regenerateVisualization();
    }
    
    async regenerateVisualization() {
        // Clean up existing visualization
        this.cleanup();
        
        // Regenerate with new parameters
        await this.generateNeuralNetwork();
        await this.setupThoughtParticles();
    }
    
    cleanup() {
        // Clean up Three.js objects
        for (const node of this.thoughtNodes) {
            if (node) {
                this.scene.remove(node);
                node.geometry?.dispose();
                node.material?.dispose();
            }
        }
        
        for (const connection of this.thoughtConnections) {
            if (connection) {
                this.scene.remove(connection);
                connection.geometry?.dispose();
                connection.material?.dispose();
            }
        }
        
        if (this.neuralParticles) {
            this.scene.remove(this.neuralParticles);
            this.neuralParticles.geometry?.dispose();
            this.neuralParticles.material?.dispose();
        }
        
        for (const orb of this.memoryOrbs) {
            if (orb) {
                this.scene.remove(orb);
                orb.geometry?.dispose();
                orb.material?.dispose();
            }
        }
        
        // Clear arrays
        this.thoughtNodes = [];
        this.thoughtConnections = [];
        this.memoryOrbs = [];
        this.thoughtPulses = [];
    }
    
    destroy() {
        this.cleanup();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up shader materials
        for (const material of this.shaderMaterials) {
            material?.dispose();
        }
        
        console.log('🧠 Consciousness visualization destroyed');
    }
} 