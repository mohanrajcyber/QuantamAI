/**
 * Quantum AI Integration for TalkingHead Avatar
 * Connects the avatar to Quantum AI backend instead of Google TTS
 */

// Backend API URL
const QUANTUM_AI_BACKEND = 'http://localhost:3001/api';

// Conversation history
let conversationHistory = [];

/**
 * Send message to Quantum AI and get response
 */
async function sendToQuantumAI(message) {
  try {
    const response = await fetch(`${QUANTUM_AI_BACKEND}/tts/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        conversationHistory: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.response }
    );

    // Keep only last 10 messages
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return data.response;
  } catch (error) {
    console.error('Quantum AI Error:', error);
    return "I'm having trouble connecting to my AI brain. Please check if the Quantum AI backend is running on port 3001.";
  }
}

/**
 * Override the default TTS function to use browser speech synthesis
 */
function speakWithBrowserTTS(text, avatar) {
  return new Promise((resolve, reject) => {
    try {
      // Check if browser supports speech synthesis
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser does not support speech synthesis'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Sync avatar lip movements with speech
      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        reject(event.error);
      };

      // Speak
      speechSynthesis.speak(utterance);

      // Simple lip-sync simulation
      if (avatar && avatar.speakText) {
        avatar.speakText(text);
      }

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Initialize Quantum AI integration
 */
function initQuantumAIIntegration(avatar) {
  console.log('🤖 Quantum AI Integration initialized');
  console.log('📡 Backend URL:', QUANTUM_AI_BACKEND);
  
  // Test backend connection
  fetch(`${QUANTUM_AI_BACKEND}/health`)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Backend connected:', data);
    })
    .catch(error => {
      console.error('❌ Backend connection failed:', error);
      console.log('⚠️ Make sure Quantum AI backend is running on port 3001');
    });

  return {
    sendMessage: sendToQuantumAI,
    speak: (text) => speakWithBrowserTTS(text, avatar),
    clearHistory: () => { conversationHistory = []; }
  };
}

// Export for use in index.html
window.QuantumAI = {
  init: initQuantumAIIntegration,
  sendMessage: sendToQuantumAI,
  speak: speakWithBrowserTTS
};

console.log('🚀 Quantum AI Integration loaded');
