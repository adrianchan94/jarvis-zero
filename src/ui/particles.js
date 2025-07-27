import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particleSystems = [];
        this.currentMode = 'idle';
        this.currentEmotion = 'neutral';
        
        // Particle configurations
        this.configs = {
            ambient: {
                count: 1000,
                spread: 10,
                speed: 0.5,
                size: 0.05,
                opacity: 0.6
            },
            listening: {
                count: 2000,
                spread: 8,
                speed: 2.0,
                size: 0.08,
                opacity: 0.8
            },
            thinking: {
                count: 1500,
                spread: 15,
                speed: 1.0,
                size: 0.06,
                opacity: 0.7
            },
            speaking: {
                count: 3000,
                spread: 12,
                speed: 3.0,
                size: 0.1,
                opacity: 0.9
            }
        };
        
        // Emotion colors
        this.emotionColors = {
            neutral: new THREE.Color(0x00d4ff),
            happy: new THREE.Color(0x00ff80),
            excited: new THREE.Color(0xff8000),
            focused: new THREE.Color(0x8000ff),
            curious: new THREE.Color(0xffff00),
            thinking: new THREE.Color(0x00ffff),
            speaking: new THREE.Color(0xff0080)
        };
    }
    
    async init() {
        this.createAmbientParticles();
        this.createDataParticles();
        this.createEnergyField();
        
        console.log('✨ Particle system initialized');
    }
    
    createAmbientParticles() {
        const config = this.configs.ambient;
        const geometry = new THREE.BufferGeometry();
        
        // Create positions
        const positions = new Float32Array(config.count * 3);
        const colors = new Float32Array(config.count * 3);
        const sizes = new Float32Array(config.count);
        const velocities = new Float32Array(config.count * 3);
        
        for (let i = 0; i < config.count; i++) {
            const i3 = i * 3;
            
            // Random positions in sphere
            const radius = config.spread * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Colors
            const color = this.emotionColors.neutral;
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = config.size * (0.5 + Math.random() * 0.5);
            
            // Velocities
            velocities[i3] = (Math.random() - 0.5) * config.speed;
            velocities[i3 + 1] = (Math.random() - 0.5) * config.speed;
            velocities[i3 + 2] = (Math.random() - 0.5) * config.speed;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                opacity: { value: config.opacity }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x * 10.0) * 0.2);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform float opacity;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, alpha * opacity);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            type: 'ambient',
            velocities: velocities,
            originalPositions: positions.slice(),
            config: config
        };
        
        this.particleSystems.push(particles);
        this.scene.add(particles);
    }
    
    createDataParticles() {
        // Create flowing data streams
        const streamCount = 6;
        
        for (let s = 0; s < streamCount; s++) {
            const particleCount = 200;
            const geometry = new THREE.BufferGeometry();
            
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const t = i / particleCount;
                
                // Create spiral stream
                const radius = 3 + s * 0.5;
                const angle = t * Math.PI * 8 + (s / streamCount) * Math.PI * 2;
                const height = 6;
                
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = (t - 0.5) * height;
                positions[i3 + 2] = Math.sin(angle) * radius;
                
                // Colors
                const color = this.emotionColors.neutral;
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                // Sizes
                sizes[i] = 0.03 * (1 - t * 0.5);
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    opacity: { value: 0.7 },
                    streamOffset: { value: s }
                },
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    uniform float time;
                    uniform float streamOffset;
                    
                    void main() {
                        vColor = color;
                        vec3 pos = position;
                        pos.y += sin(time * 2.0 + streamOffset) * 0.5;
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    uniform float opacity;
                    
                    void main() {
                        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                        float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                        gl_FragColor = vec4(vColor, alpha * opacity);
                    }
                `,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const dataStream = new THREE.Points(geometry, material);
            dataStream.userData = {
                type: 'dataStream',
                streamIndex: s,
                originalPositions: positions.slice()
            };
            
            this.particleSystems.push(dataStream);
            this.scene.add(dataStream);
        }
    }
    
    createEnergyField() {
        const fieldCount = 500;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(fieldCount * 3);
        const colors = new Float32Array(fieldCount * 3);
        const sizes = new Float32Array(fieldCount);
        
        for (let i = 0; i < fieldCount; i++) {
            const i3 = i * 3;
            
            // Create energy field around the hologram
            const radius = 1 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Colors
            const color = this.emotionColors.neutral;
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = 0.02 + Math.random() * 0.03;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                opacity: { value: 0.4 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    float wave = sin(time + length(position) * 2.0) * 0.1;
                    pos *= 1.0 + wave;
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform float opacity;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, alpha * opacity);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const energyField = new THREE.Points(geometry, material);
        energyField.userData = {
            type: 'energyField',
            originalPositions: positions.slice()
        };
        
        this.particleSystems.push(energyField);
        this.scene.add(energyField);
    }
    
    update(delta, elapsedTime) {
        this.particleSystems.forEach((system) => {
            const material = system.material;
            
            // Update time uniform
            if (material.uniforms && material.uniforms.time) {
                material.uniforms.time.value = elapsedTime;
            }
            
            // Update based on system type
            switch (system.userData.type) {
                case 'ambient':
                    this.updateAmbientParticles(system, delta, elapsedTime);
                    break;
                case 'dataStream':
                    this.updateDataStream(system, delta, elapsedTime);
                    break;
                case 'energyField':
                    this.updateEnergyField(system, delta, elapsedTime);
                    break;
            }
        });
    }
    
    updateAmbientParticles(system, delta, elapsedTime) {
        const positions = system.geometry.attributes.position;
        const velocities = system.userData.velocities;
        const originalPositions = system.userData.originalPositions;
        
        for (let i = 0; i < positions.count; i++) {
            const i3 = i * 3;
            
            // Apply brownian motion
            velocities[i3] += (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] += (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] += (Math.random() - 0.5) * 0.02;
            
            // Apply velocity damping
            velocities[i3] *= 0.99;
            velocities[i3 + 1] *= 0.99;
            velocities[i3 + 2] *= 0.99;
            
            // Update positions
            positions.array[i3] += velocities[i3] * delta;
            positions.array[i3 + 1] += velocities[i3 + 1] * delta;
            positions.array[i3 + 2] += velocities[i3 + 2] * delta;
            
            // Boundary check and reset
            const distance = Math.sqrt(
                positions.array[i3] ** 2 +
                positions.array[i3 + 1] ** 2 +
                positions.array[i3 + 2] ** 2
            );
            
            if (distance > 15) {
                positions.array[i3] = originalPositions[i3];
                positions.array[i3 + 1] = originalPositions[i3 + 1];
                positions.array[i3 + 2] = originalPositions[i3 + 2];
            }
        }
        
        positions.needsUpdate = true;
    }
    
    updateDataStream(system, delta, elapsedTime) {
        const positions = system.geometry.attributes.position;
        const streamIndex = system.userData.streamIndex;
        
        // Animate the data stream flow
        for (let i = 0; i < positions.count; i++) {
            const i3 = i * 3;
            const t = i / positions.count;
            
            const radius = 3 + streamIndex * 0.5;
            const angle = t * Math.PI * 8 + (streamIndex / 6) * Math.PI * 2 + elapsedTime * 0.5;
            const height = 6;
            
            positions.array[i3] = Math.cos(angle) * radius;
            positions.array[i3 + 1] = (t - 0.5) * height + Math.sin(elapsedTime * 2 + streamIndex) * 0.5;
            positions.array[i3 + 2] = Math.sin(angle) * radius;
        }
        
        positions.needsUpdate = true;
    }
    
    updateEnergyField(system, delta, elapsedTime) {
        // Energy field particles pulse and wave
        const material = system.material;
        if (material.uniforms.opacity) {
            material.uniforms.opacity.value = 0.4 + Math.sin(elapsedTime * 3) * 0.2;
        }
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Adjust particle behavior based on mode
        this.particleSystems.forEach((system) => {
            const material = system.material;
            
            switch (mode) {
                case 'listening':
                    if (material.uniforms.opacity) {
                        material.uniforms.opacity.value = 0.9;
                    }
                    break;
                case 'thinking':
                    if (material.uniforms.opacity) {
                        material.uniforms.opacity.value = 0.7;
                    }
                    break;
                case 'speaking':
                    if (material.uniforms.opacity) {
                        material.uniforms.opacity.value = 1.0;
                    }
                    break;
                default:
                    if (material.uniforms.opacity) {
                        material.uniforms.opacity.value = 0.6;
                    }
            }
        });
    }
    
    setEmotion(emotion) {
        this.currentEmotion = emotion;
        const color = this.emotionColors[emotion] || this.emotionColors.neutral;
        
        // Update all particle colors
        this.particleSystems.forEach((system) => {
            const colors = system.geometry.attributes.color;
            
            for (let i = 0; i < colors.count; i++) {
                const i3 = i * 3;
                colors.array[i3] = color.r;
                colors.array[i3 + 1] = color.g;
                colors.array[i3 + 2] = color.b;
            }
            
            colors.needsUpdate = true;
        });
    }
    
    destroy() {
        this.particleSystems.forEach((system) => {
            this.scene.remove(system);
            system.geometry.dispose();
            system.material.dispose();
        });
        
        this.particleSystems = [];
    }
} 