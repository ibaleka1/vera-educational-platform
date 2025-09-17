// VERA Voice Service with ElevenLabs Integration
// Simple implementation to get started quickly

class VERAVoiceService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    
    // VERA Voice IDs - Different personalities for different nervous system states
    this.voices = {
      primary: 'uYXf8XasLslADfZ2MB4u',    // Main therapeutic voice - calm, grounding
      gentle: 'OYTbf65OHHFELVut7v2H',     // Softer voice for activated/trauma states  
      energetic: 'WAhoMTNdLdMoq1j3wf3I'   // Dynamic voice for motivation/engagement
    };
    
    // Default to primary therapeutic voice
    this.voiceId = this.voices.primary;
  }

  // Simple voice generation for VERA responses
  async generateVoice(text, userState = {}) {
    try {
      // Adapt voice settings based on user's state
      const voiceSettings = this.getVoiceSettings(userState);
      
      // Add natural pauses for nervous system regulation
      const regulatedText = this.addRegulationPauses(text, userState);
      
      // Select appropriate voice based on user state
      const selectedVoiceId = this.selectVoice(userState);
      
      // Call ElevenLabs API
      const response = await fetch(`${this.baseUrl}/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: regulatedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Return audio buffer
      const audioBuffer = await response.arrayBuffer();
      return audioBuffer;

    } catch (error) {
      console.error('VERA Voice Generation Error:', error);
      throw error;
    }
  }

  // Select appropriate voice based on nervous system state
  selectVoice(userState) {
    if (!userState) return this.voices.primary;
    
    // High activation/stress - use gentle voice
    if (userState.activation_level > 0.7) {
      return this.voices.gentle;
    }
    
    // Shutdown/freeze state - use gentle voice
    if (userState.coherence_level < 0.3) {
      return this.voices.gentle;
    }
    
    // Low energy/motivation needed - use energetic voice
    if (userState.energy_level < 0.4) {
      return this.voices.energetic;
    }
    
    // Default to primary therapeutic voice
    return this.voices.primary;
  }

  // Adaptive voice settings for nervous system states
  getVoiceSettings(userState) {
    const baseSettings = {
      stability: 0.85,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true
    };

    // User is anxious/activated - more grounding
    if (userState.activation_level > 0.7) {
      return {
        ...baseSettings,
        stability: 0.95,     // Extra stable for calming
        style: 0.1           // Less emotional variation
      };
    }

    // User is shutdown/low energy - gentle warmth
    if (userState.coherence_level < 0.3) {
      return {
        ...baseSettings,
        stability: 0.8,
        style: 0.4           // More warmth
      };
    }

    // Default regulated state
    return baseSettings;
  }

  // Add natural pauses for nervous system regulation
  addRegulationPauses(text, userState) {
    let regulatedText = text;

    // For activated users - add calming pauses
    if (userState.activation_level > 0.7) {
      regulatedText = regulatedText
        .replace(/\./g, '... ')     // Longer pauses
        .replace(/,/g, ', ')        // Breathing space
        .replace(/important/gi, 'really... important');
    }

    // For shutdown users - gentle pacing
    if (userState.coherence_level < 0.3) {
      regulatedText = regulatedText
        .replace(/you/gi, 'you... ')  // Personal connection pauses
        .replace(/\./g, '. ');        // Natural breathing
    }

    return regulatedText;
  }
}

export default VERAVoiceService;