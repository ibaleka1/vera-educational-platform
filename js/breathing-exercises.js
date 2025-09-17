// VERA Interactive Breathing Exercises
class VERABreathingExercises {
    constructor() {
        this.currentExercise = null;
        this.isPlaying = false;
        this.currentPhase = 'inhale';
        this.cycleCount = 0;
        this.totalCycles = 0;
        this.breathTimer = null;
        this.visualAnimation = null;
        
        // Breathing exercise configurations
        this.exercises = {
            box: {
                name: 'Box Breathing',
                description: 'Navy SEAL technique for instant calm and focus',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
                    { name: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
                    { name: 'Exhale', duration: 4, instruction: 'Breathe out slowly through your mouth' },
                    { name: 'Hold', duration: 4, instruction: 'Hold empty, stay relaxed' }
                ],
                totalCycles: 8,
                benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
                difficulty: 'Beginner'
            },
            physiological: {
                name: 'Physiological Sigh',
                description: 'Huberman Lab\'s rapid stress relief technique',
                phases: [
                    { name: 'Inhale', duration: 2, instruction: 'First inhale through nose' },
                    { name: 'Double Inhale', duration: 1, instruction: 'Second smaller inhale' },
                    { name: 'Long Exhale', duration: 6, instruction: 'Long, slow exhale through mouth' }
                ],
                totalCycles: 3,
                benefits: ['Instant calm', 'Stress relief', 'Nervous system reset'],
                difficulty: 'Beginner'
            },
            coherent: {
                name: 'Coherent Breathing',
                description: 'Heart Rate Variability optimization',
                phases: [
                    { name: 'Inhale', duration: 5, instruction: 'Smooth inhale through nose' },
                    { name: 'Exhale', duration: 5, instruction: 'Smooth exhale through nose' }
                ],
                totalCycles: 12,
                benefits: ['Heart coherence', 'Emotional balance', 'Sustained calm'],
                difficulty: 'Intermediate'
            },
            voo: {
                name: 'Voo Breath',
                description: 'Polyvagal therapy for trauma release',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Deep inhale through nose' },
                    { name: 'Voo Sound', duration: 8, instruction: 'Exhale with "Vooooo" sound' }
                ],
                totalCycles: 6,
                benefits: ['Trauma release', 'Vagal tone', 'Deep healing'],
                difficulty: 'Advanced'
            },
            fourSevenEight: {
                name: '4-7-8 Breathing',
                description: 'Dr. Weil\'s natural tranquilizer',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Inhale through nose for 4' },
                    { name: 'Hold', duration: 7, instruction: 'Hold breath for 7' },
                    { name: 'Exhale', duration: 8, instruction: 'Exhale through mouth for 8' }
                ],
                totalCycles: 4,
                benefits: ['Deep relaxation', 'Sleep aid', 'Anxiety relief'],
                difficulty: 'Intermediate'
            }
        };
        
        this.init();
    }

    init() {
        this.setupBreathingInterface();
        this.createVisualGuides();
        this.setupVoiceGuidance();
    }

    setupBreathingInterface() {
        // This will be called when breathing section is loaded
        const breathingSection = document.getElementById('breathing-section');
        if (!breathingSection) return;

        // Create breathing exercises menu if it doesn't exist
        if (!document.getElementById('breathingExercises')) {
            this.createBreathingMenu();
        }
    }

    createBreathingMenu() {
        const breathingSection = document.getElementById('breathing-section');
        if (!breathingSection) return;

        const menuHTML = `
            <div id="breathingExercises" class="breathing-exercises">
                <div class="breathing-header">
                    <h2>Breathing Exercises</h2>
                    <p class="breathing-subtitle">Choose your regulation technique</p>
                </div>

                <div class="exercises-grid">
                    ${Object.entries(this.exercises).map(([key, exercise]) => `
                        <div class="exercise-card" data-exercise="${key}">
                            <div class="exercise-neural" data-icon-type="breathing"></div>
                            <h3>${exercise.name}</h3>
                            <p class="exercise-description">${exercise.description}</p>
                            <div class="exercise-details">
                                <span class="difficulty ${exercise.difficulty.toLowerCase()}">${exercise.difficulty}</span>
                                <span class="cycles">${exercise.totalCycles} cycles</span>
                            </div>
                            <ul class="benefits-list">
                                ${exercise.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                            <button class="start-exercise-btn" onclick="breathingSystem.startExercise('${key}')">
                                Start Exercise
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Exercise Player Interface -->
                <div id="breathingPlayer" class="breathing-player" style="display: none;">
                    <div class="player-header">
                        <button class="back-btn" onclick="breathingSystem.stopExercise()">← Back</button>
                        <h3 id="exerciseTitle">Box Breathing</h3>
                        <div class="exercise-progress">
                            <span id="currentCycle">1</span> / <span id="totalCycles">8</span>
                        </div>
                    </div>

                    <div class="breathing-visual">
                        <div id="breathingCircle" class="breathing-circle">
                            <div class="breathing-center">
                                <span id="breathingPhase">Inhale</span>
                                <div id="breathingCount" class="breathing-count">4</div>
                            </div>
                        </div>
                    </div>

                    <div class="breathing-instruction">
                        <p id="breathingInstruction">Breathe in slowly through your nose</p>
                    </div>

                    <div class="breathing-controls">
                        <button id="pauseBtn" class="control-btn" onclick="breathingSystem.togglePause()">
                            <span id="pauseText">Pause</span>
                        </button>
                        <button class="control-btn" onclick="breathingSystem.stopExercise()">
                            Stop
                        </button>
                    </div>

                    <div class="breathing-neural-bg" id="breathingNeuralBg"></div>
                </div>
            </div>
        `;

        breathingSection.innerHTML = menuHTML;
        this.setupExerciseCardListeners();
    }

    setupExerciseCardListeners() {
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('start-exercise-btn')) {
                    const exerciseKey = card.getAttribute('data-exercise');
                    this.previewExercise(exerciseKey);
                }
            });
        });
    }

    previewExercise(exerciseKey) {
        const exercise = this.exercises[exerciseKey];
        if (!exercise) return;

        // Highlight selected exercise
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-exercise="${exerciseKey}"]`).classList.add('selected');

        // Create neural particle preview
        if (window.createNeuralIcon) {
            const card = document.querySelector(`[data-exercise="${exerciseKey}"]`);
            window.createNeuralIcon('breathing', card);
        }

        // Set neural state for breathing
        if (window.setNeuralCoherence) {
            window.setNeuralCoherence();
        }
    }

    startExercise(exerciseKey) {
        const exercise = this.exercises[exerciseKey];
        if (!exercise) return;

        this.currentExercise = exercise;
        this.cycleCount = 0;
        this.totalCycles = exercise.totalCycles;
        this.currentPhase = exercise.phases[0].name;

        // Show player interface
        document.querySelector('.exercises-grid').style.display = 'none';
        document.querySelector('.breathing-header').style.display = 'none';
        document.getElementById('breathingPlayer').style.display = 'block';

        // Update player UI
        document.getElementById('exerciseTitle').textContent = exercise.name;
        document.getElementById('totalCycles').textContent = exercise.totalCycles;
        document.getElementById('currentCycle').textContent = '1';

        // Start neural breathing animation
        if (window.startBreathingAnimation) {
            window.startBreathingAnimation();
        }

        // Start the breathing cycle
        this.startBreathingCycle();
        this.isPlaying = true;

        // Start voice guidance if available
        this.startVoiceGuidance();
    }

    startBreathingCycle() {
        if (!this.currentExercise || !this.isPlaying) return;

        this.cycleCount++;
        document.getElementById('currentCycle').textContent = this.cycleCount;

        let phaseIndex = 0;
        const runPhase = () => {
            if (!this.isPlaying || phaseIndex >= this.currentExercise.phases.length) {
                if (this.cycleCount < this.totalCycles && this.isPlaying) {
                    // Start next cycle
                    setTimeout(() => this.startBreathingCycle(), 500);
                } else if (this.isPlaying) {
                    // Exercise complete
                    this.completeExercise();
                }
                return;
            }

            const phase = this.currentExercise.phases[phaseIndex];
            this.currentPhase = phase.name;
            
            // Update UI
            document.getElementById('breathingPhase').textContent = phase.name;
            document.getElementById('breathingInstruction').textContent = phase.instruction;
            
            // Animate breathing circle
            this.animateBreathingCircle(phase);
            
            // Count down the phase duration
            let timeLeft = phase.duration;
            document.getElementById('breathingCount').textContent = timeLeft;
            
            const countdown = setInterval(() => {
                timeLeft--;
                document.getElementById('breathingCount').textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    phaseIndex++;
                    runPhase();
                }
            }, 1000);
        };

        runPhase();
    }

    animateBreathingCircle(phase) {
        const circle = document.getElementById('breathingCircle');
        if (!circle) return;

        // Remove existing animation classes
        circle.classList.remove('inhale', 'exhale', 'hold', 'voo-sound', 'double-inhale', 'long-exhale');
        
        // Add appropriate animation class based on phase
        const phaseClass = phase.name.toLowerCase().replace(' ', '-');
        circle.classList.add(phaseClass);

        // Special animations for different exercise types
        if (this.currentExercise.name === 'Physiological Sigh') {
            if (phase.name === 'Double Inhale') {
                circle.style.animation = 'doubleInhaleAnimation 1s ease-in-out';
            } else if (phase.name === 'Long Exhale') {
                circle.style.animation = 'longExhaleAnimation 6s ease-out';
            }
        }
    }

    togglePause() {
        this.isPlaying = !this.isPlaying;
        const pauseBtn = document.getElementById('pauseText');
        
        if (this.isPlaying) {
            pauseBtn.textContent = 'Pause';
            this.startBreathingCycle(); // Resume from current cycle
        } else {
            pauseBtn.textContent = 'Resume';
            // Pause neural animations
            if (window.resetNeuralState) {
                window.resetNeuralState();
            }
        }
    }

    stopExercise() {
        this.isPlaying = false;
        this.currentExercise = null;
        
        // Show menu, hide player
        document.querySelector('.exercises-grid').style.display = 'grid';
        document.querySelector('.breathing-header').style.display = 'block';
        document.getElementById('breathingPlayer').style.display = 'none';
        
        // Reset neural state
        if (window.resetNeuralState) {
            window.resetNeuralState();
        }

        // Clear any timers
        if (this.breathTimer) {
            clearInterval(this.breathTimer);
        }
    }

    completeExercise() {
        this.isPlaying = false;
        
        // Show completion message
        this.showCompletionMessage();
        
        // Track progress (in production, save to backend)
        this.trackExerciseCompletion();
        
        // Return to menu after completion message
        setTimeout(() => {
            this.stopExercise();
        }, 3000);
    }

    showCompletionMessage() {
        const player = document.getElementById('breathingPlayer');
        const completionHTML = `
            <div class="completion-overlay">
                <div class="completion-content">
                    <div class="completion-neural" data-icon-type="breathing"></div>
                    <h3>Beautiful Work!</h3>
                    <p>You completed ${this.currentExercise.name}</p>
                    <p class="completion-subtitle">Your nervous system is now more regulated</p>
                    <div class="completion-stats">
                        <span>${this.totalCycles} cycles completed</span>
                        <span>~${Math.round(this.totalCycles * this.currentExercise.phases.reduce((sum, phase) => sum + phase.duration, 0) / 60)} minutes</span>
                    </div>
                </div>
            </div>
        `;
        
        player.insertAdjacentHTML('beforeend', completionHTML);
        
        // Animate completion
        setTimeout(() => {
            const overlay = document.querySelector('.completion-overlay');
            if (overlay) overlay.classList.add('show');
        }, 100);
    }

    trackExerciseCompletion() {
        const completionData = {
            exercise: this.currentExercise.name,
            cycles: this.totalCycles,
            completedAt: new Date().toISOString(),
            duration: this.totalCycles * this.currentExercise.phases.reduce((sum, phase) => sum + phase.duration, 0)
        };

        // Store in localStorage (in production, send to backend)
        let breathingHistory = JSON.parse(localStorage.getItem('veraBreathingHistory') || '[]');
        breathingHistory.push(completionData);
        localStorage.setItem('veraBreathingHistory', JSON.stringify(breathingHistory));
    }

    setupVoiceGuidance() {
        // Placeholder for ElevenLabs voice integration
        // In production, this would use the voice system from landing.js
    }

    startVoiceGuidance() {
        // Voice guidance implementation would go here
        // For now, we'll use visual cues only
    }

    createVisualGuides() {
        // Additional visual elements for breathing guidance
        // These will be integrated with the neural particle system
    }
}

// Initialize breathing system
document.addEventListener('DOMContentLoaded', function() {
    window.breathingSystem = new VERABreathingExercises();
});