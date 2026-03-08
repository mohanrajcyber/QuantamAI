import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// YouTube Data API v3 Key (from .env file)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyASMEJP1EY2JfQKB3QwudiQp3G_7gpSYys';

console.log(`🔑 YouTube API Key loaded: ${YOUTUBE_API_KEY ? 'Yes' : 'No'}`);

// Invidious instances (backup if API key fails)
const INVIDIOUS_INSTANCES = [
  'https://invidious.fdn.fr',
  'https://inv.tux.pizza',
  'https://invidious.protokolla.fi',
  'https://iv.nboeck.de',
  'https://invidious.private.coffee'
];

let currentInstanceIndex = 0;

function getNextInstance() {
  currentInstanceIndex = (currentInstanceIndex + 1) % INVIDIOUS_INSTANCES.length;
  return INVIDIOUS_INSTANCES[currentInstanceIndex];
}

// Search videos
router.get('/search', async (req, res) => {
  const { q, maxResults = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  // Try YouTube API first (more reliable)
  try {
    console.log('🎬 Trying YouTube Data API v3...');
    
    const url = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `maxResults=${maxResults}&` +
      `q=${encodeURIComponent(q)}&` +
      `type=video&` +
      `key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ YouTube API Success! Found ${data.items?.length || 0} videos`);

      const videos = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));

      return res.json({ videos, source: 'YouTube Data API v3' });
    } else {
      console.warn('⚠️ YouTube API failed, trying Invidious...');
    }
  } catch (error) {
    console.error('❌ YouTube API error:', error.message);
  }

  // Fallback to Invidious
  let lastError;
  
  for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
    const instance = getNextInstance();
    
    try {
      console.log(`🎬 Trying Invidious instance ${i + 1}/${INVIDIOUS_INSTANCES.length}: ${instance}`);
      
      const response = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      if (!response.ok) {
        console.warn(`❌ Instance failed: ${instance} (${response.status})`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ Success! Found ${data.length} videos from ${instance}`);

      const videos = data.slice(0, maxResults).map(item => ({
        id: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
        publishedAt: new Date(item.published * 1000).toISOString(),
        description: item.description || '',
        viewCount: item.viewCount?.toString(),
        duration: item.lengthSeconds?.toString()
      }));

      return res.json({ videos, source: instance });
      
    } catch (error) {
      console.error(`❌ Error with ${instance}:`, error.message);
      lastError = error;
    }
  }

  // All methods failed
  console.error('❌ All video providers failed!');
  res.status(503).json({ 
    error: 'YouTube service unavailable',
    message: 'All video providers are currently unavailable. Please check your API key or try again later.',
    details: lastError?.message 
  });
});

// Get trending videos
router.get('/trending', async (req, res) => {
  const { maxResults = 20 } = req.query;
  
  // Try YouTube API first
  try {
    console.log('🎬 Trying YouTube API for trending...');
    
    const url = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet&` +
      `chart=mostPopular&` +
      `maxResults=${maxResults}&` +
      `regionCode=IN&` +
      `key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ YouTube API Success! Found ${data.items?.length || 0} trending videos`);

      const videos = data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));

      return res.json({ videos, source: 'YouTube Data API v3' });
    } else {
      console.warn('⚠️ YouTube API failed, trying Invidious...');
    }
  } catch (error) {
    console.error('❌ YouTube API error:', error.message);
  }

  // Fallback to Invidious
  let lastError;
  
  for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
    const instance = getNextInstance();
    
    try {
      console.log(`🎬 Trying trending from ${instance}`);
      
      const response = await fetch(
        `${instance}/api/v1/trending`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      if (!response.ok) {
        console.warn(`❌ Instance failed: ${instance} (${response.status})`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ Success! Found ${data.length} trending videos`);

      const videos = data.slice(0, maxResults).map(item => ({
        id: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
        publishedAt: new Date(item.published * 1000).toISOString(),
        description: item.description || '',
        viewCount: item.viewCount?.toString(),
        duration: item.lengthSeconds?.toString()
      }));

      return res.json({ videos, source: instance });
      
    } catch (error) {
      console.error(`❌ Error with ${instance}:`, error.message);
      lastError = error;
    }
  }

  res.status(503).json({ 
    error: 'YouTube service unavailable',
    message: 'All video providers are currently unavailable',
    details: lastError?.message 
  });
});

// Get video details
router.get('/video/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  let lastError;
  
  for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
    const instance = getNextInstance();
    
    try {
      const response = await fetch(
        `${instance}/api/v1/videos/${videoId}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      if (!response.ok) continue;

      const item = await response.json();

      const video = {
        id: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
        publishedAt: new Date(item.published * 1000).toISOString(),
        description: item.description || '',
        viewCount: item.viewCount?.toString(),
        duration: item.lengthSeconds?.toString()
      };

      return res.json({ video, source: instance });
      
    } catch (error) {
      lastError = error;
    }
  }

  res.status(503).json({ 
    error: 'Video details unavailable',
    details: lastError?.message 
  });
});

export default router;
