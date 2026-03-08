/**
 * Job Search Routes - Real & Live Job Data
 * Integrates with FREE job APIs (The Muse, Remotive, Arbeitnow, Findwork)
 */

import express from 'express';
const router = express.Router();

// Import job fetcher service
import { 
  fetchAllJobs, 
  getJobCategories, 
  getTrendingSearches 
} from '../services/jobFetcher.js';

console.log('🚀 Job routes initialized with FREE APIs (The Muse, Remotive, Arbeitnow, Findwork)');

/**
 * POST /api/jobs/search
 * Search for jobs across multiple FREE platforms
 */
router.post('/search', async (req, res) => {
  try {
    const { 
      query,           // Search keyword (e.g., "Data Analyst")
      location,        // Job location (optional)
      domain,          // Job domain/category (optional)
      experience,      // Experience level (optional)
      jobType,         // Full-time, Part-time, etc. (optional)
      salaryRange,     // Min-Max salary (optional)
      page = 1,
      limit = 20,
      sources = ['themuse', 'remotive', 'arbeitnow', 'findwork']
    } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    console.log(`🔍 Job search request: "${query}" (page ${page})`);

    // Fetch jobs from all FREE APIs
    const result = await fetchAllJobs(query, { page, limit, sources });

    res.json({
      success: true,
      query,
      totalResults: result.totalResults,
      page: result.page,
      limit: result.limit,
      jobs: result.jobs,
      sources: result.sources
    });

  } catch (error) {
    console.error('Job Search Error:', error);
    res.status(500).json({
      error: 'Job search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/jobs/sources
 * Get available job sources and their status
 */
router.get('/sources', async (req, res) => {
  try {
    const sources = [
      { 
        name: 'The Muse', 
        enabled: true, 
        status: 'Active - FREE API',
        url: 'https://www.themuse.com',
        description: 'Tech jobs, startups, companies'
      },
      { 
        name: 'Remotive', 
        enabled: true, 
        status: 'Active - FREE API',
        url: 'https://remotive.com',
        description: 'Remote jobs worldwide'
      },
      { 
        name: 'Arbeitnow', 
        enabled: true, 
        status: 'Active - FREE API',
        url: 'https://www.arbeitnow.com',
        description: 'Tech jobs in Europe'
      },
      { 
        name: 'Findwork', 
        enabled: true, 
        status: 'Active - FREE API',
        url: 'https://findwork.dev',
        description: 'Developer jobs'
      }
    ];

    res.json({
      sources,
      totalSources: sources.length,
      activeSources: sources.filter(s => s.enabled).length
    });

  } catch (error) {
    console.error('Sources Error:', error);
    res.status(500).json({
      error: 'Failed to fetch job sources',
      message: error.message
    });
  }
});

/**
 * GET /api/jobs/trending
 * Get trending job searches and popular domains
 */
router.get('/trending', async (req, res) => {
  try {
    const trending = {
      keywords: getTrendingSearches(),
      categories: getJobCategories(),
      locations: [
        'Remote',
        'United States',
        'United Kingdom',
        'Europe',
        'Worldwide'
      ]
    };

    res.json(trending);

  } catch (error) {
    console.error('Trending Error:', error);
    res.status(500).json({
      error: 'Failed to fetch trending data',
      message: error.message
    });
  }
});

/**
 * GET /api/jobs/categories
 * Get available job categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = getJobCategories();
    
    res.json({
      categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Categories Error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

export default router;
