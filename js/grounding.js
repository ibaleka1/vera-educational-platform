// Grounding exercise controller
class GroundingController {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.isActive = false;
  }

  start() {
    this.currentStep = 1;
    this.isActive = true;
    this.showStep(1);
  }

  showStep(stepNumber) {
    // Hide all steps
    for (let i = 1; i <= this.totalSteps; i++) {
      const step = document.getElementById(`step${i}`);
      if (step) step.style.display = 'none';
    }
    
    // Show current step
    const currentStepEl = document.getElementById(`step${stepNumber}`);
    if (currentStepEl) {
      currentStepEl.style.display = 'block';
      currentStepEl.classList.add('active');
    }
    
    // Update button text
    const button = document.getElementById('groundingButton');
    if (button) {
      if (stepNumber === this.totalSteps) {
        button.textContent = 'Complete Grounding';
      } else {
        button.textContent = `Next: ${this.getStepName(stepNumber + 1)}`;
      }
    }
  }

  nextStep() {
    if (this.currentStep >= this.totalSteps) {
      this.complete();
      return;
    }
    
    this.currentStep++;
    this.showStep(this.currentStep);
  }

  complete() {
    this.isActive = false;
    
    // Show completion message
    const container = document.querySelector('.grounding-steps');
    if (container) {
      container.innerHTML = `
        <div class="grounding-complete">
          <div class="completion-icon">🌿</div>
          <h3>Grounding Complete</h3>
          <p>You've anchored yourself in the present moment.</p>
          <p>Notice how your nervous system feels now.</p>
        </div>
      `;
    }
    
    // Reset button
    const button = document.getElementById('groundingButton');
    if (button) {
      button.textContent = 'Start Again';
      button.onclick = () => this.restart();
    }
  }

  restart() {
    this.currentStep = 1;
    this.isActive = true;
    
    // Restore original steps
    const container = document.querySelector('.grounding-steps');
    if (container) {
      container.innerHTML = this.getOriginalStepsHTML();
    }
    
    this.showStep(1);
  }

  getStepName(stepNumber) {
    const names = {
      1: 'See (5 things)',
      2: 'Touch (4 things)', 
      3: 'Hear (3 things)',
      4: 'Smell (2 things)',
      5: 'Taste (1 thing)'
    };
    return names[stepNumber] || '';
  }

  getOriginalStepsHTML() {
    return `
      <div class="grounding-step active" id="step1">
        <div class="step-indicator">👁️</div>
        <h3>Say out loud: 5 things you SEE</h3>
        <p>Look around you right now. Name them.</p>
      </div>
      
      <div class="grounding-step" id="step2">
        <div class="step-indicator">✋</div>
        <h3>Say out loud: 4 things you can TOUCH</h3>
        <p>What textures are within reach?</p>
      </div>
      
      <div class="grounding-step" id="step3">
        <div class="step-indicator">👂</div>
        <h3>Say out loud: 3 things you HEAR</h3>
        <p>What sounds are present right now?</p>
      </div>
      
      <div class="grounding-step" id="step4">
        <div class="step-indicator">👃</div>
        <h3>Say out loud: 2 things you SMELL</h3>
        <p>What scents can you detect?</p>
      </div>
      
      <div class="grounding-step" id="step5">
        <div class="step-indicator">👅</div>
        <h3>Say out loud: 1 thing you TASTE</h3>
        <p>What taste is in your mouth?</p>
      </div>
    `;
  }
}

// Bilateral Sway Controller
class SwayController {
  constructor() {
    this.isActive = false;
    this.swayInterval = null;
    this.direction = 1; // 1 for right, -1 for left
  }

  start() {
    if (this.isActive) {
      this.stop();
      return;
    }
    
    this.isActive = true;
    const button = document.getElementById('swayButton');
    if (button) button.textContent = 'Stop Swaying';
    
    this.startSwayAnimation();
  }

  stop() {
    this.isActive = false;
    if (this.swayInterval) {
      clearInterval(this.swayInterval);
      this.swayInterval = null;
    }
    
    const button = document.getElementById('swayButton');
    const circle = document.getElementById('swayCircle');
    
    if (button) button.textContent = 'Start Swaying';
    if (circle) {
      circle.style.transform = 'translateX(0)';
    }
  }

  startSwayAnimation() {
    const circle = document.getElementById('swayCircle');
    if (!circle) return;
    
    let position = 0;
    const maxDistance = 60; // pixels to sway
    const speed = 0.02; // animation speed
    
    this.swayInterval = setInterval(() => {
      if (!this.isActive) return;
      
      position += speed * this.direction;
      
      if (position >= 1 || position <= -1) {
        this.direction *= -1; // Change direction
      }
      
      const translateX = position * maxDistance;
      circle.style.transform = `translateX(${translateX}px)`;
      circle.style.background = `linear-gradient(${90 + position * 45}deg, var(--neural), var(--calm))`;
    }, 16); // ~60fps
  }
}

// Global controllers
window.groundingController = new GroundingController();
window.swayController = new SwayController();

// Global functions for HTML
function nextGroundingStep() {
  window.groundingController.nextStep();
}

function toggleSway() {
  window.swayController.start();
}

// Initialize grounding on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('step1')) {
    window.groundingController.showStep(1);
  }
});