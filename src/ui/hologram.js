import * as THREE from 'three';

export class HologramRenderer {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.centralCore = null;
        this.orbitalRings = [];
        this.dataStreams = [];
        this.emotion = 'neutral';
        
        // Animation parameters
        this.rotationSpeed = 0.01;
        this.pulseIntensity = 1.0;
        this.colorIntensity = 1.0;
        
        // Colors for different emotions
        this.emotionColors = {
            neutral: 0x00d4ff,
            happy: 0x00ff80,
            excited: 0xff8000,
            focused: 0x8000ff,
            curious: 0xffff00,
            thinking: 0x00ffff,
            speaking: 0xff0080
        };
    }
    
    async init() {
        this.createCentralCore();
        this.createOrbitalRings();
        this.createDataStreams();
        this.createHolographicText();
        
        this.scene.add(this.group);
        console.log('🔮 Hologram renderer initialized');
    }
    
    createCentralCore() {
        // Central energy core
        const coreGeometry = new THREE.IcosahedronGeometry(0.5, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: this.emotionColors.neutral,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.centralCore = new THREE.Mesh(coreGeometry, coreMaterial);
        this.group.add(this.centralCore);
        
        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.emotionColors.neutral,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        this.innerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.group.add(this.innerGlow);
    }
    
    createOrbitalRings() {
        const ringCount = 3;
        
        for (let i = 0; i < ringCount; i++) {
            const radius = 1.5 + i * 0.8;
            const segments = 64;
            
            // Create ring geometry
            const ringGeometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, segments);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: this.emotionColors.neutral,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            
            // Random rotation for each ring
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.rotation.z = Math.random() * Math.PI;
            
            // Store rotation speeds
            ring.userData = {
                rotationSpeedX: (Math.random() - 0.5) * 0.02,
                rotationSpeedY: (Math.random() - 0.5) * 0.02,
                rotationSpeedZ: (Math.random() - 0.5) * 0.02
            };
            
            this.orbitalRings.push(ring);
            this.group.add(ring);
        }
    }
    
    createDataStreams() {
        const streamCount = 8;
        
        for (let i = 0; i < streamCount; i++) {
            const points = [];
            const radius = 2 + Math.random() * 2;
            const height = 4;
            
            // Create spiral data stream
            for (let j = 0; j <= 50; j++) {
                const t = j / 50;
                const angle = t * Math.PI * 4 + (i / streamCount) * Math.PI * 2;
                const x = Math.cos(angle) * radius * (1 - t * 0.5);
                const z = Math.sin(angle) * radius * (1 - t * 0.5);
                const y = (t - 0.5) * height;
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const streamGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const streamMaterial = new THREE.LineBasicMaterial({
                color: this.emotionColors.neutral,
                transparent: true,
                opacity: 0.4
            });
            
            const stream = new THREE.Line(streamGeometry, streamMaterial);
            stream.userData = {
                originalPoints: points,
                phase: Math.random() * Math.PI * 2
            };
            
            this.dataStreams.push(stream);
            this.group.add(stream);
        }
    }
    
    createHolographicText() {
        // This would require a font loader in a full implementation
        // For now, we'll create geometric text representations
        const textGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: this.emotionColors.neutral,
            transparent: true,
            opacity: 0.7
        });
        
        // Create floating text elements around the hologram
        for (let i = 0; i < 16; i++) {
            const textElement = new THREE.Mesh(textGeometry, textMaterial.clone());
            
            const angle = (i / 16) * Math.PI * 2;
            const radius = 5;
            textElement.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 6,
                Math.sin(angle) * radius
            );
            
            textElement.userData = {
                originalPosition: textElement.position.clone(),
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatPhase: Math.random() * Math.PI * 2
            };
            
            this.group.add(textElement);
        }
    }
    
    update(delta, elapsedTime) {
        // Rotate central core
        if (this.centralCore) {
            this.centralCore.rotation.x += delta * this.rotationSpeed * 2;
            this.centralCore.rotation.y += delta * this.rotationSpeed * 3;
            this.centralCore.rotation.z += delta * this.rotationSpeed;
            
            // Pulse effect
            const pulse = 1 + Math.sin(elapsedTime * 3) * 0.1 * this.pulseIntensity;
            this.centralCore.scale.setScalar(pulse);
        }
        
        // Update inner glow
        if (this.innerGlow) {
            this.innerGlow.rotation.x -= delta * this.rotationSpeed;
            this.innerGlow.rotation.y += delta * this.rotationSpeed * 2;
            
            const glowPulse = 1 + Math.sin(elapsedTime * 4) * 0.2 * this.pulseIntensity;
            this.innerGlow.scale.setScalar(glowPulse);
        }
        
        // Update orbital rings
        this.orbitalRings.forEach((ring) => {
            ring.rotation.x += delta * ring.userData.rotationSpeedX;
            ring.rotation.y += delta * ring.userData.rotationSpeedY;
            ring.rotation.z += delta * ring.userData.rotationSpeedZ;
        });
        
        // Update data streams
        this.dataStreams.forEach((stream, index) => {
            const points = stream.userData.originalPoints.map((point, i) => {
                const offset = Math.sin(elapsedTime * 2 + stream.userData.phase + i * 0.1) * 0.1;
                return new THREE.Vector3(
                    point.x + offset,
                    point.y,
                    point.z + offset
                );
            });
            
            stream.geometry.setFromPoints(points);
            
            // Animate opacity
            const opacity = 0.4 + Math.sin(elapsedTime * 3 + index) * 0.2;
            stream.material.opacity = opacity * this.colorIntensity;
        });
        
        // Update floating text elements
        this.group.children.forEach((child) => {
            if (child.userData.floatSpeed) {
                child.position.y = child.userData.originalPosition.y + 
                    Math.sin(elapsedTime * child.userData.floatSpeed + child.userData.floatPhase) * 0.5;
            }
        });
        
        // Overall group rotation for dynamic effect
        this.group.rotation.y += delta * 0.1;
    }
    
    setEmotion(emotion) {
        this.emotion = emotion;
        const color = this.emotionColors[emotion] || this.emotionColors.neutral;
        
        // Update central core color
        if (this.centralCore) {
            this.centralCore.material.color.setHex(color);
        }
        
        if (this.innerGlow) {
            this.innerGlow.material.color.setHex(color);
        }
        
        // Update rings
        this.orbitalRings.forEach((ring) => {
            ring.material.color.setHex(color);
        });
        
        // Update data streams
        this.dataStreams.forEach((stream) => {
            stream.material.color.setHex(color);
        });
        
        // Adjust animation parameters based on emotion
        switch (emotion) {
            case 'excited':
                this.rotationSpeed = 0.03;
                this.pulseIntensity = 2.0;
                this.colorIntensity = 1.5;
                break;
            case 'focused':
                this.rotationSpeed = 0.005;
                this.pulseIntensity = 0.5;
                this.colorIntensity = 1.2;
                break;
            case 'thinking':
                this.rotationSpeed = 0.02;
                this.pulseIntensity = 1.5;
                this.colorIntensity = 1.0;
                break;
            case 'speaking':
                this.rotationSpeed = 0.025;
                this.pulseIntensity = 3.0;
                this.colorIntensity = 1.8;
                break;
            default:
                this.rotationSpeed = 0.01;
                this.pulseIntensity = 1.0;
                this.colorIntensity = 1.0;
        }
    }
    
    setPulseIntensity(intensity) {
        this.pulseIntensity = Math.max(0, Math.min(3, intensity));
    }
    
    setRotationSpeed(speed) {
        this.rotationSpeed = Math.max(0, Math.min(0.1, speed));
    }
    
    destroy() {
        this.scene.remove(this.group);
        
        // Dispose of geometries and materials
        this.group.traverse((child) => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
} 