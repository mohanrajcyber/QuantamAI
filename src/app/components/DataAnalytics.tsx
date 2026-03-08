import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Database, Download, Filter, ArrowLeft, Activity } from 'lucide-react';

interface DataAnalyticsProps {
  onBack?: () => void;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function DataAnalytics({ onBack }: DataAnalyticsProps) {
  const [selectedChart, setSelectedChart] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', name: 'Pie Chart', icon: PieChart },
    { id: 'trend', name: 'Trend Analysis', icon: TrendingUp },
    { id: 'activity', name: 'Activity Monitor', icon: Activity },
  ];

  const mockData = {
    bar: [
      { name: 'AI Requests', value: 1247, color: '#3B82F6' },
      { name: 'Code Generation', value: 892, color: '#8B5CF6' },
      { name: 'Image Creation', value: 634, color: '#EC4899' },
      { name: 'Voice Queries', value: 445, color: '#10B981' },
      { name: 'Document Analysis', value: 321, color: '#F59E0B' },
    ],
    pie: [
      { name: 'OpenAI', value: 35, color: '#3B82F6' },
      { name: 'Ollama', value: 28, color: '#8B5CF6' },
      { name: 'Groq', value: 20, color: '#EC4899' },
      { name: 'Gemini', value: 12, color: '#10B981' },
      { name: 'Mock AI', value: 5, color: '#F59E0B' },
    ],
    trend: [
      { name: 'Jan', value: 400, color: '#3B82F6' },
      { name: 'Feb', value: 600, color: '#3B82F6' },
      { name: 'Mar', value: 800, color: '#3B82F6' },
      { name: 'Apr', value: 1200, color: '#3B82F6' },
      { name: 'May', value: 1600, color: '#3B82F6' },
    ],
    activity: [
      { name: 'Active Users', value: 2847, color: '#10B981' },
      { name: 'API Calls', value: 15632, color: '#3B82F6' },
      { name: 'Success Rate', value: 98.7, color: '#8B5CF6' },
      { name: 'Avg Response', value: 1.2, color: '#EC4899' },
    ]
  };

  useEffect(() => {
    loadData();
  }, [selectedChart]);

  const loadData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(mockData[selectedChart as keyof typeof mockData]);
    setIsLoading(false);
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (selectedChart === 'bar') {
      return (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-300">{item.name}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                    backgroundColor: item.color
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xs text-white font-medium">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedChart === 'pie') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0);
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={-strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                );
              })}
            </svg>
          </div>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-300">{item.name}</span>
                <span className="text-gray-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-2" style={{ color: item.color }}>
              {selectedChart === 'activity' && item.name.includes('Rate') ? `${item.value}%` :
               selectedChart === 'activity' && item.name.includes('Response') ? `${item.value}s` :
               item.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">{item.name}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Back Button */}
      {onBack && (
        <div className="sticky top-0 z-20 bg-[#0f1c2e]/80 backdrop-blur-sm border-b border-gray-800/50 px-8 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            Data Analytics
          </h1>
          <p className="text-gray-400">AI usage insights and performance metrics</p>
        </div>

        {/* Chart Type Selection */}
        <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Analytics Dashboard</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select className="bg-[#0f1c2e] border border-gray-600 rounded-lg px-3 py-2 text-gray-200 text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Today</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedChart(type.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    selectedChart === type.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-gray-300">{type.name}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#0f1c2e] rounded-lg p-6">
            {renderChart()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-cyan-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Total Requests</h3>
                <p className="text-2xl font-bold text-cyan-400">24,847</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400">↗ +12.5%</span> from last month
            </div>
          </div>

          <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Success Rate</h3>
                <p className="text-2xl font-bold text-green-400">98.7%</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-green-400">↗ +2.1%</span> from last month
            </div>
          </div>

          <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Avg Response</h3>
                <p className="text-2xl font-bold text-purple-400">1.2s</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-red-400">↘ -0.3s</span> from last month
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Export Data</h2>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}