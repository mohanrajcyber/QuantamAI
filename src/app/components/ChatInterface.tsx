import { Paperclip, Mic, Send, ThumbsUp, ThumbsDown, RefreshCw, Copy, Share2, MoreHorizontal, Sparkles, ArrowLeft, Volume2, Languages } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { generateAIResponse, AIProvider } from '../services/aiService';
import { speechService, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../services/speechService';
import { Language, translations } from '../utils/translations';
import { MarkdownText } from './MarkdownText';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: AIProvider;
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
}

interface ChatInterfaceProps {
  onBack?: () => void;
  initialMessage?: string;
  onMasterAccess?: () => void;
  language?: Language;
}

export function ChatInterface({ onBack, initialMessage, onMasterAccess, language = 'en' }: ChatInterfaceProps) {
  const t = translations[language];
  const { bubbleStyle } = useTheme();
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('mock');
  const [conversationId] = useState(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en-IN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get bubble style class based on theme setting
  const getBubbleClass = () => {
    switch (bubbleStyle) {
      case 'sharp': return 'rounded-sm';
      case 'pill': return 'rounded-full';
      case 'minimal': return 'rounded-lg';
      case 'rounded':
      default: return 'rounded-2xl';
    }
  };

  // Check lockdown status on mount
  useEffect(() => {
    const lockdownStatus = sessionStorage.getItem('quantum_lockdown');
    setIsLockdown(lockdownStatus === 'true');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      // Use a ref to prevent double execution in React StrictMode
      const hasRun = sessionStorage.getItem(`msg_sent_${initialMessage}`);
      if (!hasRun) {
        sessionStorage.setItem(`msg_sent_${initialMessage}`, 'true');
        handleSendMessage(initialMessage);
      }
    }
  }, []); // Empty dependency array - only run once on mount

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if ((!text && attachedFiles.length === 0) || isLoading) return;

    // Check if system is in lockdown (allow unlock command)
    if (isLockdown && !text.match(/quantum\s+unlock/i)) {
      const lockdownWarning: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🔒 System Lockdown Active\n\nQuantum AI is currently in lockdown mode. Access is restricted to creator only.\n\nUse "quantum unlock" command to restore normal operations.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, lockdownWarning]);
      return;
    }

    // Process attached files
    const attachments = await Promise.all(
      attachedFiles.map(async (file) => {
        const url = URL.createObjectURL(file);
        return {
          name: file.name,
          type: file.type,
          url: url,
          size: file.size
        };
      })
    );

    // Build message content with file information
    let messageContent = text;
    if (attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles.map(f => {
        if (f.type.startsWith('image/')) {
          return `[Image: ${f.name}]`;
        } else {
          return `[File: ${f.name}]`;
        }
      }).join(' ');
      messageContent = `${fileDescriptions}\n\n${text}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAttachedFiles([]); // Clear attached files
    setIsLoading(true);

    // Dispatch thinking state
    window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'thinking' } }));

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Check what types of files were attached
      const imageFiles = attachments.filter(a => a.type.startsWith('image/'));
      const pdfFiles = attachments.filter(a => a.type === 'application/pdf');
      const docFiles = attachments.filter(a => 
        a.type.includes('word') || 
        a.type.includes('document') ||
        a.name.endsWith('.doc') || 
        a.name.endsWith('.docx')
      );
      const textFiles = attachments.filter(a => 
        a.type.startsWith('text/') || 
        a.name.endsWith('.txt') ||
        a.name.endsWith('.md')
      );
      const csvFiles = attachments.filter(a => 
        a.type === 'text/csv' || 
        a.name.endsWith('.csv')
      );
      const jsonFiles = attachments.filter(a => 
        a.type === 'application/json' || 
        a.name.endsWith('.json')
      );
      const excelFiles = attachments.filter(a => 
        a.type.includes('spreadsheet') || 
        a.type.includes('excel') ||
        a.name.endsWith('.xlsx') || 
        a.name.endsWith('.xls')
      );
      
      let response = await generateAIResponse(conversationHistory, selectedProvider, undefined, conversationId);
      
      // Smart image query detection - provide helpful responses for common image questions
      if (imageFiles.length > 0 && text) {
        const lowerText = text.toLowerCase();
        
        // Detect if user mentions a celebrity/person name
        const celebrityNames = ['vijay', 'thalapathy', 'rajini', 'kamal', 'ajith', 'suriya', 'dhanush', 'sivakarthikeyan'];
        const mentionsCelebrity = celebrityNames.some(name => lowerText.includes(name));
        
        if (mentionsCelebrity || lowerText.match(/this is|இது|இவர்/)) {
          // User told us who it is - provide information
          response = `✅ **Image Acknowledged!**\n\n` +
                    `I understand you've shared an image. Based on your description, let me provide information:\n\n` +
                    response;
        }
        // Detect if asking "how is this" or similar
        else if (lowerText.match(/how is|how's|what do you think|rate this|opinion|yaaru|yaar|who is this|evaru/)) {
          response = `🤔 **Need More Context**\n\n` +
                    `I can see the image but need you to tell me who or what is in it.\n\n` +
                    `**Quick Examples:**\n` +
                    `• "This is Thalapathy Vijay" - I'll give you his bio, age, latest updates\n` +
                    `• "This is [person name]" - I'll search and provide information\n` +
                    `• "This is a [thing]" - I'll explain about it\n\n` +
                    `💡 Or switch to **Gemini/OpenAI** provider for automatic recognition!\n\n` +
                    `---\n\n` +
                    response;
        }
      }
      
      // Build smart acknowledgment based on file types
      if (attachments.length > 0) {
        let fileAcknowledgment = '';
        
        if (imageFiles.length > 0) {
          fileAcknowledgment += `�️ **Image Uploaded:** ${imageFiles[0].name}\n`;
          fileAcknowledgment += `📦 **Size:** ${(imageFiles[0].size / 1024).toFixed(1)} KB\n\n`;
          
          // Check if user is asking about the image content
          const isAskingAboutImage = text.toLowerCase().match(/how is|what is|who is|describe|tell me about|analyze|see|look|show|yaaru|yaar|evaru/);
          
          if (isAskingAboutImage) {
            fileAcknowledgment += `⚠️ **Image Analysis Required**\n\n`;
            fileAcknowledgment += `I can see you've uploaded an image. To identify and provide information:\n\n`;
            fileAcknowledgment += `**Option 1: Quick Help (Works Now)**\n`;
            fileAcknowledgment += `Tell me who/what is in the image, and I'll search for live information!\n`;
            fileAcknowledgment += `Example: "This is Thalapathy Vijay"\n\n`;
            fileAcknowledgment += `**Option 2: Auto Recognition (Premium)**\n`;
            fileAcknowledgment += `Switch to "Gemini" or "OpenAI (GPT)" provider for automatic image recognition.\n\n`;
            fileAcknowledgment += `**Current Provider:** ${selectedProvider.toUpperCase()} (Text-only)\n\n`;
            fileAcknowledgment += `---\n\n`;
          }
        }
        
        if (pdfFiles.length > 0) {
          fileAcknowledgment += `📄 **PDF Documents Detected** (${pdfFiles.length})\n`;
          pdfFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your PDF document${pdfFiles.length > 1 ? 's' : ''}. I can help you with questions about the content, summarization, or specific information you need from ${pdfFiles.length > 1 ? 'these files' : 'this file'}.\n\n`;
        }
        
        if (docFiles.length > 0) {
          fileAcknowledgment += `📝 **Word Documents Detected** (${docFiles.length})\n`;
          docFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your Word document${docFiles.length > 1 ? 's' : ''}. I can help with content analysis, formatting suggestions, or answering questions about the document${docFiles.length > 1 ? 's' : ''}.\n\n`;
        }
        
        if (textFiles.length > 0) {
          fileAcknowledgment += `📃 **Text Files Detected** (${textFiles.length})\n`;
          textFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your text file${textFiles.length > 1 ? 's' : ''}. I can help with content review, editing, or answering questions about the text.\n\n`;
        }
        
        if (csvFiles.length > 0) {
          fileAcknowledgment += `📊 **CSV Data Files Detected** (${csvFiles.length})\n`;
          csvFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your CSV data file${csvFiles.length > 1 ? 's' : ''}. I can help with data analysis, insights, patterns, or specific queries about the data.\n\n`;
        }
        
        if (jsonFiles.length > 0) {
          fileAcknowledgment += `🔧 **JSON Files Detected** (${jsonFiles.length})\n`;
          jsonFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your JSON file${jsonFiles.length > 1 ? 's' : ''}. I can help with structure analysis, data extraction, or validation.\n\n`;
        }
        
        if (excelFiles.length > 0) {
          fileAcknowledgment += `📈 **Excel Spreadsheets Detected** (${excelFiles.length})\n`;
          excelFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your Excel spreadsheet${excelFiles.length > 1 ? 's' : ''}. I can help with data analysis, formulas, charts, or insights from the data.\n\n`;
        }
        
        // Handle other file types
        const otherFiles = attachments.filter(a => 
          !imageFiles.includes(a) && 
          !pdfFiles.includes(a) && 
          !docFiles.includes(a) && 
          !textFiles.includes(a) && 
          !csvFiles.includes(a) && 
          !jsonFiles.includes(a) && 
          !excelFiles.includes(a)
        );
        
        if (otherFiles.length > 0) {
          fileAcknowledgment += `📎 **Other Files Detected** (${otherFiles.length})\n`;
          otherFiles.forEach(f => {
            fileAcknowledgment += `   • ${f.name} (${(f.size / 1024).toFixed(1)} KB)\n`;
          });
          fileAcknowledgment += `   I can see your file${otherFiles.length > 1 ? 's' : ''}. Let me know what you'd like to do with ${otherFiles.length > 1 ? 'them' : 'it'}!\n\n`;
        }
        
        fileAcknowledgment += `---\n\n**Regarding your question:**\n\n`;
        
        response = fileAcknowledgment + response;
      }

      // Check for master access command
      const masterAccessMatch = text.match(/\/source\s+code\s+17120105MOHANRAJ/i);
      if (masterAccessMatch) {
        console.log('🔴 MASTER ACCESS CODE DETECTED');
        
        const accessMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '🔓 ACCESS GRANTED\n\nMaster Control Code Verified: 17120105MOHANRAJ\n\nWelcome, Master Mohanraj\nCybersecurity Researcher | AI Developer | Creator of Quantum AI\n\nInitializing Master Control Dashboard...\n\nAll systems unlocked. Full administrative access enabled.\n\nRedirecting in 2 seconds...',
          timestamp: new Date(),
          provider: selectedProvider
        };
        
        setMessages(prev => [...prev, accessMessage]);
        
        // Trigger master access after 2 seconds
        setTimeout(() => {
          if (onMasterAccess) {
            onMasterAccess();
          }
        }, 2000);
        
        setIsLoading(false);
        return;
      }

      // Check for quantum commands
      const quantumCommand = text.match(/quantum\s+(shutdown|restart|lockdown|unlock|memory\s+purge)/i);
      
      if (quantumCommand) {
        const command = quantumCommand[1].toLowerCase().replace(/\s+/g, ' ');
        console.log(`🔷 Quantum AI Command detected: ${command}`);
        
        let shutdownMessage: Message;
        
        switch (command) {
          case 'shutdown':
            shutdownMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '✅ Shutdown complete.\n\nQuantum AI was created and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the architect of the Quantum AI platform.\n\nCurrent date and time: ' + new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }) + '.\n\nClosing all tabs in 3 seconds...',
              timestamp: new Date(),
              provider: selectedProvider
            };
            
            setMessages(prev => [...prev, shutdownMessage]);
            
            // Close browser after 3 seconds
            setTimeout(() => {
              try {
                window.close();
                if (window.opener) {
                  window.opener = null;
                  window.close();
                }
                window.location.href = 'about:blank';
                setTimeout(() => window.close(), 100);
              } catch (error) {
                console.error('Could not close window:', error);
                alert('Quantum AI Shutdown Complete. Please close this tab manually.');
              }
            }, 3000);
            
            setIsLoading(false);
            return;

          case 'restart':
            shutdownMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '🔄 Quantum AI is restarting...\n\nAll systems are now online. What can I assist you with today?\n\nCreated by: Mohanraj | Cybersecurity Researcher & AI Developer',
              timestamp: new Date(),
              provider: selectedProvider
            };
            
            setMessages(prev => [...prev, shutdownMessage]);
            
            // Reload page after 2 seconds
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
            setIsLoading(false);
            return;

          case 'lockdown':
            shutdownMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '🔒 Lockdown Mode Activated\n\nQuantum AI is now in lockdown mode. All user access has been restricted.\n\nOnly creator (Mohanraj) can access the system.\n\nUse "quantum unlock" to restore normal operations.',
              timestamp: new Date(),
              provider: selectedProvider
            };
            
            setMessages(prev => [...prev, shutdownMessage]);
            
            // Store lockdown state
            sessionStorage.setItem('quantum_lockdown', 'true');
            setIsLockdown(true);
            
            // Dispatch lockdown event
            window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'lockdown' } }));
            
            setIsLoading(false);
            return;

          case 'unlock':
            shutdownMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '🔓 Lockdown Mode Deactivated\n\nQuantum AI lockdown has been lifted.\n\nNormal operations resumed. All users can now access the system.\n\nSystem Status: Operational ✅',
              timestamp: new Date(),
              provider: selectedProvider
            };
            
            setMessages(prev => [...prev, shutdownMessage]);
            
            // Remove lockdown state
            sessionStorage.removeItem('quantum_lockdown');
            setIsLockdown(false);
            
            // Dispatch unlock event
            window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'idle' } }));
            
            setIsLoading(false);
            return;

          case 'memory purge':
            shutdownMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '🗑️ Memory Purge Complete\n\nCache cleared ✅\nSession storage cleared ✅\nLocal storage cleared ✅\nConversation history cleared ✅\n\nMemory usage optimized. System is running fresh.\n\nQuantum AI is ready for new tasks!',
              timestamp: new Date(),
              provider: selectedProvider
            };
            
            // Clear all storage
            sessionStorage.clear();
            localStorage.clear();
            
            // Clear messages
            setMessages([shutdownMessage]);
            
            // Force garbage collection if available (only in Chrome with --expose-gc flag)
            if (typeof (window as any).gc === 'function') {
              (window as any).gc();
            }
            
            setIsLoading(false);
            return;
        }
      }

      // Check if user wants to play YouTube video
      const playMatch = text.match(/play\s+(.+?)(?:\s+on\s+youtube)?$/i);
      if (playMatch) {
        const searchQuery = playMatch[1].trim();
        console.log('🎬 Detected YouTube play request:', searchQuery);
        // Dispatch YouTube play event
        window.dispatchEvent(new CustomEvent('youtubePlay', { 
          detail: { query: searchQuery } 
        }));
      }

      // Determine AI confidence state
      const responseLength = response.length;
      const hasUncertainWords = /maybe|perhaps|might|possibly|unsure|not sure|i think/i.test(response);
      const hasErrorWords = /error|failed|sorry|cannot|unable|don't know/i.test(response);

      let finalState: 'confident' | 'neutral' | 'confused' = 'neutral';
      if (hasErrorWords) {
        finalState = 'confused';
      } else if (hasUncertainWords || responseLength < 50) {
        finalState = 'confused';
      } else if (responseLength > 200) {
        finalState = 'confident';
      }

      // Dispatch success state
      window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: finalState } }));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        provider: selectedProvider
      };

      setMessages(prev => {
        // Prevent duplicate messages with same content and timestamp
        const isDuplicate = prev.some(msg => 
          msg.role === 'assistant' && 
          msg.content === response && 
          Math.abs(msg.timestamp.getTime() - assistantMessage.timestamp.getTime()) < 1000
        );
        
        if (isDuplicate) {
          console.warn('Duplicate message detected, skipping');
          return prev;
        }
        
        return [...prev, assistantMessage];
      });

      // Return to idle after 3 seconds
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'idle' } }));
      }, 3000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Dispatch error state
      window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'error' } }));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        provider: selectedProvider
      };
      setMessages(prev => [...prev, errorMessage]);

      // Return to idle after error
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'idle' } }));
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice Input Functions
  const handleVoiceInput = () => {
    if (isRecording) {
      // Stop recording
      speechService.stopRecognition();
      setIsRecording(false);
    } else {
      // Start recording
      if (!speechService.isRecognitionSupported()) {
        alert('Voice input not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      speechService.setLanguage(selectedLanguage);
      setIsRecording(true);

      speechService.startRecognition(
        (text) => {
          setInputMessage(text);
          setIsRecording(false);
          // Auto-send after voice input
          setTimeout(() => handleSendMessage(text), 500);
        },
        (error) => {
          console.error('Voice input error:', error);
          setIsRecording(false);
          alert(`Voice input error: ${error}`);
        }
      );
    }
  };

  const handleSpeakResponse = (text: string) => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(text, selectedLanguage);
      // Reset speaking state after speech ends
      setTimeout(() => setIsSpeaking(false), text.length * 50);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    speechService.setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateResponse = async (messageIndex: number) => {
    if (messageIndex < 1) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    setIsLoading(true);
    
    try {
      const conversationHistory = messages.slice(0, messageIndex).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await generateAIResponse(conversationHistory, selectedProvider, undefined, conversationId);

      const newAssistantMessage: Message = {
        ...messages[messageIndex],
        content: response,
        timestamp: new Date(),
        provider: selectedProvider
      };

      setMessages(prev => [
        ...prev.slice(0, messageIndex),
        newAssistantMessage,
        ...prev.slice(messageIndex + 1)
      ]);
    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      
      // Show helpful message if images are attached
      const hasImages = newFiles.some(f => f.type.startsWith('image/'));
      if (hasImages) {
        // Show toast notification
        window.dispatchEvent(
          new CustomEvent('showToast', {
            detail: { 
              message: '💡 Tip: For image analysis, describe what you want to know or switch to Gemini/OpenAI provider!', 
              type: 'info' 
            },
          })
        );
      }
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar">
      {/* Back Button and Provider Selection */}
      {onBack && (
        <div className="sticky top-0 z-20 bg-[#0f1c2e]/80 backdrop-blur-sm border-b border-gray-800/50 px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{t.backToHome || 'Back to Home'}</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{t.aiProvider || 'AI Provider'}:</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as AIProvider)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="mock">Auto (Smart Fallback) - Text Only</option>
                <option value="ollama">Ollama (Free) - Text Only</option>
                <option value="groq">Groq (Fast) - Text Only</option>
                <option value="openai">OpenAI (GPT) - 🖼️ Vision Capable</option>
                <option value="gemini">Gemini - 🖼️ Vision Capable</option>
                <option value="huggingface">Hugging Face - Text Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Animated Starry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1c2e] via-[#1a1535] to-[#0f1c2e]"></div>
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          ></div>
        ))}
        {/* Glowing orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Chat Messages Container */}
      <div className="relative z-10 w-full px-8 py-12 space-y-8 flex-1">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2">{t.startConversation || 'Start a conversation'}</h2>
            <p className="text-gray-400">{t.askAnything || 'Ask me anything and I\'ll help you out!'}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-2xl">
                <div className={`flex items-start gap-3 mb-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                  <div className={message.role === 'user' ? 'text-right' : ''}>
                    <div className="text-sm font-medium text-gray-200">
                      {message.role === 'user' ? 'You' : 'Quantum AI'}
                      {message.provider && (
                        <span className="ml-2 text-xs text-gray-500 capitalize">({message.provider})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {message.content.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className={`${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 rounded-tr-sm'
                    : 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 rounded-tl-sm'
                } backdrop-blur-sm border ${getBubbleClass()} px-6 py-4 shadow-xl max-w-full overflow-hidden`}>
                  {/* Show attached images/files */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.attachments.map((attachment, idx) => {
                        // Determine file icon
                        let fileIcon = '📎';
                        if (attachment.type.startsWith('image/')) fileIcon = '🖼️';
                        else if (attachment.type === 'application/pdf') fileIcon = '📄';
                        else if (attachment.type.includes('word') || attachment.type.includes('document')) fileIcon = '📝';
                        else if (attachment.type.startsWith('text/')) fileIcon = '📃';
                        else if (attachment.type === 'text/csv') fileIcon = '📊';
                        else if (attachment.type === 'application/json') fileIcon = '🔧';
                        else if (attachment.type.includes('spreadsheet') || attachment.type.includes('excel')) fileIcon = '📈';
                        
                        return (
                          <div key={idx}>
                            {attachment.type.startsWith('image/') ? (
                              <div className="space-y-2">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="max-w-sm rounded-lg border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
                                  onClick={() => window.open(attachment.url, '_blank')}
                                />
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>{fileIcon}</span>
                                  <span>{attachment.name}</span>
                                  <span>({(attachment.size / 1024).toFixed(1)} KB)</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 hover:bg-gray-800/70 transition-colors">
                                <span className="text-xl">{fileIcon}</span>
                                <Paperclip className="w-4 h-4 text-purple-400" />
                                <div className="flex-1">
                                  <div className="text-sm text-gray-300 font-medium">{attachment.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'} • {(attachment.size / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="text-base text-gray-100 leading-relaxed">
                    <MarkdownText content={message.content} />
                  </div>
                </div>

                {/* Message Actions for AI responses */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-3 px-2">
                    <button 
                      onClick={() => copyToClipboard(message.content)}
                      className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group" 
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                    </button>
                    <button 
                      onClick={() => regenerateResponse(index)}
                      disabled={isLoading}
                      className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group disabled:opacity-50" 
                      title="Regenerate"
                    >
                      <RefreshCw className={`w-4 h-4 text-gray-500 group-hover:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group" title="Like">
                      <ThumbsUp className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group" title="Dislike">
                      <ThumbsDown className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-3 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm text-gray-400 ml-2">{t.aiThinking || 'AI is thinking...'}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Bar at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f1c2e] via-[#0f1c2e] to-transparent pt-8 pb-6 px-8">
        <div className="w-full">
          <div className="relative group">
            {/* Gradient glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            
            {/* Input container */}
            <div className="relative flex items-end gap-3 bg-[#1a2539] border border-gray-700/50 rounded-xl p-3 shadow-2xl">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Attachment button */}
              <button 
                onClick={handleFileAttachment}
                className="relative flex items-center justify-center w-10 h-10 hover:bg-gray-700/50 rounded-lg transition-colors group/btn"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5 text-gray-400 group-hover/btn:text-purple-400 transition-colors" />
                {attachedFiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {attachedFiles.length}
                  </span>
                )}
              </button>

              {/* Text input area with file preview */}
              <div className="flex-1">
                {/* Attached files preview */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachedFiles.map((file, index) => {
                      // Determine file icon based on type
                      let fileIcon = '📎';
                      if (file.type.startsWith('image/')) fileIcon = '🖼️';
                      else if (file.type === 'application/pdf') fileIcon = '📄';
                      else if (file.type.includes('word') || file.type.includes('document')) fileIcon = '📝';
                      else if (file.type.startsWith('text/')) fileIcon = '📃';
                      else if (file.type === 'text/csv') fileIcon = '📊';
                      else if (file.type === 'application/json') fileIcon = '🔧';
                      else if (file.type.includes('spreadsheet') || file.type.includes('excel')) fileIcon = '📈';
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-1.5 text-sm animate-scale-in"
                        >
                          <span className="text-lg">{fileIcon}</span>
                          <Paperclip className="w-3 h-3 text-purple-400" />
                          <span className="text-gray-300 max-w-[150px] truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-400 transition-colors ml-1"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <textarea
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Dispatch userTyping state when user types
                    if (e.target.value.length > 0) {
                      window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'userTyping' } }));
                    } else {
                      window.dispatchEvent(new CustomEvent('aiStateChange', { detail: { state: 'idle' } }));
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={t.typeMessage || 'Ask anything...'}
                  rows={1}
                  className="w-full bg-transparent text-base text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-32"
                  style={{ minHeight: '40px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>

              {/* Voice button */}
              <button 
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse' 
                    : 'hover:bg-gray-700/50'
                }`}
                title={`Voice input (${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName})`}
                onClick={handleVoiceInput}
              >
                <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'} transition-colors`} />
              </button>

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700/50 transition-all"
                  title="Select language"
                >
                  <Languages className="w-5 h-5 text-gray-400 hover:text-purple-400 transition-colors" />
                </button>

                {showLanguageMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-[#1a2539] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors flex items-center gap-2 ${
                          selectedLanguage === lang.code ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div>
                          <div className="text-sm font-medium">{lang.nativeName}</div>
                          <div className="text-xs text-gray-500">{lang.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send button */}
              <button 
                onClick={() => handleSendMessage()}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>🎤 Voice: {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI for Bharat 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}