// Neural Particle System for VERA Explorer
class NeuralParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                hue: Math.random() * 60 + 260, // Purple-pink range
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.y = particle.y < 0 ? 0 : this.canvas.height;
            }

            // Update pulse
            particle.pulsePhase += particle.pulseSpeed;
            particle.currentOpacity = particle.opacity + Math.sin(particle.pulsePhase) * 0.2;

            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
                particle.currentOpacity = Math.min(1, particle.opacity + force * 0.5);
            }

            // Limit velocity
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }

            // Apply friction
            particle.vx *= 0.995;
            particle.vy *= 0.995;
        });
    }

    findConnections() {
        this.connections = [];
        const maxDistance = 120;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.connections.push({
                        particle1: this.particles[i],
                        particle2: this.particles[j],
                        distance: distance,
                        opacity: (maxDistance - distance) / maxDistance
                    });
                }
            }
        }
    }

    draw() {
        // Clear canvas with subtle background
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw enhanced connections with therapeutic states
        this.connections.forEach(connection => {
            const p1 = connection.particle1;
            const p2 = connection.particle2;
            const baseOpacity = connection.opacity * 0.3;
            
            // Dynamic connection styling based on particle states
            let connectionHue = 270; // Default purple
            let connectionSaturation = 70;
            let connectionLightness = 60;
            let lineWidth = 0.5;
            let finalOpacity = baseOpacity;
            
            if ((p1.coherenceActive && p2.coherenceActive)) {
                connectionHue = 270; // Purple for coherence
                lineWidth = 1;
                connectionSaturation = 80;
                finalOpacity = baseOpacity * 1.5;
            } else if (p1.activationActive || p2.activationActive) {
                connectionHue = 15; // Orange for activation
                lineWidth = 0.8;
                connectionSaturation = 90;
                connectionLightness = 70;
                finalOpacity = baseOpacity * 1.2;
            } else if (p1.regulationActive || p2.regulationActive) {
                connectionHue = 180; // Blue-green for regulation
                lineWidth = 0.7;
                connectionSaturation = 60;
                connectionLightness = 50;
                finalOpacity = baseOpacity * 1.1;
            }
            
            this.ctx.strokeStyle = `hsla(${connectionHue}, ${connectionSaturation}%, ${connectionLightness}%, ${finalOpacity})`;
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.particle1.x, connection.particle1.y);
            this.ctx.lineTo(connection.particle2.x, connection.particle2.y);
            this.ctx.stroke();
        });

        // Draw particles
        this.particles.forEach(particle => {
            // Outer glow
            const glowSize = particle.size * 3;
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.currentOpacity * 0.3})`);
            gradient.addColorStop(1, 'hsla(270, 70%, 60%, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Core particle
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.currentOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.findConnections();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
    }

    // Method to increase activity during interactions
    energize(x, y, intensity = 1) {
        this.particles.forEach(particle => {
            const dx = x - particle.x;
            const dy = y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150 * intensity;
                particle.vx += (Math.random() - 0.5) * force * 0.5;
                particle.vy += (Math.random() - 0.5) * force * 0.5;
                particle.opacity = Math.min(1, particle.opacity + force * 0.3);
            }
        });
    }

    // Method to create calm, flowing patterns
    regulate() {
        this.particles.forEach(particle => {
            // Gentle, rhythmic movement
            particle.vx += Math.sin(Date.now() * 0.001 + particle.pulsePhase) * 0.01;
            particle.vy += Math.cos(Date.now() * 0.001 + particle.pulsePhase) * 0.01;
            
            // Synchronized pulsing for regulation effect
            particle.pulseSpeed = 0.02; // Synchronized breathing rhythm
        });
    }

    // Advanced therapeutic effects
    coherenceMode() {
        this.particles.forEach((particle, index) => {
            // Synchronized pulsing for coherence
            const phase = (index / this.particles.length) * Math.PI * 2;
            particle.coherencePhase = phase;
            particle.coherenceActive = true;
            particle.activationActive = false;
            particle.regulationActive = false;
        });
    }

    activationMode() {
        this.particles.forEach(particle => {
            // Rapid, chaotic movement for activation states
            particle.vx *= 1.8;
            particle.vy *= 1.8;
            particle.energy = 0.9;
            particle.activationActive = true;
            particle.coherenceActive = false;
            particle.regulationActive = false;
        });
    }

    regulationMode() {
        this.particles.forEach(particle => {
            // Slow, flowing movement for regulation
            particle.vx *= 0.6;
            particle.vy *= 0.6;
            particle.energy = 0.4;
            particle.regulationActive = true;
            particle.activationActive = false;
            particle.coherenceActive = false;
        });
    }

    // Enhanced bioluminescent effects for different therapeutic states
    updateBioluminescence() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particle, index) => {
            if (particle.coherenceActive) {
                // Coherent breathing - synchronized glow
                const coherentGlow = 0.5 + 0.5 * Math.sin(time * 0.5 + particle.coherencePhase);
                particle.glowIntensity = coherentGlow;
                particle.hue = 270; // Purple for coherence
                particle.saturation = 70;
                particle.lightness = 60;
            } else if (particle.activationActive) {
                // Activation - rapid, bright flashing
                particle.glowIntensity = 0.8 + 0.2 * Math.sin(time * 8 + index);
                particle.hue = 15; // Orange for activation
                particle.saturation = 90;
                particle.lightness = 70;
            } else if (particle.regulationActive) {
                // Regulation - gentle, steady glow
                particle.glowIntensity = 0.3 + 0.2 * Math.sin(time * 0.2 + index * 0.1);
                particle.hue = 180; // Blue-green for regulation
                particle.saturation = 60;
                particle.lightness = 50;
            } else {
                // Default state - soft neural purple
                particle.glowIntensity = 0.6 + 0.1 * Math.sin(time + index * 0.5);
                particle.hue = 270;
                particle.saturation = 60;
                particle.lightness = 60;
            }
        });
    }

    // Neural icon replacement system
    createNeuralIcon(type, containerElement) {
        const rect = containerElement.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top + rect.height / 2;
        
        const iconParticles = [];
        const patterns = {
            'breathing': () => {
                // Circular breathing pattern
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = 15;
                    const particle = this.createParticle();
                    particle.x = x + Math.cos(angle) * radius;
                    particle.y = y + Math.sin(angle) * radius;
                    particle.vx = Math.cos(angle) * 0.3;
                    particle.vy = Math.sin(angle) * 0.3;
                    particle.energy = 0.8;
                    particle.breathingPhase = i * Math.PI / 4;
                    particle.isIcon = true;
                    particle.iconType = 'breathing';
                    particle.hue = 200; // Light blue for breathing
                    iconParticles.push(particle);
                }
            },
            'grounding': () => {
                // Downward flowing pattern like roots
                for (let i = 0; i < 6; i++) {
                    const particle = this.createParticle();
                    particle.x = x + (i - 2.5) * 6;
                    particle.y = y + i * 4;
                    particle.vx = 0;
                    particle.vy = 0.2;
                    particle.energy = 0.6;
                    particle.groundingDepth = i;
                    particle.isIcon = true;
                    particle.iconType = 'grounding';
                    particle.hue = 120; // Green for grounding
                    iconParticles.push(particle);
                }
            },
            'journal': () => {
                // Writing pattern - flowing lines
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 5; j++) {
                        const particle = this.createParticle();
                        particle.x = x - 12 + j * 6;
                        particle.y = y - 8 + i * 4;
                        particle.vx = (Math.random() - 0.5) * 0.1;
                        particle.vy = 0;
                        particle.energy = 0.7;
                        particle.journalLine = i;
                        particle.isIcon = true;
                        particle.iconType = 'journal';
                        particle.hue = 300; // Purple for journaling
                        iconParticles.push(particle);
                    }
                }
            },
            'chat': () => {
                // Speech bubble pattern
                const bubblePoints = [
                    {x: -12, y: -8}, {x: 12, y: -8},
                    {x: 12, y: 4}, {x: 0, y: 12}, {x: -12, y: 4}
                ];
                bubblePoints.forEach((point, i) => {
                    const particle = this.createParticle();
                    particle.x = x + point.x;
                    particle.y = y + point.y;
                    particle.vx = 0;
                    particle.vy = 0;
                    particle.energy = 0.8;
                    particle.chatPulse = i * Math.PI / 3;
                    particle.isIcon = true;
                    particle.iconType = 'chat';
                    particle.hue = 45; // Gold for chat
                    iconParticles.push(particle);
                });
            }
        };

        if (patterns[type]) {
            patterns[type]();
            // Add icon particles to main particle system
            this.particles.push(...iconParticles);
            
            // Remove icon particles after animation
            setTimeout(() => {
                iconParticles.forEach(iconParticle => {
                    const index = this.particles.indexOf(iconParticle);
                    if (index > -1) {
                        this.particles.splice(index, 1);
                    }
                });
            }, 3000);
        }
    }

    // Enhanced draw method with bioluminescence
    drawParticle(particle) {
        const time = Date.now() * 0.001;
        
        // Update bioluminescence
        if (!particle.hue) particle.hue = 270; // Default purple
        if (!particle.saturation) particle.saturation = 60;
        if (!particle.lightness) particle.lightness = 60;
        if (!particle.glowIntensity) particle.glowIntensity = 0.6;
        
        // Calculate dynamic color based on state
        let finalHue = particle.hue;
        let finalSaturation = particle.saturation;
        let finalLightness = particle.lightness + (particle.glowIntensity * 20);
        
        // Special icon animations
        if (particle.isIcon) {
            switch (particle.iconType) {
                case 'breathing':
                    const breathGlow = 0.5 + 0.5 * Math.sin(time * 2 + particle.breathingPhase);
                    finalLightness = 50 + breathGlow * 30;
                    break;
                case 'grounding':
                    finalLightness = 40 + particle.groundingDepth * 5;
                    break;
                case 'journal':
                    const writeGlow = 0.7 + 0.3 * Math.sin(time * 0.5 + particle.journalLine);
                    finalLightness = 45 + writeGlow * 25;
                    break;
                case 'chat':
                    const chatGlow = 0.6 + 0.4 * Math.sin(time * 3 + particle.chatPulse);
                    finalLightness = 55 + chatGlow * 25;
                    break;
            }
        }
        
        // Draw particle with glow effect
        const radius = particle.size || 2;
        const opacity = particle.opacity || 0.8;
        
        // Outer glow
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${finalHue}, ${finalSaturation}%, ${finalLightness}%, ${opacity * 0.2})`;
        this.ctx.fill();
        
        // Inner particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${finalHue}, ${finalSaturation}%, ${finalLightness}%, ${opacity})`;
        this.ctx.fill();
    }
}

// Initialize neural particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const neuralSystem = new NeuralParticleSystem('neuralCanvas');
    
    // Expose to global scope for interaction with other app functions
    window.neuralSystem = neuralSystem;
    
    // Add regulation effect during breathing exercises
    window.startRegulationEffect = function() {
        setInterval(() => {
            neuralSystem.regulate();
        }, 100);
    };
    
    // Add energize effect for interactions
    window.energizeNeural = function(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        neuralSystem.energize(x, y, 0.5);
    };
    
    // Enhanced therapeutic state functions
    window.setNeuralCoherence = function() {
        if (neuralSystem) neuralSystem.coherenceMode();
    };
    
    window.setNeuralActivation = function() {
        if (neuralSystem) neuralSystem.activationMode();
    };
    
    window.setNeuralRegulation = function() {
        if (neuralSystem) neuralSystem.regulationMode();
    };
    
    // Neural icon replacement functions
    window.createNeuralIcon = function(type, element) {
        if (neuralSystem && element) {
            neuralSystem.createNeuralIcon(type, element);
        }
    };
    
    // Breathing exercise integration
    window.startBreathingAnimation = function() {
        if (neuralSystem) {
            neuralSystem.coherenceMode();
            // Create breathing rhythm particles
            setInterval(() => {
                neuralSystem.particles.forEach(particle => {
                    if (!particle.breathingSync) {
                        particle.breathingSync = true;
                        particle.breathingPhase = Math.random() * Math.PI * 2;
                    }
                    
                    const breathingGlow = 0.4 + 0.6 * Math.sin(Date.now() * 0.001 + particle.breathingPhase);
                    particle.glowIntensity = breathingGlow;
                });
            }, 50);
        }
    };
    
    // Reset to default state
    window.resetNeuralState = function() {
        if (neuralSystem) {
            neuralSystem.particles.forEach(particle => {
                particle.coherenceActive = false;
                particle.activationActive = false;
                particle.regulationActive = false;
                particle.breathingSync = false;
            });
        }
    };
});