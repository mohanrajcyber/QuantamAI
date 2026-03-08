/**
 * Job Service - Real & Live Job Search
 * Connects to backend API for real-time job data
 */

const API_BASE_URL = 'http://localhost:3001/api/jobs';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  skills: string[];
  postedDate: string;
  source: string;
  applyUrl: string;
}

export interface SearchParams {
  query: string;
  location?: string;
  domain?: string;
  experience?: string;
  jobType?: string;
  salaryRange?: { min: number; max: number };
  page?: number;
  limit?: number;
}

export interface UserProfile {
  domain?: string;
  experience?: string;
  location?: string;
  skills?: string[];
}

/**
 * Search for jobs with real-time data
 */
export async function searchJobs(params: SearchParams): Promise<{ jobs: Job[]; totalResults: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      jobs: data.jobs || [],
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    console.error('Job search error:', error);
    throw error;
  }
}

/**
 * Get available job sources
 */
export async function getJobSources() {
  try {
    const response = await fetch(`${API_BASE_URL}/sources`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sources: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Job sources error:', error);
    throw error;
  }
}

/**
 * Get trending searches and domains
 */
export async function getTrendingData() {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Trending data error:', error);
    throw error;
  }
}

/**
 * Filter jobs by user profile (Career Agent integration)
 */
export async function filterJobsByProfile(jobs: Job[], userProfile: UserProfile): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobs,
        userProfile,
      }),
    });

    if (!response.ok) {
      throw new Error(`Filter failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Job filter error:', error);
    throw error;
  }
}
