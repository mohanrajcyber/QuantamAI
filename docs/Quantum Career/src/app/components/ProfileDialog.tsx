import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Upload, FileText, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
}

export function ProfileDialog({ open, onClose, accessToken }: ProfileDialogProps) {
  const [profile, setProfile] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProfile();
      fetchApplications();
      fetchSavedJobs();
    }
  }, [open]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setProfile(data.profile);
      setResume(data.resume);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/applications`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const fetchSavedJobs = async () => {
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

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      email: profile.email,
    };

    try {
      const response = await fetch(
        `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        setProfile(updates);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as string;

        const response = await fetch(
          `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/resume`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileData: fileData,
            }),
          }
        );

        if (response.ok) {
          setResume({
            fileName: file.name,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
          });
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload resume:", error);
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a1a1a] text-white border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">My Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#0f0f0f]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profile.name}
                    className="bg-[#0f0f0f] border-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-[#0f0f0f] border-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={profile.phone}
                    className="bg-[#0f0f0f] border-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={profile.location}
                    className="bg-[#0f0f0f] border-gray-800"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-lg">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-lg">{profile.location}</p>
                </div>
                <Button onClick={() => setEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                  Edit Profile
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resume" className="space-y-4">
            <div className="border border-gray-800 rounded-lg p-6 bg-[#0f0f0f]">
              {resume ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{resume.fileName}</p>
                      <p className="text-sm text-gray-400">
                        Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => document.getElementById("resume-upload")?.click()}>
                    Replace
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-4">No resume uploaded yet</p>
                  <Button onClick={() => document.getElementById("resume-upload")?.click()} className="bg-blue-500 hover:bg-blue-600">
                    Upload Resume
                  </Button>
                </div>
              )}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Applications ({applications.length})
              </h3>
              <div className="space-y-3">
                {applications.length > 0 ? (
                  applications.map((app: any, index: number) => (
                    <div key={index} className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job ID: {app.jobId}</p>
                          <p className="text-sm text-gray-400">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No applications yet</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Saved Jobs ({savedJobs.length})</h3>
              <div className="space-y-3">
                {savedJobs.length > 0 ? (
                  savedJobs.map((jobId: string, index: number) => (
                    <div key={index} className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
                      <p className="font-medium">Job ID: {jobId}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No saved jobs yet</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
