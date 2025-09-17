// Emergency Navigation Fix - Direct Section Switching
console.log('🆘 Emergency Navigation System Loading...');

// Simple, direct section switching function
function switchToSection(sectionName) {
    console.log('🔄 Emergency switch to:', sectionName);
    
    // Hide all sections first
    const sections = ['dashboard-section', 'breathing-section', 'grounding-section', 'journal-section', 'chat-section', 'progress-section', 'settings-section'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Update navigation active states
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Show the target section or create it
    let targetSection = document.getElementById(sectionName + '-section');
    
    if (!targetSection) {
        // Create the section if it doesn't exist
        targetSection = document.createElement('section');
        targetSection.id = sectionName + '-section';
        targetSection.className = 'content-section active-section';
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(targetSection);
        }
    }
    
    // Show the section
    targetSection.style.display = 'block';
    
    // Load content based on section
    loadSectionContent(sectionName, targetSection);
    
    console.log('✅ Emergency navigation complete to:', sectionName);
}

function loadSectionContent(sectionName, container) {
    console.log('📄 Loading content for:', sectionName);
    
    switch(sectionName) {
        case 'breathing':
            container.innerHTML = `
                <div class="breathing-container">
                    <div class="content-header">
                        <button onclick="switchToSection('dashboard')" class="back-btn">← Back to Dashboard</button>
                        <h2>🫁 Breathing Exercises</h2>
                        <p>Regulate your nervous system with guided breathing</p>
                    </div>
                    
                    <div class="technique-grid">
                        <div class="technique-card" data-technique="box">
                            <div class="technique-icon">📦</div>
                            <h3>Box Breathing</h3>
                            <p>4-4-4-4 pattern for instant calm</p>
                            <button class="start-technique-btn" onclick="alert('Starting Box Breathing! In production, this would launch the guided breathing interface.')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="physiological">
                            <div class="technique-icon">😮‍💨</div>
                            <h3>Physiological Sigh</h3>
                            <p>Double inhale + long exhale</p>
                            <button class="start-technique-btn" onclick="alert('Starting Physiological Sigh! This technique rapidly calms your nervous system.')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="coherent">
                            <div class="technique-icon">❤️</div>
                            <h3>Coherent Breathing</h3>
                            <p>Heart rate variability optimization</p>
                            <button class="start-technique-btn" onclick="alert('Starting Coherent Breathing! This builds heart-brain coherence.')">Start</button>
                        </div>
                        
                        <div class="technique-card" data-technique="voo">
                            <div class="technique-icon">🎵</div>
                            <h3>Voo Breathing</h3>
                            <p>Vagus nerve activation</p>
                            <button class="start-technique-btn" onclick="alert('Voo Breathing requires Regulator tier. Upgrade to unlock!')">Upgrade Required</button>
                        </div>
                        
                        <div class="technique-card" data-technique="478">
                            <div class="technique-icon">🔢</div>
                            <h3>4-7-8 Technique</h3>
                            <p>Sleep and anxiety relief</p>
                            <button class="start-technique-btn" onclick="alert('4-7-8 Breathing requires Regulator tier. Upgrade to unlock!')">Upgrade Required</button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'grounding':
            container.innerHTML = `
                <div class="grounding-container">
                    <div class="content-header">
                        <button onclick="switchToSection('dashboard')" class="back-btn">← Back to Dashboard</button>
                        <h2>🌱 Grounding Techniques</h2>
                        <p>Ground yourself in the present moment</p>
                    </div>
                    
                    <div class="grounding-grid">
                        <div class="grounding-card">
                            <div class="grounding-icon">👁️</div>
                            <h3>5-4-3-2-1 Sensory</h3>
                            <p>5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste</p>
                            <button class="start-grounding-btn" onclick="alert('Starting 5-4-3-2-1 Sensory grounding! Look around and name 5 things you can see...')">Start</button>
                        </div>
                        
                        <div class="grounding-card">
                            <div class="grounding-icon">💪</div>
                            <h3>Progressive Muscle</h3>
                            <p>Tense and release muscle groups</p>
                            <button class="start-grounding-btn" onclick="alert('Starting Progressive Muscle Relaxation! Tense your fists for 5 seconds, then release...')">Start</button>
                        </div>
                        
                        <div class="grounding-card">
                            <div class="grounding-icon">🤲</div>
                            <h3>Bilateral Stimulation</h3>
                            <p>Cross-lateral movements for integration</p>
                            <button class="start-grounding-btn" onclick="alert('Bilateral Stimulation requires Regulator tier. Upgrade to unlock advanced techniques!')">Upgrade Required</button>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'journal':
            container.innerHTML = `
                <div class="journal-container">
                    <div class="content-header">
                        <button onclick="switchToSection('dashboard')" class="back-btn">← Back to Dashboard</button>
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
                            <div class="mood-option" data-mood="1" onclick="selectMood(1)">😰</div>
                            <div class="mood-option" data-mood="2" onclick="selectMood(2)">😟</div>
                            <div class="mood-option" data-mood="3" onclick="selectMood(3)">😐</div>
                            <div class="mood-option" data-mood="4" onclick="selectMood(4)">😌</div>
                            <div class="mood-option" data-mood="5" onclick="selectMood(5)">😊</div>
                        </div>
                        
                        <button class="save-entry-btn" onclick="alert('Journal entry saved! Your insights help VERA understand your patterns.')">Save Entry</button>
                    </div>
                </div>
            `;
            break;
            
        case 'chat':
            container.innerHTML = `
                <div class="chat-container">
                    <div class="content-header">
                        <button onclick="switchToSection('dashboard')" class="back-btn">← Back to Dashboard</button>
                        <h2>💬 Chat with VERA</h2>
                        <p>Your AI nervous system companion</p>
                        <div class="chat-limits">7/10 chats this month</div>
                    </div>
                    
                    <div class="messages-container" id="messagesContainer">
                        <div class="message vera-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <p>Hello! I'm VERA, your nervous system companion. How can I help you regulate today?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <textarea class="chat-input" id="chatInput" placeholder="Share what you're feeling..."></textarea>
                        <button class="send-btn" onclick="sendChatMessage()">Send</button>
                        <button class="voice-btn">🎤</button>
                    </div>
                    
                    <div class="feature-buttons">
                        <button class="feature-btn" onclick="quickChatMessage('I need help with anxiety')">Help with Anxiety</button>
                        <button class="feature-btn" onclick="quickChatMessage('I feel overwhelmed')">Feeling Overwhelmed</button>
                        <button class="feature-btn" onclick="quickChatMessage('Breathing guidance')">Breathing Guidance</button>
                    </div>
                </div>
            `;
            break;
            
        case 'settings':
            container.innerHTML = `
                <div class="settings-container">
                    <div class="content-header">
                        <button onclick="switchToSection('dashboard')" class="back-btn">← Back to Dashboard</button>
                        <h2>⚙️ Settings</h2>
                        <p>Customize your VERA experience</p>
                    </div>
                    
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
            break;
            
        default:
            // Return to dashboard
            switchToSection('dashboard');
    }
}

// Chat functions
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (input && input.value.trim() && messagesContainer) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${input.value}</p>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // VERA response
        setTimeout(() => {
            const veraResponse = document.createElement('div');
            veraResponse.className = 'message vera-message';
            veraResponse.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>I understand you're experiencing "${input.value}". Let me guide you through some regulation techniques...</p>
                </div>
            `;
            messagesContainer.appendChild(veraResponse);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
        
        input.value = '';
    }
}

function quickChatMessage(message) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = message;
        sendChatMessage();
    }
}

function selectMood(mood) {
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    console.log('Mood selected:', mood);
}

// Override any existing navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🆘 Emergency navigation system ready!');
    
    // Add emergency click listeners
    setTimeout(() => {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const section = this.getAttribute('data-section');
                if (section) {
                    switchToSection(section);
                }
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-option').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const text = this.textContent.toLowerCase();
                if (text.includes('breathing')) {
                    switchToSection('breathing');
                } else if (text.includes('grounding')) {
                    switchToSection('grounding');
                } else if (text.includes('chat')) {
                    switchToSection('chat');
                } else if (text.includes('journal')) {
                    switchToSection('journal');
                }
            });
        });
        
        console.log('✅ Emergency navigation listeners attached!');
    }, 1000);
});

// Make functions globally available
window.switchToSection = switchToSection;
window.sendChatMessage = sendChatMessage;
window.quickChatMessage = quickChatMessage;
window.selectMood = selectMood;