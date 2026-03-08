import { useState, useRef, useEffect } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import type { Node } from './WorkflowCanvas';

interface WorkflowNodeProps {
  node: Node;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (nodeId: string, deltaX: number, deltaY: number) => void;
  onDelete: (nodeId: string) => void;
}

export function WorkflowNode({ node, isSelected, onSelect, onDrag, onDelete }: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        onDrag(node.id, deltaX, deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, node.id, onDrag]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onSelect();
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move transition-all ${
        isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0a1628]' : ''
      } ${isDragging ? 'scale-105 shadow-2xl' : 'shadow-lg'}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: isDragging ? 'rotate(2deg)' : 'rotate(0deg)'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-64 bg-[#1a2539] border border-gray-700/50 rounded-xl overflow-hidden">
        {/* Node Header */}
        <div className={`bg-gradient-to-r ${node.color} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{node.icon}</div>
              <div>
                <h4 className="font-semibold text-white text-sm">{node.title}</h4>
                <p className="text-xs text-white/80">{node.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Node Body */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 capitalize">{node.type} Node</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="p-1.5 hover:bg-red-600/20 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a1628] cursor-pointer hover:scale-125 transition-transform"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a1628] cursor-pointer hover:scale-125 transition-transform"></div>
      </div>
    </div>
  );
}
