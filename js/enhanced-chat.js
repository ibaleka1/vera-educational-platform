/**
 * VERA Enhanced Chat System
 * Tier-based chat limits, conversation history, voice integration
 */

class VERAEnhancedChat {
    constructor() {
        this.chatContainer = null;
        this.messageContainer = null;
        this.chatInput = null;
        this.sendButton = null;
        this.voiceButton = null;
        this.conversationHistory = JSON.parse(localStorage.getItem('vera_chat_history') || '[]');
        this.currentConversation = [];
        this.isRecording = false;
        this.recognition = null;
        this.isProcessing = false;
        
        // Tier-based chat limits (messages per day)
        this.tierLimits = {
            free: 5,
            explorer: 50,
            regulator: 200,
            integrator: 1000,
            enterprise: -1 // unlimited
        };
        
        // Initialize speech recognition if available
        this.initializeSpeechRecognition();
        this.checkDailyReset();
    }

    async init() {
        await this.render();
        this.attachEventListeners();
        this.loadConversationHistory();
        this.updateChatLimitDisplay();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.chatInput.value = transcript;
                this.chatInput.focus();
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateVoiceButton();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateVoiceButton();
            };
        }
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastResetDate = localStorage.getItem('vera_chat_reset_date');
        
        if (lastResetDate !== today) {
            localStorage.setItem('vera_daily_messages', '0');
            localStorage.setItem('vera_chat_reset_date', today);
        }
    }

    getDailyMessageCount() {
        return parseInt(localStorage.getItem('vera_daily_messages') || '0');
    }

    incrementDailyMessageCount() {
        const current = this.getDailyMessageCount();
        localStorage.setItem('vera_daily_messages', (current + 1).toString());
    }

    getCurrentTier() {
        return window.VERAAuth?.getCurrentTier() || 'free';
    }

    getRemainingMessages() {
        const tier = this.getCurrentTier();
        const limit = this.tierLimits[tier];
        
        if (limit === -1) return -1; // unlimited
        
        const used = this.getDailyMessageCount();
        return Math.max(0, limit - used);
    }

    canSendMessage() {
        const remaining = this.getRemainingMessages();
        return remaining === -1 || remaining > 0;
    }

    async render() {
        const chatContainer = document.querySelector('#chat-section');
        if (!chatContainer) return;

        const tier = this.getCurrentTier();
        const remaining = this.getRemainingMessages();
        const limit = this.tierLimits[tier];

        chatContainer.innerHTML = `
            <div class="enhanced-chat">
                <div class="chat-header">
                    <div class="chat-title">
                        <h2>VERA Neural Assistant</h2>
                        <div class="neural-status">
                            <div class="status-dot active"></div>
                            <span>Neural network active</span>
                        </div>
                    </div>
                    <div class="chat-limits">
                        <div class="limit-info">
                            ${limit === -1 ? 
                                '<span class="unlimited">∞ Unlimited</span>' : 
                                `<span class="count">${remaining}/${limit}</span> messages today`
                            }
                        </div>
                        <div class="tier-badge ${tier}">${tier.toUpperCase()}</div>
                    </div>
                </div>

                <div class="conversation-history-toggle">
                    <button id="history-toggle" class="history-btn">
                        <span class="icon">📚</span>
                        View Conversation History
                    </button>
                </div>

                <div class="messages-container" id="messages-container">
                    <div class="welcome-message">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <div class="neural-avatar">V</div>
                            </div>
                            <div class="message-content">
                                <div class="message-text">
                                    Welcome to VERA! I'm here to help you understand and regulate your nervous system. 
                                    How are you feeling today?
                                </div>
                                <div class="message-time">${new Date().toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <textarea 
                            id="chat-input" 
                            placeholder="Type your message about nervous system regulation..."
                            rows="1"
                            ${!this.canSendMessage() ? 'disabled' : ''}
                        ></textarea>
                        ${this.recognition ? `
                            <button id="voice-button" class="voice-btn" ${!this.canSendMessage() ? 'disabled' : ''}>
                                <span class="icon">🎤</span>
                            </button>
                        ` : ''}
                        <button id="send-button" class="send-btn" ${!this.canSendMessage() ? 'disabled' : ''}>
                            <span class="icon">→</span>
                        </button>
                    </div>
                    ${!this.canSendMessage() ? `
                        <div class="limit-reached">
                            <p>You've reached your daily message limit for the ${tier.toUpperCase()} tier.</p>
                            <button class="upgrade-chat-btn" onclick="window.VERACore?.showUpgradeModal?.()">
                                Upgrade for More Messages
                            </button>
                        </div>
                    ` : ''}
                </div>

                <div class="chat-features">
                    <div class="feature-buttons">
                        <button class="feature-btn" onclick="VERAEnhancedChat.instance.suggestRegulationTechnique()">
                            <span class="icon">🌊</span>
                            Suggest Regulation
                        </button>
                        <button class="feature-btn" onclick="VERAEnhancedChat.instance.analyzeCurrentState()">
                            <span class="icon">🧠</span>
                            Analyze My State
                        </button>
                        <button class="feature-btn" onclick="VERAEnhancedChat.instance.explainConcept()">
                            <span class="icon">💡</span>
                            Explain Concept
                        </button>
                    </div>
                </div>
            </div>

            <!-- Conversation History Modal -->
            <div id="history-modal" class="history-modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Conversation History</h3>
                        <button class="modal-close" onclick="VERAEnhancedChat.instance.closeHistoryModal()">&times;</button>
                    </div>
                    <div class="history-content">
                        <!-- History will be populated here -->
                    </div>
                </div>
            </div>
        `;

        this.chatContainer = chatContainer;
        this.messageContainer = document.getElementById('messages-container');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.voiceButton = document.getElementById('voice-button');
    }

    attachEventListeners() {
        if (!this.chatInput || !this.sendButton) return;

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });

        // Send message on Enter (but allow Shift+Enter for new lines)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Voice button
        if (this.voiceButton && this.recognition) {
            this.voiceButton.addEventListener('click', () => this.toggleVoiceRecording());
        }

        // History toggle
        const historyToggle = document.getElementById('history-toggle');
        if (historyToggle) {
            historyToggle.addEventListener('click', () => this.showHistoryModal());
        }

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('history-modal');
            if (e.target === modal) {
                this.closeHistoryModal();
            }
        });
    }

    async sendMessage() {
        if (!this.canSendMessage() || this.isProcessing) return;

        const message = this.chatInput.value.trim();
        if (!message) return;

        this.isProcessing = true;
        this.updateSendButton();

        // Add user message to UI
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Increment message count
        this.incrementDailyMessageCount();
        this.updateChatLimitDisplay();

        // Add to conversation history
        this.currentConversation.push({
            role: 'user',
            content: message,
            timestamp: Date.now()
        });

        // Simulate AI response (in real implementation, this would call your AI service)
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessage('bot', response);
            
            this.currentConversation.push({
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            });

            this.saveConversation();
            this.isProcessing = false;
            this.updateSendButton();
        }, 1500);
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="${sender === 'user' ? 'user-avatar' : 'neural-avatar'}">
                    ${sender === 'user' ? 'U' : 'V'}
                </div>
            </div>
            <div class="message-content">
                <div class="message-text">${content}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

        // Add neural particle effect for bot messages
        if (sender === 'bot' && window.VERANeuralParticles) {
            window.VERANeuralParticles.instance?.triggerChatResponse();
        }
    }

    generateAIResponse(userMessage) {
        // Sophisticated AI response generation based on nervous system regulation
        const responses = {
            stress: [
                "I can sense you might be feeling stressed. Let's try the physiological sigh breathing technique - it's scientifically proven to calm your nervous system quickly.",
                "Stress activates your sympathetic nervous system. Would you like to explore some grounding techniques to help shift into a more regulated state?",
                "When we're stressed, our nervous system goes into protection mode. Let's work on some tools to help you feel safer and more regulated."
            ],
            anxiety: [
                "Anxiety is your nervous system's way of trying to protect you. Let's explore some techniques to help you feel more grounded and present.",
                "I understand anxiety can feel overwhelming. The 5-4-3-2-1 grounding technique can help bring you back to the present moment.",
                "Your nervous system is in a state of hypervigilance. Let's work on some co-regulation techniques to help you feel safer."
            ],
            regulation: [
                "Nervous system regulation is about finding balance between activation and calm. What specific area would you like to explore?",
                "Great question about regulation! The key is developing awareness of your nervous system states and having tools to shift between them.",
                "Regulation happens through safety, connection, and practice. Let's explore which nervous system state you're currently experiencing."
            ],
            breathing: [
                "Breathwork is one of the most powerful tools for nervous system regulation. Would you like to try a specific breathing pattern?",
                "Your breath is directly connected to your nervous system. Different breathing patterns can help you achieve different states of regulation.",
                "Conscious breathing activates your parasympathetic nervous system, promoting rest and recovery. Let's explore some techniques together."
            ],
            trauma: [
                "Thank you for sharing. Trauma can dysregulate our nervous system, but healing is possible through gentle, body-based approaches.",
                "Trauma lives in the nervous system, but so does our capacity for resilience and healing. Let's explore some gentle regulation techniques.",
                "I hear you. Trauma-informed nervous system work focuses on safety, choice, and gradual re-regulation. How can I support you today?"
            ]
        };

        const message = userMessage.toLowerCase();
        let category = 'regulation'; // default

        if (message.includes('stress') || message.includes('overwhelm')) category = 'stress';
        else if (message.includes('anxiety') || message.includes('anxious') || message.includes('worry')) category = 'anxiety';
        else if (message.includes('breath') || message.includes('breathing')) category = 'breathing';
        else if (message.includes('trauma') || message.includes('ptsd')) category = 'trauma';

        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    toggleVoiceRecording() {
        if (!this.recognition) return;

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isRecording = true;
        }
        
        this.updateVoiceButton();
    }

    updateVoiceButton() {
        if (!this.voiceButton) return;
        
        if (this.isRecording) {
            this.voiceButton.classList.add('recording');
            this.voiceButton.innerHTML = '<span class="icon">⏹</span>';
        } else {
            this.voiceButton.classList.remove('recording');
            this.voiceButton.innerHTML = '<span class="icon">🎤</span>';
        }
    }

    updateSendButton() {
        if (!this.sendButton) return;
        
        if (this.isProcessing) {
            this.sendButton.disabled = true;
            this.sendButton.innerHTML = '<div class="loading-spinner"></div>';
        } else {
            this.sendButton.disabled = !this.canSendMessage();
            this.sendButton.innerHTML = '<span class="icon">→</span>';
        }
    }

    updateChatLimitDisplay() {
        const limitInfo = document.querySelector('.limit-info');
        const inputContainer = document.querySelector('.chat-input-container');
        
        if (!limitInfo || !inputContainer) return;

        const tier = this.getCurrentTier();
        const remaining = this.getRemainingMessages();
        const limit = this.tierLimits[tier];

        if (limit === -1) {
            limitInfo.innerHTML = '<span class="unlimited">∞ Unlimited</span>';
        } else {
            limitInfo.innerHTML = `<span class="count">${remaining}/${limit}</span> messages today`;
        }

        // Show/hide limit reached message
        const existingLimit = inputContainer.querySelector('.limit-reached');
        if (!this.canSendMessage() && !existingLimit) {
            const limitDiv = document.createElement('div');
            limitDiv.className = 'limit-reached';
            limitDiv.innerHTML = `
                <p>You've reached your daily message limit for the ${tier.toUpperCase()} tier.</p>
                <button class="upgrade-chat-btn" onclick="window.VERACore?.showUpgradeModal?.()">
                    Upgrade for More Messages
                </button>
            `;
            inputContainer.appendChild(limitDiv);
            
            // Disable inputs
            if (this.chatInput) this.chatInput.disabled = true;
            if (this.sendButton) this.sendButton.disabled = true;
            if (this.voiceButton) this.voiceButton.disabled = true;
        } else if (this.canSendMessage() && existingLimit) {
            existingLimit.remove();
            
            // Re-enable inputs
            if (this.chatInput) this.chatInput.disabled = false;
            if (this.sendButton) this.sendButton.disabled = false;
            if (this.voiceButton) this.voiceButton.disabled = false;
        }
    }

    saveConversation() {
        if (this.currentConversation.length === 0) return;

        const conversation = {
            id: Date.now(),
            title: this.generateConversationTitle(),
            messages: [...this.currentConversation],
            createdAt: Date.now(),
            tier: this.getCurrentTier()
        };

        this.conversationHistory.unshift(conversation);
        
        // Keep only last 50 conversations for performance
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(0, 50);
        }

        localStorage.setItem('vera_chat_history', JSON.stringify(this.conversationHistory));
    }

    generateConversationTitle() {
        if (this.currentConversation.length === 0) return 'New Conversation';
        
        const firstMessage = this.currentConversation.find(msg => msg.role === 'user')?.content || '';
        return firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
    }

    loadConversationHistory() {
        // This would load a specific conversation back into the chat
        // For now, we'll just display the welcome message
    }

    showHistoryModal() {
        const modal = document.getElementById('history-modal');
        const historyContent = modal.querySelector('.history-content');
        
        if (this.conversationHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="no-history">
                    <p>No conversation history yet. Start chatting with VERA to build your history!</p>
                </div>
            `;
        } else {
            historyContent.innerHTML = `
                <div class="history-list">
                    ${this.conversationHistory.map(conv => `
                        <div class="history-item" onclick="VERAEnhancedChat.instance.loadConversation('${conv.id}')">
                            <div class="conversation-header">
                                <h4>${conv.title}</h4>
                                <div class="conversation-meta">
                                    <span class="date">${new Date(conv.createdAt).toLocaleDateString()}</span>
                                    <span class="tier-badge ${conv.tier}">${conv.tier.toUpperCase()}</span>
                                </div>
                            </div>
                            <p class="message-preview">
                                ${conv.messages.length} messages • ${conv.messages[conv.messages.length - 1]?.content.substring(0, 60)}...
                            </p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        modal.style.display = 'flex';
    }

    closeHistoryModal() {
        const modal = document.getElementById('history-modal');
        modal.style.display = 'none';
    }

    loadConversation(conversationId) {
        const conversation = this.conversationHistory.find(conv => conv.id == conversationId);
        if (!conversation) return;

        // Clear current messages
        this.messageContainer.innerHTML = '';
        
        // Load conversation messages
        conversation.messages.forEach(msg => {
            this.addMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
        });

        this.closeHistoryModal();
    }

    // Feature button methods
    suggestRegulationTechnique() {
        if (!this.canSendMessage()) return;
        
        const suggestions = [
            "Can you suggest a breathing technique for when I feel overwhelmed?",
            "What grounding technique would help me feel more present?",
            "I'm feeling activated - what can help me regulate?",
            "Can you recommend a technique for anxiety?"
        ];
        
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.chatInput.value = suggestion;
        this.chatInput.focus();
    }

    analyzeCurrentState() {
        if (!this.canSendMessage()) return;
        
        this.chatInput.value = "Can you help me understand what nervous system state I might be in right now?";
        this.chatInput.focus();
    }

    explainConcept() {
        if (!this.canSendMessage()) return;
        
        const concepts = [
            "Can you explain how the nervous system affects emotions?",
            "What's the difference between sympathetic and parasympathetic states?",
            "How does trauma affect the nervous system?",
            "What is co-regulation and how does it work?"
        ];
        
        const concept = concepts[Math.floor(Math.random() * concepts.length)];
        this.chatInput.value = concept;
        this.chatInput.focus();
    }

    // Static instance for global access
    static instance = null;
    
    static async initialize() {
        if (!VERAEnhancedChat.instance) {
            VERAEnhancedChat.instance = new VERAEnhancedChat();
        }
        await VERAEnhancedChat.instance.init();
        return VERAEnhancedChat.instance;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VERAEnhancedChat.initialize());
} else {
    VERAEnhancedChat.initialize();
}

window.VERAEnhancedChat = VERAEnhancedChat;