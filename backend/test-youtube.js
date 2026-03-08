// Test YouTube API - Check if Invidious proxy is working

const INVIDIOUS_INSTANCES = [
  'https://invidious.fdn.fr',
  'https://inv.tux.pizza',
  'https://invidious.protokolla.fi',
  'https://iv.nboeck.de',
  'https://invidious.private.coffee'
];

async function testInvidiousInstance(instance) {
  try {
    console.log(`\n🔍 Testing: ${instance}`);
    
    const response = await fetch(
      `${instance}/api/v1/search?q=tamil&type=video`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ Success! Found ${data.length} videos`);
    
    if (data.length > 0) {
      console.log(`   📹 First video: "${data[0].title}"`);
      console.log(`   👤 Channel: ${data[0].author}`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function testBackendAPI() {
  try {
    console.log('\n\n🔍 Testing Backend YouTube API...');
    
    const response = await fetch('http://localhost:3001/api/youtube/search?q=tamil&maxResults=5');
    
    if (!response.ok) {
      console.log(`   ❌ Backend API Failed: ${response.status}`);
      const error = await response.json();
      console.log(`   Error: ${error.message}`);
      return false;
    }

    const data = await response.json();
    console.log(`   ✅ Backend API Success!`);
    console.log(`   📹 Found ${data.videos.length} videos`);
    console.log(`   🌐 Source: ${data.source}`);
    
    if (data.videos.length > 0) {
      console.log(`\n   First 3 videos:`);
      data.videos.slice(0, 3).forEach((video, i) => {
        console.log(`   ${i + 1}. ${video.title}`);
        console.log(`      Channel: ${video.channelTitle}`);
      });
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Backend API Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎬 YouTube API Test - FREE Invidious Proxy');
  console.log('═══════════════════════════════════════════════════════');

  console.log('\n📋 Testing all Invidious instances...\n');
  
  let workingInstances = 0;
  
  for (const instance of INVIDIOUS_INSTANCES) {
    const success = await testInvidiousInstance(instance);
    if (success) workingInstances++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`📊 Results: ${workingInstances}/${INVIDIOUS_INSTANCES.length} instances working`);
  console.log('═══════════════════════════════════════════════════════');

  // Test backend API
  await testBackendAPI();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ Test Complete!');
  console.log('═══════════════════════════════════════════════════════\n');
}

runTests();
