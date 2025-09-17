// VERA Nervous System Journal - Track Your Regulation Journey
class VERANervousSystemJournal {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('veraNSJournal')) || [];
        this.prompts = this.getPromptLibrary();
        this.currentPrompt = null;
        this.moodPatterns = JSON.parse(localStorage.getItem('veraMoodPatterns')) || [];
        this.insights = JSON.parse(localStorage.getItem('veraJournalInsights')) || [];
        
        this.init();
    }

    init() {
        this.updateProgress();
        this.generateDailyPrompt();
    }

    getPromptLibrary() {
        return {
            explorer: {
                daily: [
                    "How is your nervous system feeling right now? Notice without judgment.",
                    "What helped you feel most grounded today?",
                    "Did you notice any activation patterns in your body today?",
                    "What made you feel safe and calm today?",
                    "How did your breathing change throughout the day?",
                    "What physical sensations are you aware of right now?",
                    "How did you move through stress today?",
                    "What brought you back to center when you felt dysregulated?",
                    "Notice your jaw, shoulders, and belly - what are they holding?",
                    "What environmental factors affected your nervous system today?",
                    "How did social interactions impact your energy?",
                    "What did your body need most today?",
                    "Rate your overall nervous system state today (1-10) and why.",
                    "What patterns are you noticing in your regulation journey?",
                    "How has your relationship with stress changed lately?"
                ],
                weekly: [
                    "Looking back at this week, what patterns do you notice in your nervous system responses?",
                    "Which regulation techniques served you best this week?",
                    "How has your window of tolerance expanded or contracted?",
                    "What triggered your biggest activation this week, and how did you respond?"
                ]
            },
            regulator: {
                daily: [
                    // All Explorer prompts plus advanced ones
                    "Track your autonomic shifts: when did you move from sympathetic to parasympathetic today?",
                    "How did bilateral activities (walking, breathing exercises) affect your integration?",
                    "Notice your interoceptive awareness - what internal signals did you pick up on?",
                    "How did polyvagal exercises influence your social engagement today?",
                    "What micro-movements helped discharge activation in your system?",
                    "How did your vagal tone respond to different environments/people?",
                    "Track your sleep quality and its relationship to nervous system regulation.",
                    "Notice your digestive patterns and their connection to your emotional state.",
                    "How did temperature, lighting, or sound affect your nervous system today?",
                    "What boundary-setting moments supported your regulation?",
                    "How did your nervous system respond to challenging conversations?",
                    "Track your window of tolerance - when did it expand or contract today?",
                    "Notice your co-regulation experiences - who helped you feel more regulated?",
                    "How did nature connection support your nervous system today?",
                    "What somatic resources did you access during stress?"
                ],
                somatic: [
                    "Body Compass Check: What is your gut telling you about a current situation?",
                    "Pendulation Practice: Notice an area of tension, then find an area of ease. Track the movement between them.",
                    "Resource Mapping: What in your environment right now supports your nervous system?",
                    "Titration Practice: Take a small piece of a big stress and notice how your body responds.",
                    "Completion Cycles: Is there any activation in your system that wants to complete a movement or action?"
                ]
            },
            integrator: {
                daily: [
                    // All previous prompts plus trauma-informed ones
                    "Nervous System Archaeology: What generational patterns are you noticing and transforming?",
                    "Integration Tracking: How are you metabolizing recent challenging experiences?",
                    "Embodied Boundaries: How did your body communicate your limits today?",
                    "Adaptive Capacity: How did your nervous system show its intelligence and resilience today?",
                    "Coherence Mapping: Track moments of alignment between your heart, mind, and gut.",
                    "Nervous System Flexibility: How did you adapt to unexpected changes today?",
                    "Trauma Integration: What old patterns are shifting into new possibilities?",
                    "Somatic Memory: What did your body remember or release today?",
                    "Regulation as Medicine: How did your self-regulation serve others around you?",
                    "Nervous System Leadership: How did you guide others toward regulation today?",
                    "Embodied Wisdom: What did your body teach you about life today?",
                    "System Capacity: How much complexity could your nervous system handle today?",
                    "Integration Practice: How are you weaving healing into your daily life?",
                    "Coherent Communication: When did you speak from your most regulated self?",
                    "Nervous System Intelligence: What adaptive responses impressed you today?"
                ],
                therapeutic: [
                    "EMDR Integration: If you're processing trauma, how is your nervous system integrating between sessions?",
                    "Parts Mapping: What different parts of you showed up today and what did each need?",
                    "Attachment Patterns: How did your nervous system respond in relationships today?",
                    "Developmental Repair: What childhood needs got met through your adult self-care today?",
                    "Therapeutic Relationship: How is your nervous system responding to your healing process?"
                ]
            },
            enterprise: {
                leadership: [
                    "Organizational Nervous System: How did you contribute to collective regulation at work today?",
                    "Team Co-regulation: How did you support your team's nervous system health?",
                    "Decision-Making from Regulation: How did nervous system awareness inform your leadership choices?",
                    "Conflict as Information: How did you use nervous system activation as data in challenging situations?",
                    "Sustainable Performance: How did you balance productivity with nervous system care?"
                ]
            }
        };
    }

    generateDailyPrompt() {
        const userTier = window.auth?.getUserTier() || 'explorer';
        const tierPrompts = this.prompts[userTier];
        
        // Check if user already journaled today
        const today = new Date().toDateString();
        const todayEntry = this.entries.find(entry => 
            new Date(entry.date).toDateString() === today
        );
        
        if (todayEntry) {
            this.currentPrompt = todayEntry.prompt;
        } else {
            // Get appropriate prompts for tier
            let availablePrompts = [...tierPrompts.daily];
            if (userTier !== 'explorer') {
                availablePrompts = [...availablePrompts, ...this.prompts.explorer.daily];
            }
            
            // Add specialized prompts
            if (tierPrompts.somatic) {
                availablePrompts = [...availablePrompts, ...tierPrompts.somatic];
            }
            if (tierPrompts.therapeutic) {
                availablePrompts = [...availablePrompts, ...tierPrompts.therapeutic];
            }
            if (tierPrompts.leadership) {
                availablePrompts = [...availablePrompts, ...tierPrompts.leadership];
            }
            
            // Select random prompt, avoiding recent ones
            const recentPrompts = this.entries.slice(-7).map(entry => entry.prompt);
            const newPrompts = availablePrompts.filter(prompt => !recentPrompts.includes(prompt));
            
            this.currentPrompt = newPrompts.length > 0 
                ? newPrompts[Math.floor(Math.random() * newPrompts.length)]
                : availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
        }
    }

    createJournalInterface() {
        const userTier = window.auth?.getUserTier() || 'explorer';
        const hasAccess = window.auth?.hasFeatureAccess('journal') !== false;
        
        if (!hasAccess) {
            return `
                <div class="journal-locked">
                    <div class="lock-content">
                        <div class="lock-icon">🔒</div>
                        <h3>Nervous System Journal</h3>
                        <p>Track your regulation journey with guided prompts</p>
                        <button class="upgrade-btn" onclick="window.app.showUpgradeModal('journal')">
                            Upgrade to Access Journal
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="nervous-system-journal">
                <div class="journal-header">
                    <div class="neural-icon" data-icon-type="journal"></div>
                    <h2>Your Nervous System Journal</h2>
                    <p>Track patterns, insights, and your regulation journey</p>
                </div>

                <div class="journal-stats">
                    <div class="stat-card">
                        <div class="stat-number">${this.entries.length}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.getStreakCount()}</div>
                        <div class="stat-label">Current Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.getThisMonthCount()}</div>
                        <div class="stat-label">This Month</div>
                    </div>
                </div>

                <div class="daily-prompt-section">
                    <div class="prompt-header">
                        <h3>Today's Reflection</h3>
                        <div class="prompt-tier-badge ${userTier}">${userTier.toUpperCase()}</div>
                    </div>
                    
                    <div class="daily-prompt">
                        <div class="prompt-question">
                            "${this.currentPrompt}"
                        </div>
                        
                        <div class="mood-tracker">
                            <h4>How's your nervous system right now?</h4>
                            <div class="mood-scale">
                                ${this.createMoodScale()}
                            </div>
                        </div>

                        <div class="journal-input-area">
                            <textarea 
                                id="journalEntry" 
                                placeholder="Let your nervous system speak... Notice sensations, patterns, insights..."
                                class="journal-textarea"
                            ></textarea>
                            
                            <div class="journal-tools">
                                <div class="writing-time">
                                    <span id="writingTime">0:00</span>
                                </div>
                                <div class="word-count">
                                    <span id="wordCount">0</span> words
                                </div>
                            </div>
                        </div>

                        <div class="journal-actions">
                            <button class="save-entry-btn" onclick="window.nsJournal.saveEntry()">
                                Save Entry
                            </button>
                            <button class="new-prompt-btn" onclick="window.nsJournal.getNewPrompt()">
                                New Prompt
                            </button>
                        </div>
                    </div>
                </div>

                <div class="journal-insights">
                    <h3>Your Patterns & Insights</h3>
                    <div class="insights-grid">
                        ${this.generateInsights()}
                    </div>
                </div>

                <div class="recent-entries">
                    <h3>Recent Reflections</h3>
                    <div class="entries-list">
                        ${this.renderRecentEntries()}
                    </div>
                </div>
            </div>
        `;
    }

    createMoodScale() {
        const moods = [
            { value: 1, emoji: '😰', label: 'Highly Activated', color: '#ef4444' },
            { value: 2, emoji: '😬', label: 'Stressed', color: '#f97316' },
            { value: 3, emoji: '😐', label: 'Neutral', color: '#6b7280' },
            { value: 4, emoji: '😌', label: 'Calm', color: '#22c55e' },
            { value: 5, emoji: '✨', label: 'Deeply Regulated', color: '#8b5cf6' }
        ];

        return moods.map(mood => `
            <div class="mood-option" data-value="${mood.value}" onclick="window.nsJournal.selectMood(${mood.value})">
                <div class="mood-emoji">${mood.emoji}</div>
                <div class="mood-label">${mood.label}</div>
            </div>
        `).join('');
    }

    selectMood(value) {
        document.querySelectorAll('.mood-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-value="${value}"]`).classList.add('selected');
        this.selectedMood = value;
    }

    saveEntry() {
        const entryText = document.getElementById('journalEntry').value;
        const mood = this.selectedMood || 3;
        
        if (!entryText.trim()) {
            this.showNotification('Please write something in your journal first', 'warning');
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            prompt: this.currentPrompt,
            content: entryText,
            mood: mood,
            wordCount: entryText.split(' ').length,
            tier: window.auth?.getUserTier() || 'explorer'
        };

        // Check if entry for today already exists
        const today = new Date().toDateString();
        const existingIndex = this.entries.findIndex(entry => 
            new Date(entry.date).toDateString() === today
        );

        if (existingIndex !== -1) {
            this.entries[existingIndex] = entry;
        } else {
            this.entries.push(entry);
        }

        // Store mood pattern
        this.moodPatterns.push({
            date: new Date().toISOString(),
            mood: mood,
            tier: entry.tier
        });

        this.saveData();
        this.showNotification('Journal entry saved! 🌟', 'success');
        
        // Clear form
        document.getElementById('journalEntry').value = '';
        this.selectedMood = null;
        document.querySelectorAll('.mood-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Update UI
        this.updateProgress();
        this.refreshInterface();
    }

    getNewPrompt() {
        this.generateDailyPrompt();
        document.querySelector('.prompt-question').textContent = `"${this.currentPrompt}"`;
    }

    generateInsights() {
        if (this.entries.length < 3) {
            return `
                <div class="insight-placeholder">
                    <p>Keep journaling to unlock personalized insights about your nervous system patterns!</p>
                </div>
            `;
        }

        const insights = [];
        
        // Mood trends
        const recentMoods = this.moodPatterns.slice(-7);
        const avgMood = recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length;
        
        insights.push({
            type: 'mood-trend',
            title: 'Recent Mood Pattern',
            content: this.getMoodInsight(avgMood),
            icon: '📈'
        });

        // Writing frequency
        const recentEntries = this.entries.filter(entry => 
            new Date(entry.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
        
        insights.push({
            type: 'frequency',
            title: 'Journaling Consistency',
            content: `You've journaled ${recentEntries.length} times this month. ${this.getFrequencyInsight(recentEntries.length)}`,
            icon: '✍️'
        });

        // Pattern recognition
        if (this.entries.length > 10) {
            insights.push({
                type: 'pattern',
                title: 'Emerging Patterns',
                content: this.getPatternInsight(),
                icon: '🔍'
            });
        }

        return insights.map(insight => `
            <div class="insight-card">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.content}</p>
                </div>
            </div>
        `).join('');
    }

    getMoodInsight(avgMood) {
        if (avgMood >= 4.5) return "Your nervous system has been beautifully regulated lately! ✨";
        if (avgMood >= 3.5) return "You're maintaining good nervous system balance 😌";
        if (avgMood >= 2.5) return "Your system has been moderately activated - consider more grounding practices";
        return "Your nervous system needs extra support right now - be gentle with yourself ❤️";
    }

    getFrequencyInsight(count) {
        if (count >= 20) return "Amazing consistency! Your nervous system loves this regular check-in.";
        if (count >= 10) return "Great rhythm! Regular reflection supports nervous system awareness.";
        if (count >= 5) return "Good start! Try to journal more often for deeper insights.";
        return "Your nervous system would benefit from more regular reflection.";
    }

    getPatternInsight() {
        // Analyze common words or themes
        const allContent = this.entries.map(e => e.content.toLowerCase()).join(' ');
        const stressWords = ['stress', 'anxious', 'overwhelmed', 'tense', 'activated'];
        const calmWords = ['calm', 'peaceful', 'grounded', 'relaxed', 'centered'];
        
        const stressCount = stressWords.reduce((count, word) => 
            count + (allContent.split(word).length - 1), 0);
        const calmCount = calmWords.reduce((count, word) => 
            count + (allContent.split(word).length - 1), 0);
        
        if (calmCount > stressCount) {
            return "You're developing strong regulation skills - calm states appear frequently in your reflections.";
        } else if (stressCount > calmCount * 2) {
            return "Your entries show frequent activation. Consider focusing on grounding techniques.";
        }
        return "Your nervous system is learning balance - you're becoming more aware of your patterns.";
    }

    renderRecentEntries() {
        const recent = this.entries.slice(-5).reverse();
        
        if (recent.length === 0) {
            return `
                <div class="no-entries">
                    <p>Your journal entries will appear here. Start with today's prompt above! ✨</p>
                </div>
            `;
        }

        return recent.map(entry => `
            <div class="entry-card" onclick="window.nsJournal.viewEntry(${entry.id})">
                <div class="entry-header">
                    <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                    <div class="entry-mood">${this.getMoodEmoji(entry.mood)}</div>
                </div>
                <div class="entry-prompt">"${entry.prompt}"</div>
                <div class="entry-preview">${entry.content.substring(0, 120)}...</div>
                <div class="entry-meta">
                    <span>${entry.wordCount} words</span>
                    <span class="tier-badge ${entry.tier}">${entry.tier.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    }

    getMoodEmoji(mood) {
        const moods = { 1: '😰', 2: '😬', 3: '😐', 4: '😌', 5: '✨' };
        return moods[mood] || '😐';
    }

    viewEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        const modal = document.createElement('div');
        modal.className = 'journal-entry-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${new Date(entry.date).toLocaleDateString()}</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="entry-full">
                    <div class="entry-prompt">"${entry.prompt}"</div>
                    <div class="entry-mood-display">
                        Nervous System State: ${this.getMoodEmoji(entry.mood)} ${this.getMoodLabel(entry.mood)}
                    </div>
                    <div class="entry-content">${entry.content}</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getMoodLabel(mood) {
        const labels = { 
            1: 'Highly Activated', 
            2: 'Stressed', 
            3: 'Neutral', 
            4: 'Calm', 
            5: 'Deeply Regulated' 
        };
        return labels[mood] || 'Neutral';
    }

    getStreakCount() {
        if (this.entries.length === 0) return 0;

        const sortedEntries = this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        let streak = 0;
        let currentDate = new Date();

        for (let entry of sortedEntries) {
            const entryDate = new Date(entry.date);
            const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
                streak++;
                currentDate = new Date(entryDate);
            } else {
                break;
            }
        }

        return streak;
    }

    getThisMonthCount() {
        const now = new Date();
        const thisMonth = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() && 
                   entryDate.getFullYear() === now.getFullYear();
        });
        return thisMonth.length;
    }

    refreshInterface() {
        // Refresh the entire journal interface
        const contentArea = document.querySelector('.section-content');
        if (contentArea && contentArea.querySelector('.nervous-system-journal')) {
            contentArea.innerHTML = this.createJournalInterface();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const textarea = document.getElementById('journalEntry');
        if (textarea) {
            let startTime = Date.now();
            
            textarea.addEventListener('input', () => {
                // Update word count
                const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
                document.getElementById('wordCount').textContent = words;
                
                // Update writing time
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('writingTime').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            });
        }
    }

    saveData() {
        localStorage.setItem('veraNSJournal', JSON.stringify(this.entries));
        localStorage.setItem('veraMoodPatterns', JSON.stringify(this.moodPatterns));
    }

    updateProgress() {
        // Update any progress indicators
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `journal-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(245, 158, 11, 0.9)'};
            color: white;
            padding: var(--space-md);
            border-radius: var(--radius);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize journal
window.nsJournal = new VERANervousSystemJournal();