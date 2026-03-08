import { BookOpen, Brain, FileText, HelpCircle, Award, Languages } from 'lucide-react';
import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export function EducationHelper() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('en');
  const [explanation, setExplanation] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [studyMaterial, setStudyMaterial] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const SUBJECTS = [
    'Mathematics (गणित / கணிதம்)',
    'Science (विज्ञान / அறிவியல்)',
    'History (इतिहास / வரலாறு)',
    'Geography (भूगोल / புவியியல்)',
    'English (अंग्रेज़ी / ஆங்கிலம்)'
  ];

  const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const explainTopic = () => {
    // Mock explanations in different languages
    const explanations: Record<string, Record<string, string>> = {
      'photosynthesis': {
        'en': 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.',
        'hi': 'प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ऑक्सीजन और शर्करा के रूप में ऊर्जा बनाते हैं।',
        'ta': 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடைப் பயன்படுத்தி ஆக்ஸிஜன் மற்றும் சர்க்கரை வடிவில் ஆற்றலை உருவாக்கும் செயல்முறையாகும்.'
      },
      'gravity': {
        'en': 'Gravity is a force that attracts objects toward each other. Earth\'s gravity keeps us on the ground and causes objects to fall.',
        'hi': 'गुरुत्वाकर्षण एक बल है जो वस्तुओं को एक दूसरे की ओर आकर्षित करता है। पृथ्वी का गुरुत्वाकर्षण हमें जमीन पर रखता है।',
        'ta': 'ஈர்ப்பு விசை என்பது பொருட்களை ஒன்றையொன்று நோக்கி இழுக்கும் ஒரு விசையாகும். பூமியின் ஈர்ப்பு விசை நம்மை தரையில் வைத்திருக்கிறது.'
      }
    };

    const topicKey = topic.toLowerCase().includes('photo') ? 'photosynthesis' : 'gravity';
    setExplanation(explanations[topicKey]?.[language] || 'Please enter a valid topic.');
  };

  const generateQuiz = () => {
    // Mock quiz generation
    const quizzes: Record<string, QuizQuestion[]> = {
      'science': [
        {
          question: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
          correct: 1
        },
        {
          question: 'What is the chemical formula for water?',
          options: ['CO2', 'H2O', 'O2', 'NaCl'],
          correct: 1
        }
      ],
      'history': [
        {
          question: 'Who was the first Prime Minister of India?',
          options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Ambedkar'],
          correct: 1
        }
      ]
    };

    const subject = topic.toLowerCase().includes('science') ? 'science' : 'history';
    setQuiz(quizzes[subject] || []);
    setSelectedAnswers(new Array(quizzes[subject]?.length || 0).fill(-1));
  };

  const generateStudyMaterial = () => {
    setStudyMaterial(`
# ${topic} - Study Material

## Key Points:
1. Definition and basic concepts
2. Important formulas and theories
3. Real-world applications
4. Practice problems

## Summary:
This comprehensive guide covers all essential aspects of ${topic}. 
Study each section carefully and practice the exercises.

## Practice Questions:
1. Define the main concept
2. Explain with examples
3. Solve numerical problems
4. Apply to real scenarios
    `);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Education Helper</h2>
          <p className="text-sm text-gray-400">शिक्षा सहायक / கல்வி உதவியாளர்</p>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-[#1a2539] rounded-xl p-4 border border-gray-800/50">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-white">Select Language</span>
        </div>
        <div className="flex gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg transition-all ${
                language === lang.code
                  ? 'bg-purple-500 text-white'
                  : 'bg-[#0f1c2e] text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Input */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <label className="block text-sm text-gray-400 mb-2">Enter Topic / Subject</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Photosynthesis, Indian History, Algebra..."
          className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Explain Concept */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Explain Concept
        </h3>
        <button
          onClick={explainTopic}
          disabled={!topic}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Get Explanation
        </button>

        {explanation && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>

      {/* Generate Quiz */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-400" />
          Practice Quiz
        </h3>
        <button
          onClick={generateQuiz}
          disabled={!topic}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Generate Quiz
        </button>

        {quiz.length > 0 && (
          <div className="space-y-4">
            {quiz.map((q, qIdx) => (
              <div key={qIdx} className="bg-[#0f1c2e] rounded-lg p-4 border border-green-500/30">
                <div className="font-medium text-white mb-3">
                  Q{qIdx + 1}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((option, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        const newAnswers = [...selectedAnswers];
                        newAnswers[qIdx] = oIdx;
                        setSelectedAnswers(newAnswers);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedAnswers[qIdx] === oIdx
                          ? oIdx === q.correct
                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                            : 'bg-red-500/20 border border-red-500 text-red-400'
                          : 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center text-sm text-gray-400">
              Score: {selectedAnswers.filter((ans, idx) => ans === quiz[idx]?.correct).length} / {quiz.length}
            </div>
          </div>
        )}
      </div>

      {/* Study Material */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Study Material
        </h3>
        <button
          onClick={generateStudyMaterial}
          disabled={!topic}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Generate Study Material
        </button>

        {studyMaterial && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{studyMaterial}</pre>
          </div>
        )}
      </div>

      {/* Subjects */}
      <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Popular Subjects</h3>
        <div className="grid grid-cols-2 gap-2">
          {SUBJECTS.map((subject, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(subject.split('(')[0].trim())}
              className="p-3 bg-[#0f1c2e] hover:bg-gray-700/50 rounded-lg text-left text-sm text-gray-300 transition-colors"
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
