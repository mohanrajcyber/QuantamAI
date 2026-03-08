import { ChevronDown, DollarSign } from "lucide-react";
import { Slider } from "./ui/slider";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedRole, setSelectedRole] = useState("Designer");
  const [selectedLocation, setSelectedLocation] = useState("Work Location");
  const [selectedExperience, setSelectedExperience] = useState("Experience");
  const [selectedSalaryPeriod, setSelectedSalaryPeriod] = useState("Per month");
  const [salaryRange, setSalaryRange] = useState([60]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [showSalaryPeriodDropdown, setShowSalaryPeriodDropdown] = useState(false);

  const roles = [
    "Designer", "Developer", "Product Manager", "Data Analyst", 
    "Marketing", "Sales", "HR", "Finance", "Operations", "Customer Support"
  ];

  const locations = [
    "Work Location", "Remote", "Hybrid", "On-site", 
    "USA", "India", "UK", "Canada", "Germany", "Australia"
  ];

  const experiences = [
    "Experience", "Entry Level", "Junior", "Mid-level", 
    "Senior", "Lead", "Manager", "Director", "Executive"
  ];

  const salaryPeriods = ["Per month", "Per year", "Per hour"];

  const minSalary = 3200;
  const maxSalary = 20000;
  const currentMin = minSalary + (salaryRange[0] / 100) * (maxSalary - minSalary);
  const currentMax = maxSalary;

  const handleFilterUpdate = () => {
    if (onFilterChange) {
      onFilterChange({
        role: selectedRole !== "Designer" ? selectedRole : null,
        location: selectedLocation !== "Work Location" ? selectedLocation : null,
        experience: selectedExperience !== "Experience" ? selectedExperience : null,
        salaryMin: Math.round(currentMin),
        salaryMax: currentMax,
        salaryPeriod: selectedSalaryPeriod
      });
    }
  };

  return (
    <div className="bg-[#0f0f0f] border-b border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowLocationDropdown(false);
                setShowExperienceDropdown(false);
                setShowSalaryPeriodDropdown(false);
              }}
              className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <span className="text-gray-400 text-sm">{selectedRole}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full mt-2 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setShowRoleDropdown(false);
                      handleFilterUpdate();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Work Location */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowRoleDropdown(false);
                setShowExperienceDropdown(false);
                setShowSalaryPeriodDropdown(false);
              }}
              className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <span className="text-gray-400 text-sm">{selectedLocation}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showLocationDropdown && (
              <div className="absolute top-full mt-2 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowLocationDropdown(false);
                      handleFilterUpdate();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExperienceDropdown(!showExperienceDropdown);
                setShowRoleDropdown(false);
                setShowLocationDropdown(false);
                setShowSalaryPeriodDropdown(false);
              }}
              className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <span className="text-gray-400 text-sm">{selectedExperience}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showExperienceDropdown && (
              <div className="absolute top-full mt-2 w-48 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {experiences.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => {
                      setSelectedExperience(exp);
                      setShowExperienceDropdown(false);
                      handleFilterUpdate();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                  >
                    {exp}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Salary Period */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSalaryPeriodDropdown(!showSalaryPeriodDropdown);
                setShowRoleDropdown(false);
                setShowLocationDropdown(false);
                setShowExperienceDropdown(false);
              }}
              className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{selectedSalaryPeriod}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showSalaryPeriodDropdown && (
              <div className="absolute top-full mt-2 w-40 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl z-50">
                {salaryPeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedSalaryPeriod(period);
                      setShowSalaryPeriodDropdown(false);
                      handleFilterUpdate();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Salary Range */}
          <div className="flex-1 min-w-[200px] flex items-center gap-4 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-800">
            <span className="text-gray-400 text-sm whitespace-nowrap">Salary range</span>
            <div className="flex-1">
              <Slider 
                value={salaryRange} 
                onValueChange={(value) => {
                  setSalaryRange(value);
                  handleFilterUpdate();
                }}
                max={100} 
                step={1} 
                className="w-full" 
              />
            </div>
            <span className="text-gray-300 text-sm whitespace-nowrap">
              ${Math.round(currentMin).toLocaleString()} - ${currentMax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
