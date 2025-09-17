// VERA Pricing Page JavaScript
class VERAPricing {
    constructor() {
        this.selectedPlan = null;
        this.userTiers = {
            explorer: {
                chatLimit: 10,
                exercises: 'basic',
                neuralVisualization: 'simple',
                price: 19,
                features: {
                    breathingExercises: 5,
                    groundingTechniques: 6,
                    journalPrompts: 'daily',
                    veraChats: 10
                }
            },
            regulator: {
                chatLimit: Infinity,
                exercises: 'full',
                neuralVisualization: 'enhanced',
                price: 39,
                features: {
                    breathingExercises: 'all',
                    groundingTechniques: 'all',
                    journalPrompts: '50+',
                    veraChats: 'unlimited',
                    movementTools: true,
                    frequencyLibrary: true,
                    weeklyInsights: true
                }
            },
            integrator: {
                chatLimit: Infinity,
                exercises: 'advanced',
                neuralVisualization: 'complete',
                prioritySupport: true,
                price: 79,
                features: {
                    personalizedPlans: true,
                    crisisSupport: true,
                    adaptiveCodeMapping: true,
                    integrationGuidance: true,
                    methodologyAccess: true
                }
            },
            enterprise: {
                everything: true,
                customization: true,
                dedicated: true,
                price: 'custom',
                features: {
                    teamManagement: true,
                    professionalTools: true,
                    customIntegration: true,
                    training: true,
                    analytics: true,
                    compliance: true
                }
            }
        };
        
        this.init();
    }

    init() {
        this.setupPricingInteractions();
        this.setupPlanComparison();
        this.setupNeuralEffects();
        this.handleURLParams();
    }

    setupPricingInteractions() {
        // Add hover effects to pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.activateCardNeural(card);
            });

            card.addEventListener('mouseleave', () => {
                this.deactivateCardNeural(card);
            });
        });

        // Add click interactions to industry tags
        document.querySelectorAll('.industry-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.showIndustryInfo(tag.textContent);
            });
        });

        // FAQ interactions
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', () => {
                this.expandFAQ(item);
            });
        });
    }

    setupPlanComparison() {
        // Create plan comparison matrix
        this.createComparisonTooltips();
        
        // Add plan switching animations
        this.setupPlanSwitching();
    }

    setupNeuralEffects() {
        // Enhance neural particles based on plan tier
        document.querySelectorAll('.pricing-card').forEach(card => {
            const planType = card.getAttribute('data-plan');
            this.setupPlanSpecificEffects(card, planType);
        });
    }

    setupPlanSpecificEffects(card, planType) {
        const neuralElement = card.querySelector('.plan-neural');
        
        switch(planType) {
            case 'explorer':
                this.addExplorerEffects(neuralElement);
                break;
            case 'regulator':
                this.addRegulatorEffects(neuralElement);
                break;
            case 'integrator':
                this.addIntegratorEffects(neuralElement);
                break;
            case 'enterprise':
                this.addEnterpriseEffects(neuralElement);
                break;
        }
    }

    addExplorerEffects(element) {
        if (!element) return;
        
        setInterval(() => {
            const breathingGlow = 0.6 + 0.4 * Math.sin(Date.now() * 0.002);
            element.style.boxShadow = `0 0 ${20 * breathingGlow}px rgba(34, 197, 94, ${0.4 * breathingGlow})`;
        }, 50);
    }

    addRegulatorEffects(element) {
        if (!element) return;
        
        setInterval(() => {
            const regulationFlow = 0.7 + 0.3 * Math.sin(Date.now() * 0.001);
            element.style.boxShadow = `0 0 ${25 * regulationFlow}px rgba(59, 130, 246, ${0.5 * regulationFlow})`;
            element.style.transform = `scale(${1 + 0.1 * regulationFlow})`;
        }, 50);
    }

    addIntegratorEffects(element) {
        if (!element) return;
        
        let hueShift = 0;
        setInterval(() => {
            hueShift += 1;
            const integrationPulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.003);
            element.style.boxShadow = `0 0 ${30 * integrationPulse}px hsla(${270 + hueShift % 60}, 70%, 60%, ${0.6 * integrationPulse})`;
        }, 100);
    }

    addEnterpriseEffects(element) {
        if (!element) return;
        
        setInterval(() => {
            const enterpriseGlow = 0.9 + 0.1 * Math.sin(Date.now() * 0.004);
            const secondaryGlow = 0.5 + 0.5 * Math.cos(Date.now() * 0.002);
            element.style.boxShadow = `
                0 0 ${35 * enterpriseGlow}px rgba(245, 158, 11, ${0.7 * enterpriseGlow}),
                0 0 ${15 * secondaryGlow}px rgba(139, 92, 246, ${0.3 * secondaryGlow})
            `;
        }, 50);
    }

    activateCardNeural(card) {
        const planType = card.getAttribute('data-plan');
        
        // Enhance neural effects on hover
        if (window.neuralSystem) {
            const rect = card.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            window.neuralSystem.energize(x, y, 0.6);
            
            // Set appropriate neural state
            switch(planType) {
                case 'explorer':
                    window.setNeuralCoherence && window.setNeuralCoherence();
                    break;
                case 'regulator':
                    window.setNeuralRegulation && window.setNeuralRegulation();
                    break;
                case 'integrator':
                case 'enterprise':
                    window.setNeuralActivation && window.setNeuralActivation();
                    break;
            }
        }

        // Add hover glow effect
        card.style.boxShadow = `0 20px 60px rgba(139, 92, 246, 0.4)`;
    }

    deactivateCardNeural(card) {
        // Reset neural effects
        if (window.resetNeuralState) {
            setTimeout(() => {
                window.resetNeuralState();
            }, 500);
        }

        // Reset card shadow
        card.style.boxShadow = '';
    }

    createComparisonTooltips() {
        // Add tooltips for feature comparisons
        document.querySelectorAll('.feature-group li').forEach(feature => {
            feature.addEventListener('mouseenter', (e) => {
                this.showFeatureTooltip(e.target, feature.textContent);
            });

            feature.addEventListener('mouseleave', () => {
                this.hideFeatureTooltip();
            });
        });
    }

    showFeatureTooltip(element, featureText) {
        const tooltip = document.createElement('div');
        tooltip.className = 'feature-tooltip';
        tooltip.innerHTML = this.getFeatureDescription(featureText);
        
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(15, 23, 42, 0.95);
            color: var(--text-primary);
            padding: var(--space-sm) var(--space-md);
            border-radius: var(--radius);
            font-size: var(--font-xs);
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 92, 246, 0.3);
            max-width: 250px;
            line-height: 1.4;
        `;

        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.right + 10 + 'px';
        tooltip.style.top = rect.top + 'px';

        this.currentTooltip = tooltip;
    }

    hideFeatureTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    getFeatureDescription(featureText) {
        const descriptions = {
            '5 Breathing Exercises': 'Box breathing, Physiological sigh, Coherent breathing, Voo breath, and 4-7-8 technique',
            '6 Grounding Techniques': '5-4-3-2-1 sensory, Progressive muscle relaxation, Cold exposure, and more',
            'Daily Journal Prompts': 'Guided nervous system reflection and tracking',
            '10 VERA Chats/month': 'Voice-enabled conversations with VERA for regulation guidance',
            'Basic Neural Particles': 'Interactive neural visualization for therapeutic feedback',
            'No chat limits': 'Unlimited conversations with VERA - no monthly restrictions',
            'Voice-to-text enabled': 'Speak naturally to VERA with automatic transcription',
            'Session replay capability': 'Review and replay previous regulation sessions',
            '50+ daily prompts': 'Extensive library of somatic and nervous system journal prompts',
            'Bilateral stimulation sequences': 'EMDR-inspired bilateral movements for integration',
            'Binaural beats for regulation': 'Therapeutic frequency combinations for nervous system regulation',
            'Personal nervous system analysis': 'Weekly insights into your unique regulation patterns',
            'Custom 30-day protocols': 'Personalized regulation plans adapted to your nervous system',
            '24/7 acute dysregulation guidance': 'Crisis support protocols available around the clock',
            'Complete 30+ code profile': 'Full adaptive nervous system mapping and analysis',
            'Pattern prediction algorithm': 'AI-powered insights into your regulation patterns',
            'Video guides from Eva & Julija': 'Direct education from VERA methodology founders',
            'Source protocols': 'Access to original research and practitioner-level techniques'
        };

        return descriptions[featureText] || 'Advanced nervous system regulation feature';
    }

    setupPlanSwitching() {
        // Add smooth transitions between plan views
        const cards = document.querySelectorAll('.pricing-card');
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    showIndustryInfo(industryName) {
        // Show industry-specific information
        const industryData = {
            'Wellness Departments': 'Reduce employee burnout, increase engagement, measurable ROI on wellness investments',
            'Mental Health Clinics': 'Evidence-based tools for therapists, client progress tracking, HIPAA compliance',
            'Corporate Wellness Programs': '40% reduction in stress-related absences, team coherence building',
            'Healthcare Systems': 'Provider burnout reduction, patient nervous system education, scalable implementation',
            'University Counseling Centers': 'Student stress management, crisis intervention protocols, preventive care',
            'First Responder Organizations': 'PTSD prevention, trauma processing, rapid regulation techniques',
            'Veteran Support Services': 'Trauma-informed nervous system regulation, community building, peer support'
        };

        this.showModal('Industry Focus: ' + industryName, industryData[industryName] || 'Specialized nervous system regulation for your organization.');
    }

    expandFAQ(faqItem) {
        // Add expansion animation for FAQ items
        faqItem.classList.toggle('expanded');
        
        if (faqItem.classList.contains('expanded')) {
            faqItem.style.transform = 'scale(1.02)';
            faqItem.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
        } else {
            faqItem.style.transform = '';
            faqItem.style.boxShadow = '';
        }
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'pricing-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
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

        modal.querySelector('.modal-content').style.cssText = `
            background: rgba(15, 23, 42, 0.95);
            border-radius: var(--radius);
            padding: var(--space-xl);
            max-width: 500px;
            margin: var(--space-lg);
            border: 1px solid rgba(139, 92, 246, 0.3);
            backdrop-filter: blur(20px);
        `;

        document.body.appendChild(modal);

        // Close modal on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        
        if (plan && this.userTiers[plan]) {
            this.highlightPlan(plan);
        }
    }

    highlightPlan(planName) {
        const card = document.querySelector(`[data-plan="${planName}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.activateCardNeural(card);
            
            setTimeout(() => {
                this.deactivateCardNeural(card);
            }, 2000);
        }
    }
}

// Global plan selection function
window.selectPlan = function(planName) {
    const planData = window.pricingSystem?.userTiers[planName];
    
    if (!planData) {
        console.error('Invalid plan:', planName);
        return;
    }

    // Store selected plan
    localStorage.setItem('selectedPlan', planName);
    localStorage.setItem('planData', JSON.stringify(planData));

    // Handle different plan actions
    switch(planName) {
        case 'explorer':
            // Redirect to signup with plan pre-selected
            window.location.href = 'index.html#signup?plan=explorer';
            break;
        
        case 'regulator':
            // Redirect to upgrade flow
            window.location.href = 'app.html#upgrade?plan=regulator';
            break;
        
        case 'integrator':
            // Redirect to integrator signup
            window.location.href = 'app.html#upgrade?plan=integrator';
            break;
        
        case 'enterprise':
            // Open contact form
            window.open('mailto:sales@vera-platform.com?subject=Enterprise Plan Interest&body=Hi, I\'m interested in VERA Enterprise for my organization.', '_blank');
            break;
    }

    // Neural effect for selection
    if (window.neuralSystem) {
        const card = document.querySelector(`[data-plan="${planName}"]`);
        if (card) {
            const rect = card.getBoundingClientRect();
            window.neuralSystem.energize(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.0);
        }
    }

    // Show selection confirmation
    showPlanSelection(planName, planData);
};

function showPlanSelection(planName, planData) {
    const notification = document.createElement('div');
    notification.className = 'plan-selection-notification';
    notification.innerHTML = `
        <div class="selection-content">
            <div class="selection-neural"></div>
            <h4>Great Choice!</h4>
            <p>You selected VERA ${planName.toUpperCase()}</p>
            <p class="selection-price">$${planData.price}/month</p>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(59, 130, 246, 0.95));
        color: white;
        padding: var(--space-lg);
        border-radius: var(--radius);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize pricing system
document.addEventListener('DOMContentLoaded', function() {
    window.pricingSystem = new VERAPricing();
    
    // Add CSS animation for plan selection notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .selection-neural {
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            margin: 0 auto var(--space-sm);
            animation: neuralPulse 1s ease-in-out infinite;
        }
        
        .selection-content {
            text-align: center;
        }
        
        .selection-content h4 {
            margin: var(--space-sm) 0;
            font-size: var(--font-lg);
        }
        
        .selection-content p {
            margin: var(--space-xs) 0;
            font-size: var(--font-sm);
        }
        
        .selection-price {
            font-size: var(--font-md) !important;
            font-weight: 600 !important;
        }
    `;
    document.head.appendChild(style);
});