/**
 * VERA Personalized Dashboard
 * Progress analytics, nervous system insights, tier-specific widgets, achievement system
 */

class VERAPersonalizedDashboard {
    constructor() {
        this.dashboardContainer = null;
        this.userData = this.loadUserData();
        this.analyticsData = this.loadAnalyticsData();
        this.achievements = this.loadAchievements();
        this.insights = [];
        
        // Initialize data if not exists
        this.initializeUserData();
    }

    async init() {
        await this.render();
        this.updateAnalytics();
        this.generateInsights();
        this.checkAchievements();
        this.setupRefreshTimer();
    }

    loadUserData() {
        return JSON.parse(localStorage.getItem('vera_user_data') || '{}');
    }

    saveUserData() {
        localStorage.setItem('vera_user_data', JSON.stringify(this.userData));
    }

    loadAnalyticsData() {
        return JSON.parse(localStorage.getItem('vera_analytics') || '{}');
    }

    saveAnalyticsData() {
        localStorage.setItem('vera_analytics', JSON.stringify(this.analyticsData));
    }

    loadAchievements() {
        return JSON.parse(localStorage.getItem('vera_achievements') || '[]');
    }

    saveAchievements() {
        localStorage.setItem('vera_achievements', JSON.stringify(this.achievements));
    }

    initializeUserData() {
        if (!this.userData.joinDate) {
            this.userData.joinDate = Date.now();
            this.userData.totalSessions = 0;
            this.userData.consecutiveDays = 0;
            this.userData.lastSessionDate = null;
            this.userData.preferredTechniques = [];
            this.userData.nervousSystemProfile = 'discovering';
        }

        if (!this.analyticsData.dailyActivity) {
            this.analyticsData.dailyActivity = {};
            this.analyticsData.weeklyStats = {};
            this.analyticsData.regulationPatterns = [];
            this.analyticsData.moodHistory = [];
            this.analyticsData.techniqueUsage = {};
        }

        this.saveUserData();
        this.saveAnalyticsData();
    }

    getCurrentTier() {
        return window.VERAAuth?.getCurrentTier() || 'free';
    }

    getRegulationHistory() {
        const journalEntries = JSON.parse(localStorage.getItem('vera_journal_entries') || '[]');
        const breathingHistory = JSON.parse(localStorage.getItem('vera_breathing_history') || '[]');
        const groundingHistory = JSON.parse(localStorage.getItem('vera_grounding_history') || '[]');
        
        return {
            journal: journalEntries,
            breathing: breathingHistory,
            grounding: groundingHistory
        };
    }

    updateAnalytics() {
        const today = new Date().toDateString();
        const history = this.getRegulationHistory();
        
        // Update daily activity
        if (!this.analyticsData.dailyActivity[today]) {
            this.analyticsData.dailyActivity[today] = {
                sessions: 0,
                journalEntries: 0,
                breathingExercises: 0,
                groundingTechniques: 0,
                avgMood: 0,
                totalMinutes: 0
            };
        }

        // Calculate mood trends
        const recentMoods = history.journal
            .filter(entry => entry.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000)
            .map(entry => entry.mood)
            .filter(mood => mood);

        if (recentMoods.length > 0) {
            const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
            this.analyticsData.moodHistory.push({
                date: today,
                avgMood: avgMood,
                entries: recentMoods.length
            });
        }

        // Analyze regulation patterns
        this.analyzeRegulationPatterns(history);
        
        this.saveAnalyticsData();
    }

    analyzeRegulationPatterns(history) {
        const patterns = {
            mostActiveTime: this.getMostActiveTime(history),
            preferredTechniques: this.getPreferredTechniques(history),
            regulationTriggers: this.getRegulationTriggers(history),
            effectiveTechniques: this.getEffectiveTechniques(history)
        };

        this.analyticsData.regulationPatterns = patterns;
    }

    getMostActiveTime(history) {
        const timeSlots = {};
        
        [...history.journal, ...history.breathing, ...history.grounding].forEach(entry => {
            if (entry.createdAt) {
                const hour = new Date(entry.createdAt).getHours();
                const slot = this.getTimeSlot(hour);
                timeSlots[slot] = (timeSlots[slot] || 0) + 1;
            }
        });

        return Object.entries(timeSlots).reduce((a, b) => timeSlots[a[0]] > timeSlots[b[0]] ? a : b, ['morning', 0])[0];
    }

    getTimeSlot(hour) {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    getPreferredTechniques(history) {
        const techniques = {};
        
        history.breathing.forEach(session => {
            techniques[session.technique] = (techniques[session.technique] || 0) + 1;
        });
        
        history.grounding.forEach(session => {
            techniques[session.technique] = (techniques[session.technique] || 0) + 1;
        });

        return Object.entries(techniques)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([technique]) => technique);
    }

    getRegulationTriggers(history) {
        const triggers = {};
        
        history.journal.forEach(entry => {
            if (entry.content && entry.mood < 3) {
                const words = entry.content.toLowerCase().split(' ');
                words.forEach(word => {
                    if (word.length > 4 && ['stress', 'anxiety', 'overwhelm', 'worry', 'fear'].some(trigger => word.includes(trigger))) {
                        triggers[word] = (triggers[word] || 0) + 1;
                    }
                });
            }
        });

        return Object.entries(triggers)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([trigger]) => trigger);
    }

    getEffectiveTechniques(history) {
        const effectiveness = {};
        
        // Analyze mood changes after techniques
        history.breathing.forEach(session => {
            if (session.beforeMood && session.afterMood) {
                const improvement = session.afterMood - session.beforeMood;
                if (!effectiveness[session.technique]) {
                    effectiveness[session.technique] = { total: 0, count: 0 };
                }
                effectiveness[session.technique].total += improvement;
                effectiveness[session.technique].count += 1;
            }
        });

        return Object.entries(effectiveness)
            .map(([technique, data]) => ({
                technique,
                avgImprovement: data.total / data.count
            }))
            .sort((a, b) => b.avgImprovement - a.avgImprovement)
            .slice(0, 3);
    }

    generateInsights() {
        const tier = this.getCurrentTier();
        const history = this.getRegulationHistory();
        const patterns = this.analyticsData.regulationPatterns;
        
        this.insights = [];

        // Activity insights
        if (history.journal.length > 0) {
            this.insights.push({
                type: 'activity',
                icon: '📊',
                title: 'Journal Consistency',
                content: this.getJournalInsight(history.journal),
                priority: 'high'
            });
        }

        // Mood trend insights
        if (this.analyticsData.moodHistory.length > 3) {
            this.insights.push({
                type: 'mood',
                icon: '🌊',
                title: 'Mood Patterns',
                content: this.getMoodInsight(),
                priority: 'high'
            });
        }

        // Technique effectiveness
        if (patterns.effectiveTechniques?.length > 0) {
            this.insights.push({
                type: 'technique',
                icon: '💡',
                title: 'Most Effective Techniques',
                content: this.getTechniqueInsight(patterns.effectiveTechniques),
                priority: 'medium'
            });
        }

        // Time-based insights
        if (patterns.mostActiveTime) {
            this.insights.push({
                type: 'timing',
                icon: '⏰',
                title: 'Optimal Practice Time',
                content: this.getTimingInsight(patterns.mostActiveTime),
                priority: 'medium'
            });
        }

        // Tier-specific insights
        this.insights.push(...this.getTierSpecificInsights(tier, history));
    }

    getJournalInsight(entries) {
        const recentEntries = entries.filter(entry => entry.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000);
        const streak = this.calculateJournalStreak(entries);
        
        if (streak > 7) {
            return `Amazing! You've maintained a ${streak}-day journaling streak. Consistent reflection is building your self-awareness.`;
        } else if (recentEntries.length >= 3) {
            return `You're developing a good journaling rhythm with ${recentEntries.length} entries this week. Keep it up!`;
        } else {
            return `Regular journaling can help you recognize patterns. Try to write a few thoughts each day.`;
        }
    }

    getMoodInsight() {
        const recentMoods = this.analyticsData.moodHistory.slice(-7);
        const trend = this.calculateMoodTrend(recentMoods);
        
        if (trend > 0.3) {
            return `Your mood has been improving over the past week! Your regulation practices are having a positive impact.`;
        } else if (trend < -0.3) {
            return `Your mood has been lower recently. This is valuable information - consider exploring grounding techniques or reaching out for support.`;
        } else {
            return `Your mood has been relatively stable. Consistency in regulation practices can help maintain this balance.`;
        }
    }

    getTechniqueInsight(techniques) {
        const best = techniques[0];
        return `${best.technique} has been your most effective technique, improving your state by an average of ${best.avgImprovement.toFixed(1)} points. Consider using it when you need reliable regulation.`;
    }

    getTimingInsight(activeTime) {
        const timeMessages = {
            morning: "You're most active with regulation in the morning. This sets a great foundation for your day!",
            afternoon: "Afternoon regulation sessions help you manage midday stress effectively.",
            evening: "Evening practice helps you process the day and prepare for rest.",
            night: "Late-night sessions can be helpful, but consider if earlier practice might improve your sleep."
        };
        
        return timeMessages[activeTime] || "Understanding your natural regulation rhythms helps optimize your practice.";
    }

    getTierSpecificInsights(tier, history) {
        const insights = [];
        
        switch (tier) {
            case 'explorer':
                insights.push({
                    type: 'growth',
                    icon: '🌱',
                    title: 'Explorer Journey',
                    content: 'You\'re building foundational regulation skills. Focus on consistency over complexity.',
                    priority: 'low'
                });
                break;
                
            case 'regulator':
                insights.push({
                    type: 'advancement',
                    icon: '🎯',
                    title: 'Regulation Mastery',
                    content: 'You have access to advanced techniques. Experiment to find what works best for your nervous system.',
                    priority: 'medium'
                });
                break;
                
            case 'integrator':
                insights.push({
                    type: 'integration',
                    icon: '🔄',
                    title: 'Integration Focus',
                    content: 'Your comprehensive access allows deep exploration. Consider how different techniques complement each other.',
                    priority: 'high'
                });
                break;
        }
        
        return insights;
    }

    calculateJournalStreak(entries) {
        const sortedEntries = entries.sort((a, b) => b.createdAt - a.createdAt);
        let streak = 0;
        let currentDate = new Date();
        
        for (const entry of sortedEntries) {
            const entryDate = new Date(entry.createdAt);
            const daysDiff = Math.floor((currentDate - entryDate) / (24 * 60 * 60 * 1000));
            
            if (daysDiff === streak) {
                streak++;
                currentDate = entryDate;
            } else {
                break;
            }
        }
        
        return streak;
    }

    calculateMoodTrend(moodHistory) {
        if (moodHistory.length < 2) return 0;
        
        const first = moodHistory[0].avgMood;
        const last = moodHistory[moodHistory.length - 1].avgMood;
        
        return last - first;
    }

    checkAchievements() {
        const history = this.getRegulationHistory();
        const newAchievements = [];

        // Streak achievements
        const journalStreak = this.calculateJournalStreak(history.journal);
        if (journalStreak >= 7 && !this.hasAchievement('week-warrior')) {
            newAchievements.push({
                id: 'week-warrior',
                title: 'Week Warrior',
                description: '7-day journaling streak',
                icon: '🗓️',
                unlockedAt: Date.now()
            });
        }

        // Technique mastery
        const breathingSessions = history.breathing.length;
        if (breathingSessions >= 10 && !this.hasAchievement('breath-master')) {
            newAchievements.push({
                id: 'breath-master',
                title: 'Breath Master',
                description: 'Completed 10 breathing exercises',
                icon: '🌬️',
                unlockedAt: Date.now()
            });
        }

        // Grounding explorer
        const groundingSessions = history.grounding.length;
        if (groundingSessions >= 5 && !this.hasAchievement('grounded')) {
            newAchievements.push({
                id: 'grounded',
                title: 'Well Grounded',
                description: 'Tried 5 grounding techniques',
                icon: '🌍',
                unlockedAt: Date.now()
            });
        }

        // Mood improvement
        const recentMoodTrend = this.calculateMoodTrend(this.analyticsData.moodHistory.slice(-7));
        if (recentMoodTrend > 1 && !this.hasAchievement('mood-lifter')) {
            newAchievements.push({
                id: 'mood-lifter',
                title: 'Mood Lifter',
                description: 'Significant mood improvement over a week',
                icon: '📈',
                unlockedAt: Date.now()
            });
        }

        // Add new achievements
        this.achievements.push(...newAchievements);
        this.saveAchievements();

        return newAchievements;
    }

    hasAchievement(achievementId) {
        return this.achievements.some(achievement => achievement.id === achievementId);
    }

    async render() {
        const dashboardContainer = document.querySelector('#dashboard-section');
        if (!dashboardContainer) return;

        const tier = this.getCurrentTier();
        const history = this.getRegulationHistory();
        const recentMood = this.analyticsData.moodHistory.slice(-1)[0];

        dashboardContainer.innerHTML = `
            <div class="personalized-dashboard">
                <div class="dashboard-header">
                    <div class="welcome-section">
                        <h2>Welcome back to your VERA journey</h2>
                        <p class="user-status">
                            ${tier.toUpperCase()} member since ${new Date(this.userData.joinDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div class="current-state">
                        <div class="state-indicator">
                            <div class="neural-pulse ${this.getNeuralState()}"></div>
                            <span>Current State: ${this.getNeuralStateLabel()}</span>
                        </div>
                        ${recentMood ? `
                            <div class="mood-indicator">
                                <span>Recent Mood: ${this.getMoodEmoji(recentMood.avgMood)} ${recentMood.avgMood.toFixed(1)}/5</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Quick Stats -->
                    <div class="stats-overview">
                        <h3>Your Journey at a Glance</h3>
                        <div class="stat-cards">
                            <div class="stat-card">
                                <div class="stat-icon">📝</div>
                                <div class="stat-content">
                                    <div class="stat-number">${history.journal.length}</div>
                                    <div class="stat-label">Journal Entries</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">🌬️</div>
                                <div class="stat-content">
                                    <div class="stat-number">${history.breathing.length}</div>
                                    <div class="stat-label">Breathing Sessions</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">🌍</div>
                                <div class="stat-content">
                                    <div class="stat-number">${history.grounding.length}</div>
                                    <div class="stat-label">Grounding Practices</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">🏆</div>
                                <div class="stat-content">
                                    <div class="stat-number">${this.achievements.length}</div>
                                    <div class="stat-label">Achievements</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Insights Panel -->
                    <div class="insights-panel">
                        <h3>Nervous System Insights</h3>
                        <div class="insights-container">
                            ${this.insights.length > 0 ? this.insights.map(insight => `
                                <div class="insight-card ${insight.priority}">
                                    <div class="insight-header">
                                        <span class="insight-icon">${insight.icon}</span>
                                        <h4>${insight.title}</h4>
                                    </div>
                                    <p class="insight-content">${insight.content}</p>
                                </div>
                            `).join('') : `
                                <div class="no-insights">
                                    <p>Start using VERA's features to generate personalized insights about your nervous system patterns!</p>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Progress Tracking -->
                    <div class="progress-tracking">
                        <h3>Regulation Progress</h3>
                        <div class="progress-charts">
                            <div class="mood-chart">
                                <h4>7-Day Mood Trend</h4>
                                <div class="chart-container">
                                    ${this.renderMoodChart()}
                                </div>
                            </div>
                            <div class="technique-usage">
                                <h4>Technique Preferences</h4>
                                <div class="technique-bars">
                                    ${this.renderTechniqueUsage()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Achievements -->
                    <div class="achievements-section">
                        <h3>Achievements & Milestones</h3>
                        <div class="achievements-grid">
                            ${this.achievements.length > 0 ? this.achievements.slice(-6).map(achievement => `
                                <div class="achievement-card">
                                    <div class="achievement-icon">${achievement.icon}</div>
                                    <div class="achievement-content">
                                        <h4>${achievement.title}</h4>
                                        <p>${achievement.description}</p>
                                        <span class="unlock-date">${new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="no-achievements">
                                    <p>Your achievements will appear here as you use VERA's regulation tools!</p>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="quick-actions">
                        <h3>Recommended Actions</h3>
                        <div class="action-buttons">
                            <button class="action-btn primary" onclick="VERACore.showSection('journal')">
                                <span class="icon">📝</span>
                                <div class="action-content">
                                    <span class="action-title">Journal Check-in</span>
                                    <span class="action-desc">Reflect on your current state</span>
                                </div>
                            </button>
                            <button class="action-btn secondary" onclick="VERACore.showSection('breathing')">
                                <span class="icon">🌬️</span>
                                <div class="action-content">
                                    <span class="action-title">Quick Regulation</span>
                                    <span class="action-desc">5-minute breathing exercise</span>
                                </div>
                            </button>
                            <button class="action-btn tertiary" onclick="VERACore.showSection('grounding')">
                                <span class="icon">🌍</span>
                                <div class="action-content">
                                    <span class="action-title">Ground & Center</span>
                                    <span class="action-desc">Connect with the present</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Tier Benefits -->
                    <div class="tier-benefits">
                        <h3>Your ${tier.toUpperCase()} Benefits</h3>
                        ${this.renderTierBenefits(tier)}
                    </div>
                </div>
            </div>
        `;

        this.dashboardContainer = dashboardContainer;
    }

    getNeuralState() {
        const recentMood = this.analyticsData.moodHistory.slice(-1)[0];
        if (!recentMood) return 'neutral';
        
        if (recentMood.avgMood >= 4) return 'regulated';
        if (recentMood.avgMood >= 3) return 'stable';
        if (recentMood.avgMood >= 2) return 'activated';
        return 'dysregulated';
    }

    getNeuralStateLabel() {
        const state = this.getNeuralState();
        const labels = {
            regulated: 'Well Regulated',
            stable: 'Stable',
            neutral: 'Neutral',
            activated: 'Mildly Activated',
            dysregulated: 'Seeking Regulation'
        };
        return labels[state] || 'Unknown';
    }

    getMoodEmoji(mood) {
        if (mood >= 4.5) return '😊';
        if (mood >= 4) return '🙂';
        if (mood >= 3) return '😐';
        if (mood >= 2) return '😕';
        return '😟';
    }

    renderMoodChart() {
        const recentMoods = this.analyticsData.moodHistory.slice(-7);
        if (recentMoods.length === 0) {
            return '<p class="no-data">Start journaling to see your mood trends!</p>';
        }

        const maxMood = Math.max(...recentMoods.map(m => m.avgMood));
        return recentMoods.map((mood, index) => `
            <div class="chart-bar">
                <div class="bar" style="height: ${(mood.avgMood / 5) * 100}%"></div>
                <span class="bar-label">${new Date(mood.date).toLocaleDateString().split('/')[1]}/${new Date(mood.date).toLocaleDateString().split('/')[0]}</span>
            </div>
        `).join('');
    }

    renderTechniqueUsage() {
        const patterns = this.analyticsData.regulationPatterns;
        if (!patterns.preferredTechniques || patterns.preferredTechniques.length === 0) {
            return '<p class="no-data">Try different techniques to see your preferences!</p>';
        }

        return patterns.preferredTechniques.map((technique, index) => `
            <div class="technique-bar">
                <span class="technique-name">${technique}</span>
                <div class="bar-container">
                    <div class="usage-bar" style="width: ${100 - (index * 20)}%"></div>
                </div>
            </div>
        `).join('');
    }

    renderTierBenefits(tier) {
        const benefits = {
            free: [
                '5 daily chat messages',
                'Basic breathing exercises',
                'Limited journal access'
            ],
            explorer: [
                '50 daily chat messages',
                'Full breathing exercise library',
                'Complete journal with prompts',
                'Basic grounding techniques'
            ],
            regulator: [
                '200 daily chat messages',
                'Advanced breathing patterns',
                'Somatic awareness journal',
                'All grounding techniques',
                'Pattern recognition insights'
            ],
            integrator: [
                '1000 daily chat messages',
                'Complete regulation toolkit',
                'Therapeutic journal prompts',
                'Advanced pattern analysis',
                'Personal nervous system profile'
            ],
            enterprise: [
                'Unlimited chat messages',
                'Complete platform access',
                'Leadership regulation tools',
                'Team nervous system insights',
                'Custom integration options'
            ]
        };

        return `
            <div class="benefits-list">
                ${benefits[tier]?.map(benefit => `
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        <span class="benefit-text">${benefit}</span>
                    </div>
                `).join('') || '<p>Upgrade to unlock more benefits!</p>'}
                ${tier !== 'enterprise' ? `
                    <button class="upgrade-tier-btn" onclick="window.VERACore?.showUpgradeModal?.()">
                        Upgrade Your Plan
                    </button>
                ` : ''}
            </div>
        `;
    }

    setupRefreshTimer() {
        // Refresh insights every 5 minutes
        setInterval(() => {
            this.updateAnalytics();
            this.generateInsights();
            const newAchievements = this.checkAchievements();
            
            if (newAchievements.length > 0) {
                this.showAchievementNotifications(newAchievements);
            }
        }, 5 * 60 * 1000);
    }

    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementToast(achievement);
            }, index * 1000);
        });
    }

    showAchievementToast(achievement) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${achievement.icon}</span>
                <div class="toast-text">
                    <strong>Achievement Unlocked!</strong>
                    <p>${achievement.title}: ${achievement.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 4000);
    }

    // Static instance for global access
    static instance = null;
    
    static async initialize() {
        if (!VERAPersonalizedDashboard.instance) {
            VERAPersonalizedDashboard.instance = new VERAPersonalizedDashboard();
        }
        await VERAPersonalizedDashboard.instance.init();
        return VERAPersonalizedDashboard.instance;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERAPersonalizedDashboard.initialize());
} else {
    VERAPersonalizedDashboard.initialize();
}

window.VERAPersonalizedDashboard = VERAPersonalizedDashboard;