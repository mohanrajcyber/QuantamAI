import express from 'express';

const router = express.Router();

// Popular Tamil YouTube channels for trending
const TAMIL_CHANNELS = [
  'UCq-Fj5jknLsUf-MWSy4_brA', // T-Series
  'UCJrDMFOdv1I2k8n9oK_V21w', // Sun TV
  'UCcEbCNwqzDKEYkYX7PvsGkA', // Vijay Television
  'UCOmHUn--16B90oW2L6FRR3A', // Zee Tamil
];

/**
 * Parse YouTube RSS feed
 */
async function parseYouTubeRSS(channelId) {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    
    // Simple XML parsing for video entries
    const videos = [];
    const entryRegex = /<entry>(.*?)<\/entry>/gs;
    const entries = xml.match(entryRegex) || [];
    
    for (const entry of entries.slice(0, 5)) {
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
      const author = entry.match(/<name>(.*?)<\/name>/)?.[1];
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
      
      if (videoId && title) {
        videos.push({
          id: videoId,
          title: title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          channelTitle: author || 'Unknown',
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          publishedAt: published || new Date().toISOString(),
          description: ''
        });
      }
    }
    
    return videos;
  } catch (error) {
    console.error(`Error fetching RSS for channel ${channelId}:`, error.message);
    return [];
  }
}

/**
 * Search videos using YouTube RSS (limited but FREE)
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    console.log(`🎬 Searching YouTube RSS feeds for: ${q}`);
    
    // Fetch from multiple channels
    const allVideos = [];
    
    for (const channelId of TAMIL_CHANNELS) {
      const videos = await parseYouTubeRSS(channelId);
      allVideos.push(...videos);
    }
    
    // Filter by search query
    const query = q.toLowerCase();
    const filtered = allVideos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.channelTitle.toLowerCase().includes(query)
    );
    
    console.log(`✅ Found ${filtered.length} videos matching "${q}"`);
    
    res.json({ 
      videos: filtered.slice(0, 20),
      source: 'YouTube RSS Feeds (FREE)',
      note: 'Limited to popular channels. For full search, enable YouTube Data API v3 in Google Cloud Console.'
    });
    
  } catch (error) {
    console.error('❌ RSS search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
});

/**
 * Get trending videos from popular channels
 */
router.get('/trending', async (req, res) => {
  const { maxResults = 20 } = req.query;
  
  try {
    console.log('🎬 Loading trending videos from RSS feeds...');
    
    const allVideos = [];
    
    for (const channelId of TAMIL_CHANNELS) {
      const videos = await parseYouTubeRSS(channelId);
      allVideos.push(...videos);
    }
    
    // Sort by published date
    allVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    console.log(`✅ Found ${allVideos.length} trending videos`);
    
    res.json({ 
      videos: allVideos.slice(0, maxResults),
      source: 'YouTube RSS Feeds (FREE)',
      note: 'Showing latest videos from popular Tamil channels'
    });
    
  } catch (error) {
    console.error('❌ RSS trending error:', error);
    res.status(500).json({ 
      error: 'Trending failed',
      message: error.message 
    });
  }
});

/**
 * Get video details (limited info from RSS)
 */
router.get('/video/:videoId', async (req, res) => {
  const { videoId } = req.params;
  
  res.json({
    video: {
      id: videoId,
      title: 'Video Title (Enable YouTube API for full details)',
      channelTitle: 'Unknown',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: new Date().toISOString(),
      description: 'Enable YouTube Data API v3 in Google Cloud Console for full video details'
    },
    source: 'YouTube RSS (Limited)',
    note: 'For full video details, enable YouTube Data API v3'
  });
});

export default router;
