import { Play, Clock, GitBranch, TrendingUp, Sparkles } from 'lucide-react';

interface WorkflowTemplatesProps {
  onCreateNew: () => void;
  onSelectTemplate: (templateId: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  steps: number;
  icon: string;
}

export function WorkflowTemplates({ onCreateNew, onSelectTemplate }: WorkflowTemplatesProps) {
  const templates: Template[] = [
    {
      id: 'content-creation',
      name: 'Content Creation Pipeline',
      description: 'Generate blog posts, social media content, and marketing copy',
      category: 'content',
      duration: '10 min',
      steps: 3,
      icon: '📝'
    },
    {
      id: 'code-review',
      name: 'Code Review & Analysis',
      description: 'Automated code review, bug detection, and optimization suggestions',
      category: 'development',
      duration: '7 min',
      steps: 3,
      icon: '🔍'
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis & Insights',
      description: 'Extract insights from data and generate reports',
      category: 'analytics',
      duration: '15 min',
      steps: 3,
      icon: '📊'
    },
    {
      id: 'creative-writing',
      name: 'Creative Writing Assistant',
      description: 'Story development, character creation, and plot generation',
      category: 'creative',
      duration: '20 min',
      steps: 3,
      icon: '✨'
    }
  ];

  const categories = [
    { id: 'content', name: 'Content', color: 'emerald' },
    { id: 'development', name: 'Development', color: 'blue' },
    { id: 'analytics', name: 'Analytics', color: 'purple' },
    { id: 'creative', name: 'Creative', color: 'pink' }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-4 py-2 bg-[#1a2539] hover:bg-[#1f2d42] border border-gray-700 rounded-lg whitespace-nowrap transition-colors text-sm"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Workflow Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer group"
                  onClick={() => onSelectTemplate(template.id)}
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2 group-hover:text-emerald-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>{template.steps} steps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{template.duration}</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm">
                    <Play className="w-4 h-4" />
                    <span>Run Workflow</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Stats */}
          <div className="space-y-6">
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-gray-200">Execution Status</h3>
              </div>
              
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select and run a workflow to see results</p>
              </div>
            </div>

            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Workflows</span>
                  <span className="text-gray-200 font-semibold">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Executions Today</span>
                  <span className="text-emerald-400 font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-emerald-400 font-semibold">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Duration</span>
                  <span className="text-gray-200 font-semibold">7.2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
