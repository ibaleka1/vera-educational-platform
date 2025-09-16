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

  // Interactive Demo (Breathing & Swaying)
  setupBreathingDemo() {
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
        demoText.textContent = 'Experience VERA\'s gentle swaying regulation';
      } else {
        demoCircle.classList.remove('swaying-mode');
        fasciaNetwork.classList.remove('swaying-mode');
        swayIndicator.classList.remove('active');
        demoText.textContent = 'Experience VERA\'s breathing regulation';
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
        demoText.textContent = 'Experience VERA\'s gentle swaying regulation';
      } else {
        demoText.textContent = 'Experience VERA\'s breathing regulation';
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
          const modeText = currentMode === 'swaying' ? 'swaying' : 'breathing';
          demoText.textContent = `Beautiful! VERA's neural network is syncing with your ${modeText} rhythm...`;
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