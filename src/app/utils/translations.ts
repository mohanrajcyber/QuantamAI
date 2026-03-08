// Quantum AI - Multi-Language Support
// English, Tamil (தமிழ்), Hindi (हिंदी)

export type Language = 'en' | 'ta' | 'hi';

export const translations = {
  en: {
    // Header
    welcome: 'Quantum AI',
    welcomeBack: 'Welcome back!',
    howCanIHelp: 'How can I assist you today?',
    upgradeToPro: 'Upgrade to Pro',
    logout: 'Logout',
    
    // Sidebar
    home: 'Home',
    chat: 'Chat',
    codeAssistant: 'Code Assistant',
    quantumIDE: 'Quantum IDE',
    quantumAgent: 'Quantum Agent',
    documentAnalyzer: 'Document Analyzer',
    dataAnalytics: 'Data Analytics',
    modelPlayground: 'Model Playground',
    aiWorkflows: 'AI Workflows',
    hologram: 'Quantum Hologram',
    settings: 'Settings',
    helpSupport: 'Help & Support',
    
    // Common
    generate: 'Generate',
    send: 'Send',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Chat
    typeMessage: 'Type your message...',
    aiThinking: 'AI is thinking...',
    startConversation: 'Start a conversation',
    askAnything: 'Ask me anything and I\'ll help you out!',
    backToHome: 'Back to Home',
    aiProvider: 'AI Provider',
    
    // Quantum Agent
    careerGuidance: 'Career Guidance',
    businessAdvisor: 'Business Advisor',
    healthcareAdvisor: 'Healthcare Advisor',
    
    // Master Control
    masterControl: 'Master Control Dashboard',
    activeUsers: 'Active Users',
    systemStats: 'System Statistics',
    realTimeAnalytics: 'Real-Time Analytics',
    
    // Image Generator
    imageGenerator: 'Image Generator',
    createStunningImages: 'Create stunning images with AI',
    describeYourImage: 'Describe your image',
    artStyle: 'Art Style',
    realistic: 'Realistic',
    artistic: 'Artistic',
    anime: 'Anime',
    digitalArt: 'Digital Art',
    generating: 'Generating...',
    download: 'Download',
    
    // Voice Assistant
    voiceAssistant: 'Voice Assistant',
    speakNaturally: 'Speak naturally with AI',
    listening: 'Listening...',
    tapToSpeak: 'Tap to speak',
    speaking: 'Speaking...',
    
    // Welcome Section
    whatWouldYouLikeToDo: 'What would you like to do?',
    recentConversations: 'Recent Conversations',
    startChat: 'Start Chat',
    askAnythingDesc: 'Ask anything',
    generateCode: 'Generate Code',
    aiPoweredCoding: 'AI-powered coding',
    createImages: 'Create Images',
    aiImageGeneration: 'AI image generation',
    voiceChat: 'Voice Chat',
    speakWithAI: 'Speak with AI',
    analyzeDocuments: 'Analyze Documents',
    documentInsights: 'Document insights',
    dataAnalyticsCard: 'Data Analytics',
    usageInsights: 'Usage insights',
    career: 'Career',
    jobCareerGuidance: 'Job & career guidance',
    aiWorkflowsCard: 'AI Workflows',
    automatedTasks: 'Automated tasks',
    quantumAgentCard: 'Quantum Agent',
    advancedAI: 'Advanced AI',
    brainstorm: 'Brainstorm',
    ideasSolutions: 'Ideas & solutions',
    creativeMode: 'Creative Mode',
    artContent: 'Art & content',
  },
  
  ta: {
    // Header
    welcome: 'குவாண்டம் AI',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
    howCanIHelp: 'இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    upgradeToPro: 'ப்ரோ-வுக்கு மேம்படுத்து',
    logout: 'வெளியேறு',
    
    // Sidebar
    home: 'முகப்பு',
    chat: 'அரட்டை',
    codeAssistant: 'கோட் உதவியாளர்',
    quantumIDE: 'குவாண்டம் IDE',
    quantumAgent: 'குவாண்டம் ஏஜென்ட்',
    documentAnalyzer: 'ஆவண பகுப்பாய்வி',
    dataAnalytics: 'தரவு பகுப்பாய்வு',
    modelPlayground: 'மாடல் விளையாட்டு மைதானம்',
    aiWorkflows: 'AI பணிப்பாய்வுகள்',
    hologram: 'குவாண்டம் ஹாலோகிராம்',
    settings: 'அமைப்புகள்',
    helpSupport: 'உதவி & ஆதரவு',
    
    // Common
    generate: 'உருவாக்கு',
    send: 'அனுப்பு',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    
    // Chat
    typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யவும்...',
    aiThinking: 'AI சிந்திக்கிறது...',
    startConversation: 'உரையாடலைத் தொடங்குங்கள்',
    askAnything: 'எதையும் கேளுங்கள், நான் உதவுகிறேன்!',
    backToHome: 'முகப்புக்கு திரும்பு',
    aiProvider: 'AI வழங்குநர்',
    
    // Quantum Agent
    careerGuidance: 'தொழில் வழிகாட்டுதல்',
    businessAdvisor: 'வணிக ஆலோசகர்',
    healthcareAdvisor: 'சுகாதார ஆலோசகர்',
    
    // Master Control
    masterControl: 'மாஸ்டர் கண்ட்ரோல் டாஷ்போர்டு',
    activeUsers: 'செயலில் உள்ள பயனர்கள்',
    systemStats: 'கணினி புள்ளிவிவரங்கள்',
    realTimeAnalytics: 'நேரடி பகுப்பாய்வு',
    
    // Image Generator
    imageGenerator: 'படம் உருவாக்கி',
    createStunningImages: 'AI மூலம் அற்புதமான படங்களை உருவாக்குங்கள்',
    describeYourImage: 'உங்கள் படத்தை விவரிக்கவும்',
    artStyle: 'கலை பாணி',
    realistic: 'யதார்த்தமான',
    artistic: 'கலை',
    anime: 'அனிமே',
    digitalArt: 'டிஜிட்டல் கலை',
    generating: 'உருவாக்குகிறது...',
    download: 'பதிவிறக்கு',
    
    // Voice Assistant
    voiceAssistant: 'குரல் உதவியாளர்',
    speakNaturally: 'AI உடன் இயல்பாக பேசுங்கள்',
    listening: 'கேட்கிறது...',
    tapToSpeak: 'பேச தட்டவும்',
    speaking: 'பேசுகிறது...',
    
    // Welcome Section
    whatWouldYouLikeToDo: 'நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?',
    recentConversations: 'சமீபத்திய உரையாடல்கள்',
    startChat: 'அரட்டை தொடங்கு',
    askAnythingDesc: 'எதையும் கேளுங்கள்',
    generateCode: 'கோட் உருவாக்கு',
    aiPoweredCoding: 'AI சக்தி கோடிங்',
    createImages: 'படங்கள் உருவாக்கு',
    aiImageGeneration: 'AI படம் உருவாக்கம்',
    voiceChat: 'குரல் அரட்டை',
    speakWithAI: 'AI உடன் பேசு',
    analyzeDocuments: 'ஆவணங்களை பகுப்பாய்வு செய்',
    documentInsights: 'ஆவண நுண்ணறிவு',
    dataAnalyticsCard: 'தரவு பகுப்பாய்வு',
    usageInsights: 'பயன்பாட்டு நுண்ணறிவு',
    career: 'தொழில்',
    jobCareerGuidance: 'வேலை & தொழில் வழிகாட்டுதல்',
    aiWorkflowsCard: 'AI பணிப்பாய்வுகள்',
    automatedTasks: 'தானியங்கு பணிகள்',
    quantumAgentCard: 'குவாண்டம் ஏஜென்ட்',
    advancedAI: 'மேம்பட்ட AI',
    brainstorm: 'மூளைச்சலவை',
    ideasSolutions: 'யோசனைகள் & தீர்வுகள்',
    creativeMode: 'படைப்பு முறை',
    artContent: 'கலை & உள்ளடக்கம்',
  },
  
  hi: {
    // Header
    welcome: 'क्वांटम AI',
    welcomeBack: 'वापसी पर स्वागत है!',
    howCanIHelp: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
    upgradeToPro: 'प्रो में अपग्रेड करें',
    logout: 'लॉग आउट',
    
    // Sidebar
    home: 'होम',
    chat: 'चैट',
    codeAssistant: 'कोड सहायक',
    quantumIDE: 'क्वांटम IDE',
    quantumAgent: 'क्वांटम एजेंट',
    documentAnalyzer: 'डॉक्यूमेंट एनालाइज़र',
    dataAnalytics: 'डेटा एनालिटिक्स',
    modelPlayground: 'मॉडल प्लेग्राउंड',
    aiWorkflows: 'AI वर्कफ़्लो',
    hologram: 'क्वांटम होलोग्राम',
    settings: 'सेटिंग्स',
    helpSupport: 'मदद और सहायता',
    
    // Common
    generate: 'उत्पन्न करें',
    send: 'भेजें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Chat
    typeMessage: 'अपना संदेश टाइप करें...',
    aiThinking: 'AI सोच रहा है...',
    startConversation: 'बातचीत शुरू करें',
    askAnything: 'कुछ भी पूछें, मैं मदद करूंगा!',
    backToHome: 'होम पर वापस जाएं',
    aiProvider: 'AI प्रदाता',
    
    // Quantum Agent
    careerGuidance: 'करियर मार्गदर्शन',
    businessAdvisor: 'बिजनेस सलाहकार',
    healthcareAdvisor: 'स्वास्थ्य सलाहकार',
    
    // Master Control
    masterControl: 'मास्टर कंट्रोल डैशबोर्ड',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    systemStats: 'सिस्टम आंकड़े',
    realTimeAnalytics: 'रियल-टाइम एनालिटिक्स',
    
    // Image Generator
    imageGenerator: 'इमेज जेनरेटर',
    createStunningImages: 'AI के साथ शानदार छवियां बनाएं',
    describeYourImage: 'अपनी छवि का वर्णन करें',
    artStyle: 'कला शैली',
    realistic: 'यथार्थवादी',
    artistic: 'कलात्मक',
    anime: 'एनीमे',
    digitalArt: 'डिजिटल आर्ट',
    generating: 'उत्पन्न हो रहा है...',
    download: 'डाउनलोड',
    
    // Voice Assistant
    voiceAssistant: 'वॉयस असिस्टेंट',
    speakNaturally: 'AI के साथ स्वाभाविक रूप से बोलें',
    listening: 'सुन रहा है...',
    tapToSpeak: 'बोलने के लिए टैप करें',
    speaking: 'बोल रहा है...',
    
    // Welcome Section
    whatWouldYouLikeToDo: 'आप क्या करना चाहेंगे?',
    recentConversations: 'हाल की बातचीत',
    startChat: 'चैट शुरू करें',
    askAnythingDesc: 'कुछ भी पूछें',
    generateCode: 'कोड जेनरेट करें',
    aiPoweredCoding: 'AI संचालित कोडिंग',
    createImages: 'छवियां बनाएं',
    aiImageGeneration: 'AI छवि निर्माण',
    voiceChat: 'वॉयस चैट',
    speakWithAI: 'AI के साथ बोलें',
    analyzeDocuments: 'दस्तावेज़ विश्लेषण',
    documentInsights: 'दस्तावेज़ अंतर्दृष्टि',
    dataAnalyticsCard: 'डेटा एनालिटिक्स',
    usageInsights: 'उपयोग अंतर्दृष्टि',
    career: 'करियर',
    jobCareerGuidance: 'नौकरी और करियर मार्गदर्शन',
    aiWorkflowsCard: 'AI वर्कफ़्लो',
    automatedTasks: 'स्वचालित कार्य',
    quantumAgentCard: 'क्वांटम एजेंट',
    advancedAI: 'उन्नत AI',
    brainstorm: 'विचार मंथन',
    ideasSolutions: 'विचार और समाधान',
    creativeMode: 'रचनात्मक मोड',
    artContent: 'कला और सामग्री',
  },
};

export const getTranslation = (key: string, language: Language = 'en'): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

export const languageNames = {
  en: 'English',
  ta: 'தமிழ்',
  hi: 'हिंदी',
};

export const languageFlags = {
  en: '🇬🇧',
  ta: '🇮🇳',
  hi: '🇮🇳',
};
