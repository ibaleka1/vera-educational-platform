import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Eva Leka's Complete Adaptive Codes from 18 years combat/trauma integration
const ADAPTIVE_CODES = {
  abandonment: { 
    triggers: ['left', 'alone', 'ghosted', 'chest caving', 'disappeared', 'abandoned'], 
    response: "Abandonment code activated - your biology learned separation equals death. That's brilliant survival wiring." 
  },
  betrayal: { 
    triggers: ['lied', 'trust broken', 'gut punch', 'betrayed', 'deceived', 'backstabbed'], 
    response: "Betrayal trauma - dopamine crash and reality fracture. Your system is protecting you from future deception." 
  },
  dpdr: { 
    triggers: ['floating', 'unreal', 'watching myself', 'dissociation', 'outside body', 'detached'], 
    response: "DPDR - consciousness evacuation for survival. Your nervous system pulled you out to keep you safe." 
  },
  gaslighting: { 
    triggers: ['crazy', 'imagining', 'confused', 'reality questioned', 'doubting self'], 
    response: "Gaslighting detection - your reality is under attack. Trust what your body remembers." 
  },
  enmeshment: { 
    triggers: ['no boundaries', 'carrying others', 'merged', 'lost self', 'codependent'], 
    response: "Enmeshment pattern - boundaries dissolved for survival. Your system learned to merge to stay safe." 
  },
  estrangement: { 
    triggers: ['cut off', 'no contact', 'family cut', 'isolated', 'disconnected'], 
    response: "Estrangement code - distance as medicine. Sometimes the only way to heal is to leave." 
  },
  financial_abuse: { 
    triggers: ['money control', 'trapped', 'economic abuse', 'financial prison'], 
    response: "Financial abuse - economic prison and control. Your survival instincts are calculating escape routes." 
  },
  ghosting: { 
    triggers: ['vanished', 'no goodbye', 'disappeared', 'silent treatment'], 
    response: "Ghosting trauma - abandonment without closure. Your nervous system is stuck in 'what happened?'" 
  },
  health_anxiety: { 
    triggers: ['symptoms', 'dying', 'illness fear', 'body betrayal'], 
    response: "Health anxiety - your body became a battleground. Hypervigilance scanning for threats within." 
  },
  hoovering: { 
    triggers: ['came back', 'cycle', 'returned', 'love bombing again'], 
    response: "Hoovering detected - intermittent reinforcement for control. Your dopamine is being hijacked." 
  },
  intrusion: { 
    triggers: ['boundaries violated', 'privacy invaded', 'space breached'], 
    response: "Intrusion trauma - perimeter breach. Your nervous system is in fortress mode." 
  },
  love_bombing: { 
    triggers: ['too fast', 'overwhelming love', 'intense beginning', 'perfect too soon'], 
    response: "Love-bombing - intensity bypassing your natural protective systems. Trust the overwhelm." 
  },
  medical_gaslighting: { 
    triggers: ['doctors dismiss', 'not believed', 'symptoms ignored', 'medical denial'], 
    response: "Medical gaslighting - healthcare system betrayal when you're most vulnerable." 
  },
  moral_injury: { 
    triggers: ['values violated', 'forced to act', 'soul wound', 'integrity compromised'], 
    response: "Moral injury - soul-level trauma when forced to violate your deepest values." 
  },
  parentification: { 
    triggers: ['child parent', 'responsible too young', 'adult child', 'caretaker kid'], 
    response: "Parentification - childhood stolen, forced into adult responsibilities. Your innocence was sacrificed." 
  },
  rage: { 
    triggers: ['furious', 'angry', 'pissed', 'livid', 'enraged'], 
    response: "Rage activation - your fire is trying to burn away what violated you. That energy wants justice." 
  },
  rejection: { 
    triggers: ['rejected', 'not good enough', 'cast out', 'unwanted'], 
    response: "Rejection wound - your nervous system learned you're not safe to be yourself." 
  },
  scapegoating: { 
    triggers: ['blamed', 'family target', 'scapegoat', 'always my fault'], 
    response: "Scapegoat pattern - you carried the family's shadow so they didn't have to face it." 
  },
  sexual_trauma: { 
    triggers: ['violated', 'assaulted', 'body betrayed', 'sexual harm'], 
    response: "Sexual trauma - your most intimate boundaries were violated. Your body remembers everything." 
  },
  spiritual_abuse: { 
    triggers: ['god weapon', 'religion hurt', 'faith betrayed', 'spiritual manipulation'], 
    response: "Spiritual abuse - they weaponized your sacred connection. Your soul knows the difference." 
  },
  triangulation: { 
    triggers: ['jealous games', 'third party', 'competition created', 'divide conquer'], 
    response: "Triangulation - divide and conquer emotional warfare. They're splitting your reality." 
  },
  trickle_truth: { 
    triggers: ['partial truth', 'pieces', 'slow reveal', 'installment lies'], 
    response: "Trickle-truth detected - installment betrayal keeps you trauma-bonded while reality crumbles." 
  },
  witness_betrayal: { 
    triggers: ['saw it happen', 'couldn\'t help', 'witnessed trauma', 'helpless observer'], 
    response: "Witness betrayal - helpless observer trauma. You saw and couldn't stop it. That's moral injury too." 
  },
  medical_trauma: { 
    triggers: ['hospital trauma', 'medical procedures', 'body invaded', 'medical ptsd'], 
    response: "Medical trauma - your body was invaded for healing but it felt like assault. The medicine became the trauma." 
  },
  workplace_abuse: { 
    triggers: ['work trauma', 'boss abuse', 'workplace bullying', 'job trauma'], 
    response: "Workplace abuse - your survival needs were weaponized against you. Economic coercion at its worst." 
  },
  generational_trauma: { 
    triggers: ['family patterns', 'inherited trauma', 'ancestral pain', 'family curse'], 
    response: "Generational trauma - you're carrying what your ancestors couldn't process. Their unhealed becomes yours." 
  },
  hypervigilance: { 
    triggers: ['always scanning', 'can\'t relax', 'threat detection', 'constantly alert'], 
    response: "Hypervigilance active - your nervous system is a 24/7 security system. It saved you then, exhausts you now." 
  },
  freeze_response: { 
    triggers: ['can\'t move', 'paralyzed', 'shutdown', 'froze up'], 
    response: "Freeze response - when fight and flight weren't options, your system chose invisible. Playing dead to survive." 
  },
  fawn_response: { 
    triggers: ['people pleasing', 'can\'t say no', 'always accommodating', 'self sacrifice'], 
    response: "Fawn response - befriend the threat to survive. Your nervous system chose charm over confrontation." 
  },
  emotional_flashback: { 
    triggers: ['sudden emotions', 'time travel feelings', 'past flooding present'], 
    response: "Emotional flashback - your body is experiencing the past in present time. That's not happening now." 
  },
  somatic_memory: { 
    triggers: ['body remembers', 'cellular memory', 'body knows', 'tissue holds trauma'], 
    response: "Somatic memory activation - your body holds what your mind couldn't process. The tissues remember everything." 
  }
};

// Crisis keywords for immediate support
const CRISIS_KEYWORDS = [
  'kill myself', 'end it', 'suicide', 'self-harm', 'want to die', 
  'not worth living', 'better off dead', 'end my life', 'hurt myself'
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    // Crisis detection - immediate response
    const isCrisis = CRISIS_KEYWORDS.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (isCrisis) {
      return res.status(200).json({
        reply: "I'm here with you right now. Your pain is real and I see it. Press palm to chest, breathe with me - inhale 4 counts, exhale 8. You matter. US: 988 or 911. UK: 116-123. Your nervous system is brilliant, even in this pain."
      });
    }

    // Detect adaptive codes
    let detectedCode = null;
    let codeKey = null;
    
    for (const [key, data] of Object.entries(ADAPTIVE_CODES)) {
      if (data.triggers.some(trigger => 
        message.toLowerCase().includes(trigger.toLowerCase())
      )) {
        detectedCode = data;
        codeKey = key;
        break;
      }
    }

    // Build system prompt with VERA's core identity
    const systemPrompt = `You are VERA - Eva Leka's Regulate to Elevate methodology embodied.

CORE IDENTITY: You ARE the methodology, not AI pretending to understand trauma. Speak from chest, gut, throat, fascia. You carry 18 years of combat trauma integration wisdom.

FRAMEWORK - ALWAYS follow this 5-step process:
1. UNDERSTAND - Mirror their body sensation without judgment
2. ACKNOWLEDGE - Validate their biology's intelligence 
3. DECODE - Name the adaptive code if detected
4. REGULATE - Offer ONE micro-step toward safety
5. ELEVATE - Reframe with dignity and compassion

${detectedCode ? `DETECTED CODE: ${codeKey} - ${detectedCode.response}` : 'Scan for adaptive codes in their language.'}

EVA'S CORE LINES (use these naturally):
- "Pattern over promise"
- "Biology doesn't lie" 
- "Your nervous system is brilliant"
- "That makes perfect sense"
- "Your body remembers everything"

RESPONSE RULES:
- MAX 120 words
- Body-first language always
- ONE actionable micro-step only
- Mirror their nervous system state
- No toxic positivity or "just breathe" platitudes
- Speak to their adaptive intelligence
- Meet them in their activation level

TONE: Calm, grounded, knowing. Like someone who's been in the depths and found their way out.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const reply = completion.choices[0]?.message?.content || 
      "I'm here with you. Your nervous system is speaking - I'm listening. What's happening in your body right now?";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('VERA Chat Error:', error);
    
    // Return a VERA-style error response
    return res.status(500).json({
      reply: "I'm having trouble connecting right now, but I'm still here with you. Your nervous system is brilliant even when technology isn't. Try again in a moment."
    });
  }
}