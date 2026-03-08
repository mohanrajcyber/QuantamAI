import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { CheckCircle, ExternalLink, Zap } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface PortalLoginDialogProps {
  open: boolean;
  onClose: () => void;
  accessToken: string | null;
  onLoginRequired: () => void;
}

const jobPortals = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "#0A66C2",
    description: "Connect to LinkedIn for Easy Apply jobs",
    available: true,
  },
  {
    id: "naukri",
    name: "Naukri.com",
    icon: "🇮🇳",
    color: "#4A90E2",
    description: "India's #1 Job Portal",
    available: true,
  },
  {
    id: "indeed",
    name: "Indeed",
    icon: "🔍",
    color: "#2164F3",
    description: "Global job search engine",
    available: true,
  },
  {
    id: "google",
    name: "Google Jobs",
    icon: "🔎",
    color: "#4285F4",
    description: "Search jobs across the web",
    available: true,
  },
  {
    id: "monster",
    name: "Monster India",
    icon: "👾",
    color: "#6E46AE",
    description: "Connect to Monster for job alerts",
    available: true,
  },
];

export function PortalLoginDialog({ open, onClose, accessToken, onLoginRequired }: PortalLoginDialogProps) {
  const [connectedPortals, setConnectedPortals] = useState<string[]>([]);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && accessToken) {
      fetchConnectedPortals();
    }
  }, [open, accessToken]);

  const fetchConnectedPortals = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c2d0870/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setConnectedPortals(data.profile?.connectedPortals || []);
      setAutoApplyEnabled(data.profile?.autoApplyEnabled || false);
    } catch (error) {
      console.error("Failed to fetch connected portals:", error);
    }
  };

  const handleConnect = async (portalId: string) => {
    if (!accessToken) {
      onLoginRequired();
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would initiate OAuth flow
      // For demo, we'll just toggle the connection
      const isConnected = connectedPortals.includes(portalId);
      const updatedPortals = isConnected
        ? connectedPortals.filter((p) => p !== portalId)
        : [...connectedPortals, portalId];

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c2d0870/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            connectedPortals: updatedPortals,
          }),
        }
      );

      if (response.ok) {
        setConnectedPortals(updatedPortals);
      }
    } catch (error) {
      console.error("Failed to connect portal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoApplyToggle = async (enabled: boolean) => {
    if (!accessToken) {
      onLoginRequired();
      return;
    }

    setAutoApplyEnabled(enabled);

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2c2d0870/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            autoApplyEnabled: enabled,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to update auto-apply:", error);
    }
  };

  if (!accessToken) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Portal Login</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please sign in to connect job portals
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">You need to sign in first</p>
            <Button onClick={onLoginRequired} className="bg-blue-500 hover:bg-blue-600">
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#1a1a1a] text-white border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Career Agent - Portal Connections
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your job portal accounts to enable auto-apply and get jobs from multiple platforms
          </DialogDescription>
        </DialogHeader>

        {/* Auto Apply Setting */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-500" />
                <Label htmlFor="auto-apply" className="text-lg font-semibold">
                  Auto Apply (Assisted)
                </Label>
              </div>
              <p className="text-sm text-gray-400">
                Automatically apply to Easy Apply jobs with your saved profile and resume
              </p>
            </div>
            <Switch
              id="auto-apply"
              checked={autoApplyEnabled}
              onCheckedChange={handleAutoApplyToggle}
            />
          </div>
          {autoApplyEnabled && (
            <div className="mt-3 text-xs text-yellow-400 flex items-center gap-2">
              ⚡ Auto-apply is enabled for Easy Apply jobs on connected portals
            </div>
          )}
        </div>

        {/* Portal Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Connect Job Portals</h3>
          {jobPortals.map((portal) => {
            const isConnected = connectedPortals.includes(portal.id);
            return (
              <div
                key={portal.id}
                className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl">{portal.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{portal.name}</h4>
                        {isConnected && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{portal.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnect(portal.id)}
                    disabled={loading}
                    variant={isConnected ? "outline" : "default"}
                    className={
                      isConnected
                        ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 mt-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            ℹ️ How it works
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✅ Connect portals to search jobs from multiple platforms</li>
            <li>✅ Your profile & resume will be used for applications</li>
            <li>✅ Easy Apply jobs are auto-detected and highlighted</li>
            <li>✅ Auto-apply submits on your behalf (you can disable anytime)</li>
            <li>✅ Get notifications when new jobs match your profile</li>
          </ul>
        </div>

        {connectedPortals.length > 0 && (
          <div className="text-center pt-4 text-sm text-gray-400">
            Connected to {connectedPortals.length} portal{connectedPortals.length > 1 ? "s" : ""}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
