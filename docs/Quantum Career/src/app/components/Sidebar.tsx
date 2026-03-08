import { PromoCard } from "./PromoCard";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

interface SidebarProps {
  onFilterChange?: (filters: any) => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [workingSchedule, setWorkingSchedule] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    projectWork: false,
    volunteering: false
  });

  const [employmentType, setEmploymentType] = useState({
    fullDay: false,
    flexible: false,
    shiftWork: false,
    shiftMethod: false
  });

  const handleWorkingScheduleChange = (key: string, checked: boolean) => {
    const updated = { ...workingSchedule, [key]: checked };
    setWorkingSchedule(updated);
    
    if (onFilterChange) {
      onFilterChange({
        workingSchedule: updated,
        employmentType
      });
    }
  };

  const handleEmploymentTypeChange = (key: string, checked: boolean) => {
    const updated = { ...employmentType, [key]: checked };
    setEmploymentType(updated);
    
    if (onFilterChange) {
      onFilterChange({
        workingSchedule,
        employmentType: updated
      });
    }
  };

  const handleClearAll = () => {
    setWorkingSchedule({
      fullTime: false,
      partTime: false,
      internship: false,
      projectWork: false,
      volunteering: false
    });
    setEmploymentType({
      fullDay: false,
      flexible: false,
      shiftWork: false,
      shiftMethod: false
    });
    
    if (onFilterChange) {
      onFilterChange({
        workingSchedule: {},
        employmentType: {}
      });
    }
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <PromoCard />
      
      {/* Filters */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-white mb-4 flex items-center justify-between">
          Filters
          <button 
            onClick={handleClearAll}
            className="text-blue-500 text-sm hover:text-blue-400 transition-colors"
          >
            Clear
          </button>
        </h3>
        
        {/* Working Schedule */}
        <div className="mb-6">
          <h4 className="text-gray-400 text-sm mb-3">Working schedule</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="full-time" 
                checked={workingSchedule.fullTime}
                onCheckedChange={(checked) => handleWorkingScheduleChange('fullTime', checked as boolean)}
              />
              Full-time
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="part-time" 
                checked={workingSchedule.partTime}
                onCheckedChange={(checked) => handleWorkingScheduleChange('partTime', checked as boolean)}
              />
              Part-time
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="internship" 
                checked={workingSchedule.internship}
                onCheckedChange={(checked) => handleWorkingScheduleChange('internship', checked as boolean)}
              />
              Internship
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="project-work" 
                checked={workingSchedule.projectWork}
                onCheckedChange={(checked) => handleWorkingScheduleChange('projectWork', checked as boolean)}
              />
              Project work
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="volunteering" 
                checked={workingSchedule.volunteering}
                onCheckedChange={(checked) => handleWorkingScheduleChange('volunteering', checked as boolean)}
              />
              Volunteering
            </label>
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <h4 className="text-gray-400 text-sm mb-3">Employment type</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="full-day" 
                checked={employmentType.fullDay}
                onCheckedChange={(checked) => handleEmploymentTypeChange('fullDay', checked as boolean)}
              />
              Full day
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="flexible" 
                checked={employmentType.flexible}
                onCheckedChange={(checked) => handleEmploymentTypeChange('flexible', checked as boolean)}
              />
              Flexible schedule
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="shift-work" 
                checked={employmentType.shiftWork}
                onCheckedChange={(checked) => handleEmploymentTypeChange('shiftWork', checked as boolean)}
              />
              Shift work
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition-colors">
              <Checkbox 
                id="shift-method" 
                checked={employmentType.shiftMethod}
                onCheckedChange={(checked) => handleEmploymentTypeChange('shiftMethod', checked as boolean)}
              />
              Shift method
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
