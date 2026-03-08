import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

export function JobNotification() {
  useEffect(() => {
    // Simulate new job notifications every 30 seconds
    const interval = setInterval(() => {
      const indianCompanies = [
        "Tata Consultancy Services",
        "Infosys",
        "Wipro",
        "Tech Mahindra",
        "HCL Technologies",
        "Accenture India",
        "Cognizant",
      ];
      
      const roles = [
        "UI/UX Designer",
        "Product Designer",
        "Visual Designer",
        "Graphic Designer",
        "Motion Designer",
      ];

      const randomCompany = indianCompanies[Math.floor(Math.random() * indianCompanies.length)];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];

      toast(
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold">New Job Posted!</p>
            <p className="text-sm text-gray-600">
              {randomRole} at {randomCompany}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
