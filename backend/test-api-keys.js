/**
 * Comprehensive API Key Testing Script
 * Tests each provider individually with your API keys
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔑 Testing All API Keys for Quantum AI\n');
console.log('========================================\n');

const results = {
  passed: [],
  failed: [],
  skipped: []
};

// Test OpenAI
async function testOpenAI() {
  console.log('Testing OpenAI API...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OpenAI: No API key found\n');
    results.skipped.push('OpenAI');
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "Quantum AI works!"' }],
        max_tokens: 50
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ OpenAI: Working!');
      console.log(`   Response: ${data.choices[0].message.content}`);
      console.log(`   Model: ${data.model}\n`);
      results.passed.push('OpenAI');
    } else {
      console.log('❌ OpenAI: Failed');
      console.log(`   Error: ${data.error?.message || 'Unknown error'}\n`);
      results.failed.push({ name: 'OpenAI', error: data.error?.message });
    }
  } catch (error) {
    console.log('❌ OpenAI: Connection failed');
    console.log(`   Error: ${error.message}\n`);
    results.failed.push({ name: 'OpenAI', error: error.message });
  }
}

// Test Gemini
async function testGemini() {
  console.log('Testing Gemini API...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Gemini: No API key found\n');
    results.skipped.push('Gemini');
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say "Quantum AI works!"' }]
          }]
        })
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates) {
      console.log('✅ Gemini: Working!');
      console.log(`   Response: ${data.candidates[0].content.parts[0].text}`);
      console.log(`   Model: gemini-2.0-flash-exp\n`);
      results.passed.push('Gemini');
    } else {
      console.log('❌ Gemini: Failed');
      console.log(`   Error: ${data.error?.message || 'Unknown error'}\n`);
      results.failed.push({ name: 'Gemini', error: data.error?.message });
    }
  } catch (error) {
    console.log('❌ Gemini: Connection failed');
    console.log(`   Error: ${error.message}\n`);
    results.failed.push({ name: 'Gemini', error: error.message });
  }
}

// Test Groq
async function testGroq() {
  console.log('Testing Groq API...');
  
  if (!process.env.GROQ_API_KEY) {
    console.log('❌ Groq: No API key found\n');
    results.skipped.push('Groq');
    return;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'Say "Quantum AI works!"' }],
        max_tokens: 50
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Groq: Working!');
      console.log(`   Response: ${data.choices[0].message.content}`);
      console.log(`   Model: ${data.model}\n`);
      results.passed.push('Groq');
    } else {
      console.log('❌ Groq: Failed');
      console.log(`   Error: ${data.error?.message || 'Unknown error'}\n`);
      results.failed.push({ name: 'Groq', error: data.error?.message });
    }
  } catch (error) {
    console.log('❌ Groq: Connection failed');
    console.log(`   Error: ${error.message}\n`);
    results.failed.push({ name: 'Groq', error: error.message });
  }
}

// Test Pollinations (No API key needed)
async function testPollinations() {
  console.log('Testing Pollinations API (Free, No Key)...');

  try {
    const response = await fetch('https://text.pollinations.ai/Say%20Quantum%20AI%20works!?model=openai');

    if (response.ok) {
      const text = await response.text();
      console.log('✅ Pollinations: Working!');
      console.log(`   Response: ${text.substring(0, 100)}...`);
      console.log(`   Model: openai\n`);
      results.passed.push('Pollinations');
    } else {
      console.log('❌ Pollinations: Failed');
      console.log(`   Status: ${response.status}\n`);
      results.failed.push({ name: 'Pollinations', error: `HTTP ${response.status}` });
    }
  } catch (error) {
    console.log('❌ Pollinations: Connection failed');
    console.log(`   Error: ${error.message}\n`);
    results.failed.push({ name: 'Pollinations', error: error.message });
  }
}

// Test G4F (No API key needed)
async function testG4F() {
  console.log('Testing G4F API (Free, No Key)...');

  try {
    const response = await fetch('https://api.g4f.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "Quantum AI works!"' }]
      })
    });

    const data = await response.json();

    if (response.ok && data.choices) {
      console.log('✅ G4F: Working!');
      console.log(`   Response: ${data.choices[0].message.content}`);
      console.log(`   Model: ${data.model}\n`);
      results.passed.push('G4F');
    } else {
      console.log('❌ G4F: Failed');
      console.log(`   Error: ${data.error?.message || 'Unknown error'}\n`);
      results.failed.push({ name: 'G4F', error: data.error?.message });
    }
  } catch (error) {
    console.log('❌ G4F: Connection failed');
    console.log(`   Error: ${error.message}\n`);
    results.failed.push({ name: 'G4F', error: error.message });
  }
}

// Test Ollama (Local, No API key needed)
async function testOllama() {
  console.log('Testing Ollama API (Local, No Key)...');

  try {
    const response = await fetch('http://localhost:11434/api/version', {
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama: Working!');
      console.log(`   Version: ${data.version}`);
      
      // Try to list models
      const modelsResponse = await fetch('http://localhost:11434/api/tags');
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        console.log(`   Models available: ${modelsData.models?.length || 0}\n`);
      } else {
        console.log(`   Models: Unable to fetch\n`);
      }
      results.passed.push('Ollama');
    } else {
      console.log('⚠️  Ollama: Not running');
      console.log('   Install: https://ollama.com/download');
      console.log('   Then run: ollama pull llama3.2\n');
      results.skipped.push('Ollama (not installed)');
    }
  } catch (error) {
    console.log('⚠️  Ollama: Not running');
    console.log('   Install: https://ollama.com/download');
    console.log('   Then run: ollama pull llama3.2\n');
    results.skipped.push('Ollama (not installed)');
  }
}

// Run all tests
async function runAllTests() {
  await testOpenAI();
  await testGemini();
  await testGroq();
  await testPollinations();
  await testG4F();
  await testOllama();

  // Summary
  console.log('\n========================================');
  console.log('📊 Test Summary');
  console.log('========================================\n');

  console.log(`✅ Passed: ${results.passed.length}`);
  results.passed.forEach(name => console.log(`   - ${name}`));

  if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach(item => {
      console.log(`   - ${item.name}: ${item.error}`);
    });
  }

  if (results.skipped.length > 0) {
    console.log(`\n⚠️  Skipped: ${results.skipped.length}`);
    results.skipped.forEach(name => console.log(`   - ${name}`));
  }

  console.log('\n========================================');
  console.log('🎯 Recommendations');
  console.log('========================================\n');

  if (results.passed.length >= 3) {
    console.log('✅ Great! You have multiple working providers.');
    console.log('   Your Quantum AI will work with automatic fallback!\n');
  } else if (results.passed.length >= 1) {
    console.log('⚠️  You have at least one working provider.');
    console.log('   Consider enabling more for better reliability.\n');
  } else {
    console.log('❌ No working providers found.');
    console.log('   Please check your API keys or use free providers.\n');
  }

  // Specific recommendations
  if (!results.passed.includes('Ollama') && !results.skipped.includes('Ollama (not installed)')) {
    console.log('💡 Install Ollama for 650+ FREE models:');
    console.log('   https://ollama.com/download\n');
  }

  if (results.failed.some(f => f.name === 'OpenAI' && f.error?.includes('quota'))) {
    console.log('💡 OpenAI quota exceeded. Use free alternatives:');
    console.log('   - Pollinations (unlimited, free)');
    console.log('   - G4F (200+ models, free)');
    console.log('   - Ollama (650+ models, local)\n');
  }

  console.log('========================================\n');
}

// Run tests
runAllTests().catch(console.error);
