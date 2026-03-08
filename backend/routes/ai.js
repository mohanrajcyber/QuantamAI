import express from 'express';
import axios from 'axios';

const router = express.Router();

// OpenAI Chat Completion
router.post('/openai/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages,
      temperature,
      max_tokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'OpenAI API request failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Gemini Chat
router.post('/gemini/chat', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Gemini API request failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Groq Chat
router.post('/groq/chat', async (req, res) => {
  try {
    const { messages, model = 'llama-3.1-70b-versatile', temperature = 0.7, max_tokens = 1000 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model,
      messages,
      temperature,
      max_tokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Groq API request failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Hugging Face Inference
router.post('/huggingface/inference', async (req, res) => {
  try {
    const { inputs, model = 'microsoft/DialoGPT-medium' } = req.body;

    if (!inputs) {
      return res.status(400).json({ error: 'Inputs are required' });
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Hugging Face API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Hugging Face API request failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// List available models for each provider
router.get('/models', (req, res) => {
  res.json({
    openai: [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-3.5-turbo',
      'gpt-4-turbo'
    ],
    gemini: [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ],
    groq: [
      'llama3-8b-8192',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'gemma-7b-it'
    ],
    huggingface: [
      'microsoft/DialoGPT-medium',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-large'
    ]
  });
});

export default router;