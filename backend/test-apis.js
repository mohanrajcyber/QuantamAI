import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing All API Keys...\n');

// Test OpenAI
async function testOpenAI() {
  console.log('1️⃣ Testing OpenAI API...');
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OpenAI works!"' }],
        max_tokens: 20
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    console.log('✅ OpenAI: WORKING');
    console.log('   Response:', response.data.choices[0].message.content);
    console.log('   Model:', response.data.model);
    return true;
  } catch (error) {
    console.log('❌ OpenAI: FAILED');
    console.log('   Error:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Test Gemini
async function testGemini() {
  console.log('\n2️⃣ Testing Gemini API...');
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: 'Say "Gemini works!"' }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    console.log('✅ Gemini: WORKING');
    console.log('   Response:', response.data.candidates[0].content.parts[0].text);
    return true;
  } catch (error) {
    console.log('❌ Gemini: FAILED');
    console.log('   Error:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Test Groq
async function testGroq() {
  console.log('\n3️⃣ Testing Groq API...');
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: 'Say "Groq works!"' }],
        max_tokens: 20
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    console.log('✅ Groq: WORKING');
    console.log('   Response:', response.data.choices[0].message.content);
    console.log('   Model:', response.data.model);
    return true;
  } catch (error) {
    console.log('❌ Groq: FAILED');
    console.log('   Error:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Test Hugging Face
async function testHuggingFace() {
  console.log('\n4️⃣ Testing Hugging Face API...');
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      { inputs: 'Hello!' },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    console.log('✅ Hugging Face: WORKING');
    console.log('   Response:', response.data[0]?.generated_text || 'Model loaded');
    return true;
  } catch (error) {
    console.log('❌ Hugging Face: FAILED');
    console.log('   Error:', error.response?.data?.error || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔑 API Key Configuration Check');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('📋 Checking environment variables...');
  console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('   GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('   HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🧪 Testing API Connections...');
  console.log('═══════════════════════════════════════════════════════\n');

  const results = {
    openai: await testOpenAI(),
    gemini: await testGemini(),
    groq: await testGroq(),
    huggingface: await testHuggingFace()
  };

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 Test Results Summary');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const working = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Working APIs: ${working}/${total}`);
  console.log(`❌ Failed APIs: ${total - working}/${total}\n`);
  
  Object.entries(results).forEach(([provider, status]) => {
    console.log(`   ${status ? '✅' : '❌'} ${provider.toUpperCase()}: ${status ? 'WORKING' : 'FAILED'}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════');
  
  if (working === total) {
    console.log('🎉 All API keys are working perfectly!');
  } else if (working > 0) {
    console.log('⚠️  Some API keys are working, but not all.');
  } else {
    console.log('❌ No API keys are working. Please check your configuration.');
  }
  
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run the tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
