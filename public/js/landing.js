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

  // Live Chat Demo
  setupBreathingDemo() {
    const chatInterface = document.getElementById('chatInterface');
    const startButton = document.getElementById('startChatDemo');

    if (!chatInterface || !startButton) return;

    let isActive = false;
    let messageIndex = 0;
    let chatTimer;

    startButton.addEventListener('click', () => {
      if (isActive) {
        this.stopChatDemo();
      } else {
        this.startChatDemo();
      }
    });

    const startChatDemo = () => {
      isActive = true;
      startButton.textContent = 'Reset Conversation';
      startButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      
      // Reset all messages
      const messages = chatInterface.querySelectorAll('.message, .wow-reaction');
      messages.forEach(msg => {
        msg.classList.add('hidden');
        const typingIndicator = msg.querySelector('.typing-indicator');
        const messageText = msg.querySelector('.message-text');
        if (typingIndicator && messageText) {
          typingIndicator.classList.remove('hidden');
          messageText.classList.add('hidden');
        }
      });
      
      messageIndex = 0;
      this.showNextMessage();
    };

    const stopChatDemo = () => {
      isActive = false;
      startButton.textContent = 'Watch VERA in Action';
      startButton.style.background = 'linear-gradient(135deg, var(--neural), var(--trauma))';
      
      if (chatTimer) {
        clearTimeout(chatTimer);
      }
      
      // Reset all messages
      const messages = chatInterface.querySelectorAll('.message, .wow-reaction');
      messages.forEach(msg => {
        msg.classList.add('hidden');
        const typingIndicator = msg.querySelector('.typing-indicator');
        const messageText = msg.querySelector('.message-text');
        if (typingIndicator && messageText) {
          typingIndicator.classList.remove('hidden');
          messageText.classList.add('hidden');
        }
      });
    };

    const showNextMessage = () => {
      if (!isActive) return;

      const messages = chatInterface.querySelectorAll('.message, .wow-reaction');
      if (messageIndex >= messages.length) {
        // Show wow reaction and restart
        setTimeout(() => {
          if (isActive) {
            messageIndex = 0;
            this.showNextMessage();
          }
        }, 3000);
        return;
      }

      const currentMessage = messages[messageIndex];
      currentMessage.classList.remove('hidden');

      const typingIndicator = currentMessage.querySelector('.typing-indicator');
      const messageText = currentMessage.querySelector('.message-text');

      if (typingIndicator && messageText) {
        // Show typing indicator first
        setTimeout(() => {
          if (isActive) {
            typingIndicator.classList.add('hidden');
            messageText.classList.remove('hidden');
            
            // Move to next message
            messageIndex++;
            setTimeout(() => {
              if (isActive) this.showNextMessage();
            }, messageIndex === messages.length - 1 ? 2000 : 1500);
          }
        }, messageIndex === 0 ? 2000 : 1500);
      } else {
        // For wow reaction or messages without typing
        messageIndex++;
        setTimeout(() => {
          if (isActive) this.showNextMessage();
        }, currentMessage.classList.contains('wow-reaction') ? 2000 : 1000);
      }
    };

    // Bind methods to this context
    this.startChatDemo = startChatDemo;
    this.stopChatDemo = stopChatDemo;
    this.showNextMessage = showNextMessage;
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