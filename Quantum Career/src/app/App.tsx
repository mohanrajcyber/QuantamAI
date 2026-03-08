import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { Sidebar } from "./components/Sidebar";
import { JobList } from "./components/JobList";
import { AuthDialog } from "./components/AuthDialog";
import { ProfileDialog } from "./components/ProfileDialog";
import { JobDetailDialog } from "./components/JobDetailDialog";
import { PortalLoginDialog } from "./components/PortalLoginDialog";
import { JobNotification } from "./components/JobNotification";
import { AICareerAssistant } from "./components/AICareerAssistant";
import { Toaster } from "./components/ui/sonner";
import { supabase } from "./lib/supabase";

export default function App() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [jobDetailDialogOpen, setJobDetailDialogOpen] = useState(false);
  const [portalLoginDialogOpen, setPortalLoginDialogOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchSavedJobs();
    }
  }, [accessToken]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  const fetchSavedJobs = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/jobs/saved`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setSavedJobs(data.savedJobs || []);
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    }
  };

  const handleSaveToggle = async (jobId: string) => {
    if (!accessToken) {
      setAuthDialogOpen(true);
      return;
    }

    const isSaved = savedJobs.includes(jobId);

    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(
          `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/jobs/save/${jobId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          setSavedJobs(savedJobs.filter((id) => id !== jobId));
        }
      } else {
        // Add to saved
        const response = await fetch(
          `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/jobs/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ jobId }),
          }
        );

        if (response.ok) {
          setSavedJobs([...savedJobs, jobId]);
        }
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setJobDetailDialogOpen(true);
  };

  const handleAuthSuccess = () => {
    checkSession();
  };

  const handleSearchResults = (jobs: any[]) => {
    console.log('📊 App received search results:', {
      count: jobs.length,
      firstJob: jobs[0],
      allJobIds: jobs.map(j => j.id)
    });
    setSearchResults(jobs);
    setIsSearchMode(true);
  };

  const handleFilterChange = (newFilters: any) => {
    console.log('🔍 Filters updated:', newFilters);
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header
        onLoginClick={() => setAuthDialogOpen(true)}
        onProfileClick={() => setProfileDialogOpen(true)}
        onPortalLoginClick={() => setPortalLoginDialogOpen(true)}
        onAIAssistantClick={() => setAiAssistantOpen(true)}
        isLoggedIn={!!user}
        userName={user?.user_metadata?.name}
        onSearchResults={handleSearchResults}
      />
      <FilterBar onFilterChange={handleFilterChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar onFilterChange={handleFilterChange} />
          <JobList
            onJobClick={handleJobClick}
            savedJobs={savedJobs}
            onSaveToggle={handleSaveToggle}
            accessToken={accessToken}
            searchResults={isSearchMode ? searchResults : undefined}
            filters={filters}
          />
        </div>
      </main>

      {/* Dialogs */}
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {accessToken && (
        <ProfileDialog
          open={profileDialogOpen}
          onClose={() => setProfileDialogOpen(false)}
          accessToken={accessToken}
        />
      )}

      <JobDetailDialog
        open={jobDetailDialogOpen}
        onClose={() => setJobDetailDialogOpen(false)}
        job={selectedJob}
        accessToken={accessToken}
        onLoginRequired={() => {
          setJobDetailDialogOpen(false);
          setAuthDialogOpen(true);
        }}
      />

      <PortalLoginDialog
        open={portalLoginDialogOpen}
        onClose={() => setPortalLoginDialogOpen(false)}
        accessToken={accessToken}
        onLoginRequired={() => {
          setPortalLoginDialogOpen(false);
          setAuthDialogOpen(true);
        }}
      />

      {/* AI Career Assistant */}
      {aiAssistantOpen && (
        <AICareerAssistant
          onClose={() => setAiAssistantOpen(false)}
          onJobRecommendations={(jobs) => {
            setSearchResults(jobs);
            setIsSearchMode(true);
            setAiAssistantOpen(false);
          }}
        />
      )}

      {/* Notifications */}
      <JobNotification />
      <Toaster />
    </div>
  );
}