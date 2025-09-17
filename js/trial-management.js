// VERA Trial & Subscription Management System

class VERATierManager {
    constructor() {
        this.tiers = {
            free: {
                name: 'Free Trial',
                features: ['breathing-basic', 'grounding-basic', 'journal-basic', 'chat-limited'],
                chatLimit: 10,
                duration: 7, // days
                price: 0
            },
            explorer: {
                name: 'Explorer',
                features: ['breathing-all', 'grounding-basic', 'journal-standard', 'chat-limited'],
                chatLimit: 10,
                price: 19
            },
            regulator: {
                name: 'Regulator', 
                features: ['breathing-all', 'grounding-advanced', 'journal-enhanced', 'chat-extended'],
                chatLimit: 50,
                price: 49
            },
            integrator: {
                name: 'Integrator',
                features: ['breathing-all', 'grounding-all', 'journal-premium', 'chat-unlimited', 'voice-enabled'],
                chatLimit: -1, // unlimited
                price: 99
            },
            enterprise: {
                name: 'Enterprise',
                features: ['all-features', 'team-dashboard', 'custom-integration', 'priority-support'],
                chatLimit: -1,
                price: 299
            }
        };
        
        this.currentTier = this.getCurrentUserTier();
        this.init();
    }

    init() {
        console.log(`🎯 VERA Tier Manager initialized - Current tier: ${this.currentTier}`);
        this.updateTierDisplay();
        this.enforceFeatureRestrictions();
    }

    getCurrentUserTier() {
        const userData = localStorage.getItem('veraUser');
        const trialData = localStorage.getItem('veraTrial');
        
        if (userData) {
            const user = JSON.parse(userData);
            if (user.subscription && user.subscription.active) {
                return user.subscription.tier;
            }
        }
        
        if (trialData) {
            const trial = JSON.parse(trialData);
            if (trial.isActive) {
                return 'free';
            }
        }
        
        // Default to free trial
        return 'free';
    }

    hasFeatureAccess(featureName) {
        const tierFeatures = this.tiers[this.currentTier]?.features || [];
        
        // Check specific feature access
        const featureMap = {
            'breathing-box': ['breathing-basic', 'breathing-all'],
            'breathing-physiological': ['breathing-basic', 'breathing-all'],
            'breathing-coherent': ['breathing-basic', 'breathing-all'],
            'breathing-voo': ['breathing-all'],
            'breathing-478': ['breathing-all'],
            
            'grounding-sensory': ['grounding-basic', 'grounding-advanced', 'grounding-all'],
            'grounding-progressive': ['grounding-basic', 'grounding-advanced', 'grounding-all'],
            'grounding-bilateral': ['grounding-advanced', 'grounding-all'],
            'grounding-movement': ['grounding-advanced', 'grounding-all'],
            'grounding-cold': ['grounding-all'],
            'grounding-breathwork': ['grounding-all'],
            
            'journal-basic': ['journal-basic', 'journal-standard', 'journal-enhanced', 'journal-premium'],
            'journal-insights': ['journal-enhanced', 'journal-premium'],
            'journal-patterns': ['journal-premium'],
            
            'chat-basic': ['chat-limited', 'chat-extended', 'chat-unlimited'],
            'chat-voice': ['voice-enabled'],
            'chat-unlimited': ['chat-unlimited']
        };
        
        const requiredFeatures = featureMap[featureName] || [featureName];
        return requiredFeatures.some(feature => tierFeatures.includes(feature));
    }

    getChatLimit() {
        return this.tiers[this.currentTier]?.chatLimit || 0;
    }

    canUseChat() {
        const chatLimit = this.getChatLimit();
        if (chatLimit === -1) return true; // unlimited
        
        const chatData = localStorage.getItem('veraChats');
        if (!chatData) return true;
        
        const chats = JSON.parse(chatData);
        const currentMonth = new Date().getMonth();
        
        if (chats.month !== currentMonth) return true; // new month
        
        return chats.count < chatLimit;
    }

    updateTierDisplay() {
        // Update tier indicator
        const tierIndicator = document.getElementById('tierIndicator');
        if (tierIndicator) {
            tierIndicator.textContent = this.tiers[this.currentTier]?.name || 'Free';
            tierIndicator.className = `tier-indicator tier-${this.currentTier}`;
        }
        
        // Update chat limit display
        const chatLimitDisplay = document.getElementById('chatLimitDisplay');
        if (chatLimitDisplay) {
            const chatLimit = this.getChatLimit();
            const chatData = localStorage.getItem('veraChats');
            let used = 0;
            
            if (chatData) {
                const chats = JSON.parse(chatData);
                const currentMonth = new Date().getMonth();
                if (chats.month === currentMonth) {
                    used = chats.count;
                }
            }
            
            if (chatLimit === -1) {
                chatLimitDisplay.textContent = '∞ Unlimited';
            } else {
                chatLimitDisplay.textContent = `${used}/${chatLimit}`;
            }
        }
        
        // Update trial status
        this.updateTrialStatus();
    }

    updateTrialStatus() {
        const trialData = localStorage.getItem('veraTrial');
        if (!trialData) return;
        
        const trial = JSON.parse(trialData);
        const trialStatusElement = document.getElementById('trialStatus');
        
        if (trialStatusElement && this.currentTier === 'free') {
            if (trial.isActive) {
                trialStatusElement.textContent = `Free Trial`;
                trialStatusElement.className = 'trial-active';
            } else {
                trialStatusElement.textContent = 'Trial Expired';
                trialStatusElement.className = 'trial-expired';
            }
        }
    }

    enforceFeatureRestrictions() {
        // Add tier restrictions to locked features
        const restrictedFeatures = document.querySelectorAll('[data-tier]');
        
        restrictedFeatures.forEach(element => {
            const requiredTier = element.getAttribute('data-tier');
            const currentTierLevel = this.getTierLevel(this.currentTier);
            const requiredTierLevel = this.getTierLevel(requiredTier);
            
            if (currentTierLevel < requiredTierLevel) {
                element.classList.add('tier-locked');
                
                // Update button text for locked features
                const button = element.querySelector('button');
                if (button) {
                    const tierName = this.tiers[requiredTier]?.name || requiredTier;
                    button.textContent = `Upgrade to ${tierName}`;
                    button.onclick = () => this.showUpgradePrompt(requiredTier);
                }
            }
        });
    }

    getTierLevel(tierName) {
        const levels = {
            'free': 0,
            'explorer': 1,
            'regulator': 2,
            'integrator': 3,
            'enterprise': 4
        };
        return levels[tierName] || 0;
    }

    showUpgradePrompt(targetTier = null) {
        const tierName = targetTier ? this.tiers[targetTier]?.name : 'Premium';
        const upgradeModal = document.getElementById('upgradeModal');
        
        if (upgradeModal) {
            // Update modal content for specific tier
            const modalContent = upgradeModal.querySelector('.upgrade-modal');
            if (modalContent && targetTier) {
                const tierInfo = this.tiers[targetTier];
                modalContent.innerHTML = `
                    <div class="modal-header">
                        <h2>Upgrade to ${tierInfo.name}</h2>
                        <button class="modal-close" onclick="closeUpgradeModal()">×</button>
                    </div>
                    <div class="modal-content">
                        <div class="tier-preview">
                            <div class="tier-price">$${tierInfo.price}/month</div>
                            <div class="tier-features">
                                <h3>Unlock:</h3>
                                <ul>
                                    ${this.getTierFeaturesList(targetTier).map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="upgrade-actions">
                            <button class="btn-primary upgrade-btn" onclick="window.location.href='/pricing.html'">
                                View All Plans
                            </button>
                            <button class="btn-secondary" onclick="closeUpgradeModal()">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                `;
            }
            upgradeModal.style.display = 'flex';
        } else {
            // Fallback to pricing page
            window.location.href = '/pricing.html';
        }
    }

    getTierFeaturesList(tierName) {
        const featureLists = {
            explorer: [
                'All 5 Breathing Exercises',
                '10 Monthly Chat Sessions',
                'Basic Grounding Techniques',
                'Standard Journal Features'
            ],
            regulator: [
                'Advanced Grounding Techniques',
                '50 Monthly Chat Sessions', 
                'Enhanced Journal Insights',
                'Bilateral Stimulation Exercises'
            ],
            integrator: [
                'Complete Grounding Library',
                'Unlimited Chat Sessions',
                'Voice-Enabled Conversations',
                'Advanced Pattern Recognition'
            ],
            enterprise: [
                'Team Dashboard & Analytics',
                'Custom Integration Support',
                '24/7 Priority Support',
                'Advanced Admin Controls'
            ]
        };
        
        return featureLists[tierName] || [];
    }

    upgradeTo(newTier) {
        // In a real app, this would handle payment processing
        console.log(`🚀 Upgrading to ${newTier} tier`);
        
        // Update user data
        const userData = localStorage.getItem('veraUser');
        if (userData) {
            const user = JSON.parse(userData);
            user.subscription = {
                tier: newTier,
                active: true,
                startDate: new Date().toISOString()
            };
            localStorage.setItem('veraUser', JSON.stringify(user));
        }
        
        // Update current tier and refresh restrictions
        this.currentTier = newTier;
        this.updateTierDisplay();
        this.enforceFeatureRestrictions();
        
        // Show success message
        alert(`🎉 Welcome to VERA ${this.tiers[newTier].name}! All features are now unlocked.`);
    }
}

// Utility functions
function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize tier management
window.veraTierManager = new VERATierManager();

// Make functions globally available
window.closeUpgradeModal = closeUpgradeModal;