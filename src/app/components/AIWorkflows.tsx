import { useState } from 'react';
import { ArrowLeft, Plus, Play, Save, Search, Settings as SettingsIcon } from 'lucide-react';

interface AIWorkflowsProps {
  onBack?: () => void;
}

interface Node {
  id: string;
  type: 'trigger' | 'ai' | 'action' | 'condition';
  title: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

export function AIWorkflows({ onBack }: AIWorkflowsProps) {
  const [nodes] = useState<Node[]>([
    {
      id: 'start',
      type: 'trigger',
      title: 'Add first step...',
      x: 300,
      y: 200,
      icon: '➕',
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'ai',
      type: 'ai',
      title: 'Build with AI',
      x: 480,
      y: 200,
      icon: '🤖',
      color: 'from-purple-600 to-blue-600'
    }
  ]);
  
  const [showTriggerPanel, setShowTriggerPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  return (
    <div 
      className="flex-1 flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: '#0f1c2e',
        backdropFilter: 'none'
      }}
    >
      {/* Top Header */}
      <div 
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{
          backgroundColor: 'rgba(10, 22, 40, 0.95)',
          borderColor: 'rgba(75, 85, 99, 0.5)',
          backdropFilter: 'none'
        }}
      >
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm text-white">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm font-medium text-white">
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Nodes */}
        <div 
          className="w-16 border-r flex flex-col items-center py-4 gap-3"
          style={{
            backgroundColor: '#0a1628',
            borderColor: 'rgba(75, 85, 99, 0.5)',
            backdropFilter: 'none'
          }}
        >
          <button
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors text-white"
            title="Add Node"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors" title="Search">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-10 h-10 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors" title="Settings">
            <SettingsIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            backgroundColor: '#0a1628',
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backdropFilter: 'none'
          }}
        >
          {/* Nodes */}
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
              onClick={() => {
                if (node.id === 'start') setShowTriggerPanel(true);
                if (node.id === 'ai') setShowAIPanel(true);
              }}
            >
              <div className="relative">
                {/* Connection line */}
                {index > 0 && (
                  <div
                    className="absolute top-1/2 -left-16 w-16 h-0.5 bg-gray-700"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  </div>
                )}

                {/* Node Card */}
                <div 
                  className={`w-36 bg-gradient-to-br ${node.color} rounded-lg p-3 shadow-lg border border-transparent group-hover:border-emerald-500 transition-all`}
                  style={{ backdropFilter: 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{node.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-xs">{node.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Connection Points */}
                <div 
                  className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ border: '2px solid #0a1628' }}
                ></div>
                <div 
                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ border: '2px solid #0a1628' }}
                ></div>
              </div>
            </div>
          ))}

          {/* "or" text between nodes */}
          <div
            className="absolute text-gray-500 text-xs"
            style={{ 
              left: '390px', 
              top: '200px', 
              transform: 'translate(-50%, -50%)',
              zIndex: 5
            }}
          >
            or
          </div>
        </div>

        {/* Right Sidebar - Trigger Panel */}
        {showTriggerPanel && (
          <div 
            className="w-80 border-l overflow-y-auto"
            style={{
              backgroundColor: '#1a2539',
              borderColor: 'rgba(75, 85, 99, 0.5)',
              backdropFilter: 'none'
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200">What triggers this workflow?</h3>
                <button
                  onClick={() => setShowTriggerPanel(false)}
                  className="text-gray-400 hover:text-gray-200 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  style={{
                    backgroundColor: '#0f1c2e',
                    borderColor: '#374151'
                  }}
                />
              </div>

              <div className="space-y-2">
                {[
                  { icon: '⚡', title: 'Trigger manually', desc: 'Runs the flow on clicking a button in n8n. Good for getting started quickly' },
                  { icon: '📱', title: 'On app event', desc: 'Runs the flow when something happens in an app like Telegram, Notion or Airtable' },
                  { icon: '⏰', title: 'On a schedule', desc: 'Runs the flow every day, hour, or custom interval' },
                  { icon: '🌐', title: 'On webhook call', desc: 'Runs the flow on receiving an HTTP request' },
                  { icon: '📝', title: 'On form submission', desc: 'Generate webforms in n8n and pass their responses to the workflow' },
                  { icon: '🔄', title: 'When executed by another workflow', desc: 'Runs the flow when called by the Execute Workflow node from a different workflow' }
                ].map((trigger, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 border rounded-lg transition-all group hover:border-emerald-500/50"
                    style={{
                      backgroundColor: '#0f1c2e',
                      borderColor: 'rgba(75, 85, 99, 0.5)'
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="text-lg">{trigger.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-200 mb-0.5 group-hover:text-emerald-400 transition-colors">
                          {trigger.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-tight">{trigger.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar - AI Panel */}
        {showAIPanel && (
          <div 
            className="w-80 border-l overflow-y-auto"
            style={{
              backgroundColor: '#1a2539',
              borderColor: 'rgba(75, 85, 99, 0.5)',
              backdropFilter: 'none'
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200">What would you like to automate?</h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-400 hover:text-gray-200 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {[
                  'Summarize emails with AI',
                  'Daily weather report',
                  'Invoice processing pipeline',
                  'RAG knowledge assistant',
                  'Lead qualification and call scheduling',
                  'Multi agent research workflow',
                  'Daily AI news digest',
                  'YouTube video chapters'
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2.5 border rounded-lg transition-all text-sm text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50"
                    style={{
                      backgroundColor: '#0f1c2e',
                      borderColor: 'rgba(75, 85, 99, 0.5)'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
