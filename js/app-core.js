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
});