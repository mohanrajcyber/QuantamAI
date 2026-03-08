/**
 * Job Fetcher Service - Real & Live Job Data
 * Integrates with FREE job APIs (no API keys needed)
 */

/**
 * Fetch jobs from The Muse API
 * Best for: Tech jobs, startups, companies
 */
export async function fetchTheMuseJobs(query, page = 1) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      descending: 'true',
      ...(query && { search: query })
    });

    const response = await fetch(`https://www.themuse.com/api/public/jobs?${params}`);
    
    if (!response.ok) {
      throw new Error(`The Muse API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map(job => ({
      id: `muse_${job.id}`,
      title: job.name,
      company: job.company?.name || 'Unknown Company',
      location: job.locations?.[0]?.name || 'Remote',
      type: job.type || 'Full-time',
      experience: job.level?.name || 'Not specified',
      salary: 'Not disclosed',
      description: job.contents || job.short_description || '',
      skills: job.tags?.map(tag => tag.name) || [],
      postedDate: job.publication_date,
      source: 'The Muse',
      applyUrl: job.refs?.landing_page || `https://www.themuse.com/jobs/${job.id}`,
      logo: job.company?.refs?.logo_image || null
    }));
  } catch (error) {
    console.error('The Muse API Error:', error);
    return [];
  }
}

/**
 * Fetch jobs from Remotive API
 * Best for: Remote jobs worldwide
 */
export async function fetchRemotiveJobs(query, category = 'software-dev') {
  try {
    const params = new URLSearchParams({
      ...(category && { category }),
      ...(query && { search: query })
    });

    const response = await fetch(`https://remotive.com/api/remote-jobs?${params}`);
    
    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.jobs.map(job => ({
      id: `remotive_${job.id}`,
      title: job.title,
      company: job.company_name,
      location: 'Remote',
      type: job.job_type || 'Full-time',
      experience: job.candidate_required_location || 'Worldwide',
      salary: job.salary || 'Not disclosed',
      description: job.description,
      skills: job.tags || [],
      postedDate: job.publication_date,
      source: 'Remotive',
      applyUrl: job.url,
      logo: job.company_logo || null
    }));
  } catch (error) {
    console.error('Remotive API Error:', error);
    return [];
  }
}

/**
 * Fetch jobs from Arbeitnow API
 * Best for: Tech jobs in Europe
 */
export async function fetchArbeitnowJobs(query) {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
    
    if (!response.ok) {
      throw new Error(`Arbeitnow API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter by query if provided
    let jobs = data.data || [];
    if (query) {
      const searchTerm = query.toLowerCase();
      jobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm) ||
        job.description?.toLowerCase().includes(searchTerm) ||
        job.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return jobs.map(job => ({
      id: `arbeitnow_${job.slug}`,
      title: job.title,
      company: job.company_name,
      location: job.location || 'Remote',
      type: job.job_types?.[0] || 'Full-time',
      experience: 'Not specified',
      salary: 'Not disclosed',
      description: job.description,
      skills: job.tags || [],
      postedDate: job.created_at,
      source: 'Arbeitnow',
      applyUrl: job.url,
      logo: null
    }));
  } catch (error) {
    console.error('Arbeitnow API Error:', error);
    return [];
  }
}

/**
 * Fetch jobs from Findwork API
 * Best for: Developer jobs
 */
export async function fetchFindworkJobs(query) {
  try {
    const params = new URLSearchParams({
      ...(query && { search: query })
    });

    const response = await fetch(`https://findwork.dev/api/jobs/?${params}`);
    
    if (!response.ok) {
      throw new Error(`Findwork API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map(job => ({
      id: `findwork_${job.id}`,
      title: job.role,
      company: job.company_name,
      location: job.location || 'Remote',
      type: job.employment_type || 'Full-time',
      experience: job.experience_level || 'Not specified',
      salary: 'Not disclosed',
      description: job.text,
      skills: job.keywords?.split(',').map(k => k.trim()) || [],
      postedDate: job.date_posted,
      source: 'Findwork',
      applyUrl: job.url,
      logo: job.logo || null
    }));
  } catch (error) {
    console.error('Findwork API Error:', error);
    return [];
  }
}

/**
 * Fetch jobs from Adzuna API
 * Best for: Global job search with salary data
 */
export async function fetchAdzunaJobs(query, country = 'us', page = 1) {
  try {
    // Note: Requires free API key from https://developer.adzuna.com/
    // For now, this is a placeholder structure
    const APP_ID = process.env.ADZUNA_APP_ID || 'demo';
    const APP_KEY = process.env.ADZUNA_APP_KEY || 'demo';
    
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: '20',
      what: query,
      page: page.toString()
    });

    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map(job => ({
      id: `adzuna_${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Not specified',
      type: job.contract_time || 'Full-time',
      experience: 'Not specified',
      salary: job.salary_min && job.salary_max 
        ? `$${Math.round(job.salary_min)}-${Math.round(job.salary_max)}` 
        : 'Not disclosed',
      description: job.description,
      skills: job.category?.tag ? [job.category.tag] : [],
      postedDate: job.created,
      source: 'Adzuna',
      applyUrl: job.redirect_url,
      logo: null
    }));
  } catch (error) {
    console.error('Adzuna API Error:', error);
    return [];
  }
}
export async function fetchAllJobs(query, options = {}) {
  const {
    page = 1,
    limit = 20,
    sources = ['themuse', 'remotive', 'arbeitnow', 'findwork']
  } = options;

  console.log(`🔍 Fetching jobs for query: "${query}" from ${sources.length} sources...`);

  // Fetch from all sources in parallel
  const promises = [];
  
  if (sources.includes('themuse')) {
    promises.push(fetchTheMuseJobs(query, page));
  }
  
  if (sources.includes('remotive')) {
    promises.push(fetchRemotiveJobs(query));
  }
  
  if (sources.includes('arbeitnow')) {
    promises.push(fetchArbeitnowJobs(query));
  }
  
  if (sources.includes('findwork')) {
    promises.push(fetchFindworkJobs(query));
  }

  const results = await Promise.allSettled(promises);
  
  // Combine all successful results
  const allJobs = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);

  console.log(`✅ Found ${allJobs.length} total jobs from ${sources.length} sources`);

  // Sort by posted date (newest first)
  allJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = allJobs.slice(startIndex, endIndex);

  return {
    jobs: paginatedJobs,
    totalResults: allJobs.length,
    page,
    limit,
    sources: sources.map(source => ({
      name: source,
      status: 'active',
      jobCount: allJobs.filter(job => job.source.toLowerCase().includes(source)).length
    }))
  };
}

/**
 * Get available job categories
 */
export function getJobCategories() {
  return [
    'Software Development',
    'Design',
    'Marketing',
    'Sales',
    'Customer Support',
    'Product',
    'Data Science',
    'DevOps',
    'QA/Testing',
    'Management'
  ];
}

/**
 * Get trending job searches
 */
export function getTrendingSearches() {
  return [
    'React Developer',
    'Python Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Data Analyst',
    'Product Manager',
    'DevOps Engineer',
    'Machine Learning Engineer'
  ];
}
