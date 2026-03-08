import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { MapPin, DollarSign, Calendar, Briefcase, CheckCircle } from "lucide-react";

interface JobDetailDialogProps {
  open: boolean;
  onClose: () => void;
  job: any;
  accessToken: string | null;
  onLoginRequired: () => void;
}

export function JobDetailDialog({ open, onClose, job, accessToken, onLoginRequired }: JobDetailDialogProps) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  if (!job) return null;

  const handleApply = async () => {
    if (!accessToken) {
      onLoginRequired();
      return;
    }

    setApplying(true);

    try {
      const response = await fetch(
        `https://rljcyzhzuemhfxtryotp.supabase.co/functions/v1/make-server-2c2d0870/jobs/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            jobId: job.id,
            coverLetter,
          }),
        }
      );

      if (response.ok) {
        setApplied(true);
      }
    } catch (error) {
      console.error("Failed to apply:", error);
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-xl"
              style={{ backgroundColor: job.logoColor }}
            >
              {job.logo}
            </div>
            <div>
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-semibold text-gray-900">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-semibold text-gray-900">{job.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold text-gray-900">{job.tags[0]}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">
              We are looking for a talented {job.title} to join our team at {job.company}. 
              This is an excellent opportunity to work with cutting-edge technologies and 
              contribute to exciting projects. You'll be part of a dynamic team that values 
              innovation, creativity, and collaboration.
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Design and develop user-friendly interfaces</li>
              <li>Collaborate with cross-functional teams</li>
              <li>Conduct user research and usability testing</li>
              <li>Create wireframes, prototypes, and design systems</li>
              <li>Stay updated with latest design trends and technologies</li>
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>3+ years of experience in UI/UX design</li>
              <li>Proficiency in Figma, Sketch, or Adobe XD</li>
              <li>Strong portfolio demonstrating design skills</li>
              <li>Excellent communication and teamwork abilities</li>
              <li>Bachelor's degree in Design or related field</li>
            </ul>
          </div>

          {/* Application Section */}
          {!applied ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Apply for this position</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="cover-letter"
                    placeholder="Tell us why you're a great fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {applying ? "Submitting..." : "Apply Now"}
                </Button>
                {!accessToken && (
                  <p className="text-sm text-gray-500 text-center">
                    You need to sign in to apply for this job
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Application Submitted!</p>
                  <p className="text-sm text-green-700">
                    We've received your application and will get back to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
