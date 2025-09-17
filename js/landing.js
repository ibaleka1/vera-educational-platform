// VERA Landing Page - Revolutionary Nervous System Interface
// Interactive Breathing Demo & Lead Generation

class VERALanding {
  constructor() {
    this.voiceEnabled = true;
    this.currentAudio = null;
    
    // VERA Voice Configuration - ElevenLabs Voice IDs
    this.voiceConfig = {
      primary: 'uYXf8XasLslADfZ2MB4u',    // Main therapeutic voice - calm, grounding
      gentle: 'OYTbf65OHHFELVut7v2H',     // Softer voice for activated/trauma states  
      energetic: 'WAhoMTNdLdMoq1j3wf3I'   // Dynamic voice for motivation/engagement
    };
    
    this.userState = {
      activation_level: 0.5,
      coherence_level: 0.5,
      energy_level: 0.5
    };
    this.init();
  }

  init() {
    this.setupBreathingDemo();
    this.setupSignupForm();
    this.setupSmoothScrolling();
    this.startNeuralAnimations();
    this.setupVoiceControls();
    this.setupHeroChat();
  }

  // Combined Demo Setup - Chat + Breathing/Swaying
  setupBreathingDemo() {
    this.setupChatDemo();
    this.setupTechniquesDemo();
  }

  // Interactive Live Chat
  setupChatDemo() {
    const chatInterface = document.getElementById('chatInterface');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendMessage');
    const questionsCounter = document.getElementById('questionsLeft');

    if (!chatInterface || !userInput || !sendButton) return;

    let questionsRemaining = 3;

    const veraResponses = {
      'shoulders': "I feel that tension you're holding. Try this: Gently lift your shoulders up to your ears, hold for 3 seconds, then let them drop completely while exhaling slowly. Your fascia needs this release pattern.",
      'anxious': "That restless energy - your nervous system is in hypervigilance. Place both hands on your chest, breathe in for 4 counts, hold for 4, exhale for 6. This tells your vagus nerve you're safe.",
      'chest': "That tightness is your chest fascia contracting for protection. Try gentle neck side-to-side movements while placing one hand on your chest. This helps reset the tension pattern.",
      'stress': "Your body is holding stress in multiple places. Start with 3 deep breaths, then gentle shoulder rolls backward. Your nervous system needs this grounding signal.",
      'tired': "Fatigue often means your nervous system needs regulation, not just rest. Try gentle spine twists while seated - this activates your parasympathetic nervous system.",
      'overwhelm': "I can sense that scattered feeling. Ground yourself: Press your feet firmly into the floor, lengthen your spine, and take 5 conscious breaths. This centers your nervous system.",
      'default': "I understand what you're feeling. Your body is asking for gentle attention. Try slow, mindful movement and conscious breathing to help your nervous system find balance."
    };

    // Enable/disable send button based on input
    userInput.addEventListener('input', () => {
      sendButton.disabled = !userInput.value.trim() || questionsRemaining <= 0;
    });

    // Send message on Enter key
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !sendButton.disabled) {
        sendMessage();
      }
    });

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    function sendMessage() {
      const message = userInput.value.trim();
      if (!message || questionsRemaining <= 0) return;

      // Add user message
      addMessage(message, 'user');
      
      // Clear input
      userInput.value = '';
      sendButton.disabled = true;

      // Show VERA typing and respond
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          const response = generateVERAResponse(message);
          addMessage(response, 'vera');
          
          questionsRemaining--;
          updateQuestionsCounter();
          
          if (questionsRemaining <= 0) {
            setTimeout(() => {
              addMessage("That's all for now! To continue exploring with VERA, sign up below for full access to personalized guidance.", 'vera');
            }, 1500);
          }
        }, 2000);
      }, 500);
    }

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}-message`;
      
      const avatar = document.createElement('div');
      avatar.className = `avatar ${sender}-avatar`;
      avatar.textContent = sender === 'vera' ? 'V' : 'You';
      
      const content = document.createElement('div');
      content.className = 'message-content';
      
      const messageText = document.createElement('div');
      messageText.className = 'message-text';
      messageText.textContent = text;
      
      content.appendChild(messageText);
      
      if (sender === 'vera') {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
      } else {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
      }
      
      chatInterface.appendChild(messageDiv);
      chatInterface.scrollTop = chatInterface.scrollHeight;
    }

    function generateVERAResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      if (message.includes('shoulder') || message.includes('tense') || message.includes('tight shoulder')) {
        return veraResponses.shoulders;
      } else if (message.includes('anxious') || message.includes('nervous') || message.includes('restless')) {
        return veraResponses.anxious;
      } else if (message.includes('chest') || message.includes('breath') || message.includes('tight chest')) {
        return veraResponses.chest;
      } else if (message.includes('stress') || message.includes('overwhelm') || message.includes('pressure')) {
        return veraResponses.overwhelm;
      } else if (message.includes('tired') || message.includes('fatigue') || message.includes('exhausted')) {
        return veraResponses.tired;
      } else {
        return veraResponses.default;
      }
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message vera-message';
      typingDiv.id = 'typingIndicator';
      
      const avatar = document.createElement('div');
      avatar.className = 'avatar vera-avatar';
      avatar.textContent = 'V';
      
      const content = document.createElement('div');
      content.className = 'message-content';
      
      const typing = document.createElement('span');
      typing.className = 'typing-indicator active';
      typing.textContent = 'VERA is sensing';
      
      content.appendChild(typing);
      typingDiv.appendChild(avatar);
      typingDiv.appendChild(content);
      
      chatInterface.appendChild(typingDiv);
      chatInterface.scrollTop = chatInterface.scrollHeight;
    }

    function hideTypingIndicator() {
      const typingIndicator = document.getElementById('typingIndicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    function updateQuestionsCounter() {
      questionsCounter.textContent = `${questionsRemaining} question${questionsRemaining !== 1 ? 's' : ''} remaining`;
      
      if (questionsRemaining <= 0) {
        userInput.disabled = true;
        userInput.placeholder = "Chat session complete - sign up for unlimited access";
      }
    }

    // Global function for quick questions
    window.askQuickQuestion = (question) => {
      if (questionsRemaining <= 0) return;
      userInput.value = question;
      sendMessage();
    };
  }

  // Breathing & Swaying Techniques Demo
  setupTechniquesDemo() {
    const demoCircle = document.getElementById('demoCircle');
    const demoText = document.getElementById('demoText');
    const startButton = document.getElementById('startDemo');
    const fasciaNetwork = document.getElementById('fasciaNetwork');
    const swayIndicator = document.getElementById('swayIndicator');

    if (!demoCircle || !startButton) return;

    let isActive = false;
    let demoTimer;
    let currentMode = 'breathing';
    let currentPhase = 0;

    const breathingPhases = [
      { text: "Breathe in through your nose...", duration: 4000 },
      { text: "Hold gently...", duration: 4000 },
      { text: "Breathe out slowly...", duration: 6000 },
      { text: "Rest and feel...", duration: 2000 }
    ];

    const swayingPhases = [
      { text: "Gently sway to the left...", duration: 2000 },
      { text: "Feel your center...", duration: 1000 },
      { text: "Now sway to the right...", duration: 2000 },
      { text: "Return to center...", duration: 1000 }
    ];

    // Set up mode switching
    window.switchDemoMode = (mode) => {
      if (isActive) this.stopDemo();
      
      currentMode = mode;
      currentPhase = 0;
      
      // Update UI
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
      
      // Update circle appearance
      if (mode === 'swaying') {
        demoCircle.classList.add('swaying-mode');
        fasciaNetwork.classList.add('swaying-mode');
        swayIndicator.classList.add('active');
        demoText.textContent = 'Experience VERA\'s gentle fascia swaying';
      } else {
        demoCircle.classList.remove('swaying-mode');
        fasciaNetwork.classList.remove('swaying-mode');
        swayIndicator.classList.remove('active');
        demoText.textContent = 'Experience VERA\'s neural breathing';
      }
    };

    startButton.addEventListener('click', () => {
      if (isActive) {
        this.stopDemo();
      } else {
        this.startDemo();
      }
    });

    const startDemo = () => {
      isActive = true;
      demoCircle.classList.add('active');
      startButton.textContent = 'Stop Experience';
      startButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      
      this.runDemoCycle();
    };

    const stopDemo = () => {
      isActive = false;
      demoCircle.classList.remove('active');
      startButton.textContent = 'Experience VERA\'s Regulation';
      startButton.style.background = 'linear-gradient(135deg, var(--neural), var(--trauma))';
      
      if (currentMode === 'swaying') {
        demoText.textContent = 'Experience VERA\'s gentle fascia swaying';
      } else {
        demoText.textContent = 'Experience VERA\'s neural breathing';
      }
      
      if (demoTimer) {
        clearTimeout(demoTimer);
      }
      
      // Reset visual state
      demoCircle.style.transform = '';
    };

    const runDemoCycle = () => {
      if (!isActive) return;

      const phases = currentMode === 'swaying' ? swayingPhases : breathingPhases;
      const phase = phases[currentPhase];
      demoText.textContent = phase.text;

      // Visual effects based on mode
      if (currentMode === 'breathing') {
        if (currentPhase === 0) { // Breathe in
          demoCircle.style.transform = 'scale(1.15)';
        } else if (currentPhase === 2) { // Breathe out
          demoCircle.style.transform = 'scale(0.95)';
        } else {
          demoCircle.style.transform = 'scale(1)';
        }
      } else if (currentMode === 'swaying') {
        // Swaying effects are handled by CSS animations
        // Just add subtle scale changes
        if (currentPhase === 0 || currentPhase === 2) {
          demoCircle.style.transform += ' scale(1.05)';
        } else {
          demoCircle.style.transform += ' scale(1)';
        }
      }

      demoTimer = setTimeout(() => {
        currentPhase = (currentPhase + 1) % phases.length;
        if (currentPhase === 0) {
          // Show completion message after full cycle
          const modeText = currentMode === 'swaying' ? 'fascia swaying' : 'neural breathing';
          demoText.textContent = `Beautiful! VERA's intelligence is syncing with your ${modeText} rhythm...`;
          setTimeout(() => {
            if (isActive) this.runDemoCycle();
          }, 2000);
        } else {
          this.runDemoCycle();
        }
      }, phase.duration);
    };

    // Bind methods to this context
    this.startDemo = startDemo;
    this.stopDemo = stopDemo;
    this.runDemoCycle = runDemoCycle;
  }

  // Lead Generation Signup Form
  setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) return;

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = signupForm.querySelector('input[type="email"]').value;
      
      if (this.validateEmail(email)) {
        this.processSignup(email);
      } else {
        this.showMessage('Please enter a valid email address', 'error');
      }
    });
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async processSignup(email) {
    const submitBtn = document.querySelector('.signup-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Joining the Revolution...';
    submitBtn.disabled = true;

    try {
      // Here you would typically send to your backend/database
      // For now, we'll simulate the process
      await this.simulateSignup(email);
      
      this.showMessage('🎉 Welcome to the VERA Revolution! Check your email for early access.', 'success');
      document.getElementById('signupForm').reset();
      
      // Track the conversion
      this.trackSignup(email);
      
    } catch (error) {
      this.showMessage('Something went wrong. Please try again.', 'error');
      console.error('Signup error:', error);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  simulateSignup(email) {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Store in localStorage for demo purposes
        const signups = JSON.parse(localStorage.getItem('veraSignups') || '[]');
        signups.push({
          email,
          timestamp: new Date().toISOString(),
          source: 'landing_page'
        });
        localStorage.setItem('veraSignups', JSON.stringify(signups));
        resolve();
      }, 2000);
    });
  }

  trackSignup(email) {
    // Analytics tracking - would integrate with your analytics platform
    console.log('VERA Signup Conversion:', {
      email: email,
      timestamp: new Date().toISOString(),
      page: 'landing',
      userAgent: navigator.userAgent
    });
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `signup-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('signupForm');
    form.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Neural network background animations
  startNeuralAnimations() {
    const neuralBg = document.querySelector('.neurons-background');
    if (!neuralBg) return;

    // Add dynamic neural pulses
    setInterval(() => {
      this.createNeuralPulse();
    }, 3000);
  }

  createNeuralPulse() {
    const neuralBg = document.querySelector('.neurons-background');
    if (!neuralBg) return;

    const pulse = document.createElement('div');
    pulse.className = 'neural-pulse-dynamic';
    pulse.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--neural);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: pulseGlow 2s ease-out forwards;
      pointer-events: none;
    `;

    // Add pulse glow animation if not already defined
    if (!document.getElementById('neuralPulseStyles')) {
      const style = document.createElement('style');
      style.id = 'neuralPulseStyles';
      style.textContent = `
        @keyframes pulseGlow {
          0% { 
            transform: scale(0);
            opacity: 1;
            box-shadow: 0 0 0 rgba(139, 92, 246, 0.7);
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
          }
          100% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 0 rgba(139, 92, 246, 0);
          }
        }
        .signup-message {
          padding: 1rem;
          margin-top: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        .signup-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        .signup-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
      `;
      document.head.appendChild(style);
    }

    neuralBg.appendChild(pulse);

    // Remove pulse after animation
    setTimeout(() => {
      pulse.remove();
    }, 2000);
  }

  // Voice functionality setup
  setupVoiceControls() {
    // Add voice toggle button if not exists
    this.createVoiceToggle();
  }

  createVoiceToggle() {
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) return;

    const voiceControls = document.createElement('div');
    voiceControls.className = 'voice-controls';
    voiceControls.innerHTML = `
      <button class="voice-btn ${this.voiceEnabled ? 'active' : ''}" onclick="window.veraLanding.toggleVoice()">
        <span class="voice-icon">🎙️</span>
        <span class="voice-text">${this.voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
      </button>
      <div class="voice-indicator" style="display: none;">
        <div class="sound-wave">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
        <span>VERA is speaking...</span>
      </div>
    `;

    // Add to chat input container
    const inputContainer = chatContainer.querySelector('.chat-input-container');
    if (inputContainer) {
      inputContainer.appendChild(voiceControls);
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    const voiceBtn = document.querySelector('.voice-btn');
    const voiceText = document.querySelector('.voice-text');
    
    if (voiceBtn) {
      voiceBtn.classList.toggle('active', this.voiceEnabled);
    }
    if (voiceText) {
      voiceText.textContent = this.voiceEnabled ? 'Voice On' : 'Voice Off';
    }

    // Stop any current audio if disabling
    if (!this.voiceEnabled && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.hideVoiceIndicator();
    }
  }

  // Generate voice for VERA response
  async generateVoiceResponse(text) {
    if (!this.voiceEnabled) return null;

    try {
      const response = await fetch('/api/vera-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          userState: this.userState
        })
      });

      if (!response.ok) {
        console.warn('Voice generation failed, falling back to text only');
        return null;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Voice generation error:', error);
      return null;
    }
  }

  // Play VERA's voice
  async playVERAVoice(voiceData) {
    if (!voiceData || !voiceData.audio) return;

    try {
      // Stop any current audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Create audio from base64 data
      const audioBlob = new Blob([
        Uint8Array.from(atob(voiceData.audio), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      this.currentAudio = new Audio(audioUrl);

      // Show voice indicator
      this.showVoiceIndicator();

      // Play audio
      await this.currentAudio.play();

      // Handle audio events
      this.currentAudio.addEventListener('ended', () => {
        this.hideVoiceIndicator();
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
      });

      this.currentAudio.addEventListener('error', () => {
        console.error('Audio playback failed');
        this.hideVoiceIndicator();
        URL.revokeObjectURL(audioUrl);
      });

    } catch (error) {
      console.error('Voice playback error:', error);
      this.hideVoiceIndicator();
    }
  }

  showVoiceIndicator() {
    const indicator = document.querySelector('.voice-indicator');
    if (indicator) {
      indicator.style.display = 'flex';
    }
  }

  hideVoiceIndicator() {
    const indicator = document.querySelector('.voice-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  // Update user state based on messages
  updateUserState(message) {
    const lowerMessage = message.toLowerCase();
    
    // Detect activation/stress
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stressed') || 
        lowerMessage.includes('overwhelm') || lowerMessage.includes('panic')) {
      this.userState.activation_level = Math.min(1.0, this.userState.activation_level + 0.3);
    }
    
    // Detect shutdown/low energy
    if (lowerMessage.includes('tired') || lowerMessage.includes('numb') || 
        lowerMessage.includes('disconnected') || lowerMessage.includes('empty')) {
      this.userState.coherence_level = Math.max(0.0, this.userState.coherence_level - 0.3);
    }
    
    // Detect improvement
    if (lowerMessage.includes('better') || lowerMessage.includes('calmer') || 
        lowerMessage.includes('helpful') || lowerMessage.includes('good')) {
      this.userState.coherence_level = Math.min(1.0, this.userState.coherence_level + 0.2);
    }
    
    // Gradual return to baseline
    this.userState.activation_level *= 0.9;
    this.userState.coherence_level = 0.5 + (this.userState.coherence_level - 0.5) * 0.9;
  }

  // Hero Chat Integration
  setupHeroChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!chatInput || !sendBtn) return;
    
    // Enable send button when typing
    chatInput.addEventListener('input', () => {
      sendBtn.disabled = !chatInput.value.trim();
    });
    
    // Send message on Enter
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Initial send button state
    sendBtn.disabled = true;
  }
}

// Hero Chat Functions (Global)
let heroChatVoiceEnabled = true;
let currentHeroChatAudio = null;

function toggleVoiceChat() {
  heroChatVoiceEnabled = !heroChatVoiceEnabled;
  const voiceBtn = document.querySelector('#voiceToggle .voice-btn');
  const voiceText = voiceBtn.querySelector('.voice-text');
  
  if (heroChatVoiceEnabled) {
    voiceBtn.classList.add('active');
    voiceText.textContent = 'Voice On';
  } else {
    voiceBtn.classList.remove('active'); 
    voiceText.textContent = 'Voice Off';
    
    // Stop any current audio
    if (currentHeroChatAudio) {
      currentHeroChatAudio.pause();
      currentHeroChatAudio = null;
    }
    hideHeroChatVoiceIndicator();
  }
}

// Quick Start Functions
function selectQuickStart(message) {
  const chatInput = document.getElementById('chatInput');
  chatInput.value = message;
  chatInput.focus();
  
  // Optionally auto-send the message
  setTimeout(() => {
    sendMessage();
  }, 100);
}

async function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const sendBtn = document.getElementById('sendBtn');
  
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Disable input while processing
  chatInput.disabled = true;
  sendBtn.disabled = true;
  
  // Add user message
  addHeroChatMessage(message, 'user');
  chatInput.value = '';
  
  try {
    // Get VERA's response
    const veraResponse = await generateVERAResponse(message);
    
    // Add VERA's text response
    addHeroChatMessage(veraResponse.text, 'vera');
    
    // Generate and play voice if enabled
    if (heroChatVoiceEnabled) {
      await generateAndPlayVoice(veraResponse.text);
    }
    
  } catch (error) {
    console.error('Chat error:', error);
    addHeroChatMessage("I'm experiencing some connection issues. Please try again.", 'vera');
  }
  
  // Re-enable input
  chatInput.disabled = false;
  chatInput.focus();
}

function addHeroChatMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `<p>${text}</p>`;
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateVERAResponse(userMessage) {
  // Update user state based on message sentiment
  if (window.veraLanding) {
    window.veraLanding.updateUserState(userMessage);
  }
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Direct contextual responses that actually read what the user said
  
  // Greetings and introductions
  if (lowerMessage.match(/hi|hello|hey|good morning|good afternoon|good evening/)) {
    const greetings = [
      "Hello there. I'm glad you're here. What's been on your mind today?",
      "Hi. It's good to meet you. Tell me, what brought you here right now?",
      "Hey. I can sense you're looking for something. What's going on for you?"
    ];
    return { text: greetings[Math.floor(Math.random() * greetings.length)], category: 'greeting' };
  }
  
  // Work-related stress
  if (lowerMessage.match(/work|job|boss|meeting|deadline|project|career|office/)) {
    const workResponses = [
      `Work stress - I hear that. When you mention "${extractKeyPhrase(userMessage)}", what does that feel like in your body right now?`,
      "Work can really activate our nervous system. Are you feeling that tension somewhere specific - maybe your shoulders or chest?",
      "Sounds like work is weighing on you. Let's check in with your body for a moment. Take a breath - what are you noticing?"
    ];
    return { text: workResponses[Math.floor(Math.random() * workResponses.length)], category: 'work_stress' };
  }
  
  // Relationship concerns
  if (lowerMessage.match(/relationship|partner|family|friend|conflict|argument|love|dating/)) {
    const relationshipResponses = [
      `Relationships can stir up so much in us. When you think about what you just shared, where do you feel that in your body?`,
      "People we care about can really affect our nervous system. Are you feeling activated or more shut down right now?",
      "I hear the relationship piece. Sometimes our body holds these feelings before we even realize what's happening. What are you sensing?"
    ];
    return { text: relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)], category: 'relationships' };
  }
  
  // Physical sensations
  if (lowerMessage.match(/pain|hurt|tight|tense|sore|headache|stomach|chest|shoulders|back|neck/)) {
    const physicalResponses = [
      `I notice you mentioned feeling something in your body. That tension or discomfort - it's your nervous system trying to tell you something. What's it asking for?`,
      "Your body is speaking. When you feel that sensation you described, try breathing into that area gently. What happens?",
      "Physical sensations are often our nervous system's way of processing. Can you describe what that feeling is like - heavy, tight, buzzing?"
    ];
    return { text: physicalResponses[Math.floor(Math.random() * physicalResponses.length)], category: 'physical' };
  }
  
  // Emotions and feelings
  if (lowerMessage.match(/feel|feeling|sad|angry|scared|anxious|worried|happy|excited|mad|frustrated|upset/)) {
    const emotionWords = extractEmotionWords(userMessage);
    const emotionalResponses = [
      `${emotionWords} - that's a real feeling. Where do you sense that emotion living in your body right now?`,
      "I hear the emotion in what you're sharing. Feelings have their own intelligence. What is this one trying to tell you?",
      `When you feel ${emotionWords}, your nervous system is responding to something important. What do you think it's protecting you from?`
    ];
    return { text: emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)], category: 'emotional' };
  }
  
  // Sleep and energy
  if (lowerMessage.match(/tired|exhausted|sleep|insomnia|energy|fatigue|sleepy|awake/)) {
    const sleepResponses = [
      "Sleep and energy are such direct windows into how our nervous system is doing. What's your sleep been like lately?",
      "When you're tired like this, sometimes it's your body asking for a different kind of rest. What would feel most nourishing right now?",
      "Fatigue can be our nervous system saying 'too much' or 'not safe to relax.' What does your body need to feel more settled?"
    ];
    return { text: sleepResponses[Math.floor(Math.random() * sleepResponses.length)], category: 'sleep' };
  }
  
  // Specific questions or help-seeking
  if (lowerMessage.match(/\?|how|what|why|help|don't know|confused|stuck|lost/)) {
    const helpResponses = [
      "I hear you're looking for some clarity. Let's slow down for a moment. What's the first thing you notice in your body right now?",
      "Questions are good - they mean you're paying attention. Sometimes the answer isn't in your mind, but in what your body is telling you. What do you sense?",
      "When we're confused, our nervous system is often trying to process something. Take a breath. What feels most true for you in this moment?"
    ];
    return { text: helpResponses[Math.floor(Math.random() * helpResponses.length)], category: 'seeking_help' };
  }
  
  // Default conversational responses that acknowledge what they said
  const defaultResponses = [
    `I hear you sharing about ${extractKeyPhrase(userMessage)}. What's that bringing up for you right now?`,
    "Thank you for trusting me with that. As you sit with what you just shared, what are you noticing in your body?",
    "That sounds important. When you think about what you just told me, where do you feel it most in your body?",
    "I'm with you in this. What would it feel like to breathe into whatever you're experiencing right now?"
  ];
  
  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    category: 'conversational'
  };
}

// Helper function to extract key phrases from user message
function extractKeyPhrase(message) {
  const words = message.toLowerCase().split(' ');
  const keyWords = words.filter(word => 
    word.length > 3 && 
    !['that', 'this', 'with', 'have', 'been', 'feel', 'like', 'just', 'really', 'very', 'much'].includes(word)
  );
  return keyWords.slice(0, 2).join(' ') || 'what you shared';
}

// Helper function to extract emotion words
function extractEmotionWords(message) {
  const emotionWords = message.toLowerCase().match(/sad|angry|scared|anxious|worried|happy|excited|mad|frustrated|upset|nervous|calm|peaceful|stressed|overwhelmed/g);
  return emotionWords ? emotionWords[0] : 'that feeling';
}

async function generateAndPlayVoice(text) {
  if (!heroChatVoiceEnabled) return;
  
  try {
    showHeroChatVoiceIndicator();
    console.log('🎙️ Generating VERA voice for:', text);
    
    // Get user state for adaptive voice selection
    const userState = window.veraLanding?.userState || {
      activation_level: 0.5,
      coherence_level: 0.5,
      energy_level: 0.5
    };
    
    // Select voice based on user state
    let voiceId;
    if (userState.activation_level > 0.7) {
      voiceId = 'WAhoMTNdLdMoq1j3wf3I'; // Calming voice for high activation
    } else if (userState.coherence_level < 0.3) {
      voiceId = 'OYTbf65OHHFELVut7v2H'; // Gentle voice for low coherence
    } else {
      voiceId = 'uYXf8XasLslADfZ2MB4u'; // Primary therapeutic voice
    }
    
    // Check for ElevenLabs API key
    let API_KEY = localStorage.getItem('elevenlabs_api_key');
    
    if (!API_KEY) {
      showApiKeySetup();
      throw new Error('API key required - please set up your ElevenLabs API key');
    }
    
    // Call ElevenLabs API directly
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: userState.coherence_level * 0.5 + 0.4, // 0.4-0.9 range
          similarity_boost: 0.75,
          style: userState.activation_level > 0.6 ? 0.3 : 0.1,
          use_speaker_boost: true
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
    }
    
    const audioData = await response.arrayBuffer();
    
    // Create and play audio
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    currentHeroChatAudio = audio;
    
    audio.onended = () => {
      hideHeroChatVoiceIndicator();
      URL.revokeObjectURL(audioUrl); // Clean up
    };
    
    audio.onerror = () => {
      console.error('Audio playback error');
      hideHeroChatVoiceIndicator();
    };
    
    await audio.play();
    console.log('✅ VERA voice playing successfully');
    
  } catch (error) {
    console.error('Voice generation error:', error);
    console.log('📝 Falling back to text-only response');
    hideHeroChatVoiceIndicator();
    
    // Show informative fallback message
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'message vera-message';
      fallbackDiv.innerHTML = `
        <div class="message-avatar neural-pulse-small"></div>
        <div class="message-content" style="font-style: italic; opacity: 0.8;">
          <p>🔇 Voice generation failed: ${error.message.includes('API key') ? 'Please add your ElevenLabs API key' : 'Connection issue - text response only'}</p>
        </div>
      `;
      chatMessages.appendChild(fallbackDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

function showHeroChatVoiceIndicator() {
  const voiceStatus = document.getElementById('voiceStatus');
  if (voiceStatus) {
    voiceStatus.style.display = 'block';
  }
}

function hideHeroChatVoiceIndicator() {
  const voiceStatus = document.getElementById('voiceStatus');
  if (voiceStatus) {
    voiceStatus.style.display = 'none';
  }
}

// Expandable Benefit Cards Function (Standalone)
function toggleBenefit(header) {
  const card = header.closest('.benefit-card');
  const isExpanded = card.classList.contains('expanded');
  
  // Close all other cards first
  document.querySelectorAll('.benefit-card').forEach(c => {
    if (c !== card) {
      c.classList.remove('expanded');
    }
  });
  
  // Toggle current card
  if (isExpanded) {
    card.classList.remove('expanded');
  } else {
    card.classList.add('expanded');
    
    // Track expansion for analytics
    const title = header.querySelector('h4').textContent;
    console.log('VERA Benefit Expanded:', title);
    
    // Optional: Auto-scroll to keep content in view
    setTimeout(() => {
      card.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 200);
  }
}

// About Section Expansion Function
function toggleAboutSection(header) {
  const section = header.closest('.about-section');
  const isExpanded = section.classList.contains('expanded');
  
  // Close all other about sections first
  document.querySelectorAll('.about-section').forEach(s => {
    if (s !== section) {
      s.classList.remove('expanded');
    }
  });
  
  // Toggle current section
  if (isExpanded) {
    section.classList.remove('expanded');
  } else {
    section.classList.add('expanded');
    
    // Track expansion for analytics
    const title = header.querySelector('h4').textContent;
    console.log('VERA About Section Expanded:', title);
    
    // Auto-scroll to keep content in view
    setTimeout(() => {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 250);
  }
}

// Make VERA instance globally accessible for voice controls
window.veraLanding = null;

// Initialize VERA Landing Experience
document.addEventListener('DOMContentLoaded', () => {
  window.veraLanding = new VERALanding();
});

// API Key Management Functions
function showApiKeySetup() {
  const apiKeySetup = document.getElementById('apiKeySetup');
  if (apiKeySetup) {
    apiKeySetup.style.display = 'block';
  }
}

function hideApiKeySetup() {
  const apiKeySetup = document.getElementById('apiKeySetup');
  if (apiKeySetup) {
    apiKeySetup.style.display = 'none';
  }
}

function saveApiKey() {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    alert('Please enter a valid API key');
    return false;
  }
  
  // Basic validation for ElevenLabs API key format
  if (!apiKey.match(/^[a-f0-9]{32}$/i) && !apiKey.startsWith('sk-')) {
    const proceed = confirm('This doesn\'t look like a typical ElevenLabs API key format. Save anyway?');
    if (!proceed) return false;
  }
  
  // Save to localStorage
  localStorage.setItem('elevenlabs_api_key', apiKey);
  
  // Clear input and hide setup
  apiKeyInput.value = '';
  hideApiKeySetup();
  
  // Show success message
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    const successDiv = document.createElement('div');
    successDiv.className = 'message vera-message';
    successDiv.innerHTML = `
      <div class="message-avatar neural-pulse-small"></div>
      <div class="message-content">
        <p>✅ API key saved! VERA's voice is now ready. Try sending me a message!</p>
      </div>
    `;
    chatMessages.appendChild(successDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  return false; // Prevent form submission
}

function clearApiKey() {
  localStorage.removeItem('elevenlabs_api_key');
  showApiKeySetup();
  
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'message vera-message';
    infoDiv.innerHTML = `
      <div class="message-avatar neural-pulse-small"></div>
      <div class="message-content">
        <p>🔑 API key cleared. Please enter your ElevenLabs API key to enable voice chat.</p>
      </div>
    `;
    chatMessages.appendChild(infoDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Check API key on page load
document.addEventListener('DOMContentLoaded', () => {
  const hasApiKey = localStorage.getItem('elevenlabs_api_key');
  if (!hasApiKey) {
    setTimeout(() => {
      showApiKeySetup();
    }, 2000); // Show setup after 2 seconds if no API key
  }
  
  // Setup Enter key for API key input
  const apiKeyInput = document.getElementById('apiKeyInput');
  if (apiKeyInput) {
    apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveApiKey();
      }
    });
  }
});

// Authentication Modal Functions
function showAuthModal(type = 'signup') {
  const modal = document.getElementById('authModal');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  
  if (type === 'signup') {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  } else {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
  
  modal.style.display = 'block';
  
  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector('input[type="text"], input[type="email"]');
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.style.display = 'none';
}

function switchToLogin() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function switchToSignup() {
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
}

async function handleSignup(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  try {
    if (window.veraAuth) {
      const result = await window.veraAuth.signup(userData);
      
      if (result.success) {
        // Close modal and redirect to app
        closeAuthModal();
        
        // Show success message
        showSuccessMessage('Welcome to VERA! Redirecting to your dashboard...');
        
        // Redirect to app after a moment
        setTimeout(() => {
          window.location.href = '/app.html';
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Signup failed. Please try again.');
      }
    } else {
      // Fallback for when auth system isn't loaded
      localStorage.setItem('veraSignupData', JSON.stringify(userData));
      showSuccessMessage('Account created! Redirecting to VERA...');
      
      setTimeout(() => {
        window.location.href = '/app.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showErrorMessage('Something went wrong. Please try again.');
  } finally {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const credentials = {
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing In...';
  submitBtn.disabled = true;
  
  try {
    if (window.veraAuth) {
      const result = await window.veraAuth.login(credentials);
      
      if (result.success) {
        closeAuthModal();
        showSuccessMessage('Welcome back! Redirecting to VERA...');
        
        setTimeout(() => {
          window.location.href = '/app.html';
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Login failed. Please check your credentials.');
      }
    } else {
      // Fallback
      showSuccessMessage('Signing you in...');
      setTimeout(() => {
        window.location.href = '/app.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Login error:', error);
    showErrorMessage('Something went wrong. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function startFreeTrial() {
  showAuthModal('signup');
}

function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'auth-notification success';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'auth-notification error';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Close modal on outside click
window.addEventListener('click', function(event) {
  const modal = document.getElementById('authModal');
  if (event.target === modal) {
    closeAuthModal();
  }
});

// Handle URL hash for direct signup/login links
window.addEventListener('load', function() {
  if (window.location.hash === '#signup') {
    showAuthModal('signup');
  } else if (window.location.hash === '#login') {
    showAuthModal('login');
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERALanding;
}