// VERA Explorer App Core Functionality
class VERAExplorerApp {
    constructor() {
        this.currentSection = 'welcome';
        this.user = null;
        this.trialData = null;
        this.chatCount = 0;
        this.maxChats = 10;
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        this.checkTrialStatus();
        this.initTierManagement();
    }

    loadUserData() {
        // Load user data from localStorage (in production, this would be from backend)
        const userData = localStorage.getItem('veraUser');
        if (userData) {
            this.user = JSON.parse(userData);
            this.updateUserGreeting();
        }

        // Load trial data
        const trialData = localStorage.getItem('veraTrial');
        if (trialData) {
            this.trialData = JSON.parse(trialData);
        } else {
            // Initialize 7-day trial
            this.trialData = {
                startDate: new Date().toISOString(),
                daysRemaining: 7,
                isActive: true,
                isSubscribed: false
            };
            localStorage.setItem('veraTrial', JSON.stringify(this.trialData));
        }

        // Load chat count
        const chatData = localStorage.getItem('veraChats');
        if (chatData) {
            const chats = JSON.parse(chatData);
            const currentMonth = new Date().getMonth();
            if (chats.month === currentMonth) {
                this.chatCount = chats.count;
            } else {
                // Reset for new month
                this.chatCount = 0;
                this.saveChatCount();
            }
        }
    }

    updateUserGreeting() {
        const greetingElement = document.getElementById('userGreeting');
        const userNameElement = document.getElementById('userName');
        
        if (this.user && this.user.name) {
            if (greetingElement) {
                greetingElement.textContent = `Welcome back, ${this.user.name}!`;
            }
            if (userNameElement) {
                userNameElement.textContent = this.user.name;
            }
        }
    }

    saveChatCount() {
        const chatData = {
            count: this.chatCount,
            month: new Date().getMonth(),
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('veraChats', JSON.stringify(chatData));
    }

    checkTrialStatus() {
        if (!this.trialData.isSubscribed && this.trialData.isActive) {
            const startDate = new Date(this.trialData.startDate);
            const now = new Date();
            const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
            const daysRemaining = Math.max(0, 7 - daysPassed);
            
            this.trialData.daysRemaining = daysRemaining;
            this.trialData.isActive = daysRemaining > 0;
            
            localStorage.setItem('veraTrial', JSON.stringify(this.trialData));
            this.updateTrialUI();
        }
    }

    updateTrialUI() {
        const trialDaysElement = document.getElementById('trialDays');
        const trialStatusElement = document.getElementById('trialStatus');
        
        if (this.trialData.isSubscribed) {
            if (trialStatusElement) {
                trialStatusElement.style.display = 'none';
            }
        } else if (trialDaysElement) {
            const daysText = this.trialData.daysRemaining === 1 ? '1 day left' : `${this.trialData.daysRemaining} days left`;
            trialDaysElement.textContent = daysText;
            
            if (this.trialData.daysRemaining <= 2) {
                trialDaysElement.style.color = '#f59e0b'; // Warning color
            }
        }
    }

    updateChatCounter() {
        const chatCounter = document.getElementById('chatCounter');
        if (chatCounter) {
            chatCounter.textContent = `${this.chatCount}/${this.maxChats}`;
            
            if (this.chatCount >= this.maxChats) {
                chatCounter.style.background = 'linear-gradient(135deg, #f59e0b, #dc2626)';
                chatCounter.style.color = 'white';
            }
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                    this.energizeNavigation(item);
                }
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidePanel = document.getElementById('sidePanel');
        
        if (menuToggle && sidePanel) {
            menuToggle.addEventListener('click', () => {
                sidePanel.classList.toggle('open');
                this.energizeNavigation(menuToggle);
            });
        }

        // Body check input
        const bodyCheckInput = document.getElementById('bodyCheckInput');
        if (bodyCheckInput) {
            bodyCheckInput.addEventListener('input', () => {
                this.handleBodyCheckInput();
            });
        }

        // Quick action buttons
        this.setupQuickActions();

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('upgradeModal');
            if (modal && e.target === modal) {
                this.closeUpgradeModal();
            }
        });
    }

    setupQuickActions() {
        // Quick regulation buttons
        document.querySelectorAll('.quick-option').forEach(button => {
            button.addEventListener('click', () => {
                this.energizeNavigation(button);
                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }

    navigateToSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeNav) {
                activeNav.classList.add('active');
            }
            
            // Update neural particle system based on section
            this.updateNeuralState(sectionName);
            
            // Update page title
            this.updateContentTitle(sectionName);
            
            // Load section content if needed
            this.loadSectionContent(sectionName);
        }
    }

    updateNeuralState(sectionName) {
        // Reset neural state first
        if (window.resetNeuralState) {
            window.resetNeuralState();
        }
        
        // Set appropriate neural state for section with delay for smooth transition
        setTimeout(() => {
            switch(sectionName) {
                case 'breathing':
                    if (window.setNeuralCoherence) window.setNeuralCoherence();
                    if (window.startBreathingAnimation) window.startBreathingAnimation();
                    break;
                case 'grounding':
                    if (window.setNeuralRegulation) window.setNeuralRegulation();
                    break;
                case 'journal':
                    // Calm, focused state for journaling
                    if (window.setNeuralRegulation) window.setNeuralRegulation();
                    break;
                case 'chat':
                    // Dynamic state for chatting
                    if (window.setNeuralCoherence) window.setNeuralCoherence();
                    break;
                case 'welcome':
                    // Gentle activation for body check
                    if (window.setNeuralActivation) window.setNeuralActivation();
                    break;
                default:
                    // Default calm neural state
                    if (window.resetNeuralState) window.resetNeuralState();
            }
        }, 100);
    }

    updateContentTitle(sectionName) {
        const titleElement = document.getElementById('contentTitle');
        const titles = {
            'welcome': 'How are you feeling in your body today?',
            'breathing': 'Breathing Exercises',
            'grounding': 'Grounding Techniques',
            'journal': 'Your Nervous System Journal',
            'chat': 'Chat with VERA',
            'progress': 'Your Regulation Journey',
            'settings': 'Account Settings'
        };
        
        if (titleElement && titles[sectionName]) {
            titleElement.textContent = titles[sectionName];
        }
    }

    loadSectionContent(sectionName) {
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (!targetSection) return;

        // Load specific content for each section
        switch(sectionName) {
            case 'breathing':
                this.loadBreathingSection(targetSection);
                break;
            case 'grounding':
                this.loadGroundingSection(targetSection);
                break;
            case 'journal':
                this.loadJournalSection(targetSection);
                break;
            case 'chat':
                this.loadChatSection(targetSection);
                break;
            case 'dashboard':
                this.loadDashboardSection(targetSection);
                break;
            default:
                this.loadGenericSection(targetSection, sectionName);
        }
    }

    loadBreathingSection(contentArea) {
        // Initialize breathing exercises if not already loaded
        if (!contentArea.querySelector('.breathing-exercises') && window.breathingSystem) {
            window.breathingSystem.setupBreathingInterface();
        } else if (!contentArea.querySelector('.breathing-exercises')) {
            // Fallback if breathing system not loaded yet
            contentArea.innerHTML = `
                <div class="section-loading">
                    <div class="loading-neural"></div>
                    <p>Loading breathing exercises...</p>
                </div>
            `;
            
            // Retry after breathing system loads
            setTimeout(() => {
                if (window.breathingSystem) {
                    window.breathingSystem.setupBreathingInterface();
                }
            }, 500);
        }
    }

    loadGroundingSection(contentArea) {
        // Initialize grounding library if not already loaded
        if (!window.groundingLibrary) {
            contentArea.innerHTML = `
                <div class="section-loading">
                    <div class="loading-neural"></div>
                    <p>Loading grounding techniques...</p>
                </div>
            `;
            return;
        }

        const techniques = window.groundingLibrary.getTechniquesList();
        contentArea.innerHTML = `
            <div class="grounding-techniques">
                <div class="section-header">
                    <div class="neural-icon" data-icon-type="grounding"></div>
                    <h2>Grounding Techniques</h2>
                    <p>Evidence-based practices for nervous system regulation and present-moment awareness</p>
                </div>
                
                <div class="techniques-grid">
                    ${techniques.map(technique => {
                        const hasAccess = window.groundingLibrary.hasAccess(technique.id);
                        const isCompleted = window.groundingLibrary.completedTechniques.includes(technique.id);
                        
                        return `
                            <div class="technique-card grounding-technique ${!hasAccess ? 'tier-locked' : ''} ${isCompleted ? 'completed' : ''}" 
                                 data-tier-feature="grounding" 
                                 onclick="${hasAccess ? `window.groundingLibrary.startTechnique('${technique.id}')` : ''}">
                                ${isCompleted ? '<div class="completion-badge">✓</div>' : ''}
                                ${!hasAccess ? '<div class="tier-lock">⭐</div>' : ''}
                                
                                <div class="technique-header">
                                    <h3>${technique.name}</h3>
                                    <div class="neural-state-indicator ${technique.neuralState}"></div>
                                </div>
                                
                                <p class="technique-description">${technique.description}</p>
                                
                                <div class="technique-meta">
                                    <span class="duration">${technique.duration}</span>
                                    <span class="difficulty ${technique.difficulty.toLowerCase()}">${technique.difficulty}</span>
                                    <span class="tier-required">${technique.tierRequired.toUpperCase()}</span>
                                </div>
                                
                                <div class="technique-benefits">
                                    ${technique.benefits.slice(0, 2).map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                                </div>
                                
                                ${!hasAccess ? `
                                    <div class="upgrade-overlay">
                                        <p>Upgrade to ${technique.tierRequired.toUpperCase()} to unlock</p>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="grounding-progress">
                    <h3>Your Progress</h3>
                    <div class="progress-summary">
                        <span>Completed: ${window.groundingLibrary.completedTechniques.length} of ${techniques.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(window.groundingLibrary.completedTechniques.length / techniques.length) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadJournalSection(contentArea) {
        // Initialize journal if not already loaded
        if (!window.nsJournal) {
            contentArea.innerHTML = `
                <div class="section-loading">
                    <div class="loading-neural"></div>
                    <p>Loading nervous system journal...</p>
                </div>
            `;
            return;
        }

        contentArea.innerHTML = window.nsJournal.createJournalInterface();
        window.nsJournal.setupEventListeners();
    }

    loadChatSection(contentArea) {
        // Initialize enhanced chat system
        if (window.VERAEnhancedChat) {
            window.VERAEnhancedChat.initialize();
        } else {
            // Fallback loading message
            contentArea.innerHTML = `
                <div class="section-loading">
                    <div class="loading-neural"></div>
                    <p>Loading enhanced chat system...</p>
                </div>
            `;
            
            // Retry initialization after a delay
            setTimeout(() => {
                if (window.VERAEnhancedChat) {
                    window.VERAEnhancedChat.initialize();
                }
            }, 1000);
        }
    }

    loadDashboardSection(contentArea) {
        // Initialize personalized dashboard
        if (window.VERAPersonalizedDashboard) {
            window.VERAPersonalizedDashboard.initialize();
        } else {
            // Fallback loading message
            contentArea.innerHTML = `
                <div class="section-loading">
                    <div class="loading-neural"></div>
                    <p>Loading your personalized dashboard...</p>
                </div>
            `;
            
            // Retry initialization after a delay
            setTimeout(() => {
                if (window.VERAPersonalizedDashboard) {
                    window.VERAPersonalizedDashboard.initialize();
                }
            }, 1000);
        }
    }

    loadGenericSection(contentArea, sectionName) {
        const loadingElement = contentArea.querySelector('.section-loading');
        if (loadingElement) {
            setTimeout(() => {
                loadingElement.innerHTML = `<p>Coming soon: ${sectionName} functionality</p>`;
            }, 500);
        }
    }

    handleBodyCheckInput() {
        const input = document.getElementById('bodyCheckInput');
        if (input && input.value.length > 10) {
            // Energize neural system when user is actively sharing
            if (window.neuralSystem) {
                window.neuralSystem.energize(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    0.3
                );
            }
        }
    }

    energizeNavigation(element) {
        // Add visual feedback to neural particles
        if (window.energizeNeural) {
            window.energizeNeural(element);
        }
        
        // Add CSS animation class
        element.classList.add('neural-activated');
        setTimeout(() => {
            element.classList.remove('neural-activated');
        }, 300);
    }

    // Chat functionality
    canChat() {
        return this.trialData.isSubscribed || this.chatCount < this.maxChats;
    }

    incrementChatCount() {
        if (!this.trialData.isSubscribed) {
            this.chatCount++;
            this.saveChatCount();
            this.updateChatCounter();
            
            // Show upgrade prompt if approaching limit
            if (this.chatCount >= this.maxChats - 2) {
                this.showChatLimitWarning();
            }
        }
    }

    showChatLimitWarning() {
        if (this.chatCount === this.maxChats - 2) {
            this.showNotification('You have 2 chats remaining this month. Your nervous system patterns are becoming clearer.');
        } else if (this.chatCount === this.maxChats - 1) {
            this.showNotification('You have 1 chat remaining this month. Consider upgrading to continue your regulation journey.');
        } else if (this.chatCount >= this.maxChats) {
            this.showUpgradeModal();
        }
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = 'neural-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--neural), var(--trauma));
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
            z-index: 1001;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showUpgradeModal() {
        const modal = document.getElementById('upgradeModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeUpgradeModal() {
        const modal = document.getElementById('upgradeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    processUpgrade() {
        // In production, this would integrate with Stripe
        console.log('Processing upgrade to Explorer Plan...');
        
        // For demo purposes, simulate successful upgrade
        this.trialData.isSubscribed = true;
        localStorage.setItem('veraTrial', JSON.stringify(this.trialData));
        
        this.closeUpgradeModal();
        this.updateTrialUI();
        this.showNotification('Welcome to VERA Explorer! You now have unlimited access to all features.');
    }

    updateUI() {
        this.updateChatCounter();
        this.updateTrialUI();
        this.updateUserGreeting();
    }
}

// Global functions for HTML onclick handlers
window.submitBodyCheck = function() {
    const input = document.getElementById('bodyCheckInput');
    if (input && input.value.trim()) {
        app.showNotification('Thank you for sharing. VERA is processing your nervous system signals...');
        input.value = '';
        
        // Energize neural system
        if (window.neuralSystem) {
            window.neuralSystem.regulate();
        }
    }
};

window.startQuickBreathing = function() {
    app.navigateToSection('breathing');
    app.showNotification('Loading your personalized breathing exercises...');
};

window.startQuickGrounding = function() {
    app.navigateToSection('grounding');
    app.showNotification('Preparing grounding techniques for your current state...');
};

window.openVERAChat = function() {
    if (app.canChat()) {
        app.navigateToSection('chat');
        app.incrementChatCount();
    } else {
        app.showUpgradeModal();
    }
};

window.showUpgradeModal = function() {
    app.showUpgradeModal();
};

window.closeUpgradeModal = function() {
    app.closeUpgradeModal();
};

window.processUpgrade = function() {
    app.processUpgrade();
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new VERAExplorerApp();
    
    // Add CSS for neural activation effect
    const style = document.createElement('style');
    style.textContent = `
        .neural-activated {
            transform: scale(1.05) !important;
            transition: transform 0.3s ease !important;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .neural-notification {
            animation: slideInRight 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);

    initTierManagement() {
        this.updateTierDisplay();
        this.checkFeatureAccess();
        this.setupUpgradePrompts();
    }

    updateTierDisplay() {
        const userTier = window.auth?.getUserTier() || 'explorer';
        const tierFeatures = window.auth?.getTierFeatures(userTier) || {};
        
        // Update UI elements to show current tier
        const tierIndicator = document.querySelector('.tier-indicator');
        if (tierIndicator) {
            tierIndicator.textContent = userTier.toUpperCase();
            tierIndicator.className = `tier-indicator tier-${userTier}`;
        }

        // Update chat limit display
        const chatLimit = window.auth?.getChatLimit() || 10;
        const chatDisplay = document.querySelector('.chat-limit-display');
        if (chatDisplay) {
            chatDisplay.textContent = chatLimit === 999 ? 'Unlimited' : `${this.chatCount}/${chatLimit}`;
        }

        // Show/hide tier-specific features
        this.updateFeatureVisibility(userTier, tierFeatures);
    }

    updateFeatureVisibility(tier, features) {
        // Show/hide features based on tier
        const featureElements = document.querySelectorAll('[data-tier-feature]');
        
        featureElements.forEach(element => {
            const requiredFeature = element.getAttribute('data-tier-feature');
            const hasAccess = window.auth?.hasFeatureAccess(requiredFeature) || false;
            
            if (hasAccess) {
                element.classList.remove('tier-locked');
            } else {
                element.classList.add('tier-locked');
                this.addUpgradePrompt(element, requiredFeature);
            }
        });
    }

    checkFeatureAccess() {
        // Check specific feature access
        const currentTier = window.auth?.getUserTier() || 'explorer';
        const features = window.auth?.getTierFeatures(currentTier) || {};

        // Update breathing exercises access
        if (features.breathingExercises === 5 || features.breathingExercises === 'basic') {
            this.limitBreathingExercises(5);
        }

        // Update grounding techniques access
        if (features.groundingTechniques === 6) {
            this.limitGroundingTechniques(6);
        }

        // Update chat limit enforcement
        this.maxChats = features.chatLimit === Infinity ? 999 : features.chatLimit;
    }

    limitBreathingExercises(limit) {
        const exercises = document.querySelectorAll('.breathing-exercise');
        exercises.forEach((exercise, index) => {
            if (index >= limit) {
                exercise.classList.add('tier-locked');
                this.addUpgradePrompt(exercise, 'breathing');
            }
        });
    }

    limitGroundingTechniques(limit) {
        const techniques = document.querySelectorAll('.grounding-technique');
        techniques.forEach((technique, index) => {
            if (index >= limit) {
                technique.classList.add('tier-locked');
                this.addUpgradePrompt(technique, 'grounding');
            }
        });
    }

    addUpgradePrompt(element, featureType) {
        // Add upgrade overlay to locked features
        if (!element.querySelector('.upgrade-prompt')) {
            const prompt = document.createElement('div');
            prompt.className = 'upgrade-prompt';
            prompt.innerHTML = `
                <div class="upgrade-content">
                    <div class="upgrade-icon">⭐</div>
                    <p>Upgrade to unlock</p>
                    <button class="upgrade-btn" onclick="window.app.showUpgradeModal('${featureType}')">
                        View Plans
                    </button>
                </div>
            `;
            element.appendChild(prompt);
        }
    }

    setupUpgradePrompts() {
        // Add CSS for upgrade prompts
        const style = document.createElement('style');
        style.textContent = `
            .tier-locked {
                position: relative;
                opacity: 0.6;
                pointer-events: none;
            }

            .upgrade-prompt {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(15, 23, 42, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius);
                backdrop-filter: blur(5px);
            }

            .upgrade-content {
                text-align: center;
                color: white;
            }

            .upgrade-icon {
                font-size: var(--font-xl);
                margin-bottom: var(--space-sm);
            }

            .upgrade-content p {
                margin: var(--space-xs) 0;
                font-size: var(--font-sm);
            }

            .upgrade-btn {
                background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                color: white;
                border: none;
                padding: var(--space-xs) var(--space-md);
                border-radius: var(--radius);
                font-size: var(--font-xs);
                cursor: pointer;
                transition: transform 0.2s;
            }

            .upgrade-btn:hover {
                transform: scale(1.05);
            }

            .tier-indicator {
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--radius);
                font-size: var(--font-xs);
                font-weight: 600;
                text-transform: uppercase;
            }

            .tier-explorer {
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }

            .tier-regulator {
                background: rgba(59, 130, 246, 0.2);
                color: #3b82f6;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }

            .tier-integrator {
                background: rgba(139, 92, 246, 0.2);
                color: #8b5cf6;
                border: 1px solid rgba(139, 92, 246, 0.3);
            }

            .tier-enterprise {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    showUpgradeModal(featureType) {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal';
        modal.innerHTML = `
            <div class="upgrade-modal-content">
                <div class="upgrade-modal-header">
                    <h3>Unlock ${this.getFeatureName(featureType)}</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="upgrade-modal-body">
                    <p>${this.getFeatureDescription(featureType)}</p>
                    <div class="upgrade-options">
                        <div class="upgrade-option" onclick="window.location.href='pricing.html?plan=regulator'">
                            <h4>REGULATOR</h4>
                            <p class="price">$39/month</p>
                            <p class="description">Full access to all features</p>
                        </div>
                        <div class="upgrade-option" onclick="window.location.href='pricing.html?plan=integrator'">
                            <h4>INTEGRATOR</h4>
                            <p class="price">$79/month</p>
                            <p class="description">Advanced personalization & methodology access</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(modal);
    }

    getFeatureName(featureType) {
        const names = {
            breathing: 'Advanced Breathing Exercises',
            grounding: 'Complete Grounding Library',
            movement: 'Movement & Integration Tools',
            frequency: 'Binaural Beat Library',
            insights: 'Weekly Nervous System Insights',
            personalized: 'Personalized Regulation Plans',
            crisis: '24/7 Crisis Support',
            methodology: 'Complete VERA Methodology'
        };
        return names[featureType] || 'Premium Features';
    }

    getFeatureDescription(featureType) {
        const descriptions = {
            breathing: 'Access all breathing exercises including advanced techniques like bilateral stimulation sequences.',
            grounding: 'Unlock the complete library of grounding techniques with guided step-by-step instructions.',
            movement: 'Bilateral stimulation sequences and movement-based integration tools.',
            frequency: 'Therapeutic binaural beats and frequency combinations for nervous system regulation.',
            insights: 'Weekly analysis of your nervous system patterns with personalized recommendations.',
            personalized: 'Custom 30-day regulation protocols adapted to your unique nervous system profile.',
            crisis: '24/7 access to acute dysregulation guidance and crisis intervention protocols.',
            methodology: 'Complete access to Eva & Julija\'s original research and practitioner-level techniques.'
        };
        return descriptions[featureType] || 'Upgrade to unlock premium nervous system regulation features.';
    }
}

// VERACore Navigation System
class VERACore {
    constructor() {
        this.currentSection = 'dashboard';
        this.sections = new Map();
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        console.log('🚀 VERACore Navigation System Initialized');
        
        // Register all sections
        this.registerSection('dashboard', () => this.loadDashboard());
        this.registerSection('breathing', () => this.loadBreathing());
        this.registerSection('grounding', () => this.loadGrounding());
        this.registerSection('journal', () => this.loadJournal());
        this.registerSection('chat', () => this.loadChat());
        this.registerSection('progress', () => this.loadProgress());
        this.registerSection('settings', () => this.loadSettings());
        
        // Initialize with dashboard
        this.showSection('dashboard');
        this.initialized = true;
    }

    registerSection(name, loadFunction) {
        this.sections.set(name, loadFunction);
        console.log(`📋 Registered section: ${name}`);
    }

    showSection(sectionName) {
        console.log(`🔄 Switching to section: ${sectionName}`);
        
        // Hide all sections
        this.hideAllSections();
        
        // Update navigation
        this.updateNavigation(sectionName);
        
        // Load and show the requested section
        if (this.sections.has(sectionName)) {
            this.currentSection = sectionName;
            this.sections.get(sectionName)();
        } else {
            console.warn(`⚠️ Section not found: ${sectionName}`);
            this.loadDashboard(); // Fallback to dashboard
        }
    }

    hideAllSections() {
        // Hide all content sections
        const sections = [
            'dashboard-section',
            'breathing-section', 
            'grounding-section',
            'journal-section',
            'chat-section',
            'progress-section',
            'settings-section'
        ];
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.style.display = 'none';
            }
        });

        // Also hide any existing content containers
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // Clear dynamic content while preserving structure
            const dynamicContainers = mainContent.querySelectorAll('.section-content');
            dynamicContainers.forEach(container => {
                container.style.display = 'none';
            });
        }
    }

    updateNavigation(activeSectionName) {
        // Update sidebar navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const section = item.getAttribute('data-section');
            if (section === activeSectionName) {
                item.classList.add('active');
            }
        });
    }

    loadDashboard() {
        console.log('📊 Loading Dashboard');
        this.showSectionContainer('dashboard-section');
        
        // Initialize dashboard if it exists
        if (window.personalizedDashboard) {
            window.personalizedDashboard.init();
        }
    }

    loadBreathing() {
        console.log('🫁 Loading Breathing Exercises');
        const section = this.showSectionContainer('breathing-section');
        
        // Initialize breathing exercises if it exists
        if (window.breathingExercises) {
            window.breathingExercises.init();
        } else if (window.BreathingExercises) {
            // Try the class version
            new window.BreathingExercises();
        } else {
            // Create basic breathing interface
            section.innerHTML = `
                <div class="breathing-container">
                    <div class="content-header">
                        <h2>🫁 Breathing Exercises</h2>
                        <p>Regulate your nervous system with guided breathing techniques</p>
                    </div>
                    
                    <div class="technique-grid">
                        <div class="technique-card" data-technique="box">
                            <div class="technique-icon">📦</div>
                            <h3>Box Breathing</h3>
                            <p>4-4-4-4 pattern for balance</p>
                            <button class="start-technique-btn" onclick="startBreathingTechnique('box')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="physiological">
                            <div class="technique-icon">💨</div>
                            <h3>Physiological Sigh</h3>
                            <p>Double inhale + long exhale for calm</p>
                            <button class="start-technique-btn" onclick="startBreathingTechnique('physiological')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="coherent">
                            <div class="technique-icon">🌊</div>
                            <h3>Coherent Breathing</h3>
                            <p>5-5 pattern for coherence</p>
                            <button class="start-technique-btn" onclick="startBreathingTechnique('coherent')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="voo">
                            <div class="technique-icon">🗣️</div>
                            <h3>Voo Breathing</h3>
                            <p>Vagal tone activation</p>
                            <button class="start-technique-btn" onclick="startBreathingTechnique('voo')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="478">
                            <div class="technique-icon">😴</div>
                            <h3>4-7-8 Breathing</h3>
                            <p>For deep relaxation</p>
                            <button class="start-technique-btn" onclick="startBreathingTechnique('478')">Start</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadGrounding() {
        console.log('🌱 Loading Grounding Techniques');
        const section = this.showSectionContainer('grounding-section');
        
        // Initialize grounding techniques if it exists
        if (window.groundingTechniques) {
            window.groundingTechniques.init();
        } else if (window.GroundingTechniques) {
            new window.GroundingTechniques();
        } else {
            // Create basic grounding interface
            section.innerHTML = `
                <div class="grounding-container">
                    <div class="content-header">
                        <h2>🌱 Grounding Techniques</h2>
                        <p>Ground yourself in the present moment</p>
                    </div>
                    
                    <div class="grounding-grid">
                        <div class="grounding-card" data-technique="5-4-3-2-1">
                            <div class="grounding-icon">👁️</div>
                            <h3>5-4-3-2-1 Sensory</h3>
                            <p>5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('sensory')">Start</button>
                        </div>
                        
                        <div class="grounding-card" data-technique="progressive">
                            <div class="grounding-icon">💪</div>
                            <h3>Progressive Muscle</h3>
                            <p>Tense and release muscle groups</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('progressive')">Start</button>
                        </div>
                        
                        <div class="grounding-card" data-technique="bilateral" data-tier="regulator">
                            <div class="grounding-icon">🤲</div>
                            <h3>Bilateral Stimulation</h3>
                            <p>Cross-lateral movements for integration</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('bilateral')">Upgrade Required</button>
                        </div>
                        
                        <div class="grounding-card" data-technique="coherent-movement" data-tier="regulator">
                            <div class="grounding-icon">🌊</div>
                            <h3>Coherent Movement</h3>
                            <p>Rhythmic movements for coherence</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('movement')">Upgrade Required</button>
                        </div>
                        
                        <div class="grounding-card" data-technique="cold" data-tier="integrator">
                            <div class="grounding-icon">❄️</div>
                            <h3>Cold Exposure</h3>
                            <p>Controlled stress for resilience</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('cold')">Integrator Plan</button>
                        </div>
                        
                        <div class="grounding-card" data-technique="breathwork" data-tier="integrator">
                            <div class="grounding-icon">🌬️</div>
                            <h3>Breathwork Integration</h3>
                            <p>Advanced breathing + movement</p>
                            <button class="start-grounding-btn" onclick="startGroundingTechnique('breathwork')">Integrator Plan</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadJournal() {
        console.log('📝 Loading Nervous System Journal');
        const section = this.showSectionContainer('journal-section');
        
        // Initialize journal if it exists
        if (window.nervousSystemJournal) {
            window.nervousSystemJournal.init();
        } else if (window.NervousSystemJournal) {
            new window.NervousSystemJournal();
        } else {
            // Create basic journal interface
            section.innerHTML = `
                <div class="journal-container">
                    <div class="content-header">
                        <h2>📝 Nervous System Journal</h2>
                        <p>Track your regulation patterns and insights</p>
                    </div>
                    
                    <div class="journal-stats">
                        <div class="stat-card">
                            <div class="stat-icon">📈</div>
                            <div class="stat-info">
                                <div class="stat-number">7</div>
                                <div class="stat-label">Day Streak</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-info">
                                <div class="stat-number">4.2/5</div>
                                <div class="stat-label">Avg Mood</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <div class="stat-number">12</div>
                                <div class="stat-label">Total Entries</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="journal-entry">
                        <h3>How is your nervous system today?</h3>
                        <textarea class="journal-textarea" placeholder="Describe what you're feeling in your body..."></textarea>
                        
                        <div class="mood-scale">
                            <div class="mood-option" data-mood="1">😰</div>
                            <div class="mood-option" data-mood="2">😟</div>
                            <div class="mood-option" data-mood="3">😐</div>
                            <div class="mood-option" data-mood="4">😌</div>
                            <div class="mood-option" data-mood="5">😊</div>
                        </div>
                        
                        <button class="save-entry-btn">Save Entry</button>
                    </div>
                </div>
            `;
        }
    }

    loadChat() {
        console.log('💬 Loading Enhanced Chat');
        const section = this.showSectionContainer('chat-section');
        
        // Initialize chat if it exists
        if (window.enhancedChat) {
            window.enhancedChat.init();
        } else if (window.EnhancedChat) {
            new window.EnhancedChat();
        } else {
            // Create basic chat interface
            section.innerHTML = `
                <div class="chat-container">
                    <div class="content-header">
                        <h2>💬 Chat with VERA</h2>
                        <p>Your AI nervous system companion</p>
                        <div class="chat-limits">7/10 chats this month</div>
                    </div>
                    
                    <div class="messages-container">
                        <div class="message vera-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <p>Hello! I'm VERA, your nervous system companion. How can I help you regulate today?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <textarea class="chat-input" placeholder="Share what you're feeling..."></textarea>
                        <button class="send-btn">Send</button>
                        <button class="voice-btn">🎤</button>
                    </div>
                    
                    <div class="feature-buttons">
                        <button class="feature-btn" onclick="addChatMessage('I need help with anxiety')">Help with Anxiety</button>
                        <button class="feature-btn" onclick="addChatMessage('I feel overwhelmed')">Feeling Overwhelmed</button>
                        <button class="feature-btn" onclick="addChatMessage('Breathing guidance')">Breathing Guidance</button>
                    </div>
                </div>
            `;
        }
    }

    loadProgress() {
        console.log('📈 Loading Progress Tracking');
        this.showSectionContainer('progress-section');
        
        // Same as dashboard for now
        this.loadDashboard();
    }

    loadSettings() {
        console.log('⚙️ Loading Settings');
        this.showSectionContainer('settings-section');
        
        // Create basic settings interface
        this.createSettingsInterface();
    }

    showSectionContainer(sectionId) {
        // First try to find existing section
        let section = document.getElementById(sectionId);
        
        if (!section) {
            // Create section if it doesn't exist
            section = document.createElement('div');
            section.id = sectionId;
            section.className = 'section-content active-section';
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.appendChild(section);
            }
        }
        
        // Show the section
        section.style.display = 'block';
        section.classList.add('active-section');
        
        return section;
    }

    createSettingsInterface() {
        const settingsSection = this.showSectionContainer('settings-section');
        settingsSection.innerHTML = `
            <div class="settings-container">
                <h2>Settings</h2>
                <div class="settings-grid">
                    <div class="setting-item">
                        <h3>Account</h3>
                        <p>Manage your VERA account settings</p>
                        <button class="btn-secondary">Edit Profile</button>
                    </div>
                    <div class="setting-item">
                        <h3>Notifications</h3>
                        <p>Customize your regulation reminders</p>
                        <button class="btn-secondary">Configure</button>
                    </div>
                    <div class="setting-item">
                        <h3>Privacy</h3>
                        <p>Control your data and privacy settings</p>
                        <button class="btn-secondary">Manage</button>
                    </div>
                </div>
            </div>
        `;
    }

    showUpgradeModal() {
        console.log('💳 Showing upgrade modal');
        // Redirect to pricing page for now
        window.location.href = '/pricing.html';
    }

    loadSectionContent(sectionName) {
        // Alias for showSection for compatibility
        this.showSection(sectionName);
    }
}

// Initialize VERACore immediately
console.log('🚀 Creating VERACore instance...');
window.VERACore = new VERACore();
console.log('✅ VERACore instance created:', window.VERACore);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM Loaded - Initializing VERA Systems');
    
    // Initialize VERACore first
    if (window.VERACore) {
        console.log('🔧 Initializing VERACore...');
        window.VERACore.init();
    } else {
        console.error('❌ VERACore not found!');
    }
    
    // Initialize main app
    if (!window.veraApp) {
        console.log('🏗️ Creating VERAExplorerApp...');
        window.veraApp = new VERAExplorerApp();
    }
    
    // Test navigation
    console.log('🧪 Testing VERACore methods:');
    console.log('showSection method:', typeof window.VERACore.showSection);
    
    // Make sure navigation works
    setTimeout(() => {
        console.log('🎯 VERACore ready for navigation!');
    }, 1000);
});

// Utility functions for basic interactions
function startBreathingTechnique(technique) {
    console.log(`🫁 Starting ${technique} breathing technique`);
    alert(`Starting ${technique} breathing technique! In a full version, this would launch the guided breathing interface.`);
}

function startGroundingTechnique(technique) {
    console.log(`🌱 Starting ${technique} grounding technique`);
    alert(`Starting ${technique} grounding technique! In a full version, this would launch the guided grounding interface.`);
}

function addChatMessage(message) {
    console.log(`💬 Adding chat message: ${message}`);
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // Add VERA response
        setTimeout(() => {
            const veraResponse = document.createElement('div');
            veraResponse.className = 'message vera-message';
            veraResponse.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>I understand you're experiencing ${message.toLowerCase()}. Let me guide you through some regulation techniques...</p>
                </div>
            `;
            messagesContainer.appendChild(veraResponse);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

function submitBodyCheck() {
    const input = document.getElementById('bodyCheckInput');
    if (input && input.value.trim()) {
        console.log('📝 Body check submitted:', input.value);
        alert('Thank you for sharing! VERA is processing your body awareness...');
        input.value = '';
    }
}

// Make sure VERACore is available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VERACore;
}