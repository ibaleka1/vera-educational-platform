// Frequency and music therapy controller
class FrequencyController {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentCategory = 'binaural';
    
    // Frequency data
    this.frequencies = {
      binaural: [
        {
          id: '40hz',
          name: '40Hz Focus',
          description: 'Gamma waves for concentration and cognitive clarity',
          frequency: 40,
          baseFreq: 200,
          color: '#8b5cf6'
        },
        {
          id: '10hz',
          name: '10Hz Alpha',
          description: 'Relaxed awareness and creative flow',
          frequency: 10,
          baseFreq: 200,
          color: '#06b6d4'
        },
        {
          id: '6hz',
          name: '6Hz Theta',
          description: 'Deep relaxation and meditation',
          frequency: 6,
          baseFreq: 200,
          color: '#ec4899'
        },
        {
          id: '4hz',
          name: '4Hz Delta',
          description: 'Restorative sleep and healing',
          frequency: 4,
          baseFreq: 200,
          color: '#10b981'
        }
      ],
      
      solfeggio: [
        {
          id: '396hz',
          name: '396Hz - Liberation',
          description: 'Liberating guilt and fear',
          frequency: 396,
          color: '#ef4444'
        },
        {
          id: '528hz',
          name: '528Hz - Transformation', 
          description: 'DNA repair and transformation',
          frequency: 528,
          color: '#22c55e'
        },
        {
          id: '741hz',
          name: '741Hz - Expression',
          description: 'Awakening intuition and expression',
          frequency: 741,
          color: '#3b82f6'
        },
        {
          id: '963hz',
          name: '963Hz - Connection',
          description: 'Crown chakra and higher consciousness',
          frequency: 963,
          color: '#8b5cf6'
        }
      ],
      
      nature: [
        {
          id: 'rain',
          name: 'Gentle Rain',
          description: 'Steady rainfall for nervous system regulation',
          type: 'nature',
          color: '#06b6d4'
        },
        {
          id: 'ocean',
          name: 'Ocean Waves',
          description: 'Rhythmic waves for grounding',
          type: 'nature',
          color: '#0ea5e9'
        },
        {
          id: 'forest',
          name: 'Forest Ambience',
          description: 'Birds and wind through trees',
          type: 'nature',
          color: '#22c55e'
        },
        {
          id: 'fireplace',
          name: 'Crackling Fire',
          description: 'Warm fireplace for comfort',
          type: 'nature',
          color: '#f97316'
        }
      ]
    };
  }

  showFrequencyCategory(category) {
    this.currentCategory = category;
    this.updateCategoryButtons(category);
    this.renderFrequencyList(category);
  }

  updateCategoryButtons(activeCategory) {
    document.querySelectorAll('.freq-category').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.toLowerCase().includes(activeCategory.toLowerCase()) ||
          (activeCategory === 'binaural' && btn.textContent.includes('Binaural')) ||
          (activeCategory === 'solfeggio' && btn.textContent.includes('Solfeggio')) ||
          (activeCategory === 'nature' && btn.textContent.includes('Nature'))) {
        btn.classList.add('active');
      }
    });
  }

  renderFrequencyList(category) {
    const container = document.getElementById('frequencyList');
    if (!container) return;

    const frequencies = this.frequencies[category] || [];
    
    container.innerHTML = frequencies.map(freq => `
      <div class="frequency-item" data-freq-id="${freq.id}">
        <div class="freq-info">
          <div class="freq-header">
            <h4>${freq.name}</h4>
            <div class="freq-indicator" style="background: ${freq.color}"></div>
          </div>
          <p>${freq.description}</p>
          ${freq.frequency ? `<small>${freq.frequency}Hz${freq.baseFreq ? ` binaural beat (${freq.baseFreq}Hz base)` : ''}</small>` : ''}
        </div>
        <button class="play-btn" onclick="playFrequency('${freq.id}')" data-freq="${freq.id}">
          Play
        </button>
      </div>
    `).join('');
  }

  async playFrequency(freqId) {
    // Stop current audio
    this.stop();

    const freq = this.findFrequency(freqId);
    if (!freq) return;

    try {
      if (freq.type === 'nature') {
        await this.playNatureSound(freq);
      } else {
        await this.generateTone(freq);
      }
      
      this.isPlaying = true;
      this.updatePlayButton(freqId, true);
    } catch (error) {
      console.error('Error playing frequency:', error);
      this.showFeedback('Unable to play frequency. Check your browser audio settings.', 'error');
    }
  }

  async generateTone(freq) {
    // Create Web Audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (freq.baseFreq) {
      // Binaural beat
      const leftOsc = audioContext.createOscillator();
      const rightOsc = audioContext.createOscillator();
      const leftGain = audioContext.createGain();
      const rightGain = audioContext.createGain();
      const merger = audioContext.createChannelMerger(2);
      
      leftOsc.frequency.value = freq.baseFreq;
      rightOsc.frequency.value = freq.baseFreq + freq.frequency;
      
      leftGain.gain.value = 0.1;
      rightGain.gain.value = 0.1;
      
      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(audioContext.destination);
      
      leftOsc.start();
      rightOsc.start();
      
      this.currentAudio = { leftOsc, rightOsc, audioContext };
    } else {
      // Single tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.value = freq.frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      this.currentAudio = { oscillator, audioContext };
    }
  }

  async playNatureSound(freq) {
    // For now, create a simple synthetic nature sound
    // In production, you'd load actual nature sound files
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (freq.id === 'rain') {
      // Generate rain-like white noise
      const bufferSize = audioContext.sampleRate * 2;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.05;
      
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      whiteNoise.start();
      
      this.currentAudio = { whiteNoise, audioContext };
    } else {
      // For other nature sounds, create simple tones for now
      await this.generateTone({ frequency: 200 + Math.random() * 100 });
    }
  }

  stop() {
    if (this.currentAudio) {
      try {
        if (this.currentAudio.oscillator) {
          this.currentAudio.oscillator.stop();
        }
        if (this.currentAudio.leftOsc) {
          this.currentAudio.leftOsc.stop();
          this.currentAudio.rightOsc.stop();
        }
        if (this.currentAudio.whiteNoise) {
          this.currentAudio.whiteNoise.stop();
        }
        if (this.currentAudio.audioContext) {
          this.currentAudio.audioContext.close();
        }
      } catch (error) {
        // Ignore errors when stopping
      }
      
      this.currentAudio = null;
    }
    
    this.isPlaying = false;
    this.updateAllPlayButtons(false);
  }

  findFrequency(freqId) {
    for (const category of Object.values(this.frequencies)) {
      const found = category.find(f => f.id === freqId);
      if (found) return found;
    }
    return null;
  }

  updatePlayButton(freqId, playing) {
    const button = document.querySelector(`[data-freq="${freqId}"]`);
    if (button) {
      button.textContent = playing ? 'Stop' : 'Play';
      button.classList.toggle('playing', playing);
    }
  }

  updateAllPlayButtons(playing) {
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.textContent = 'Play';
      btn.classList.remove('playing');
    });
  }

  showFeedback(message, type = 'info') {
    // Create or update feedback element
    let feedback = document.getElementById('frequencyFeedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'frequencyFeedback';
      feedback.className = 'frequency-feedback';
      
      const container = document.querySelector('.frequencies-container');
      if (container) {
        container.appendChild(feedback);
      }
    }

    feedback.className = `frequency-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 3000);
  }
}

// Global frequency controller
window.frequencyController = new FrequencyController();

// Global functions for HTML
function showFrequencyCategory(category) {
  window.frequencyController.showFrequencyCategory(category);
}

function playFrequency(freqId) {
  const controller = window.frequencyController;
  if (controller.isPlaying) {
    controller.stop();
  } else {
    controller.playFrequency(freqId);
  }
}

// Initialize frequencies on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('frequencyList')) {
    window.frequencyController.showFrequencyCategory('binaural');
  }
  
  // Stop audio when leaving page
  window.addEventListener('beforeunload', function() {
    window.frequencyController.stop();
  });
});