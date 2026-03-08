import express from 'express';
const router = express.Router();

/**
 * Text-to-Speech endpoint for TalkingHead Avatar
 * Converts text to speech using available TTS services
 */
router.post('/speak', async (req, res) => {
  try {
    const { text, voice = 'en-US', provider = 'browser' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // For now, return a simple response that tells the avatar to use browser TTS
    // This is a fallback that works without API keys
    res.json({
      success: true,
      text: text,
      voice: voice,
      provider: 'browser',
      audioUrl: null, // Browser will synthesize speech client-side
      message: 'Using browser text-to-speech'
    });

  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ 
      error: 'Text-to-speech failed',
      details: error.message 
    });
  }
});

/**
 * Chat endpoint for Avatar - integrates with existing AI providers
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use the existing chat endpoint
    const chatResponse = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        conversationHistory: conversationHistory,
        provider: 'auto' // Use automatic provider selection
      })
    });

    const data = await chatResponse.json();

    res.json({
      success: true,
      response: data.response || data.message,
      provider: data.provider,
      model: data.model
    });

  } catch (error) {
    console.error('Avatar Chat Error:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      details: error.message 
    });
  }
});

export default router;
