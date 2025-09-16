// VERA Landing Page - Revolutionary Nervous System Interface
// Interactive Breathing Demo & Lead Generation

class VERALanding {
  constructor() {
    this.init();
  }

  init() {
    this.setupBreathingDemo();
    this.setupSignupForm();
    this.setupSmoothScrolling();
    this.startNeuralAnimations();
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
}

// Initialize VERA Landing Page
document.addEventListener('DOMContentLoaded', () => {
  new VERALanding();
  
  console.log('🧠 VERA Revolutionary Nervous System Interface Loaded');
  console.log('🌟 Welcome to the future of nervous system regulation');
});

// Expandable Benefit Cards Function
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

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERALanding;
}