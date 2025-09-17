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
        if (contentArea.children.length === 0 || contentArea.querySelector('.section-loading')) {
            contentArea.innerHTML = `
                <div class="grounding-techniques">
                    <div class="techniques-header">
                        <h2>Grounding Techniques</h2>
                        <p class="techniques-subtitle">Ground yourself in the present moment</p>
                    </div>
                    <div class="section-loading">
                        <div class="loading-neural"></div>
                        <p>Coming soon: Interactive grounding techniques</p>
                    </div>
                </div>
            `;
        }
    }

    loadJournalSection(contentArea) {
        if (contentArea.children.length === 0 || contentArea.querySelector('.section-loading')) {
            contentArea.innerHTML = `
                <div class="journal-interface">
                    <div class="journal-header">
                        <h2>Your Nervous System Journal</h2>
                        <p class="journal-subtitle">Track your regulation journey</p>
                    </div>
                    <div class="section-loading">
                        <div class="loading-neural"></div>
                        <p>Coming soon: Daily prompts and mood tracking</p>
                    </div>
                </div>
            `;
        }
    }

    loadChatSection(contentArea) {
        if (contentArea.children.length === 0 || contentArea.querySelector('.section-loading')) {
            contentArea.innerHTML = `
                <div class="vera-chat-interface">
                    <div class="chat-header">
                        <h2>Chat with VERA</h2>
                        <p class="chat-subtitle">Your nervous system regulation companion</p>
                    </div>
                    <div class="section-loading">
                        <div class="loading-neural"></div>
                        <p>Coming soon: Enhanced VERA chat interface</p>
                    </div>
                </div>
            `;
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