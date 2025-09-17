/**
 * VERA Presentation Demo - Complete Feature Showcase
 * Optimized for Web, Desktop, Tablet, and Mobile
 */

class VERAPresentationDemo {
    constructor() {
        this.currentDemo = 'overview';
        this.isPresenting = true;
        this.demoData = {
            user: {
                name: 'Alex Chen',
                tier: 'integrator',
                joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
                streak: 12,
                totalSessions: 67
            },
            analytics: {
                weeklyMood: [3.2, 3.8, 4.1, 3.9, 4.3, 4.5, 4.2],
                techniques: {
                    'Box Breathing': 23,
                    'Physiological Sigh': 18,
                    '5-4-3-2-1 Grounding': 15,
                    'Progressive Muscle': 12,
                    'Coherent Breathing': 10
                },
                journalEntries: 34,
                chatMessages: 156
            }
        };
        
        this.initializeDemo();
    }

    async initializeDemo() {
        await this.setupDemoData();
        this.createDemoControls();
        this.optimizeForAllDevices();
    }

    async setupDemoData() {
        // Pre-populate with demo data for presentation
        const demoJournalEntries = [
            {
                id: 1,
                date: Date.now() - 1 * 24 * 60 * 60 * 1000,
                mood: 4,
                content: "Had a stressful meeting today but used the physiological sigh technique and felt much calmer afterward. The breathing exercises are really helping me manage work anxiety.",
                prompt: "What nervous system state did you experience most today?",
                tier: 'integrator',
                createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000
            },
            {
                id: 2,
                date: Date.now() - 2 * 24 * 60 * 60 * 1000,
                mood: 5,
                content: "Excellent day! Started with box breathing this morning and felt grounded all day. The 5-4-3-2-1 grounding technique helped me stay present during challenging conversations.",
                prompt: "How did your regulation practices serve you today?",
                tier: 'integrator',
                createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
            },
            {
                id: 3,
                date: Date.now() - 3 * 24 * 60 * 60 * 1000,
                mood: 3,
                content: "Felt overwhelmed in the afternoon. Used the cold water reset technique and it helped shift my nervous system state. Still learning to catch dysregulation earlier.",
                prompt: "What did you notice about your nervous system patterns?",
                tier: 'integrator',
                createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
            }
        ];

        localStorage.setItem('vera_journal_entries', JSON.stringify(demoJournalEntries));
        
        // Demo chat history
        const demoChatHistory = [
            {
                id: 1,
                title: "Understanding Nervous System States",
                messages: [
                    { role: 'user', content: 'Can you explain the different nervous system states?', timestamp: Date.now() - 60000 },
                    { role: 'assistant', content: 'The nervous system has three main states: sympathetic (fight/flight), parasympathetic (rest/digest), and dorsal vagal (shutdown). Each serves important functions for survival and regulation.', timestamp: Date.now() - 55000 }
                ],
                createdAt: Date.now() - 60000,
                tier: 'integrator'
            }
        ];

        localStorage.setItem('vera_chat_history', JSON.stringify(demoChatHistory));

        // Demo breathing history
        const demoBreathingHistory = [
            { technique: 'Box Breathing', duration: 5, beforeMood: 3, afterMood: 4, createdAt: Date.now() - 3600000 },
            { technique: 'Physiological Sigh', duration: 2, beforeMood: 2, afterMood: 4, createdAt: Date.now() - 7200000 }
        ];

        localStorage.setItem('vera_breathing_history', JSON.stringify(demoBreathingHistory));

        // Demo user data
        localStorage.setItem('vera_user_data', JSON.stringify(this.demoData.user));
        localStorage.setItem('vera_current_tier', 'integrator');
        localStorage.setItem('vera_trial_start', Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    }

    createDemoControls() {
        const demoControls = document.createElement('div');
        demoControls.className = 'demo-controls';
        demoControls.innerHTML = `
            <div class="demo-control-panel">
                <div class="demo-header">
                    <h3>🎯 VERA Platform Demo</h3>
                    <div class="demo-device-indicator" id="deviceIndicator">
                        <span class="device-icon">💻</span>
                        <span class="device-text">Desktop View</span>
                    </div>
                </div>
                <div class="demo-sections">
                    <button class="demo-btn active" data-demo="overview" onclick="VERAPresentationDemo.instance.showDemo('overview')">
                        📊 Platform Overview
                    </button>
                    <button class="demo-btn" data-demo="breathing" onclick="VERAPresentationDemo.instance.showDemo('breathing')">
                        🌬️ Breathing Suite
                    </button>
                    <button class="demo-btn" data-demo="grounding" onclick="VERAPresentationDemo.instance.showDemo('grounding')">
                        🌍 Grounding Library
                    </button>
                    <button class="demo-btn" data-demo="journal" onclick="VERAPresentationDemo.instance.showDemo('journal')">
                        📝 Neural Journal
                    </button>
                    <button class="demo-btn" data-demo="chat" onclick="VERAPresentationDemo.instance.showDemo('chat')">
                        💬 AI Assistant
                    </button>
                    <button class="demo-btn" data-demo="analytics" onclick="VERAPresentationDemo.instance.showDemo('analytics')">
                        📈 Analytics
                    </button>
                    <button class="demo-btn" data-demo="pricing" onclick="VERAPresentationDemo.instance.showDemo('pricing')">
                        💰 Pricing Tiers
                    </button>
                </div>
                <div class="demo-actions">
                    <button class="demo-action-btn" onclick="VERAPresentationDemo.instance.simulateUserJourney()">
                        🚀 Simulate User Journey
                    </button>
                    <button class="demo-action-btn" onclick="VERAPresentationDemo.instance.showAllFeatures()">
                        ✨ Show All Features
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(demoControls);
        this.detectDevice();
    }

    detectDevice() {
        const deviceIndicator = document.getElementById('deviceIndicator');
        const width = window.innerWidth;
        
        let device, icon;
        if (width <= 480) {
            device = 'Mobile View';
            icon = '📱';
        } else if (width <= 768) {
            device = 'Tablet View';
            icon = '📱';
        } else if (width <= 1024) {
            device = 'Laptop View';
            icon = '💻';
        } else {
            device = 'Desktop View';
            icon = '🖥️';
        }

        if (deviceIndicator) {
            deviceIndicator.innerHTML = `
                <span class="device-icon">${icon}</span>
                <span class="device-text">${device}</span>
            `;
        }

        // Update on resize
        window.addEventListener('resize', () => this.detectDevice());
    }

    optimizeForAllDevices() {
        // Add responsive meta tag if not exists
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, user-scalable=yes';
            document.head.appendChild(meta);
        }

        // Add presentation-specific styles
        const presentationStyles = document.createElement('style');
        presentationStyles.innerHTML = `
            /* Demo Controls */
            .demo-controls {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(139, 92, 246, 0.4);
                border-radius: 12px;
                padding: 16px;
                z-index: 10001;
                backdrop-filter: blur(20px);
                max-width: 300px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            }

            .demo-header {
                margin-bottom: 12px;
                text-align: center;
            }

            .demo-header h3 {
                margin: 0 0 8px 0;
                color: #e2e8f0;
                font-size: 14px;
            }

            .demo-device-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 12px;
                color: #8b5cf6;
            }

            .demo-sections {
                display: grid;
                gap: 6px;
                margin-bottom: 12px;
            }

            .demo-btn {
                background: rgba(139, 92, 246, 0.2);
                border: 1px solid rgba(139, 92, 246, 0.4);
                color: #e2e8f0;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                text-align: left;
            }

            .demo-btn:hover {
                background: rgba(139, 92, 246, 0.3);
                transform: translateY(-1px);
            }

            .demo-btn.active {
                background: rgba(139, 92, 246, 0.4);
                border-color: rgba(139, 92, 246, 0.6);
            }

            .demo-actions {
                display: grid;
                gap: 6px;
            }

            .demo-action-btn {
                background: linear-gradient(135deg, #22c55e, #10b981);
                border: none;
                color: white;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .demo-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
            }

            /* Enhanced Clickability */
            .nav-item, .quick-option, .action-btn, .technique-card, 
            .breathing-technique, .grounding-card, button, a {
                cursor: pointer !important;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .nav-item:hover, .quick-option:hover {
                background: rgba(139, 92, 246, 0.2) !important;
                transform: translateX(4px) !important;
            }

            /* Mobile Optimization */
            @media (max-width: 768px) {
                .demo-controls {
                    top: 5px;
                    right: 5px;
                    left: 5px;
                    max-width: none;
                    padding: 12px;
                }

                .demo-sections {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 4px;
                }

                .demo-btn {
                    padding: 6px 8px;
                    font-size: 11px;
                }

                .sidebar {
                    width: 100% !important;
                    height: auto !important;
                    position: relative !important;
                    border-radius: 0 !important;
                }

                .main-content {
                    margin-left: 0 !important;
                    padding: 10px !important;
                }

                .content-sections {
                    padding: 0 !important;
                }
            }

            /* Tablet Optimization */
            @media (min-width: 769px) and (max-width: 1024px) {
                .sidebar {
                    width: 250px !important;
                }

                .main-content {
                    margin-left: 250px !important;
                }

                .demo-sections {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            /* Desktop Optimization */
            @media (min-width: 1025px) {
                .sidebar {
                    width: 280px !important;
                }

                .main-content {
                    margin-left: 280px !important;
                }
            }

            /* Presentation Mode Enhancements */
            .presentation-highlight {
                animation: highlightPulse 2s infinite;
                border: 2px solid #22c55e !important;
            }

            @keyframes highlightPulse {
                0%, 100% { border-color: #22c55e; }
                50% { border-color: #8b5cf6; }
            }

            /* Feature Showcase */
            .feature-showcase {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                position: relative;
                overflow: hidden;
            }

            .feature-showcase::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: shimmer 3s infinite;
            }

            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            /* Interactive Elements */
            .interactive-demo {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .interactive-demo:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
            }

            /* Touch-Friendly Buttons */
            @media (hover: none) {
                .nav-item, .quick-option, button {
                    min-height: 44px !important;
                    padding: 12px !important;
                }
            }
        `;

        document.head.appendChild(presentationStyles);
    }

    showDemo(demoType) {
        // Update active demo button
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-demo="${demoType}"]`).classList.add('active');

        this.currentDemo = demoType;

        switch (demoType) {
            case 'overview':
                this.showOverviewDemo();
                break;
            case 'breathing':
                this.showBreathingDemo();
                break;
            case 'grounding':
                this.showGroundingDemo();
                break;
            case 'journal':
                this.showJournalDemo();
                break;
            case 'chat':
                this.showChatDemo();
                break;
            case 'analytics':
                this.showAnalyticsDemo();
                break;
            case 'pricing':
                this.showPricingDemo();
                break;
        }
    }

    showOverviewDemo() {
        if (window.VERACore) {
            window.VERACore.showSection('dashboard');
        }
        this.highlightFeatures([
            '.sidebar',
            '.quick-regulation',
            '.trial-status'
        ]);
        this.showToast('🎯 Platform Overview', 'Navigate using the sidebar or quick action buttons');
    }

    showBreathingDemo() {
        if (window.VERACore) {
            window.VERACore.showSection('breathing');
        }
        this.highlightFeatures(['.breathing-exercises', '.technique-selector']);
        this.showToast('🌬️ Breathing Exercises', '5 interactive techniques with guided animations');
    }

    showGroundingDemo() {
        if (window.VERACore) {
            window.VERACore.showSection('grounding');
        }
        this.highlightFeatures(['.grounding-library']);
        this.showToast('🌍 Grounding Techniques', '6 evidence-based practices for nervous system regulation');
    }

    showJournalDemo() {
        if (window.VERACore) {
            window.VERACore.showSection('journal');
        }
        this.highlightFeatures(['.nervous-system-journal', '.journal-stats']);
        this.showToast('📝 Neural Journal', 'Track patterns with mood tracking and AI insights');
    }

    showChatDemo() {
        if (window.VERACore) {
            window.VERACore.showSection('chat');
        }
        this.highlightFeatures(['.enhanced-chat', '.chat-features']);
        this.showToast('💬 AI Assistant', 'Intelligent chat with conversation history and voice input');
    }

    showAnalyticsDemo() {
        if (window.VERAPersonalizedDashboard && window.VERAPersonalizedDashboard.instance) {
            window.VERAPersonalizedDashboard.instance.init();
        }
        if (window.VERACore) {
            window.VERACore.showSection('dashboard');
        }
        this.highlightFeatures(['.dashboard-grid', '.stats-overview']);
        this.showToast('📈 Analytics Dashboard', 'Comprehensive insights and progress tracking');
    }

    showPricingDemo() {
        window.open('/pricing.html', '_blank');
        this.showToast('💰 Pricing Tiers', 'Complete 4-tier subscription model with enterprise solutions');
    }

    highlightFeatures(selectors) {
        // Remove existing highlights
        document.querySelectorAll('.presentation-highlight').forEach(el => {
            el.classList.remove('presentation-highlight');
        });

        // Add new highlights
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('presentation-highlight');
            });
        });

        // Remove highlights after 5 seconds
        setTimeout(() => {
            document.querySelectorAll('.presentation-highlight').forEach(el => {
                el.classList.remove('presentation-highlight');
            });
        }, 5000);
    }

    showToast(title, message) {
        const toast = document.createElement('div');
        toast.className = 'demo-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(34, 197, 94, 0.4);
            border-radius: 12px;
            padding: 16px;
            z-index: 10002;
            max-width: 300px;
            backdrop-filter: blur(20px);
            animation: slideInUp 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 4000);
    }

    async simulateUserJourney() {
        this.showToast('🚀 User Journey', 'Starting complete user experience simulation...');
        
        // Step 1: Dashboard
        await this.delay(1000);
        this.showDemo('overview');
        
        // Step 2: Breathing
        await this.delay(3000);
        this.showDemo('breathing');
        
        // Step 3: Journal
        await this.delay(3000);
        this.showDemo('journal');
        
        // Step 4: Chat
        await this.delay(3000);
        this.showDemo('chat');
        
        // Step 5: Analytics
        await this.delay(3000);
        this.showDemo('analytics');
        
        this.showToast('✅ Journey Complete', 'Full user experience demonstrated!');
    }

    async showAllFeatures() {
        this.showToast('✨ Feature Showcase', 'Displaying all platform capabilities...');
        
        // Load all sections simultaneously
        const sections = ['dashboard', 'breathing', 'grounding', 'journal', 'chat'];
        
        for (const section of sections) {
            if (window.VERACore) {
                window.VERACore.loadSectionContent(section);
            }
        }

        // Initialize all feature systems
        if (window.VERABreathingExercises) {
            window.VERABreathingExercises.initialize();
        }
        
        if (window.VERAGroundingLibrary) {
            window.VERAGroundingLibrary.initialize();
        }
        
        if (window.VERANervousSystemJournal) {
            window.VERANervousSystemJournal.initialize();
        }
        
        if (window.VERAEnhancedChat) {
            window.VERAEnhancedChat.initialize();
        }
        
        if (window.VERAPersonalizedDashboard) {
            window.VERAPersonalizedDashboard.initialize();
        }

        this.showToast('🎯 All Systems Active', 'Complete VERA platform loaded and ready!');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Static instance
    static instance = null;
    
    static initialize() {
        if (!VERAPresentationDemo.instance) {
            VERAPresentationDemo.instance = new VERAPresentationDemo();
        }
        return VERAPresentationDemo.instance;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERAPresentationDemo.initialize());
} else {
    VERAPresentationDemo.initialize();
}

window.VERAPresentationDemo = VERAPresentationDemo;