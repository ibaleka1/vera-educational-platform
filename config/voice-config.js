// VERA Voice Configuration - ElevenLabs Integration
// Updated: September 16, 2025

const VERA_VOICE_CONFIG = {
  // ElevenLabs API Configuration
  api: {
    baseUrl: 'https://api.elevenlabs.io/v1',
    // Add your API key to environment variables or here (not recommended for production)
    apiKey: process.env.ELEVENLABS_API_KEY || 'your-api-key-here'
  },

  // Available VERA Voices - Different personalities for different nervous system states
  voices: {
    // Primary VERA voice - Calm, grounding presence
    primary: {
      id: 'uYXf8XasLslADfZ2MB4u',
      name: 'VERA Primary',
      description: 'Main therapeutic voice - calm, grounding, nervous system aware',
      preferredFor: ['regulation', 'guidance', 'general_interaction']
    },

    // Gentle VERA voice - For sensitive/activated states
    gentle: {
      id: 'OYTbf65OHHFELVut7v2H', 
      name: 'VERA Gentle',
      description: 'Softer voice for activated nervous systems and trauma responses',
      preferredFor: ['trauma_response', 'high_activation', 'panic_support']
    },

    // Energetic VERA voice - For motivation and engagement
    energetic: {
      id: 'WAhoMTNdLdMoq1j3wf3I',
      name: 'VERA Energetic', 
      description: 'More dynamic voice for motivation and active engagement',
      preferredFor: ['motivation', 'learning', 'problem_solving', 'low_energy']
    }
  },

  // Voice Parameters by Nervous System State
  adaptiveSettings: {
    // Parasympathetic (Rest & Digest) - User is calm
    parasympathetic: {
      voiceId: 'uYXf8XasLslADfZ2MB4u', // Primary voice
      stability: 0.8,
      similarityBoost: 0.7,
      style: 0.3,
      speakingRate: 0.9,
      pauseDuration: 1.2
    },

    // Sympathetic Activation - User is stressed/activated
    sympathetic: {
      voiceId: 'OYTbf65OHHFELVut7v2H', // Gentle voice
      stability: 0.9,
      similarityBoost: 0.8,
      style: 0.2,
      speakingRate: 0.7, // Slower for regulation
      pauseDuration: 2.0 // Longer pauses for breathing
    },

    // Dorsal Vagal (Shutdown/Freeze) - User is disconnected
    dorsalVagal: {
      voiceId: 'OYTbf65OHHFELVut7v2H', // Gentle voice
      stability: 0.95,
      similarityBoost: 0.9,
      style: 0.1, // Very gentle
      speakingRate: 0.6, // Very slow
      pauseDuration: 3.0 // Extended pauses
    },

    // Mobilization - User needs energy/motivation
    mobilization: {
      voiceId: 'WAhoMTNdLdMoq1j3wf3I', // Energetic voice
      stability: 0.7,
      similarityBoost: 0.6,
      style: 0.5,
      speakingRate: 1.1, // Slightly faster
      pauseDuration: 0.8 // Shorter pauses
    }
  },

  // Response timing for different states
  responsePatterns: {
    parasympathetic: {
      pauseBeforeResponse: 500,
      breathingPauses: [1000, 2000], // Natural breath pauses
      endPause: 1500
    },
    sympathetic: {
      pauseBeforeResponse: 1000,
      breathingPauses: [2000, 3000, 4000], // Regulation breathing
      endPause: 2500
    },
    dorsalVagal: {
      pauseBeforeResponse: 2000,
      breathingPauses: [3000, 4000, 5000], // Gentle re-engagement
      endPause: 4000
    },
    mobilization: {
      pauseBeforeResponse: 300,
      breathingPauses: [800, 1200], // Energizing rhythm
      endPause: 1000
    }
  }
};

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERA_VOICE_CONFIG;
} else if (typeof window !== 'undefined') {
  window.VERA_VOICE_CONFIG = VERA_VOICE_CONFIG;
}