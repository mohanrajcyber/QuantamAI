import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'auto';
type ColorTheme = 'quantum' | 'cyberpunk' | 'matrix' | 'sunset' | 'ocean' | 'forest' | 'midnight' | 'rose';
type FontFamily = 'inter' | 'roboto' | 'poppins' | 'jetbrains' | 'fira' | 'ubuntu';
type BubbleStyle = 'rounded' | 'sharp' | 'pill' | 'minimal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  customPrimaryColor: string;
  setCustomPrimaryColor: (color: string) => void;
  customAccentColor: string;
  setCustomAccentColor: (color: string) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  bubbleStyle: BubbleStyle;
  setBubbleStyle: (style: BubbleStyle) => void;
  wallpaper: string | null;
  setWallpaper: (wallpaper: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorThemes = {
  quantum: { primary: '#3b82f6', accent: '#a855f7', bg: '#0a1628', bgSecondary: '#0f1c2e' },
  cyberpunk: { primary: '#ec4899', accent: '#06b6d4', bg: '#1a0a1f', bgSecondary: '#2d1537' },
  matrix: { primary: '#10b981', accent: '#059669', bg: '#0a1a0f', bgSecondary: '#0f2617' },
  sunset: { primary: '#f97316', accent: '#ec4899', bg: '#1a0f0a', bgSecondary: '#2d1a12' },
  ocean: { primary: '#0ea5e9', accent: '#14b8a6', bg: '#0a1520', bgSecondary: '#0f1f2e' },
  forest: { primary: '#22c55e', accent: '#84cc16', bg: '#0f1a0a', bgSecondary: '#1a2d12' },
  midnight: { primary: '#6366f1', accent: '#8b5cf6', bg: '#0f0a1a', bgSecondary: '#1a1237' },
  rose: { primary: '#f43f5e', accent: '#fb7185', bg: '#1a0a12', bgSecondary: '#2d1220' },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });
  
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'quantum';
  });
  
  const [customPrimaryColor, setCustomPrimaryColor] = useState(() => {
    return localStorage.getItem('customPrimaryColor') || '#3b82f6';
  });
  
  const [customAccentColor, setCustomAccentColor] = useState(() => {
    return localStorage.getItem('customAccentColor') || '#a855f7';
  });
  
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('fontFamily') as FontFamily) || 'inter';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem('fontSize')) || 16;
  });
  
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>(() => {
    return (localStorage.getItem('bubbleStyle') as BubbleStyle) || 'rounded';
  });
  
  const [wallpaper, setWallpaper] = useState<string | null>(() => {
    return localStorage.getItem('wallpaper') || null;
  });

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('🎨 Applying theme:', { theme, colorTheme, fontFamily, fontSize });
    
    // Apply theme mode
    if (theme === 'light') {
      // Light mode colors
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--text-primary', '#1a1a1a');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1a1a1a';
      
      // Apply light mode specific styles
      const lightStyle = document.createElement('style');
      lightStyle.id = 'light-mode-style';
      const existingLightStyle = document.getElementById('light-mode-style');
      if (existingLightStyle) {
        existingLightStyle.remove();
      }
      
      const selectedTheme = colorThemes[colorTheme];
      lightStyle.textContent = `
        body.light-theme {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
        }
        .light-theme .bg-\\[\\#0a1628\\],
        .light-theme .bg-\\[\\#0f1c2e\\],
        .light-theme .bg-\\[\\#0b1525\\],
        .light-theme .bg-\\[\\#1a2539\\] {
          background-color: #f8f9fa !important;
          border-color: #e0e0e0 !important;
        }
        .light-theme .text-white,
        .light-theme .text-gray-100,
        .light-theme .text-gray-200 {
          color: #1a1a1a !important;
        }
        .light-theme .text-gray-300,
        .light-theme .text-gray-400 {
          color: #666666 !important;
        }
        .light-theme .text-gray-500 {
          color: #888888 !important;
        }
        .light-theme .border-gray-700,
        .light-theme .border-gray-800 {
          border-color: #e0e0e0 !important;
        }
        .light-theme .bg-gradient-to-br.from-blue-600.to-purple-600,
        .light-theme .bg-gradient-to-r.from-blue-600.to-purple-600 {
          background: linear-gradient(to bottom right, ${selectedTheme.primary}, ${selectedTheme.accent}) !important;
          color: #ffffff !important;
        }
        .light-theme aside,
        .light-theme main {
          background-color: #ffffff !important;
        }
        .light-theme .bg-gray-800 {
          background-color: #f0f0f0 !important;
        }
        .light-theme input,
        .light-theme select,
        .light-theme textarea {
          background-color: #f8f9fa !important;
          color: #1a1a1a !important;
          border-color: #e0e0e0 !important;
        }
      `;
      document.head.appendChild(lightStyle);
    } else {
      // Dark mode colors
      const selectedTheme = colorThemes[colorTheme];
      root.style.setProperty('--bg-primary', selectedTheme.bg);
      root.style.setProperty('--bg-secondary', selectedTheme.bgSecondary);
      root.style.setProperty('--text-primary', '#ffffff');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      body.style.backgroundColor = selectedTheme.bg;
      body.style.color = '#ffffff';
      
      // Remove light mode styles if they exist
      const existingLightStyle = document.getElementById('light-mode-style');
      if (existingLightStyle) {
        existingLightStyle.remove();
      }
    }
    
    // Apply color theme
    const selectedTheme = colorThemes[colorTheme];
    root.style.setProperty('--color-primary', selectedTheme.primary);
    root.style.setProperty('--color-accent', selectedTheme.accent);
    
    // Apply to all gradient elements
    const style = document.createElement('style');
    style.id = 'dynamic-theme-style';
    const existingStyle = document.getElementById('dynamic-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      .bg-gradient-to-br.from-blue-600.to-purple-600,
      .bg-gradient-to-r.from-blue-600.to-purple-600 {
        background: linear-gradient(to bottom right, ${selectedTheme.primary}, ${selectedTheme.accent}) !important;
      }
      .text-blue-400, .text-blue-500, .text-blue-600 {
        color: ${selectedTheme.primary} !important;
      }
      .text-purple-400, .text-purple-500, .text-purple-600 {
        color: ${selectedTheme.accent} !important;
      }
      .bg-blue-600 {
        background-color: ${selectedTheme.primary} !important;
      }
      .bg-purple-600 {
        background-color: ${selectedTheme.accent} !important;
      }
      .shadow-blue-500\\/20,
      .shadow-blue-500\\/30 {
        box-shadow: 0 10px 15px -3px ${selectedTheme.primary}33 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply font
    const fontMap: Record<FontFamily, string> = {
      inter: 'Inter, sans-serif',
      roboto: 'Roboto, sans-serif',
      poppins: 'Poppins, sans-serif',
      jetbrains: 'JetBrains Mono, monospace',
      fira: 'Fira Code, monospace',
      ubuntu: 'Ubuntu, sans-serif',
    };
    root.style.setProperty('--font-family', fontMap[fontFamily]);
    root.style.setProperty('--font-size-base', `${fontSize}px`);
    body.style.fontFamily = fontMap[fontFamily];
    body.style.fontSize = `${fontSize}px`;
    
    // Apply wallpaper
    if (wallpaper) {
      body.style.backgroundImage = `url(${wallpaper})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
      
      // Make main containers semi-transparent to show wallpaper
      const wallpaperStyle = document.createElement('style');
      wallpaperStyle.id = 'wallpaper-style';
      const existingWallpaperStyle = document.getElementById('wallpaper-style');
      if (existingWallpaperStyle) {
        existingWallpaperStyle.remove();
      }
      
      wallpaperStyle.textContent = `
        body {
          background-image: url(${wallpaper}) !important;
          background-size: cover !important;
          background-position: center !important;
          background-attachment: fixed !important;
          background-repeat: no-repeat !important;
        }
        
        /* Main app container */
        .flex.h-screen {
          background-color: transparent !important;
        }
        
        /* All dark backgrounds become semi-transparent */
        .bg-\\[\\#0a1628\\] {
          background-color: rgba(10, 22, 40, 0.75) !important;
          backdrop-filter: blur(12px);
        }
        .bg-\\[\\#0f1c2e\\] {
          background-color: rgba(15, 28, 46, 0.75) !important;
          backdrop-filter: blur(12px);
        }
        .bg-\\[\\#0b1525\\] {
          background-color: rgba(11, 21, 37, 0.85) !important;
          backdrop-filter: blur(12px);
        }
        .bg-\\[\\#1a2539\\] {
          background-color: rgba(26, 37, 57, 0.75) !important;
          backdrop-filter: blur(8px);
        }
        
        /* Sidebars */
        aside {
          background-color: rgba(11, 21, 37, 0.85) !important;
          backdrop-filter: blur(12px);
        }
        
        /* Main content area */
        main {
          background-color: rgba(15, 28, 46, 0.7) !important;
          backdrop-filter: blur(12px);
        }
        
        /* Header */
        .bg-\\[\\#0a1628\\]\\/50 {
          background-color: rgba(10, 22, 40, 0.6) !important;
          backdrop-filter: blur(12px);
        }
        
        /* Gradient backgrounds */
        .bg-gradient-to-b {
          background: rgba(15, 28, 46, 0.5) !important;
        }
        
        /* Cards and panels */
        .bg-gray-800,
        .bg-gray-900 {
          background-color: rgba(31, 41, 55, 0.7) !important;
          backdrop-filter: blur(8px);
        }
      `;
      document.head.appendChild(wallpaperStyle);
      
      console.log('🖼️ Wallpaper applied!');
    } else {
      body.style.backgroundImage = '';
      
      // Remove wallpaper styles
      const existingWallpaperStyle = document.getElementById('wallpaper-style');
      if (existingWallpaperStyle) {
        existingWallpaperStyle.remove();
      }
      
      console.log('🖼️ Wallpaper removed');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorTheme', colorTheme);
    localStorage.setItem('customPrimaryColor', customPrimaryColor);
    localStorage.setItem('customAccentColor', customAccentColor);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('bubbleStyle', bubbleStyle);
    if (wallpaper) {
      localStorage.setItem('wallpaper', wallpaper);
    } else {
      localStorage.removeItem('wallpaper');
    }
    
    console.log('✅ Theme applied successfully!');
  }, [theme, colorTheme, customPrimaryColor, customAccentColor, fontFamily, fontSize, bubbleStyle, wallpaper]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colorTheme,
        setColorTheme,
        customPrimaryColor,
        setCustomPrimaryColor,
        customAccentColor,
        setCustomAccentColor,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        bubbleStyle,
        setBubbleStyle,
        wallpaper,
        setWallpaper,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
