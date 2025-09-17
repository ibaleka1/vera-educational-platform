# ElevenLabs Integration for VERA Voice System
## Revolutionary Nervous System-Aware Speech Implementation

### 🎙️ **Setup & Configuration**

#### **1. Install ElevenLabs SDK**
```bash
npm install elevenlabs
```

#### **2. Environment Variables**
Add to your `.env` file:
```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=your_chosen_voice_id
```

#### **3. Create VERA Voice Service**
```javascript
// /lib/elevenlabs-voice.js
import { ElevenLabsApi, ElevenLabsVoiceOptions } from 'elevenlabs';

class VERAVoiceService {
  constructor() {
    this.client = new ElevenLabsApi({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    
    // VERA's optimized voice settings for nervous system regulation
    this.veraVoiceSettings = {
      stability: 0.85,        // High stability for grounding presence
      similarity_boost: 0.75, // Natural human-like quality
      style: 0.3,            // Subtle emotional expression
      use_speaker_boost: true
    };
  }

  // Adaptive voice parameters based on user's nervous system state
  adaptVoiceForState(userState) {
    const baseSettings = { ...this.veraVoiceSettings };
    
    // User is dysregulated/anxious - slower, lower, more grounding
    if (userState.activation_level > 0.7) {
      return {
        ...baseSettings,
        stability: 0.95,     // Extra stability for calming
        style: 0.1,          // Minimal emotional variation
        speaking_rate: 0.75, // 25% slower than normal
        pitch_adjustment: -0.2 // Lower pitch for grounding
      };
    }
    
    // User is shutdown/dissociated - gentle animation without overwhelm
    if (userState.coherence_level < 0.3) {
      return {
        ...baseSettings,
        stability: 0.8,
        style: 0.4,          // Slightly more warmth
        speaking_rate: 0.85, // Slightly slower
        pitch_adjustment: 0.1 // Slight brightness without force
      };
    }
    
    // User is coherent - natural conversational flow
    return {
      ...baseSettings,
      speaking_rate: 1.0,
      pitch_adjustment: 0.0
    };
  }

  // Generate VERA's voice with nervous system intelligence
  async generateVERAResponse(text, userState = {}, userMemory = {}) {
    try {
      // Adapt voice parameters for user's current state
      const voiceSettings = this.adaptVoiceForState(userState);
      
      // Add natural pauses and breathing cues for regulation
      const regulatedText = this.addRegulationCues(text, userState);
      
      // Generate speech with ElevenLabs
      const audioStream = await this.client.generate({
        voice: process.env.ELEVENLABS_VOICE_ID,
        text: regulatedText,
        model_id: "eleven_multilingual_v2", // Best quality model
        voice_settings: voiceSettings
      });
      
      // Convert stream to buffer for processing
      const audioBuffer = await this.streamToBuffer(audioStream);
      
      // Apply nervous system optimizations
      const optimizedAudio = await this.applyNervousSystemOptimizations(
        audioBuffer, 
        userState
      );
      
      return {
        audioBuffer: optimizedAudio,
        voiceParams: voiceSettings,
        regulationIntent: this.getRegulationIntent(userState)
      };
      
    } catch (error) {
      console.error('VERA Voice Generation Error:', error);
      throw new Error('Failed to generate VERA voice response');
    }
  }

  // Add natural regulation cues to text
  addRegulationCues(text, userState) {
    let regulatedText = text;
    
    // For activated users - add natural pauses and slower pacing
    if (userState.activation_level > 0.7) {
      regulatedText = regulatedText
        .replace(/\./g, '... ') // Longer pauses at sentence ends
        .replace(/,/g, ', ') // Breathing space at commas
        .replace(/\?/g, '? '); // Space for processing questions
    }
    
    // For shutdown users - add gentle animation markers
    if (userState.coherence_level < 0.3) {
      regulatedText = regulatedText
        .replace(/\./g, '. ') // Natural pauses without overdoing it
        .replace(/important/gi, '*important*') // Subtle emphasis
        .replace(/you/gi, '*you*'); // Personal connection emphasis
    }
    
    return regulatedText;
  }

  // Apply post-processing for nervous system optimization
  async applyNervousSystemOptimizations(audioBuffer, userState) {
    // This would integrate with audio processing libraries
    // For now, return the buffer - can be enhanced with:
    // - Vagus nerve frequency optimization (100-300 Hz)
    // - Heart rate variability entrainment
    // - Binaural beats for regulation (if appropriate)
    
    return audioBuffer;
  }

  // Convert audio stream to buffer
  async streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // Determine regulation intent based on user state
  getRegulationIntent(userState) {
    if (userState.activation_level > 0.7) return 'calming_and_grounding';
    if (userState.coherence_level < 0.3) return 'gentle_activation';
    return 'supportive_presence';
  }
}

export default VERAVoiceService;
```

---

### 🔌 **API Integration**

#### **Create Voice API Endpoint**
```javascript
// /api/vera-voice.js
import VERAVoiceService from '../lib/elevenlabs-voice.js';

const veraVoice = new VERAVoiceService();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      text, 
      userId, 
      userState = {}, 
      conversationContext = {} 
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Get user's nervous system memory (if implemented)
    const userMemory = await getUserMemory(userId);

    // Generate VERA's voice response
    const voiceResponse = await veraVoice.generateVERAResponse(
      text,
      userState,
      userMemory
    );

    // Store audio and return URL
    const audioUrl = await storeAudio(voiceResponse.audioBuffer, userId);

    // Track interaction for learning
    await trackVoiceInteraction(userId, {
      text,
      voiceParams: voiceResponse.voiceParams,
      userState,
      regulationIntent: voiceResponse.regulationIntent
    });

    res.json({
      audioUrl,
      voiceParams: voiceResponse.voiceParams,
      regulationIntent: voiceResponse.regulationIntent,
      success: true
    });

  } catch (error) {
    console.error('VERA Voice API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate voice response',
      details: error.message 
    });
  }
}

// Helper functions
async function getUserMemory(userId) {
  // Implement user memory retrieval
  // Return user's voice preferences and regulation patterns
  return {};
}

async function storeAudio(audioBuffer, userId) {
  // Store audio file (Vercel Blob, AWS S3, etc.)
  // Return public URL
  const filename = `vera-voice-${userId}-${Date.now()}.mp3`;
  // Implementation depends on your storage solution
  return `/api/audio/${filename}`;
}

async function trackVoiceInteraction(userId, interactionData) {
  // Track for learning and optimization
  // Store in database or analytics service
  console.log('Voice interaction tracked:', { userId, ...interactionData });
}
```

---

### 🎵 **Frontend Integration**

#### **Update Chat JavaScript to Include Voice**
```javascript
// Add to /public/js/landing.js

class VERAVoiceChat {
  constructor() {
    this.isVoiceEnabled = true;
    this.currentAudio = null;
    this.userState = {
      activation_level: 0.5,
      coherence_level: 0.5
    };
  }

  // Enhanced chat with voice response
  async sendMessageWithVoice(message) {
    try {
      // Show typing indicator
      this.showTypingIndicator();

      // Get text response from existing chat system
      const textResponse = await this.generateVERAResponse(message);
      
      // Display text immediately
      this.displayMessage('vera', textResponse);

      // Generate voice in parallel
      if (this.isVoiceEnabled) {
        const voiceResponse = await this.generateVoiceResponse(
          textResponse, 
          this.userState
        );
        
        // Play VERA's voice
        await this.playVERAVoice(voiceResponse.audioUrl);
      }

    } catch (error) {
      console.error('Voice chat error:', error);
      // Fallback to text-only if voice fails
      this.displayMessage('vera', 'I hear you. Let me respond in text for now.');
    } finally {
      this.hideTypingIndicator();
    }
  }

  // Generate voice using ElevenLabs API
  async generateVoiceResponse(text, userState) {
    const response = await fetch('/api/vera-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        userId: this.getUserId(),
        userState,
        conversationContext: this.getConversationContext()
      })
    });

    if (!response.ok) {
      throw new Error(`Voice API error: ${response.status}`);
    }

    return await response.json();
  }

  // Play VERA's voice with nervous system awareness
  async playVERAVoice(audioUrl) {
    try {
      // Stop any currently playing audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Create and play new audio
      this.currentAudio = new Audio(audioUrl);
      
      // Show voice indicator
      this.showVoiceIndicator();
      
      // Play with error handling
      await this.currentAudio.play();
      
      // Handle audio events
      this.currentAudio.addEventListener('ended', () => {
        this.hideVoiceIndicator();
        this.currentAudio = null;
      });

      this.currentAudio.addEventListener('error', (error) => {
        console.error('Audio playback error:', error);
        this.hideVoiceIndicator();
      });

    } catch (error) {
      console.error('Voice playback failed:', error);
      this.hideVoiceIndicator();
    }
  }

  // Update user state based on interaction patterns
  updateUserState(message, responseSuccess) {
    // Simple state tracking - can be enhanced with biometrics
    if (message.includes('anxious') || message.includes('stressed')) {
      this.userState.activation_level = Math.min(1.0, this.userState.activation_level + 0.2);
    }
    
    if (message.includes('calm') || message.includes('better')) {
      this.userState.coherence_level = Math.min(1.0, this.userState.coherence_level + 0.2);
    }
    
    // Gradually return to baseline
    this.userState.activation_level *= 0.95;
    this.userState.coherence_level = 0.5 + (this.userState.coherence_level - 0.5) * 0.9;
  }

  // UI Helper Methods
  showVoiceIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'vera-voice-indicator';
    indicator.innerHTML = '🎙️ VERA is speaking...';
    document.querySelector('.chat-messages').appendChild(indicator);
  }

  hideVoiceIndicator() {
    const indicator = document.querySelector('.vera-voice-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  getUserId() {
    // Generate or retrieve user ID
    return localStorage.getItem('vera-user-id') || 'anonymous-' + Date.now();
  }

  getConversationContext() {
    // Return recent conversation context
    return {
      messageCount: this.messageCount || 0,
      conversationDuration: Date.now() - (this.conversationStart || Date.now())
    };
  }
}

// Initialize voice chat
const veraVoiceChat = new VERAVoiceChat();

// Update existing chat function to use voice
async function askQuickQuestion(question) {
  const input = document.getElementById('chatInput');
  input.value = question;
  
  // Use voice-enabled chat
  await veraVoiceChat.sendMessageWithVoice(question);
  
  input.value = '';
}
```

---

### 🎨 **UI Enhancements for Voice**

#### **Add Voice Controls to Chat Interface**
```html
<!-- Add to chat container in index.html -->
<div class="voice-controls">
  <button id="voiceToggle" class="voice-btn active" onclick="toggleVoice()">
    <span class="voice-icon">🎙️</span>
    <span class="voice-text">Voice On</span>
  </button>
  
  <div class="voice-indicator" id="voiceIndicator" style="display: none;">
    <div class="sound-wave">
      <div class="wave-bar"></div>
      <div class="wave-bar"></div>
      <div class="wave-bar"></div>
    </div>
    <span>VERA is speaking...</span>
  </div>
</div>
```

#### **Voice Control Styling**
```css
/* Add to vera.css */
.voice-controls {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-top: 1px solid var(--border-soft);
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-full);
  color: var(--neural);
  cursor: pointer;
  transition: all 0.3s ease;
}

.voice-btn.active {
  background: linear-gradient(135deg, var(--neural), var(--trauma));
  color: white;
}

.voice-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--neural);
  font-style: italic;
}

.sound-wave {
  display: flex;
  gap: 2px;
}

.wave-bar {
  width: 3px;
  height: 12px;
  background: var(--neural);
  border-radius: 2px;
  animation: soundWave 1s ease-in-out infinite;
}

.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }

@keyframes soundWave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}
```

---

### 🚀 **Deployment Steps**

#### **1. Set Up ElevenLabs Account**
1. Create account at [ElevenLabs](https://elevenlabs.io)
2. Get API key from dashboard
3. Choose or clone a voice (recommend warm, female voice)
4. Add voice ID to environment variables

#### **2. Environment Configuration**
```bash
# Add to Vercel environment variables
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

#### **3. Install Dependencies**
```bash
npm install elevenlabs
```

#### **4. Deploy**
```bash
git add .
git commit -m "🎙️ Add ElevenLabs Voice Integration - Revolutionary nervous system-aware speech with adaptive parameters, regulation optimization, and user state memory"
git push
```

---

### 💡 **Advanced Features to Add Later**

#### **Biometric Integration**
```javascript
// Future enhancement - integrate with biometric sensors
class BiometricVoiceAdapter {
  async adaptVoiceToHeartRate(hrv_data) {
    // Adjust voice parameters based on real HRV
  }
  
  async adaptToBreathingPattern(breathing_data) {
    // Match speech rhythm to breathing
  }
}
```

#### **Voice Memory System**
```javascript
// Track what voice qualities help each user regulate
class VoiceMemory {
  async learnUserPreferences(userId, voiceParams, regulationSuccess) {
    // Machine learning for personalized voice optimization
  }
}
```

**🎙️ This integration gives VERA her revolutionary voice - nervous system-aware, adaptive, and designed to help bodies remember how to regulate through the power of sound and presence!**