/**
 * YouTube Service - Backend Proxy Mode
 * Uses backend server to bypass CORS issues
 * FREE - No API key needed!
 */

const BACKEND_URL = 'http://localhost:3001/api/youtube';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  viewCount?: string;
  duration?: string;
}

/**
 * Search YouTube videos via backend proxy
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  try {
    console.log('🎬 Searching YouTube via backend proxy (FREE)');
    
    const response = await fetch(
      `${BACKEND_URL}/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Search failed');
    }

    const data = await response.json();
    console.log(`✅ Found ${data.videos.length} videos from ${data.source}`);
    
    return data.videos;
  } catch (error) {
    console.error('❌ YouTube search error:', error);
    throw error;
  }
}

/**
 * Get trending videos via backend proxy
 */
export async function getTrendingVideos(
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  try {
    console.log('🎬 Loading trending videos via backend proxy (FREE)');
    
    const response = await fetch(
      `${BACKEND_URL}/trending?maxResults=${maxResults}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Trending failed');
    }

    const data = await response.json();
    console.log(`✅ Found ${data.videos.length} trending videos from ${data.source}`);
    
    return data.videos;
  } catch (error) {
    console.error('❌ YouTube trending error:', error);
    throw error;
  }
}

/**
 * Get video details via backend proxy
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/video/${videoId}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.video;
  } catch (error) {
    console.error('❌ YouTube video details error:', error);
    return null;
  }
}

/**
 * Search by category
 */
export async function searchByCategory(
  category: string,
  maxResults: number = 20
): Promise<YouTubeVideo[]> {
  return searchYouTubeVideos(category, maxResults);
}

console.log('🆓 YouTube service using: Backend Proxy (FREE, no API key needed!)');

