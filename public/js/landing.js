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

  // Interactive Breathing Demo
  setupBreathingDemo() {
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const startButton = document.getElementById('startBreathing');

    if (!breathingCircle || !startButton) return;

    let isBreathing = false;
    let breathingTimer;

    const breathingPhases = [
      { text: "Breathe in through your nose...", duration: 4000 },
      { text: "Hold gently...", duration: 4000 },
      { text: "Breathe out slowly...", duration: 6000 },
      { text: "Rest and feel...", duration: 2000 }
    ];

    let currentPhase = 0;

    startButton.addEventListener('click', () => {
      if (isBreathing) {
        this.stopBreathing();
      } else {
        this.startBreathing();
      }
    });

    const startBreathing = () => {
      isBreathing = true;
      breathingCircle.classList.add('active');
      startButton.textContent = 'Stop Breathing with VERA';
      startButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      
      this.runBreathingCycle();
    };

    const stopBreathing = () => {
      isBreathing = false;
      breathingCircle.classList.remove('active');
      startButton.textContent = 'Start Breathing with VERA';
      startButton.style.background = 'linear-gradient(135deg, var(--neural), var(--trauma))';
      breathingText.textContent = 'Click to begin regulation with VERA';
      
      if (breathingTimer) {
        clearTimeout(breathingTimer);
      }
    };

    const runBreathingCycle = () => {
      if (!isBreathing) return;

      const phase = breathingPhases[currentPhase];
      breathingText.textContent = phase.text;

      // Visual breathing effect
      if (currentPhase === 0) { // Breathe in
        breathingCircle.style.transform = 'scale(1.2)';
      } else if (currentPhase === 2) { // Breathe out
        breathingCircle.style.transform = 'scale(0.9)';
      } else {
        breathingCircle.style.transform = 'scale(1)';
      }

      breathingTimer = setTimeout(() => {
        currentPhase = (currentPhase + 1) % breathingPhases.length;
        if (currentPhase === 0) {
          // Show completion message after full cycle
          breathingText.textContent = "Beautiful! VERA is reading your nervous system coherence...";
          setTimeout(() => {
            if (isBreathing) this.runBreathingCycle();
          }, 2000);
        } else {
          this.runBreathingCycle();
        }
      }, phase.duration);
    };

    // Bind methods to this context
    this.startBreathing = startBreathing;
    this.stopBreathing = stopBreathing;
    this.runBreathingCycle = runBreathingCycle;
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

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERALanding;
}