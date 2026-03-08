import { X, Zap, Sparkles, Target, GitBranch, Search } from 'lucide-react';
import { useState } from 'react';
import type { Node } from './WorkflowCanvas';

interface NodeLibraryProps {
  onAddNode: (type: Node['type']) => void;
  onClose: () => void;
}

interface NodeType {
  type: Node['type'];
  title: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

export function NodeLibrary({ onAddNode, onClose }: NodeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const nodeTypes: NodeType[] = [
    {
      type: 'trigger',
      title: 'Trigger',
      description: 'Start your workflow with a trigger event',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      examples: ['Manual trigger', 'Schedule', 'Webhook', 'On app event']
    },
    {
      type: 'ai',
      title: 'AI Process',
      description: 'Use AI to process, analyze, or generate content',
      icon: '🤖',
      color: 'from-blue-500 to-purple-500',
      examples: ['Text generation', 'Code analysis', 'Data insights', 'Translation']
    },
    {
      type: 'action',
      title: 'Action',
      description: 'Execute an action or send data somewhere',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
      examples: ['Send email', 'Save to database', 'API call', 'Create file']
    },
    {
      type: 'condition',
      title: 'Condition',
      description: 'Add conditional logic to your workflow',
      icon: '🔀',
      color: 'from-pink-500 to-rose-500',
      examples: ['If/else', 'Switch', 'Filter', 'Loop']
    }
  ];

  const filteredNodes = nodeTypes.filter(node =>
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-96 bg-[#1a2539] border-l border-gray-800/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Node Library</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-4 py-2 bg-[#0f1c2e] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredNodes.map((nodeType) => (
          <div
            key={nodeType.type}
            onClick={() => onAddNode(nodeType.type)}
            className="bg-[#0f1c2e] border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${nodeType.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                {nodeType.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-200 mb-1 group-hover:text-emerald-400 transition-colors">
                  {nodeType.title}
                </h4>
                <p className="text-xs text-gray-400">{nodeType.description}</p>
              </div>
            </div>

            {/* Examples */}
            <div className="flex flex-wrap gap-1.5">
              {nodeType.examples.map((example, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filteredNodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No nodes found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800/50">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-1">Pro Tip</h4>
              <p className="text-xs text-gray-400">
                Drag nodes onto the canvas and connect them to build your workflow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
