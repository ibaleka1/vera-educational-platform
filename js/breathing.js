// Breathing exercise patterns and controls
class BreathingController {
  constructor() {
    this.isActive = false;
    this.currentPattern = 'box';
    this.interval = null;
    this.phase = 0;
    this.count = 4;
    
    this.patterns = {
      box: { 
        phases: ['Inhale', 'Hold', 'Exhale', 'Hold'],
        counts: [4, 4, 4, 4],
        total: 16000 // 16 seconds total
      },
      '478': {
        phases: ['Inhale', 'Hold', 'Exhale'],
        counts: [4, 7, 8],
        total: 19000 // 19 seconds total
      },
      coherent: {
        phases: ['Inhale', 'Exhale'],
        counts: [5, 5],
        total: 10000 // 10 seconds total
      }
    };
  }

  setBreathType(type) {
    if (this.isActive) this.stop();
    this.currentPattern = type;
    
    // Update UI
    document.querySelectorAll('.breath-type').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(type === '478' ? 'fourSevenEight' : type + 'Breath')?.classList.add('active');
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.phase = 0;
    
    const bubble = document.getElementById('breathBubble');
    const button = document.getElementById('breathButton');
    
    if (button) button.textContent = 'Stop Breathing';
    
    this.updateBreathingDisplay();
    this.startCycle();
  }

  stop() {
    this.isActive = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    const bubble = document.getElementById('breathBubble');
    const button = document.getElementById('breathButton');
    
    if (bubble) {
      bubble.style.transform = 'scale(1)';
      bubble.style.background = 'linear-gradient(135deg, var(--neural), var(--trauma))';
    }
    
    if (button) button.textContent = 'Start Breathing';
    
    // Reset display
    const breathText = document.getElementById('breathText');
    const breathCount = document.getElementById('breathCount');
    if (breathText) breathText.textContent = 'Ready';
    if (breathCount) breathCount.textContent = '4';
  }

  startCycle() {
    const pattern = this.patterns[this.currentPattern];
    const phaseTime = pattern.total / pattern.counts.reduce((a, b) => a + b);
    
    this.interval = setInterval(() => {
      if (!this.isActive) return;
      
      this.updateBreathingDisplay();
      this.phase = (this.phase + 1) % pattern.phases.length;
    }, phaseTime * 1000);
    
    // Also update the breathing animation
    this.animateBreathing();
  }

  updateBreathingDisplay() {
    const pattern = this.patterns[this.currentPattern];
    const currentPhase = pattern.phases[this.phase];
    const currentCount = pattern.counts[this.phase];
    
    const breathText = document.getElementById('breathText');
    const breathCount = document.getElementById('breathCount');
    const bubble = document.getElementById('breathBubble');
    
    if (breathText) breathText.textContent = currentPhase;
    if (breathCount) breathCount.textContent = currentCount.toString();
    
    // Animate bubble based on phase
    if (bubble) {
      if (currentPhase === 'Inhale') {
        bubble.style.transform = 'scale(1.4)';
        bubble.style.background = 'linear-gradient(135deg, var(--neural), var(--calm))';
      } else if (currentPhase === 'Exhale') {
        bubble.style.transform = 'scale(0.8)';
        bubble.style.background = 'linear-gradient(135deg, var(--trauma), var(--neural))';
      } else {
        // Hold phases
        bubble.style.transform = 'scale(1.1)';
        bubble.style.background = 'linear-gradient(135deg, var(--calm), var(--neural))';
      }
    }
  }

  animateBreathing() {
    if (!this.isActive) return;
    
    const bubble = document.getElementById('breathBubble');
    if (!bubble) return;
    
    const pattern = this.patterns[this.currentPattern];
    const phaseDuration = (pattern.total / pattern.counts.reduce((a, b) => a + b)) * 1000;
    
    bubble.style.transition = `all ${phaseDuration}ms cubic-bezier(0.4, 0, 0.6, 1)`;
    
    setTimeout(() => {
      if (this.isActive) this.animateBreathing();
    }, phaseDuration);
  }
}

// Global breathing controller
window.breathingController = new BreathingController();

// Global functions for HTML
function setBreathType(type) {
  window.breathingController.setBreathType(type);
}

function toggleBreathing() {
  const controller = window.breathingController;
  if (controller.isActive) {
    controller.stop();
  } else {
    controller.start();
  }
}

// Initialize breathing preview animations
document.addEventListener('DOMContentLoaded', function() {
  // Animate breath preview in tool cards
  const breathPreviews = document.querySelectorAll('.breath-preview, .breathing-preview');
  
  breathPreviews.forEach(preview => {
    setInterval(() => {
      preview.style.transform = 'scale(1.2)';
      preview.style.opacity = '0.8';
      setTimeout(() => {
        preview.style.transform = 'scale(1)';
        preview.style.opacity = '1';
      }, 2000);
    }, 4000);
  });
});