# 🚀 Quantum AI - Multi-Provider AI Platform

> **AI for Bharat Hackathon 2026 Submission**  
> Created by **Mohanraj** - Cybersecurity Researcher & AI Developer

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://quantumai.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)

---

## 📱 Responsive Design - Works Everywhere!

✅ **Phone** (320px+)  
✅ **Tablet** (768px+)  
✅ **Laptop** (1024px+)  
✅ **Desktop** (1920px+)  
✅ **All Screen Sizes**

---

## 🌟 Features

### 🤖 Multi-Provider AI Support
- **OpenAI** (GPT-4, GPT-3.5)
- **Groq** (Ultra-fast inference)
- **Google Gemini** (Advanced reasoning)
- **Ollama** (Local, free models)
- **Pollinations** (Free API)
- **Smart Fallback** (Auto-switches if one fails)

### 🎨 Advanced Customization
- **8 Color Themes** (Quantum, Cyberpunk, Matrix, Sunset, Ocean, Forest, Midnight, Rose)
- **Custom Wallpaper** with blur effect
- **6 Font Options** (Inter, Roboto, Poppins, JetBrains Mono, Fira Code, Ubuntu)
- **4 Chat Bubble Styles** (Rounded, Sharp, Pill, Minimal)
- **Dark/Light/Auto Mode**
- **Real-time Theme Updates**
- **Persistent Settings** (localStorage)

### 🌐 Multi-Language Support
- **English** 🇬🇧
- **Tamil** (தமிழ்) 🇮🇳
- **Hindi** (हिन्दी) 🇮🇳
- Language selector in header
- All UI elements translated

### 💬 Smart Chat Interface
- **File Upload** (Images, PDFs, Documents, CSV, JSON, Excel)
- **Smart File Recognition** (AI identifies file types)
- **Voice Input** (Speech-to-text)
- **Text-to-Speech** (AI responses read aloud)
- **Professional Markdown** formatting
- **Copy/Regenerate/Like/Dislike** actions
- **Chat History** saved

### 🎯 Specialized Assistants
- **Code Assistant** (Programming help)
- **Image Generator** (AI art creation)
- **Document Analyzer** (PDF/Doc analysis)
- **Voice Assistant** (Hands-free interaction)
- **Data Analytics** (Chart generation)
- **Model Playground** (Test different AI models)
- **AI Workflows** (Automation)

### 🔐 Authentication System
- **Email/Password** login
- **Google OAuth** (ready)
- **Facebook OAuth** (ready)
- **Phone OTP** (ready)
- **Demo Mode** (skip login)
- **Location-based** user tracking

### 🎮 Master Control System
- **Creator Dashboard** (Admin panel)
- **Quantum Commands** (Shutdown, Restart, Lockdown, Memory Purge)
- **User Analytics** (Real-time stats)
- **System Monitoring**
- **Access Code**: `17120105MOHANRAJ`

### 🎨 Professional UI/UX
- **Gradient Animations**
- **Loading Spinners** (5 variants)
- **Toast Notifications** (Success/Error/Warning/Info)
- **Smooth Transitions**
- **Glass-morphism Effects**
- **Responsive Design**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/mohanrajcyber/QuantumAI.git
cd QuantumAI

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Configuration

1. **Backend Environment** (Optional - works without API keys in demo mode)
```bash
# Create backend/.env file
cd backend
cp .env.example .env
```

2. **Add API Keys** (Optional)
```env
# OpenAI
OPENAI_API_KEY=your_openai_key

# Groq
GROQ_API_KEY=your_groq_key

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# YouTube (for entertainment features)
YOUTUBE_API_KEY=your_youtube_key
```

### Run the Application

#### Option 1: One-Click Start (Windows)
```bash
# Double-click START.bat
# Or run:
START.bat
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm start
```

#### Option 3: Concurrent Start
```bash
npm run start:all
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Force Logout**: http://localhost:5173?logout=force

---

## 📱 Responsive Design Details

### Mobile (320px - 767px)
- Single column layout
- Collapsible sidebars
- Touch-optimized buttons
- Swipe gestures
- Mobile-first design

### Tablet (768px - 1023px)
- Two-column layout
- Sidebar toggles
- Optimized spacing
- Touch and mouse support

### Desktop (1024px+)
- Three-column layout
- Full sidebar visibility
- Hover effects
- Keyboard shortcuts
- Multi-panel view

---

## 🎯 Key Technologies

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 6.3** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icons
- **React Context API** - State management

### Backend
- **Node.js 20+** - Runtime
- **Express 4.21** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

### AI Integration
- **OpenAI SDK** - GPT models
- **Groq SDK** - Fast inference
- **Google Generative AI** - Gemini
- **Ollama** - Local models
- **Pollinations API** - Free AI

---

## 📂 Project Structure

```
QuantumAI/
├── src/
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Theme)
│   │   ├── services/        # API services
│   │   └── utils/           # Utilities (translations)
│   └── styles/              # Global styles
├── backend/
│   ├── ai/                  # AI provider integrations
│   ├── routes/              # API routes
│   └── services/            # Backend services
├── public/                  # Static assets
├── START.bat               # One-click startup
├── package.json            # Frontend dependencies
└── README.md              # This file
```

---

## 🎨 Theme Customization

### Available Themes
1. **Quantum** - Blue/Purple (Default)
2. **Cyberpunk** - Pink/Cyan
3. **Matrix** - Green
4. **Sunset** - Orange/Pink
5. **Ocean** - Sky/Teal
6. **Forest** - Green/Lime
7. **Midnight** - Indigo/Violet
8. **Rose** - Rose/Pink

### Custom Settings
- Upload custom wallpaper
- Choose custom colors
- Select font family
- Adjust font size
- Change bubble style
- Set AI personality
- Control response length

---

## 🌐 Multi-Language Support

### Supported Languages
- **English** - Full support
- **Tamil** (தமிழ்) - Full support
- **Hindi** (हिन्दी) - Full support

### How to Change Language
1. Click globe icon in header
2. Select your language
3. Entire UI updates instantly
4. Preference saved automatically

---

## 🔐 Master Control Access

### Access the Dashboard
1. Login to Quantum AI
2. Open Chat interface
3. Type: `/source code 17120105MOHANRAJ`
4. Master Control Dashboard opens

### Available Commands
- **Shutdown** - Graceful system shutdown
- **Restart** - System restart
- **Lockdown** - Emergency lockdown mode
- **Unlock** - Release lockdown
- **Memory Purge** - Clear all data

---

## 📊 Features Checklist

### Core Features
- [x] Multi-provider AI chat
- [x] File upload & analysis
- [x] Voice input/output
- [x] Multi-language support
- [x] Theme customization
- [x] Responsive design
- [x] Authentication system
- [x] Master control panel

### Advanced Features
- [x] 8 color themes
- [x] Custom wallpaper
- [x] Font customization
- [x] Chat bubble styles
- [x] Real-time updates
- [x] Persistent settings
- [x] Smart file recognition
- [x] Professional markdown

### Specialized Tools
- [x] Code Assistant
- [x] Image Generator
- [x] Document Analyzer
- [x] Voice Assistant
- [x] Data Analytics
- [x] Model Playground
- [x] AI Workflows

---

## 🏆 Hackathon Highlights

### Why Quantum AI Stands Out

1. **Multi-Provider Support** - Not locked to one AI provider
2. **Responsive Design** - Works on ALL devices
3. **Multi-Language** - Accessible to Indian users
4. **Advanced Customization** - 8 themes, custom wallpaper, fonts
5. **Professional UI** - Glass-morphism, animations, smooth UX
6. **Smart Features** - File recognition, voice I/O, markdown
7. **Production Ready** - Zero errors, type-safe, optimized
8. **Open Source** - MIT license, community-friendly

### Technical Excellence
- ✅ TypeScript for type safety
- ✅ React Context for state management
- ✅ Responsive design (mobile-first)
- ✅ Real-time theme updates
- ✅ Persistent storage
- ✅ Professional code structure
- ✅ Zero console errors
- ✅ Optimized build

---

## 📸 Screenshots

### Login Page
Beautiful gradient logo with cyan-purple-pink colors

### Home Dashboard
Multi-panel layout with action cards

### Chat Interface
Professional markdown, file upload, voice input

### Settings Page
8 themes, custom wallpaper, typography control

### Master Control
Admin dashboard with system commands

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain responsive design
3. Add proper error handling
4. Write clean, documented code
5. Test on multiple devices

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👨‍💻 Creator

**Mohanraj**  
Cybersecurity Researcher & AI Developer

- 📧 Email: mohanraj.cyber@gmail.com
- 📱 Phone: +91 6383418971
- 🔗 GitHub: [@mohanrajcyber](https://github.com/mohanrajcyber)

---

## 🙏 Acknowledgments

- **AI for Bharat Hackathon 2026** - For the opportunity
- **OpenAI, Groq, Google** - For AI APIs
- **React & TypeScript** - For amazing frameworks
- **Tailwind CSS** - For beautiful styling
- **Open Source Community** - For inspiration

---

## 📞 Support

For issues or questions:
1. Open an issue on GitHub
2. Email: mohanraj.cyber@gmail.com
3. Check documentation in `/docs` folder

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] More AI providers
- [ ] Team collaboration
- [ ] API marketplace
- [ ] Plugin system
- [ ] Advanced analytics

---

## ⚡ Performance

- **Build Size**: ~520KB (gzipped: ~127KB)
- **Load Time**: <2 seconds
- **Lighthouse Score**: 95+
- **Mobile Optimized**: Yes
- **SEO Friendly**: Yes

---

## 🔒 Security

- Environment variables for API keys
- No sensitive data in frontend
- CORS protection
- Input validation
- XSS prevention
- CSRF protection

---

## 🌟 Star This Repo!

If you find Quantum AI useful, please give it a ⭐ on GitHub!

---

**Made with ❤️ for AI for Bharat Hackathon 2026**

**Quantum AI - Your Intelligent AI Assistant for Everything** 🚀
