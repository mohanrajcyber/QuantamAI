import { ArrowUpDown } from "lucide-react";
import { JobCard } from "./JobCard";
import { useState } from "react";

interface JobListProps {
  onJobClick: (job: any) => void;
  savedJobs: string[];
  onSaveToggle: (jobId: string) => void;
  accessToken: string | null;
  searchResults?: any[];
  filters?: any;
}

const jobsData = [
  {
    id: "1",
    date: "5 Feb, 2026",
    company: "Tata Consultancy Services",
    logo: "TCS",
    logoColor: "#0066B2",
    title: "Senior UI/UX Designer",
    tags: ["Full-time", "Senior-level", "Remote", "Design System"],
    salary: "₹18-25 LPA",
    location: "Mumbai, Maharashtra",
    bgColor: "#FFE4D6",
    easyApply: true
  },
  {
    id: "2",
    date: "3 Feb, 2026",
    company: "Infosys",
    logo: "I",
    logoColor: "#007CC3",
    title: "Product Designer",
    tags: ["Full-time", "Mid-level", "Hybrid", "UI/UX"],
    salary: "₹12-18 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#D4F4DD",
    easyApply: true
  },
  {
    id: "3",
    date: "1 Feb, 2026",
    company: "Flipkart",
    logo: "F",
    logoColor: "#2874F0",
    title: "Senior Motion Designer",
    tags: ["Full-time", "Senior-level", "On-site", "Animation"],
    salary: "₹20-28 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#E8D4F4",
    easyApply: false
  },
  {
    id: "4",
    date: "30 Jan, 2026",
    company: "Swiggy",
    logo: "S",
    logoColor: "#FC8019",
    title: "UX Designer",
    tags: ["Full-time", "Mid-level", "Remote", "Mobile App"],
    salary: "₹15-22 LPA",
    location: "Hyderabad, Telangana",
    bgColor: "#F4F4D4",
    easyApply: true
  },
  {
    id: "5",
    date: "28 Jan, 2026",
    company: "Zomato",
    logo: "Z",
    logoColor: "#E23744",
    title: "Visual Designer",
    tags: ["Full-time", "Junior-level", "Hybrid", "Branding"],
    salary: "₹8-12 LPA",
    location: "Gurgaon, Haryana",
    bgColor: "#FFD4E8",
    easyApply: true
  },
  {
    id: "6",
    date: "25 Jan, 2026",
    company: "Paytm",
    logo: "P",
    logoColor: "#00BAF2",
    title: "UI Designer",
    tags: ["Full-time", "Mid-level", "On-site", "Fintech"],
    salary: "₹10-16 LPA",
    location: "Noida, Uttar Pradesh",
    bgColor: "#D4E4F4",
    easyApply: false
  },
  {
    id: "7",
    date: "22 Jan, 2026",
    company: "Wipro",
    logo: "W",
    logoColor: "#7B3294",
    title: "Senior Product Designer",
    tags: ["Full-time", "Senior-level", "Remote", "Enterprise"],
    salary: "₹16-24 LPA",
    location: "Pune, Maharashtra",
    bgColor: "#E8E4FF",
    easyApply: true
  },
  {
    id: "8",
    date: "20 Jan, 2026",
    company: "PhonePe",
    logo: "PP",
    logoColor: "#5F259F",
    title: "UX Researcher",
    tags: ["Full-time", "Mid-level", "Hybrid", "Research"],
    salary: "₹14-20 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#FFF4D4",
    easyApply: true
  },
  {
    id: "9",
    date: "18 Jan, 2026",
    company: "CRED",
    logo: "C",
    logoColor: "#000000",
    title: "Lead Designer",
    tags: ["Full-time", "Lead-level", "On-site", "Product Design"],
    salary: "₹25-35 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#FFE4F4",
    easyApply: false
  },
  {
    id: "10",
    date: "15 Jan, 2026",
    company: "OLA",
    logo: "O",
    logoColor: "#39B54A",
    title: "Interaction Designer",
    tags: ["Full-time", "Mid-level", "Hybrid", "Mobile"],
    salary: "₹12-18 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#D4FFE8",
    easyApply: true
  },
  {
    id: "11",
    date: "12 Jan, 2026",
    company: "Myntra",
    logo: "M",
    logoColor: "#FF3F6C",
    title: "Fashion Designer (Digital)",
    tags: ["Full-time", "Senior-level", "On-site", "E-commerce"],
    salary: "₹15-22 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#FFD4E4",
    easyApply: false
  },
  {
    id: "12",
    date: "10 Jan, 2026",
    company: "Razorpay",
    logo: "R",
    logoColor: "#3395FF",
    title: "Product Designer",
    tags: ["Full-time", "Mid-level", "Remote", "Payments"],
    salary: "₹16-24 LPA",
    location: "Bangalore, Karnataka",
    bgColor: "#D4E4FF",
    easyApply: true
  }
];

export function JobList({ onJobClick, savedJobs, onSaveToggle, accessToken, searchResults, filters }: JobListProps) {
  const [sortBy, setSortBy] = useState<'updated' | 'salary' | 'date'>('updated');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Map search results to match JobCard props format
  const mappedSearchResults = searchResults?.map(job => {
    try {
      // Safely format date
      let formattedDate = 'Recently posted';
      if (job.postedDate) {
        try {
          const dateObj = new Date(job.postedDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          }
        } catch (e) {
          console.warn('Date parsing error:', e);
        }
      }

      // Safely get company logo initials
      const companyName = job.company || 'Unknown';
      const logo = companyName.length >= 2 ? companyName.substring(0, 2).toUpperCase() : companyName.substring(0, 1).toUpperCase();

      // Generate consistent color based on company name
      const colorHash = companyName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const colors = ['#0066B2', '#007CC3', '#2874F0', '#FC8019', '#E23744', '#00BAF2', '#7B3294', '#5F259F', '#39B54A', '#FF3F6C', '#3395FF'];
      const logoColor = colors[colorHash % colors.length];

      // Build tags array, filtering out empty values
      const tags = [
        job.type,
        job.experience,
        ...(job.skills?.slice(0, 2) || [])
      ].filter(tag => tag && tag !== 'Not specified');

      return {
        id: job.id || `job_${Math.random()}`,
        date: formattedDate,
        company: companyName,
        logo: logo,
        logoColor: logoColor,
        title: job.title || 'Untitled Position',
        tags: tags,
        salary: job.salary || 'Not disclosed',
        location: job.location || 'Remote',
        bgColor: ['#FFE4D6', '#D4F4DD', '#E8D4F4', '#F4F4D4', '#FFD4E8', '#D4E4F4'][colorHash % 6],
        easyApply: job.source === 'The Muse' || job.source === 'Remotive',
        applyUrl: job.applyUrl,
        description: job.description,
        source: job.source,
        type: job.type,
        experience: job.experience
      };
    } catch (error) {
      console.error('Error mapping job:', error, job);
      return null;
    }
  }).filter(job => job !== null); // Remove any failed mappings

  // Use mapped search results if available, otherwise use default jobs
  let displayJobs = mappedSearchResults && mappedSearchResults.length > 0 ? mappedSearchResults : jobsData;

  // Apply filters
  if (filters) {
    displayJobs = displayJobs.filter(job => {
      // Filter by role
      if (filters.role && filters.role !== 'Designer') {
        const jobTitle = job.title.toLowerCase();
        const filterRole = filters.role.toLowerCase();
        if (!jobTitle.includes(filterRole)) {
          return false;
        }
      }

      // Filter by location
      if (filters.location && filters.location !== 'Work Location') {
        const jobLocation = job.location.toLowerCase();
        const filterLocation = filters.location.toLowerCase();
        if (!jobLocation.includes(filterLocation)) {
          return false;
        }
      }

      // Filter by experience
      if (filters.experience && filters.experience !== 'Experience') {
        const jobTags = job.tags.map((t: string) => t.toLowerCase()).join(' ');
        const filterExp = filters.experience.toLowerCase();
        if (!jobTags.includes(filterExp)) {
          return false;
        }
      }

      // Filter by working schedule (OR logic - match ANY checked option)
      if (filters.workingSchedule) {
        const schedule = filters.workingSchedule;
        const hasAnyScheduleFilter = schedule.fullTime || schedule.partTime || schedule.internship || schedule.projectWork || schedule.volunteering;
        
        if (hasAnyScheduleFilter) {
          const jobTagsLower = job.tags.map((t: string) => t.toLowerCase()).join(' ');
          const matchesSchedule = 
            (schedule.fullTime && jobTagsLower.includes('full-time')) ||
            (schedule.partTime && jobTagsLower.includes('part-time')) ||
            (schedule.internship && jobTagsLower.includes('internship')) ||
            (schedule.projectWork && jobTagsLower.includes('project')) ||
            (schedule.volunteering && jobTagsLower.includes('volunteer'));
          
          if (!matchesSchedule) {
            return false;
          }
        }
      }

      // Filter by employment type (OR logic - match ANY checked option)
      if (filters.employmentType) {
        const empType = filters.employmentType;
        const hasAnyEmpTypeFilter = empType.fullDay || empType.flexible || empType.shiftWork || empType.shiftMethod;
        
        if (hasAnyEmpTypeFilter) {
          const jobTagsLower = job.tags.map((t: string) => t.toLowerCase()).join(' ');
          const matchesEmpType = 
            (empType.fullDay && jobTagsLower.includes('full')) ||
            (empType.flexible && jobTagsLower.includes('flexible')) ||
            (empType.shiftWork && jobTagsLower.includes('shift')) ||
            (empType.shiftMethod && jobTagsLower.includes('shift'));
          
          if (!matchesEmpType) {
            return false;
          }
        }
      }

      // Filter by salary range
      if (filters.salaryMin && filters.salaryMax) {
        const getSalaryValue = (salary: string) => {
          const match = salary.match(/[\d,]+/);
          return match ? parseInt(match[0].replace(/,/g, '')) : 0;
        };
        const jobSalary = getSalaryValue(job.salary);
        if (jobSalary > 0 && (jobSalary < filters.salaryMin || jobSalary > filters.salaryMax)) {
          return false;
        }
      }

      return true;
    });
  }
  
  // Sort jobs based on selected option
  const sortedJobs = [...displayJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'salary') {
      const getSalaryValue = (salary: string) => {
        const match = salary.match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, '')) : 0;
      };
      return getSalaryValue(b.salary) - getSalaryValue(a.salary);
    }
    return 0; // 'updated' - keep original order
  });

  const jobCount = sortedJobs.length;

  // Debug logging
  console.log('🎯 JobList render:', {
    hasSearchResults: !!searchResults,
    searchResultsCount: searchResults?.length || 0,
    mappedCount: mappedSearchResults?.length || 0,
    displayCount: sortedJobs.length,
    isShowingSearchResults: mappedSearchResults && mappedSearchResults.length > 0,
    sortBy,
    activeFilters: filters
  });

  const sortOptions = [
    { value: 'updated', label: 'Last updated' },
    { value: 'date', label: 'Date posted' },
    { value: 'salary', label: 'Salary (high to low)' }
  ];

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-white text-2xl">
            {searchResults && searchResults.length > 0 ? 'Search Results' : 'Recommended jobs'}
          </h2>
          <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">{jobCount}</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sort by: <span className="text-white">{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            <ArrowUpDown className="w-4 h-4" />
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as 'updated' | 'salary' | 'date');
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    sortBy === option.value 
                      ? 'text-blue-500 bg-[#2a2a2a]' 
                      : 'text-gray-300 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job) => (
            <JobCard 
              key={job.id} 
              {...job} 
              onDetailsClick={() => onJobClick(job)}
              onSaveToggle={() => onSaveToggle(job.id)}
              isSaved={savedJobs.includes(job.id)}
              accessToken={accessToken}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No jobs found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
