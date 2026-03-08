// Test YouTube RSS API

async function testRSS() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎬 Testing YouTube RSS API (FREE, No API Key!)');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    console.log('🔍 Testing trending videos...\n');
    
    const response = await fetch('http://localhost:3001/api/youtube/trending?maxResults=10');
    
    if (!response.ok) {
      console.log(`❌ Failed: ${response.status}`);
      return;
    }

    const data = await response.json();
    
    console.log(`✅ SUCCESS!`);
    console.log(`📹 Found ${data.videos.length} videos`);
    console.log(`🌐 Source: ${data.source}\n`);
    
    if (data.videos.length > 0) {
      console.log('Latest 5 videos:\n');
      data.videos.slice(0, 5).forEach((video, i) => {
        console.log(`${i + 1}. ${video.title}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   Video ID: ${video.id}\n`);
      });
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ YouTube RSS is WORKING!');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }
}

testRSS();
