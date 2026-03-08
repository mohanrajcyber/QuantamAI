import { useState, useRef } from 'react';
import { Plus, Sparkles, Zap, Settings, X } from 'lucide-react';
import { WorkflowNode } from './WorkflowNode';
import { NodeLibrary } from './NodeLibrary';

interface WorkflowCanvasProps {
  templateId: string | null;
  onBack: () => void;
}

export interface Node {
  id: string;
  type: 'trigger' | 'ai' | 'action' | 'condition';
  title: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  connections: string[];
}

export function WorkflowCanvas({ templateId, onBack }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeLibrary, setShowNodeLibrary] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddNode = (nodeType: Node['type']) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: nodeType,
      title: getNodeTitle(nodeType),
      description: getNodeDescription(nodeType),
      x: 400,
      y: 200 + nodes.length * 150,
      icon: getNodeIcon(nodeType),
      color: getNodeColor(nodeType),
      connections: []
    };
    
    setNodes([...nodes, newNode]);
    setShowNodeLibrary(false);
  };

  const handleNodeDrag = (nodeId: string, deltaX: number, deltaY: number) => {
    setNodes(nodes.map(node => 
      node.id === nodeId
        ? { ...node, x: node.x + deltaX, y: node.y + deltaY }
        : node
    ));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  };

  const getNodeTitle = (type: Node['type']): string => {
    switch (type) {
      case 'trigger': return 'Trigger';
      case 'ai': return 'AI Process';
      case 'action': return 'Action';
      case 'condition': return 'Condition';
    }
  };

  const getNodeDescription = (type: Node['type']): string => {
    switch (type) {
      case 'trigger': return 'Start workflow';
      case 'ai': return 'AI processing';
      case 'action': return 'Execute action';
      case 'condition': return 'Check condition';
    }
  };

  const getNodeIcon = (type: Node['type']): string => {
    switch (type) {
      case 'trigger': return '⚡';
      case 'ai': return '🤖';
      case 'action': return '🎯';
      case 'condition': return '🔀';
    }
  };

  const getNodeColor = (type: Node['type']): string => {
    switch (type) {
      case 'trigger': return 'from-yellow-500 to-orange-500';
      case 'ai': return 'from-blue-500 to-purple-500';
      case 'action': return 'from-green-500 to-emerald-500';
      case 'condition': return 'from-pink-500 to-rose-500';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 relative bg-[#0a1628] overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-lime-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <Plus className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">Start Building Your Workflow</h3>
              <p className="text-gray-400 mb-6">Add nodes from the library or use a template</p>
              <button
                onClick={() => setShowNodeLibrary(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-medium"
              >
                Add First Step
              </button>
            </div>
          </div>
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            onSelect={() => setSelectedNode(node.id)}
            onDrag={handleNodeDrag}
            onDelete={handleDeleteNode}
          />
        ))}

        {/* Floating Add Button */}
        {nodes.length > 0 && (
          <button
            onClick={() => setShowNodeLibrary(true)}
            className="absolute bottom-8 right-8 w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-110"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Node Library Sidebar */}
      {showNodeLibrary && (
        <NodeLibrary
          onAddNode={handleAddNode}
          onClose={() => setShowNodeLibrary(false)}
        />
      )}

      {/* Node Properties Panel */}
      {selectedNode && (
        <div className="w-80 bg-[#1a2539] border-l border-gray-800/50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Node Properties</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;

            return (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Node Type</label>
                  <div className="px-3 py-2 bg-[#0f1c2e] rounded-lg text-gray-200 capitalize">
                    {node.type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={node.title}
                    onChange={(e) => {
                      setNodes(nodes.map(n =>
                        n.id === selectedNode ? { ...n, title: e.target.value } : n
                      ));
                    }}
                    className="w-full px-3 py-2 bg-[#0f1c2e] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={node.description}
                    onChange={(e) => {
                      setNodes(nodes.map(n =>
                        n.id === selectedNode ? { ...n, description: e.target.value } : n
                      ));
                    }}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0f1c2e] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {node.type === 'ai' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">AI Model</label>
                      <select className="w-full px-3 py-2 bg-[#0f1c2e] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500">
                        <option>GPT-4</option>
                        <option>GPT-3.5</option>
                        <option>Claude</option>
                        <option>Gemini</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Temperature</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.7"
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={() => handleDeleteNode(selectedNode)}
                  className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  Delete Node
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
