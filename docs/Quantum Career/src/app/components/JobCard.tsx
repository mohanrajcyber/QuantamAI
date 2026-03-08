import { Bookmark, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface JobCardProps {
  id: string;
  date: string;
  company: string;
  logo: string;
  logoColor: string;
  title: string;
  tags: string[];
  salary: string;
  location: string;
  bgColor: string;
  easyApply?: boolean;
  onDetailsClick: () => void;
  onSaveToggle: () => void;
  isSaved: boolean;
  accessToken: string | null;
}

export function JobCard({ 
  date, 
  company, 
  logo, 
  logoColor, 
  title, 
  tags, 
  salary, 
  location, 
  bgColor,
  easyApply = false,
  onDetailsClick,
  onSaveToggle,
  isSaved,
  accessToken
}: JobCardProps) {
  return (
    <div 
      className="rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative"
      style={{ backgroundColor: bgColor }}
    >
      {/* Easy Apply Badge */}
      {easyApply && (
        <div className="absolute top-4 right-16 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Easy Apply
        </div>
      )}

      {/* Date and Bookmark */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-700">{date}</span>
        <button 
          className={`transition-colors ${isSaved ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={onSaveToggle}
          disabled={!accessToken}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-500' : ''}`} />
        </button>
      </div>

      {/* Company and Logo */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: logoColor }}
        >
          {logo}
        </div>
        <span className="text-sm text-gray-600">{company}</span>
      </div>

      {/* Job Title */}
      <h3 className="text-xl text-gray-900 mb-4">{title}</h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="bg-white/60 text-gray-700 hover:bg-white/80 border-0"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Salary and Details Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-900">{salary}</div>
          <div className="text-sm text-gray-600">{location}</div>
        </div>
        <Button 
          onClick={onDetailsClick}
          className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
        >
          Details
        </Button>
      </div>
    </div>
  );
}