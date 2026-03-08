// Vercel Serverless Function for AI Chat
// This acts as a proxy to avoid CORS issues

const API_KEYS = {
  OPENAI: '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',
  GEMINI: 'AIzaSyCCIvBlunSN8glSkD97yCR3AIoPw3r9-7o',
  GROQ: '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',
  HUGGINGFACE: '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'
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, provider = 'groq', model } = req.body;

  try {
    let response;

    // Try Groq first (fastest)
    if (provider === 'groq' || provider === 'auto') {
      try {
        response = await callGroq(messages, model);
        return res.status(200).json({ response, provider: 'groq' });
      } catch (error) {
        console.log('Groq failed, trying OpenAI...');
      }
    }

    // Try OpenAI
    if (provider === 'openai' || provider === 'auto') {
      try {
        response = await callOpenAI(messages, model);
        return res.status(200).json({ response, provider: 'openai' });
      } catch (error) {
        console.log('OpenAI failed, trying Gemini...');
      }
    }

    // Try Gemini
    if (provider === 'gemini' || provider === 'auto') {
      try {
        response = await callGemini(messages);
        return res.status(200).json({ response, provider: 'gemini' });
      } catch (error) {
        console.log('Gemini failed, trying Hugging Face...');
      }
    }

    // Try Hugging Face
    try {
      response = await callHuggingFace(messages);
      return res.status(200).json({ response, provider: 'huggingface' });
    } catch (error) {
      console.log('All providers failed, using mock...');
    }

    // Final fallback - Mock AI
    response = getMockResponse(messages);
    return res.status(200).json({ response, provider: 'mock' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message 
    });
  }
}

async function callGroq(messages, model = 'mixtral-8x7b-32768') {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.GROQ}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) throw new Error('Groq API failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenAI(messages, model = 'gpt-3.5-turbo') {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.OPENAI}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) throw new Error('OpenAI API failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(messages) {
  const prompt = messages
    .filter(m => m.role !== 'system')
    .map(m => m.content)
    .join('\n\n');

  const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEYS.GEMINI}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
    })
  });

  if (!response.ok) throw new Error('Gemini API failed');
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callHuggingFace(messages) {
  const prompt = messages.map(m => {
    if (m.role === 'system') return m.content;
    if (m.role === 'user') return `User: ${m.content}`;
    return `Assistant: ${m.content}`;
  }).join('\n\n');

  const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.HUGGINGFACE}`
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_length: 500, temperature: 0.7 }
    })
  });

  if (!response.ok) throw new Error('Hugging Face API failed');
  const data = await response.json();
  const aiResponse = data[0]?.generated_text || data.generated_text || '';
  return aiResponse.replace(prompt, '').trim() || aiResponse;
}

function getMockResponse(messages) {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  if (lastMessage.includes('who created') || lastMessage.includes('who made')) {
    return "I was created and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the architect of the Quantum AI platform.";
  }
  
  if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
    return "Hello! I'm Quantum AI, created by Mohanraj. How can I help you today?";
  }
  
  const responses = [
    "I'm Quantum AI, created by Mohanraj! I'm here to help you.",
    "That's interesting! As Quantum AI, I can assist you with various tasks.",
    "I understand. Let me help you with that.",
    "Great question! I'm designed to provide helpful responses.",
    "I'm here to assist you. Feel free to ask me anything!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
