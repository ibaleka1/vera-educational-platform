// VERA Voice API Endpoint
import VERAVoiceService from '../lib/vera-voice-service.js';

const veraVoice = new VERAVoiceService();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, userState } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check for API key
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    // Generate VERA's voice
    const audioBuffer = await veraVoice.generateVoice(text, userState || {});
    
    // Convert to base64 for easy transmission
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    // Return audio data
    res.json({
      success: true,
      audio: audioBase64,
      mimeType: 'audio/mpeg',
      regulation_intent: veraVoice.getRegulationIntent(userState || {})
    });

  } catch (error) {
    console.error('VERA Voice API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate voice',
      message: error.message 
    });
  }
}

// Helper to determine regulation intent
VERAVoiceService.prototype.getRegulationIntent = function(userState) {
  if (userState.activation_level > 0.7) return 'calming';
  if (userState.coherence_level < 0.3) return 'gentle_activation';
  return 'supportive';
};