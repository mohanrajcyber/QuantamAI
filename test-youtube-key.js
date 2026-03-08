// Test YouTube API Key
const API_KEY = 'AIzaSyCIdGh7STk-6H6sf5wh_561wkAX_RtcQDA';

async function testYouTubeAPI() {
  console.log('🔍 Testing YouTube Data API v3...\n');
  console.log('API Key:', API_KEY);
  console.log('Key starts with "AIzaSy":', API_KEY.startsWith('AIzaSy') ? '✅' : '❌');
  console.log('Key length:', API_KEY.length, API_KEY.length === 39 ? '✅' : '❌');
  console.log('\n📡 Making test request...\n');

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! API key is working!\n');
      console.log('Response:', JSON.stringify(data, null, 2));
      console.log('\n🎉 YouTube Data API v3 is ENABLED and working!');
    } else {
      console.log('❌ ERROR! API request failed\n');
      console.log('Status:', response.status, response.statusText);
      console.log('Error details:', JSON.stringify(data, null, 2));
      
      if (response.status === 403) {
        console.log('\n⚠️  403 Forbidden Error');
        console.log('This means:');
        console.log('1. API key is valid ✅');
        console.log('2. BUT YouTube Data API v3 is NOT enabled ❌');
        console.log('\n📝 To fix:');
        console.log('1. Go to: https://console.cloud.google.com');
        console.log('2. Select your project');
        console.log('3. Go to "APIs & Services" → "Library"');
        console.log('4. Search "YouTube Data API v3"');
        console.log('5. Click "ENABLE"');
        console.log('6. Wait 5 minutes');
        console.log('7. Run this test again');
      } else if (response.status === 400) {
        console.log('\n⚠️  400 Bad Request');
        console.log('API key format might be wrong');
      } else if (response.status === 429) {
        console.log('\n⚠️  429 Quota Exceeded');
        console.log('You\'ve used all 100 searches today');
        console.log('Wait until tomorrow or use Invidious API');
      }
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testYouTubeAPI();
