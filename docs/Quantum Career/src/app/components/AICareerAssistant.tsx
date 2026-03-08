import { useState } from "react";
import { Bot, Upload, FileText, Briefcase, TrendingUp, MessageSquare, X, Send } from "lucide-react";
import { Button } from "./ui/button";

interface AICareerAssistantProps {
  onClose: () => void;
  onJobRecommendations?: (jobs: any[]) => void;
}

export function AICareerAssistant({ onClose, onJobRecommendations }: AICareerAssistantProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'resume' | 'interview' | 'career'>('chat');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hi! I\'m your AI Career Assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call Quantum AI backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are a career advisor AI. User query: ${userMessage}. Provide helpful career advice, job search tips, or answer career-related questions.`,
          provider: 'auto'
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('AI chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsLoading(true);

    try {
      // Read file content
      const text = await file.text();
      
      // Analyze with AI
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this resume and extract: skills, experience level, job titles, education, and suggest matching job roles. Resume content: ${text.substring(0, 2000)}`,
          provider: 'auto'
        })
      });

      const data = await response.json();
      setResumeAnalysis({
        summary: data.response,
        skills: extractSkills(data.response),
        recommendations: extractRecommendations(data.response)
      });
    } catch (error) {
      console.error('Resume analysis error:', error);
      setResumeAnalysis({
        summary: 'Error analyzing resume. Please try again.',
        skills: [],
        recommendations: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractSkills = (text: string): string[] => {
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Java'];
    return skillKeywords.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  };

  const extractRecommendations = (text: string): string[] => {
    const lines = text.split('\n').filter(line => 
      line.includes('recommend') || line.includes('suggest') || line.includes('consider')
    );
    return lines.slice(0, 5);
  };

  const generateInterviewQuestions = async (jobTitle: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate 10 common interview questions for a ${jobTitle} position. Include technical and behavioral questions.`,
          provider: 'auto'
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Interview Questions for ${jobTitle}:\n\n${data.response}` 
      }]);
    } catch (error) {
      console.error('Interview questions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCareerPath = async (currentRole: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a detailed career path roadmap for someone currently working as a ${currentRole}. Include: next roles, required skills, timeline, and salary expectations.`,
          provider: 'auto'
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Career Path from ${currentRole}:\n\n${data.response}` 
      }]);
    } catch (error) {
      console.error('Career path error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">AI Career Assistant</h2>
              <p className="text-gray-400 text-sm">Powered by Quantum AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'resume' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resume Analyzer
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'interview' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Interview Prep
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'career' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Career Path
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#2a2a2a] text-gray-300'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#2a2a2a] text-gray-300 p-4 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your career..."
                  className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <div className="bg-[#2a2a2a] border-2 border-dashed border-gray-700 rounded-lg p-12 hover:border-blue-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Upload Your Resume</p>
                    <p className="text-gray-400 text-sm">Supports TXT, PDF, DOC, DOCX</p>
                  </div>
                </label>
              </div>

              {resumeFile && (
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <p className="text-white mb-2">Uploaded: {resumeFile.name}</p>
                  {isLoading && <p className="text-blue-500">Analyzing...</p>}
                </div>
              )}

              {resumeAnalysis && (
                <div className="space-y-4">
                  <div className="bg-[#2a2a2a] rounded-lg p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Analysis Summary</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{resumeAnalysis.summary}</p>
                  </div>

                  {resumeAnalysis.skills.length > 0 && (
                    <div className="bg-[#2a2a2a] rounded-lg p-6">
                      <h3 className="text-white text-lg font-semibold mb-4">Detected Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeAnalysis.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="bg-[#2a2a2a] rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Interview Preparation</h3>
                <p className="text-gray-300 mb-6">Enter a job title to get AI-generated interview questions</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        generateInterviewQuestions((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => generateInterviewQuestions('Software Engineer')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Software Engineer
                    </Button>
                    <Button
                      onClick={() => generateInterviewQuestions('Product Manager')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Product Manager
                    </Button>
                    <Button
                      onClick={() => generateInterviewQuestions('Data Analyst')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Data Analyst
                    </Button>
                    <Button
                      onClick={() => generateInterviewQuestions('UX Designer')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      UX Designer
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Mock Interview with AI Avatar</h3>
                <p className="text-gray-300 mb-4">Practice with our AI-powered avatar for realistic interview experience</p>
                <Button
                  onClick={() => window.open('http://localhost:8000', '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Mock Interview
                </Button>
              </div>

              {chatMessages.length > 1 && (
                <div className="bg-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Generated Questions</h3>
                  <div className="space-y-4">
                    {chatMessages.slice(1).map((msg, idx) => (
                      msg.role === 'assistant' && (
                        <div key={idx} className="text-gray-300 whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-6">
              <div className="bg-[#2a2a2a] rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Career Path Advisor</h3>
                <p className="text-gray-300 mb-6">Get personalized career roadmap based on your current role</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="e.g., Junior Developer, Marketing Associate"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        generateCareerPath((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => generateCareerPath('Junior Developer')}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Junior Developer
                    </Button>
                    <Button
                      onClick={() => generateCareerPath('Marketing Associate')}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Marketing Associate
                    </Button>
                    <Button
                      onClick={() => generateCareerPath('Data Analyst')}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Data Analyst
                    </Button>
                    <Button
                      onClick={() => generateCareerPath('Product Designer')}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Product Designer
                    </Button>
                  </div>
                </div>
              </div>

              {chatMessages.length > 1 && (
                <div className="bg-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Your Career Roadmap</h3>
                  <div className="space-y-4">
                    {chatMessages.slice(1).map((msg, idx) => (
                      msg.role === 'assistant' && (
                        <div key={idx} className="text-gray-300 whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
