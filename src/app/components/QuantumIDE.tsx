import { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, File, Play, Save, Download, Settings, Terminal, 
  Plus, X, Code, FileText, Loader2, CheckCircle, AlertCircle,
  ChevronRight, ChevronDown, Sparkles
} from 'lucide-react';
import { generateCode, AIProvider } from '../services/aiService';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  expanded?: boolean;
}

export function QuantumIDE() {
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'index.js', type: 'file', content: '// Welcome to Quantum IDE\nconsole.log("Hello World!");' },
        { name: 'App.jsx', type: 'file', content: 'function App() {\n  return <div>Hello React!</div>;\n}' },
        { name: 'styles.css', type: 'file', content: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}' },
      ],
    },
    {
      name: 'public',
      type: 'folder',
      expanded: false,
      children: [
        { name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<body>\n  <div id="root"></div>\n</body>\n</html>' },
      ],
    },
    { name: 'package.json', type: 'file', content: '{\n  "name": "quantum-project",\n  "version": "1.0.0"\n}' },
    { name: 'README.md', type: 'file', content: '# Quantum IDE Project\n\nWelcome to your new project!' },
  ]);

  const [openTabs, setOpenTabs] = useState<string[]>(['src/index.js']);
  const [activeTab, setActiveTab] = useState('src/index.js');
  const [activeContent, setActiveContent] = useState('// Welcome to Quantum IDE\nconsole.log("Hello World!");');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Quantum IDE Terminal v1.0.0', 'Type "help" for available commands', '']);
  const [terminalInput, setTerminalInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [saved, setSaved] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [provider] = useState<AIProvider>('groq');
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const toggleFolder = (path: string) => {
    const updateFolder = (nodes: FileNode[], targetPath: string[]): FileNode[] => {
      return nodes.map(node => {
        if (node.name === targetPath[0]) {
          if (targetPath.length === 1 && node.type === 'folder') {
            return { ...node, expanded: !node.expanded };
          } else if (node.children) {
            return { ...node, children: updateFolder(node.children, targetPath.slice(1)) };
          }
        }
        return node;
      });
    };
    setFiles(updateFolder(files, path.split('/')));
  };

  const findFile = (nodes: FileNode[], path: string): FileNode | null => {
    const parts = path.split('/');
    let current: FileNode[] = nodes;
    
    for (let i = 0; i < parts.length; i++) {
      const node = current.find(n => n.name === parts[i]);
      if (!node) return null;
      if (i === parts.length - 1) return node;
      if (node.children) current = node.children;
      else return null;
    }
    return null;
  };

  const openFile = (path: string) => {
    const file = findFile(files, path);
    if (file && file.type === 'file') {
      if (!openTabs.includes(path)) {
        setOpenTabs([...openTabs, path]);
      }
      setActiveTab(path);
      setActiveContent(file.content || '');
      setSaved(true);
    }
  };

  const closeTab = (path: string) => {
    const newTabs = openTabs.filter(t => t !== path);
    setOpenTabs(newTabs);
    if (activeTab === path && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
      const file = findFile(files, newTabs[newTabs.length - 1]);
      if (file) setActiveContent(file.content || '');
    }
  };

  const handleContentChange = (newContent: string) => {
    setActiveContent(newContent);
    setSaved(false);
  };

  const saveFile = () => {
    const updateFile = (nodes: FileNode[], targetPath: string[], content: string): FileNode[] => {
      return nodes.map(node => {
        if (node.name === targetPath[0]) {
          if (targetPath.length === 1 && node.type === 'file') {
            return { ...node, content };
          } else if (node.children) {
            return { ...node, children: updateFile(node.children, targetPath.slice(1), content) };
          }
        }
        return node;
      });
    };
    
    setFiles(updateFile(files, activeTab.split('/'), activeContent));
    setSaved(true);
    addTerminalOutput(`✓ Saved: ${activeTab}`);
  };

  const runCode = () => {
    setIsRunning(true);
    addTerminalOutput(`> Running ${activeTab}...`);
    
    setTimeout(() => {
      try {
        if (activeTab.endsWith('.js') || activeTab.endsWith('.jsx')) {
          // Simulate JavaScript execution
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => logs.push(args.join(' ')),
          };
          
          // Basic simulation - in real app, use a proper sandbox
          if (activeContent.includes('console.log')) {
            const matches = activeContent.match(/console\.log\((.*?)\)/g);
            matches?.forEach(match => {
              const content = match.replace('console.log(', '').replace(')', '');
              logs.push(eval(content));
            });
          }
          
          logs.forEach(log => addTerminalOutput(log));
          addTerminalOutput('✓ Execution completed');
        } else {
          addTerminalOutput('⚠ File type not supported for execution');
        }
      } catch (error) {
        addTerminalOutput(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      setIsRunning(false);
    }, 500);
  };

  const addTerminalOutput = (output: string) => {
    setTerminalOutput(prev => [...prev, output]);
  };

  const handleTerminalCommand = (cmd: string) => {
    addTerminalOutput(`$ ${cmd}`);
    
    const [command, ...args] = cmd.trim().split(' ');
    
    switch (command) {
      case 'help':
        addTerminalOutput('Available commands:');
        addTerminalOutput('  help     - Show this help message');
        addTerminalOutput('  clear    - Clear terminal');
        addTerminalOutput('  ls       - List files');
        addTerminalOutput('  run      - Run current file');
        addTerminalOutput('  save     - Save current file');
        break;
      case 'clear':
        setTerminalOutput(['']);
        break;
      case 'ls':
        files.forEach(f => addTerminalOutput(`  ${f.type === 'folder' ? '📁' : '📄'} ${f.name}`));
        break;
      case 'run':
        runCode();
        break;
      case 'save':
        saveFile();
        break;
      default:
        addTerminalOutput(`Command not found: ${command}`);
    }
  };

  const generateAICode = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    try {
      const language = activeTab.split('.').pop() || 'javascript';
      const result = await generateCode(aiPrompt, language, provider);
      setActiveContent(result);
      setSaved(false);
      addTerminalOutput('✓ AI code generated successfully');
      setAiPrompt('');
    } catch (error) {
      addTerminalOutput(`✗ AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const renderFileTree = (nodes: FileNode[], path = ''): JSX.Element[] => {
    return nodes.map((node, index) => {
      const fullPath = path ? `${path}/${node.name}` : node.name;
      const isActive = activeTab === fullPath;
      
      return (
        <div key={index}>
          <button
            onClick={() => node.type === 'folder' ? toggleFolder(fullPath) : openFile(fullPath)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800/50 transition-colors ${
              isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
            }`}
          >
            {node.type === 'folder' && (
              node.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
            {node.type === 'folder' ? <FolderOpen className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            <span>{node.name}</span>
          </button>
          {node.type === 'folder' && node.expanded && node.children && (
            <div className="ml-4">
              {renderFileTree(node.children, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#0f1c2e]">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-[#0a1628]/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Quantum IDE</h1>
              <p className="text-xs text-gray-400">Full-featured development environment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveFile}
              disabled={saved}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 border border-blue-500/30 rounded-lg text-sm transition-colors"
            >
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm transition-colors"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* File Explorer */}
        <div className="w-64 border-r border-gray-800/50 flex flex-col bg-[#0a1628]">
          <div className="p-3 border-b border-gray-800/50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">EXPLORER</span>
            <button className="p-1 hover:bg-gray-800/50 rounded">
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderFileTree(files)}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-800/50 bg-[#0a1628] overflow-x-auto">
            {openTabs.map((tab, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0f1c2e] text-gray-200'
                    : 'bg-transparent text-gray-400 hover:bg-gray-800/30'
                }`}
              >
                <button onClick={() => openFile(tab)} className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{tab.split('/').pop()}</span>
                </button>
                <button
                  onClick={() => closeTab(tab)}
                  className="hover:bg-gray-700/50 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* AI Assistant Bar */}
          <div className="border-b border-gray-800/50 bg-[#1a2539]/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateAICode()}
                placeholder="Ask AI to generate code..."
                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={generateAICode}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-sm transition-colors"
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              ref={editorRef}
              value={activeContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full bg-[#0f1c2e] text-gray-300 px-6 py-4 font-mono text-sm focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Terminal */}
          <div className="h-48 border-t border-gray-800/50 flex flex-col bg-[#0a1628]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">TERMINAL</span>
              </div>
              <button
                onClick={() => setTerminalOutput([''])}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div ref={terminalRef} className="flex-1 overflow-y-auto px-4 py-2 font-mono text-sm">
              {terminalOutput.map((line, i) => (
                <div key={i} className="text-gray-300">
                  {line}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-800/50">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTerminalCommand(terminalInput);
                    setTerminalInput('');
                  }
                }}
                className="flex-1 bg-transparent text-gray-300 font-mono text-sm focus:outline-none"
                placeholder="Type a command..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
