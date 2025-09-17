// VERA Grounding Techniques Library - Interactive Nervous System Regulation
class VERAGroundingLibrary {
    constructor() {
        this.currentTechnique = null;
        this.isActive = false;
        this.currentStep = 0;
        this.completedTechniques = JSON.parse(localStorage.getItem('veraGroundingProgress')) || [];
        this.container = null;
        
        // Evidence-based grounding techniques
        this.techniques = {
            fiveFourThreeTwo: {
                name: '5-4-3-2-1 Sensory Grounding',
                description: 'Engage all five senses to anchor yourself in the present moment',
                duration: '3-5 minutes',
                difficulty: 'Beginner',
                neuralState: 'coherence',
                benefits: ['Reduces anxiety', 'Grounds in present moment', 'Activates parasympathetic'],
                tierRequired: 'explorer',
                steps: [
                    {
                        instruction: 'Take three deep breaths and settle into your space',
                        detail: 'Find a comfortable position and allow your breathing to naturally slow',
                        duration: 30,
                        senseType: 'preparation'
                    },
                    {
                        instruction: 'Notice 5 things you can SEE around you',
                        detail: 'Look around and identify 5 specific visual details - colors, shapes, textures',
                        duration: 60,
                        senseType: 'sight',
                        prompt: 'Name each item out loud or silently'
                    },
                    {
                        instruction: 'Identify 4 things you can TOUCH or FEEL',
                        detail: 'Notice textures, temperatures, or physical sensations in your body',
                        duration: 60,
                        senseType: 'touch',
                        prompt: 'Feel your feet on the ground, clothes on skin, air temperature'
                    },
                    {
                        instruction: 'Listen for 3 different SOUNDS',
                        detail: 'Tune into your auditory environment - near and far sounds',
                        duration: 45,
                        senseType: 'hearing',
                        prompt: 'Traffic, birds, your breathing, room sounds'
                    },
                    {
                        instruction: 'Notice 2 different SMELLS',
                        detail: 'Breathe in and identify scents in your environment',
                        duration: 30,
                        senseType: 'smell',
                        prompt: 'Coffee, fresh air, fabric softener, natural scents'
                    },
                    {
                        instruction: 'Find 1 thing you can TASTE',
                        detail: 'Notice any taste in your mouth or take a sip of water',
                        duration: 20,
                        senseType: 'taste',
                        prompt: 'Your natural mouth taste, gum, drink, or food'
                    },
                    {
                        instruction: 'Take three more deep breaths',
                        detail: 'Notice how your nervous system feels now compared to when you started',
                        duration: 30,
                        senseType: 'integration'
                    }
                ]
            },

            progressiveRelaxation: {
                name: 'Progressive Muscle Relaxation',
                description: 'Systematic tension and release to reset nervous system activation',
                duration: '8-10 minutes',
                difficulty: 'Beginner',
                neuralState: 'regulation',
                benefits: ['Releases physical tension', 'Calms fight/flight', 'Improves body awareness'],
                tierRequired: 'explorer',
                steps: [
                    {
                        instruction: 'Find a comfortable lying or seated position',
                        detail: 'Close your eyes and take 5 deep, slow breaths',
                        duration: 45,
                        muscleGroup: 'preparation'
                    },
                    {
                        instruction: 'Tense your FEET and CALVES',
                        detail: 'Clench toes, flex feet, tighten calves. Hold tension for 5 seconds, then release',
                        duration: 15,
                        muscleGroup: 'feet',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Tense your THIGHS and GLUTES',
                        detail: 'Squeeze thigh muscles and buttocks. Hold for 5 seconds, then completely relax',
                        duration: 15,
                        muscleGroup: 'legs',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Tense your ABDOMEN and LOWER BACK',
                        detail: 'Pull belly button toward spine, arch back slightly. Hold, then release',
                        duration: 15,
                        muscleGroup: 'core',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Tense your HANDS and ARMS',
                        detail: 'Make fists, tighten arms up to shoulders. Hold tension, then let arms drop',
                        duration: 15,
                        muscleGroup: 'arms',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Tense your SHOULDERS and NECK',
                        detail: 'Lift shoulders to ears, tighten neck. Hold, then let shoulders drop completely',
                        duration: 15,
                        muscleGroup: 'shoulders',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Tense your FACE and SCALP',
                        detail: 'Scrunch forehead, close eyes tight, clench jaw. Hold, then relax everything',
                        duration: 15,
                        muscleGroup: 'face',
                        action: 'tense-release'
                    },
                    {
                        instruction: 'Full body scan and integration',
                        detail: 'Notice the contrast between tension and relaxation throughout your body',
                        duration: 60,
                        muscleGroup: 'integration'
                    }
                ]
            },

            coldWaterGrounding: {
                name: 'Cold Water Reset',
                description: 'Use temperature contrast to activate vagus nerve and reset activation',
                duration: '2-3 minutes',
                difficulty: 'Beginner',
                neuralState: 'activation',
                benefits: ['Activates vagus nerve', 'Quick nervous system reset', 'Increases alertness'],
                tierRequired: 'explorer',
                steps: [
                    {
                        instruction: 'Gather cold water and a towel',
                        detail: 'Use a sink, bowl of cold water, or cold wet towel',
                        duration: 30,
                        temperature: 'preparation'
                    },
                    {
                        instruction: 'Splash cold water on your face',
                        detail: 'Focus on temples, cheeks, and around your eyes. Take slow breaths',
                        duration: 30,
                        temperature: 'cold',
                        nervousSystem: 'vagal activation'
                    },
                    {
                        instruction: 'Hold cold water on your wrists',
                        detail: 'Run cold water over inner wrists for 15-20 seconds each',
                        duration: 40,
                        temperature: 'cold',
                        nervousSystem: 'circulation reset'
                    },
                    {
                        instruction: 'Cold towel on the back of your neck',
                        detail: 'Place cold, damp towel on neck and base of skull for 30 seconds',
                        duration: 30,
                        temperature: 'cold',
                        nervousSystem: 'vagus activation'
                    },
                    {
                        instruction: 'Take 5 deep breaths',
                        detail: 'Notice the shift in your nervous system activation and alertness',
                        duration: 30,
                        temperature: 'integration'
                    }
                ]
            },

            bodyScanning: {
                name: 'Somatic Body Scanning',
                description: 'Detailed awareness practice for nervous system attunement',
                duration: '6-8 minutes',
                difficulty: 'Intermediate',
                neuralState: 'coherence',
                benefits: ['Increases interoception', 'Builds body awareness', 'Calms hypervigilance'],
                tierRequired: 'regulator',
                steps: [
                    {
                        instruction: 'Settle into stillness and connect with your breath',
                        detail: 'Close your eyes and take 10 slow, conscious breaths',
                        duration: 60,
                        bodyPart: 'preparation'
                    },
                    {
                        instruction: 'Scan your head and face',
                        detail: 'Notice tension, temperature, tingling, or other sensations without changing anything',
                        duration: 45,
                        bodyPart: 'head',
                        awareness: 'neutral observation'
                    },
                    {
                        instruction: 'Move awareness to neck and shoulders',
                        detail: 'Are they tight? Warm? Heavy? Just notice what\'s present',
                        duration: 45,
                        bodyPart: 'neck',
                        awareness: 'sensation mapping'
                    },
                    {
                        instruction: 'Scan your arms and hands',
                        detail: 'Notice both arms simultaneously - circulation, weight, aliveness',
                        duration: 45,
                        bodyPart: 'arms',
                        awareness: 'bilateral sensing'
                    },
                    {
                        instruction: 'Bring attention to your chest and heart',
                        detail: 'Feel your heartbeat, breathing rhythm, any emotional sensations',
                        duration: 60,
                        bodyPart: 'chest',
                        awareness: 'cardiac coherence'
                    },
                    {
                        instruction: 'Scan your abdomen and core',
                        detail: 'Your gut feelings, digestive sensations, core stability',
                        duration: 45,
                        bodyPart: 'abdomen',
                        awareness: 'enteric nervous system'
                    },
                    {
                        instruction: 'Move through your back and spine',
                        detail: 'From base of skull to tailbone - support, alignment, any holding patterns',
                        duration: 60,
                        bodyPart: 'spine',
                        awareness: 'structural support'
                    },
                    {
                        instruction: 'Scan your pelvis and hips',
                        detail: 'Notice grounding, stability, connection to the earth',
                        duration: 45,
                        bodyPart: 'pelvis',
                        awareness: 'grounding center'
                    },
                    {
                        instruction: 'Feel your legs and feet',
                        detail: 'Connection to ground, circulation, weight distribution',
                        duration: 45,
                        bodyPart: 'legs',
                        awareness: 'earthing connection'
                    },
                    {
                        instruction: 'Whole body integration',
                        detail: 'Sense your entire body as one unified field of awareness',
                        duration: 60,
                        bodyPart: 'integration',
                        awareness: 'unified field'
                    }
                ]
            },

            bilateralTapping: {
                name: 'Bilateral Self-Tapping',
                description: 'Cross-lateral stimulation for nervous system integration',
                duration: '4-5 minutes',
                difficulty: 'Intermediate',
                neuralState: 'integration',
                benefits: ['Integrates left/right brain', 'Processes activation', 'Builds resilience'],
                tierRequired: 'regulator',
                steps: [
                    {
                        instruction: 'Cross your arms over your chest',
                        detail: 'Place hands on opposite shoulders, creating a self-hug position',
                        duration: 15,
                        pattern: 'setup'
                    },
                    {
                        instruction: 'Begin slow, alternating taps',
                        detail: 'Tap left shoulder with right hand, then right shoulder with left hand',
                        duration: 60,
                        pattern: 'basic bilateral',
                        rhythm: 'slow and steady'
                    },
                    {
                        instruction: 'Add conscious breathing',
                        detail: 'Inhale for 2 taps, exhale for 2 taps. Stay with the rhythm',
                        duration: 90,
                        pattern: 'breath coordination',
                        rhythm: '2:2 ratio'
                    },
                    {
                        instruction: 'Move to knee tapping',
                        detail: 'Alternate tapping left knee with right hand, right knee with left hand',
                        duration: 60,
                        pattern: 'lower body bilateral',
                        rhythm: 'steady cross-lateral'
                    },
                    {
                        instruction: 'Forehead and temple tapping',
                        detail: 'Gently tap temples alternately, then center forehead',
                        duration: 45,
                        pattern: 'cranial bilateral',
                        rhythm: 'gentle stimulation'
                    },
                    {
                        instruction: 'Return to shoulder tapping',
                        detail: 'End where you began, noticing any shifts in your inner state',
                        duration: 30,
                        pattern: 'integration',
                        rhythm: 'completion'
                    }
                ]
            },

            earthingVisualization: {
                name: 'Earthing & Root Visualization',
                description: 'Connecting with earth energy for deep grounding and stability',
                duration: '7-9 minutes',
                difficulty: 'Advanced',
                neuralState: 'grounding',
                benefits: ['Deep nervous system settling', 'Builds sense of safety', 'Connects to earth energy'],
                tierRequired: 'integrator',
                steps: [
                    {
                        instruction: 'Find your seated or standing grounding position',
                        detail: 'Feel your connection to the earth through your sitting bones or feet',
                        duration: 60,
                        element: 'earth connection'
                    },
                    {
                        instruction: 'Visualize roots growing from your base',
                        detail: 'Imagine strong, healthy roots extending down from your tailbone or feet',
                        duration: 90,
                        element: 'root visualization',
                        imagery: 'tree roots extending deep'
                    },
                    {
                        instruction: 'Send roots deep into the earth',
                        detail: 'Feel them going through soil, past rocks, deep into the earth\'s core',
                        duration: 90,
                        element: 'deep grounding',
                        imagery: 'connection to earth center'
                    },
                    {
                        instruction: 'Draw earth energy up through your roots',
                        detail: 'Breathe in stability, safety, and nourishment from the earth',
                        duration: 120,
                        element: 'energy exchange',
                        imagery: 'golden earth energy rising'
                    },
                    {
                        instruction: 'Let earth energy fill your entire body',
                        detail: 'Feel warm, grounding energy in your legs, torso, arms, and head',
                        duration: 90,
                        element: 'body filling',
                        imagery: 'golden light throughout body'
                    },
                    {
                        instruction: 'Send excess energy back to earth',
                        detail: 'Release any tension, anxiety, or activation down through your roots',
                        duration: 60,
                        element: 'energy release',
                        imagery: 'dark energy draining away'
                    },
                    {
                        instruction: 'Strengthen your root system',
                        detail: 'Visualize your roots becoming stronger, more extensive, more stable',
                        duration: 60,
                        element: 'root strengthening',
                        imagery: 'expanding root network'
                    },
                    {
                        instruction: 'Set intention to carry this grounding with you',
                        detail: 'Know you can reconnect to this earth energy anytime you need it',
                        duration: 45,
                        element: 'integration intention',
                        imagery: 'portable grounding'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.createInterface();
        this.setupEventListeners();
        this.updateProgress();
    }

    createInterface() {
        // This will be called when the grounding section is loaded
        // Interface creation handled by loadSectionContent in app-core.js
    }

    getTechniquesList() {
        return Object.keys(this.techniques).map(key => ({
            id: key,
            ...this.techniques[key]
        }));
    }

    hasAccess(technique) {
        const userTier = window.auth?.getUserTier() || 'explorer';
        const tierHierarchy = {
            explorer: 1,
            regulator: 2,
            integrator: 3,
            enterprise: 4
        };

        const requiredTier = this.techniques[technique].tierRequired;
        return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
    }

    startTechnique(techniqueId) {
        if (!this.hasAccess(techniqueId)) {
            window.app?.showUpgradeModal('grounding');
            return;
        }

        this.currentTechnique = techniqueId;
        this.currentStep = 0;
        this.isActive = true;

        this.showTechniqueInterface();
        this.startStep();
    }

    showTechniqueInterface() {
        const technique = this.techniques[this.currentTechnique];
        
        const interface = `
            <div class="grounding-player">
                <div class="technique-header">
                    <h2>${technique.name}</h2>
                    <p class="technique-description">${technique.description}</p>
                    <div class="technique-meta">
                        <span class="duration">Duration: ${technique.duration}</span>
                        <span class="difficulty">Level: ${technique.difficulty}</span>
                        <span class="neural-state">State: ${technique.neuralState}</span>
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="groundingProgress"></div>
                    </div>
                    <div class="step-counter">
                        Step <span id="currentStepNum">1</span> of ${technique.steps.length}
                    </div>
                </div>

                <div class="instruction-display">
                    <div class="instruction-main" id="instructionMain">
                        ${technique.steps[0].instruction}
                    </div>
                    <div class="instruction-detail" id="instructionDetail">
                        ${technique.steps[0].detail}
                    </div>
                    ${technique.steps[0].prompt ? `<div class="instruction-prompt">${technique.steps[0].prompt}</div>` : ''}
                </div>

                <div class="grounding-visual">
                    <div class="neural-grounding-display" id="neuralGroundingDisplay">
                        <canvas id="groundingNeuralCanvas" width="300" height="300"></canvas>
                    </div>
                </div>

                <div class="technique-controls">
                    <button class="control-btn pause-btn" id="pauseGrounding" onclick="window.groundingLibrary.pauseTechnique()">
                        ⏸ Pause
                    </button>
                    <button class="control-btn skip-btn" id="skipStep" onclick="window.groundingLibrary.nextStep()">
                        ⏭ Next Step
                    </button>
                    <button class="control-btn stop-btn" id="stopGrounding" onclick="window.groundingLibrary.stopTechnique()">
                        ⏹ Stop
                    </button>
                </div>

                <div class="technique-benefits">
                    <h4>Benefits:</h4>
                    <ul>
                        ${technique.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        const contentArea = document.querySelector('.section-content');
        if (contentArea) {
            contentArea.innerHTML = interface;
            this.setupNeuralGroundingDisplay();
        }
    }

    startStep() {
        const technique = this.techniques[this.currentTechnique];
        const step = technique.steps[this.currentStep];

        if (!step) {
            this.completeTechnique();
            return;
        }

        // Update UI
        document.getElementById('instructionMain').textContent = step.instruction;
        document.getElementById('instructionDetail').textContent = step.detail;
        document.getElementById('currentStepNum').textContent = this.currentStep + 1;

        const promptElement = document.querySelector('.instruction-prompt');
        if (step.prompt) {
            if (promptElement) {
                promptElement.textContent = step.prompt;
                promptElement.style.display = 'block';
            }
        } else if (promptElement) {
            promptElement.style.display = 'none';
        }

        // Update progress
        const progressPercent = ((this.currentStep + 1) / technique.steps.length) * 100;
        document.getElementById('groundingProgress').style.width = progressPercent + '%';

        // Set neural state
        this.setNeuralState(technique.neuralState, step);

        // Auto-advance after step duration
        if (step.duration && this.isActive) {
            this.stepTimer = setTimeout(() => {
                if (this.isActive) {
                    this.nextStep();
                }
            }, step.duration * 1000);
        }
    }

    nextStep() {
        if (this.stepTimer) {
            clearTimeout(this.stepTimer);
        }

        this.currentStep++;
        this.startStep();
    }

    pauseTechnique() {
        this.isActive = !this.isActive;
        const pauseBtn = document.getElementById('pauseGrounding');
        
        if (this.isActive) {
            pauseBtn.innerHTML = '⏸ Pause';
            this.startStep(); // Resume
        } else {
            pauseBtn.innerHTML = '▶ Resume';
            if (this.stepTimer) {
                clearTimeout(this.stepTimer);
            }
        }
    }

    stopTechnique() {
        this.isActive = false;
        this.currentTechnique = null;
        this.currentStep = 0;
        
        if (this.stepTimer) {
            clearTimeout(this.stepTimer);
        }

        // Return to technique selection
        this.showTechniqueSelection();
    }

    completeTechnique() {
        // Mark technique as completed
        if (!this.completedTechniques.includes(this.currentTechnique)) {
            this.completedTechniques.push(this.currentTechnique);
            localStorage.setItem('veraGroundingProgress', JSON.stringify(this.completedTechniques));
        }

        // Show completion interface
        const technique = this.techniques[this.currentTechnique];
        const completionInterface = `
            <div class="technique-completion">
                <div class="completion-header">
                    <div class="completion-icon">✨</div>
                    <h2>Technique Complete!</h2>
                    <p>You've completed <strong>${technique.name}</strong></p>
                </div>

                <div class="completion-reflection">
                    <h3>How do you feel now?</h3>
                    <div class="feeling-options">
                        <button class="feeling-btn" onclick="window.groundingLibrary.recordFeeling('more_grounded')">More Grounded</button>
                        <button class="feeling-btn" onclick="window.groundingLibrary.recordFeeling('calmer')">Calmer</button>
                        <button class="feeling-btn" onclick="window.groundingLibrary.recordFeeling('centered')">More Centered</button>
                        <button class="feeling-btn" onclick="window.groundingLibrary.recordFeeling('present')">More Present</button>
                    </div>
                </div>

                <div class="completion-actions">
                    <button class="primary-btn" onclick="window.groundingLibrary.showTechniqueSelection()">
                        Try Another Technique
                    </button>
                    <button class="secondary-btn" onclick="window.groundingLibrary.repeatTechnique()">
                        Repeat This One
                    </button>
                </div>

                <div class="progress-celebration">
                    <p>You've completed ${this.completedTechniques.length} of ${Object.keys(this.techniques).length} grounding techniques</p>
                    <div class="progress-visual">
                        ${this.generateProgressDots()}
                    </div>
                </div>
            </div>
        `;

        const contentArea = document.querySelector('.section-content');
        if (contentArea) {
            contentArea.innerHTML = completionInterface;
        }

        // Reset state
        this.isActive = false;
        this.currentTechnique = null;
        this.currentStep = 0;
    }

    recordFeeling(feeling) {
        // Store user feedback
        const feedback = {
            technique: this.currentTechnique,
            feeling: feeling,
            timestamp: new Date().toISOString()
        };

        let feedbackHistory = JSON.parse(localStorage.getItem('veraGroundingFeedback')) || [];
        feedbackHistory.push(feedback);
        localStorage.setItem('veraGroundingFeedback', JSON.stringify(feedbackHistory));

        // Show appreciation
        const feelingBtn = event.target;
        feelingBtn.innerHTML = '✓ Recorded';
        feelingBtn.style.background = 'rgba(34, 197, 94, 0.3)';
        feelingBtn.disabled = true;
    }

    repeatTechnique() {
        this.startTechnique(this.currentTechnique);
    }

    showTechniqueSelection() {
        window.app?.loadSectionContent('grounding');
    }

    generateProgressDots() {
        return Object.keys(this.techniques).map(techniqueId => {
            const completed = this.completedTechniques.includes(techniqueId);
            return `<div class="progress-dot ${completed ? 'completed' : ''}"></div>`;
        }).join('');
    }

    setupNeuralGroundingDisplay() {
        const canvas = document.getElementById('groundingNeuralCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.animateGroundingVisual(ctx);
    }

    animateGroundingVisual(ctx) {
        const centerX = 150;
        const centerY = 150;
        let time = 0;

        const animate = () => {
            if (!this.isActive) return;

            ctx.clearRect(0, 0, 300, 300);

            // Draw grounding energy visualization
            time += 0.02;
            
            // Central grounding point
            const pulseSize = 20 + 10 * Math.sin(time * 2);
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + 0.4 * Math.sin(time)})`;
            ctx.fill();

            // Root-like tendrils extending down
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const length = 60 + 20 * Math.sin(time + i);
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length + 20
                );
                ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + 0.2 * Math.sin(time + i)})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    setNeuralState(state, step) {
        // Integrate with main neural particle system
        if (window.neuralSystem) {
            switch(state) {
                case 'coherence':
                    window.setNeuralCoherence && window.setNeuralCoherence();
                    break;
                case 'regulation':
                    window.setNeuralRegulation && window.setNeuralRegulation();
                    break;
                case 'integration':
                case 'grounding':
                    window.setNeuralActivation && window.setNeuralActivation();
                    break;
            }
        }
    }

    setupEventListeners() {
        // Event listeners set up when interface is created
    }

    updateProgress() {
        // Update any progress indicators in the main interface
    }
}

// Initialize grounding library
window.groundingLibrary = new VERAGroundingLibrary();