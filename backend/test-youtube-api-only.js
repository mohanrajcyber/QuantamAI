// Test ONLY YouTube Data API v3

const YOUTUBE_API_KEY = 'AIzaSyASMEJP1EY2JfQKB3QwudiQp3G_7gpSYys'; // NEW unrestricted key!

async function testYouTubeAPI() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔑 Testing YouTube Data API v3');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log(`API Key: ${YOUTUBE_API_KEY.substring(0, 10)}...${YOUTUBE_API_KEY.substring(YOUTUBE_API_KEY.length - 5)}`);
  console.log(`Key Length: ${YOUTUBE_API_KEY.length} characters\n`);

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `maxResults=5&` +
      `q=tamil&` +
      `type=video&` +
      `key=${YOUTUBE_API_KEY}`;
    
    console.log('🎬 Making API request...\n');
    
    const response = await fetch(url);
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('\n❌ API Request Failed!');
      console.log('Error Details:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.log(`\n⚠️  Error Code: ${data.error.code}`);
        console.log(`⚠️  Error Message: ${data.error.message}`);
        
        if (data.error.errors) {
          data.error.errors.forEach(err => {
            console.log(`   - ${err.reason}: ${err.message}`);
          });
        }
      }
      return;
    }

    console.log(`\n✅ SUCCESS! Found ${data.items?.length || 0} videos\n`);
    
    if (data.items && data.items.length > 0) {
      console.log('First 3 videos:');
      data.items.slice(0, 3).forEach((item, i) => {
        console.log(`\n${i + 1}. ${item.snippet.title}`);
        console.log(`   Channel: ${item.snippet.channelTitle}`);
        console.log(`   Video ID: ${item.id.videoId}`);
      });
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ YouTube API is WORKING!');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.log('\n❌ Network Error!');
    console.log(`Error: ${error.message}`);
    console.log('\nPossible reasons:');
    console.log('1. No internet connection');
    console.log('2. Firewall blocking the request');
    console.log('3. Need VPN to access YouTube API');
    console.log('\n═══════════════════════════════════════════════════════\n');
  }
}

testYouTubeAPI();
