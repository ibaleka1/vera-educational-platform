// VERA User Authentication & Trial Management
class VERAAuthSystem {
    constructor() {
        this.apiBase = 'https://api.vera-platform.com'; // Production API
        this.localMode = true; // Set to false in production
        
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthListeners();
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('veraUser');
        const token = localStorage.getItem('veraToken');
        
        if (userData && token) {
            const user = JSON.parse(userData);
            this.handleAuthenticatedUser(user);
        } else {
            this.showWelcomeFlow();
        }
    }

    async signup(userData) {
        try {
            if (this.localMode) {
                // Local storage simulation
                const user = {
                    id: 'user_' + Date.now(),
                    name: userData.name,
                    email: userData.email,
                    createdAt: new Date().toISOString(),
                    trialStarted: new Date().toISOString()
                };
                
                localStorage.setItem('veraUser', JSON.stringify(user));
                localStorage.setItem('veraToken', 'local_token_' + user.id);
                
                this.startFreeTrial(user);
                this.handleAuthenticatedUser(user);
                
                return { success: true, user };
            } else {
                // Production API call
                const response = await fetch(`${this.apiBase}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    localStorage.setItem('veraUser', JSON.stringify(result.user));
                    localStorage.setItem('veraToken', result.token);
                    
                    this.startFreeTrial(result.user);
                    this.handleAuthenticatedUser(result.user);
                }
                
                return result;
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    async login(credentials) {
        try {
            if (this.localMode) {
                // Local storage simulation
                const userData = localStorage.getItem('veraUser');
                if (userData) {
                    const user = JSON.parse(userData);
                    this.handleAuthenticatedUser(user);
                    return { success: true, user };
                } else {
                    return { success: false, error: 'No local user found' };
                }
            } else {
                // Production API call
                const response = await fetch(`${this.apiBase}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    localStorage.setItem('veraUser', JSON.stringify(result.user));
                    localStorage.setItem('veraToken', result.token);
                    
                    this.handleAuthenticatedUser(result.user);
                }
                
                return result;
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    startFreeTrial(user) {
        // Get selected plan from pricing page
        const selectedPlan = localStorage.getItem('selectedPlan') || 'explorer';
        const tierFeatures = this.getTierFeatures(selectedPlan);
        
        const trialData = {
            userId: user.id,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            daysRemaining: 7,
            isActive: true,
            isSubscribed: false,
            tier: selectedPlan,
            selectedPlan: selectedPlan,
            features: tierFeatures
        };
        
        localStorage.setItem('veraTrial', JSON.stringify(trialData));
        
        // Store user tier information
        const userData = {
            ...user,
            tier: selectedPlan,
            subscription: 'trial',
            planFeatures: tierFeatures,
            trialPlan: selectedPlan
        };
        localStorage.setItem('veraUser', JSON.stringify(userData));
        
        // Send welcome email (in production)
        this.sendWelcomeEmail(user);
    }

    getTierFeatures(tier) {
        const tierDefinitions = {
            explorer: {
                chatLimit: 10,
                exercises: 'basic',
                neuralVisualization: 'simple',
                breathingExercises: 5,
                groundingTechniques: 6,
                journalPrompts: 'daily',
                veraVoice: true,
                progressTracking: true,
                features: ['breathing', 'grounding', 'chat', 'journal']
            },
            regulator: {
                chatLimit: Infinity,
                exercises: 'full',
                neuralVisualization: 'enhanced',
                breathingExercises: 'all',
                groundingTechniques: 'all',
                journalPrompts: '50+',
                veraVoice: true,
                progressTracking: true,
                movementTools: true,
                frequencyLibrary: true,
                weeklyInsights: true,
                features: ['breathing', 'grounding', 'chat', 'journal', 'movement', 'frequency', 'insights']
            },
            integrator: {
                chatLimit: Infinity,
                exercises: 'advanced',
                neuralVisualization: 'complete',
                personalizedPlans: true,
                crisisSupport: true,
                adaptiveCodeMapping: true,
                integrationGuidance: true,
                methodologyAccess: true,
                prioritySupport: true,
                features: ['breathing', 'grounding', 'chat', 'journal', 'movement', 'frequency', 'insights', 'personalized', 'crisis', 'adaptive', 'methodology']
            },
            enterprise: {
                everything: true,
                customization: true,
                teamManagement: true,
                professionalTools: true,
                customIntegration: true,
                training: true,
                analytics: true,
                compliance: true,
                dedicatedSupport: true,
                features: ['all']
            }
        };
        
        return tierDefinitions[tier] || tierDefinitions.explorer;
    }

    getUserTier() {
        const trialData = localStorage.getItem('veraTrial');
        const userData = localStorage.getItem('veraUser');
        
        if (trialData) {
            const trial = JSON.parse(trialData);
            return trial.tier || 'explorer';
        }
        
        if (userData) {
            const user = JSON.parse(userData);
            return user.tier || 'explorer';
        }
        
        return 'explorer';
    }

    hasFeatureAccess(featureName) {
        const tier = this.getUserTier();
        const features = this.getTierFeatures(tier);
        
        if (features.features && features.features.includes('all')) {
            return true;
        }
        
        return features.features && features.features.includes(featureName);
    }

    getChatLimit() {
        const tier = this.getUserTier();
        const features = this.getTierFeatures(tier);
        return features.chatLimit === Infinity ? 999 : features.chatLimit;
    }

    handleAuthenticatedUser(user) {
        // Update UI with user information
        if (window.app) {
            window.app.user = user;
            window.app.updateUserGreeting();
        }
        
        // Hide auth forms, show app
        this.hideAuthForms();
        this.showWelcomeMessage(user);
    }

    showWelcomeFlow() {
        // Check if we're on the main landing page
        if (window.location.pathname.includes('app.html')) {
            // Redirect to landing page for signup
            window.location.href = '/index.html#signup';
        }
    }

    hideAuthForms() {
        const authOverlay = document.getElementById('authOverlay');
        if (authOverlay) {
            authOverlay.style.display = 'none';
        }
    }

    showWelcomeMessage(user) {
        const welcomeMessage = `Welcome ${user.name}! Your 7-day journey begins now`;
        
        if (window.app) {
            window.app.showNotification(welcomeMessage);
        }
        
        // Update page title
        const contentTitle = document.getElementById('contentTitle');
        if (contentTitle && user.name) {
            contentTitle.innerHTML = `Welcome back, <span style="color: var(--neural);">${user.name}</span>!<br><small style="font-size: 0.7em; font-weight: 300;">How are you feeling in your body today?</small>`;
        }
    }

    async sendWelcomeEmail(user) {
        // In production, this would send an actual email
        console.log(`Sending welcome email to ${user.email}`);
        
        const emailContent = {
            to: user.email,
            subject: 'Welcome to VERA - Your 7-Day Journey Begins',
            template: 'welcome_trial',
            data: {
                name: user.name,
                trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                loginUrl: window.location.origin + '/app.html'
            }
        };
        
        if (!this.localMode) {
            try {
                await fetch(`${this.apiBase}/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('veraToken')}`
                    },
                    body: JSON.stringify(emailContent)
                });
            } catch (error) {
                console.error('Email send error:', error);
            }
        }
    }

    logout() {
        localStorage.removeItem('veraUser');
        localStorage.removeItem('veraToken');
        localStorage.removeItem('veraTrial');
        localStorage.removeItem('veraChats');
        
        // Redirect to landing page
        window.location.href = '/index.html';
    }

    setupAuthListeners() {
        // Listen for auth events from landing page
        window.addEventListener('message', (event) => {
            if (event.data.type === 'VERA_AUTH_SUCCESS') {
                this.handleAuthenticatedUser(event.data.user);
            }
        });
        
        // Setup logout listener
        const logoutBtn = document.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    // Trial management methods
    checkTrialExpiration() {
        const trialData = JSON.parse(localStorage.getItem('veraTrial') || '{}');
        
        if (!trialData.isSubscribed && trialData.isActive) {
            const endDate = new Date(trialData.endDate);
            const now = new Date();
            
            if (now > endDate) {
                trialData.isActive = false;
                trialData.daysRemaining = 0;
                localStorage.setItem('veraTrial', JSON.stringify(trialData));
                
                this.handleTrialExpiration();
                return true;
            }
        }
        
        return false;
    }

    handleTrialExpiration() {
        // Show upgrade modal
        if (window.app) {
            window.app.showUpgradeModal();
        }
        
        // Limit features
        this.limitFeatures();
    }

    limitFeatures() {
        // Disable premium features
        const premiumElements = document.querySelectorAll('[data-premium="true"]');
        premiumElements.forEach(element => {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
        });
        
        // Show upgrade prompts
        const upgradePrompts = document.querySelectorAll('.upgrade-prompt');
        upgradePrompts.forEach(prompt => {
            prompt.style.display = 'block';
        });
    }

    // Subscription management
    async upgradeToExplorer(paymentMethod) {
        try {
            if (this.localMode) {
                // Simulate successful upgrade
                const trialData = JSON.parse(localStorage.getItem('veraTrial') || '{}');
                trialData.isSubscribed = true;
                trialData.subscriptionPlan = 'explorer';
                trialData.subscriptionPrice = 19;
                trialData.billingCycle = 'monthly';
                trialData.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                
                localStorage.setItem('veraTrial', JSON.stringify(trialData));
                
                return { success: true, subscription: trialData };
            } else {
                // Production Stripe integration
                const response = await fetch(`${this.apiBase}/billing/upgrade`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('veraToken')}`
                    },
                    body: JSON.stringify({
                        plan: 'explorer',
                        paymentMethod: paymentMethod
                    })
                });
                
                return await response.json();
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', function() {
    window.veraAuth = new VERAAuthSystem();
    
    // Check trial expiration every 5 minutes
    setInterval(() => {
        window.veraAuth.checkTrialExpiration();
    }, 5 * 60 * 1000);
});