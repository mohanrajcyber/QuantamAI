export type AIState = 
  | 'idle'           // Default - breathing, occasional blink
  | 'userTyping'     // User is typing - attentive
  | 'thinking'       // AI processing - head tilt + glow
  | 'confident'      // High confidence response - bounce/sparkle
  | 'neutral'        // Normal response
  | 'confused'       // Low confidence - head shake
  | 'error'          // Error - glitch effect
  | 'greeting';      // Initial greeting

interface AIAvatarProps {
  state: AIState;
  size?: 'sm' | 'md' | 'lg';
}

export function AIAvatar({ state, size = 'lg' }: AIAvatarProps) {
  const getStateColor = () => {
    switch (state) {
      case 'confident':
        return { 
          primary: 'from-emerald-400 via-green-400 to-teal-500', 
          secondary: 'from-emerald-300 to-green-400',
          glow: 'shadow-green-400/60',
          accent: '#10b981'
        };
      case 'thinking':
        return { 
          primary: 'from-purple-400 via-violet-400 to-pink-500', 
          secondary: 'from-purple-300 to-violet-400',
          glow: 'shadow-purple-400/60',
          accent: '#a855f7'
        };
      case 'confused':
        return { 
          primary: 'from-yellow-400 via-amber-400 to-orange-500', 
          secondary: 'from-yellow-300 to-amber-400',
          glow: 'shadow-yellow-400/60',
          accent: '#f59e0b'
        };
      case 'error':
        return { 
          primary: 'from-red-400 via-rose-400 to-pink-500', 
          secondary: 'from-red-300 to-rose-400',
          glow: 'shadow-red-400/60',
          accent: '#ef4444'
        };
      case 'userTyping':
        return { 
          primary: 'from-blue-400 via-sky-400 to-cyan-500', 
          secondary: 'from-blue-300 to-sky-400',
          glow: 'shadow-blue-400/60',
          accent: '#3b82f6'
        };
      default:
        return { 
          primary: 'from-cyan-400 via-blue-400 to-indigo-500', 
          secondary: 'from-cyan-300 to-blue-400',
          glow: 'shadow-cyan-400/60',
          accent: '#06b6d4'
        };
    }
  };

  const colors = getStateColor();

  const getAnimationClass = () => {
    switch (state) {
      case 'idle':
      case 'greeting':
        return 'animate-breathe';
      case 'userTyping':
        return 'animate-attentive';
      case 'thinking':
        return 'animate-processing';
      case 'confident':
        return 'animate-success';
      case 'confused':
        return 'animate-shake';
      case 'error':
        return 'animate-glitch';
      default:
        return '';
    }
  };

  const renderFace = () => {
    switch (state) {
      case 'confident':
        return (
          <>
            <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-white rounded-full shadow-lg">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
            </div>
            <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-white rounded-full shadow-lg">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
            </div>
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-8 h-3 border-b-[3px] border-white rounded-b-2xl"></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          </>
        );
      
      case 'thinking':
        return (
          <>
            <div className="absolute top-[25%] left-[30%] w-3 h-3 bg-white rounded-full shadow-lg"></div>
            <div className="absolute top-[25%] right-[30%] w-3 h-3 bg-white rounded-full shadow-lg"></div>
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-white rounded-full"></div>
            <div className="absolute -top-2 right-0 flex gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </>
        );
      
      case 'confused':
        return (
          <>
            <div className="absolute top-[25%] left-[25%] w-3 h-3 bg-white rounded-full shadow-lg"></div>
            <div className="absolute top-[32%] right-[25%] w-3 h-3 bg-white rounded-full shadow-lg"></div>
            <svg className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-8 h-3" viewBox="0 0 32 12">
              <path d="M 4 6 Q 8 3, 12 6 T 20 6 T 28 6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </>
        );
      
      case 'error':
        return (
          <>
            <div className="absolute top-[30%] left-[25%] w-3 h-3">
              <div className="absolute w-full h-1 bg-white rotate-45 rounded-full"></div>
              <div className="absolute w-full h-1 bg-white -rotate-45 rounded-full"></div>
            </div>
            <div className="absolute top-[30%] right-[25%] w-3 h-3">
              <div className="absolute w-full h-1 bg-white rotate-45 rounded-full"></div>
              <div className="absolute w-full h-1 bg-white -rotate-45 rounded-full"></div>
            </div>
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-8 h-3 border-t-[3px] border-white rounded-t-2xl"></div>
          </>
        );
      
      case 'userTyping':
        return (
          <>
            <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-white rounded-full shadow-lg animate-pulse">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-white rounded-full shadow-lg animate-pulse">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-7 h-2.5 border-b-[3px] border-white rounded-b-xl"></div>
          </>
        );
      
      default:
        return (
          <>
            <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-white rounded-full shadow-lg animate-blink">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            </div>
            <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-white rounded-full shadow-lg animate-blink">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            </div>
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-7 h-2.5 border-b-[3px] border-white rounded-b-xl"></div>
          </>
        );
    }
  };

  return (
    <div className={`relative w-40 h-48 ${getAnimationClass()}`}>
      {/* Outer glow aura */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} rounded-[3rem] blur-2xl opacity-30 ${colors.glow} ${
        state === 'thinking' ? 'animate-pulse' : ''
      }`}></div>
      
      {/* Robot container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Antenna with glowing tip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className={`w-3 h-3 bg-white rounded-full shadow-2xl ${colors.glow} ${
            state === 'thinking' ? 'animate-ping' : 
            state === 'userTyping' ? 'animate-pulse' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full"></div>
          </div>
          <div className="w-1.5 h-4 bg-gradient-to-b from-white via-white/80 to-transparent rounded-full shadow-lg"></div>
        </div>

        {/* Head with helmet design */}
        <div className={`relative w-20 h-20 bg-gradient-to-br ${colors.primary} rounded-3xl shadow-2xl border-[3px] border-white/40 overflow-hidden`}>
          {/* Helmet shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/30 to-transparent"></div>
          
          {/* Visor/face plate */}
          <div className="absolute inset-2 bg-gradient-to-br from-black/20 to-black/40 rounded-2xl border border-white/20">
            {renderFace()}
          </div>
          
          {/* Helmet details */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full"></div>
        </div>

        {/* Neck connector */}
        <div className={`relative w-8 h-2 bg-gradient-to-br ${colors.secondary} rounded-lg shadow-lg border border-white/30 mt-0.5`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg"></div>
        </div>

        {/* Body/Torso */}
        <div className={`relative w-16 h-20 mt-0.5 bg-gradient-to-br ${colors.primary} rounded-2xl shadow-2xl border-[3px] border-white/30`}>
          {/* Body shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-2xl"></div>
          
          {/* Chest panel/core */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-xl border-2 border-white/30 shadow-inner">
            <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
            <div className={`absolute inset-2 bg-gradient-to-br ${colors.secondary} rounded-lg ${
              state === 'thinking' ? 'animate-pulse' : ''
            }`}></div>
          </div>
          
          {/* Body details */}
          <div className="absolute bottom-3 left-2 right-2 h-1 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-5 left-3 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-5 right-3 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Arms */}
        <div className={`absolute top-24 left-2 w-5 h-12 bg-gradient-to-br ${colors.primary} rounded-xl shadow-xl border-2 border-white/30 ${
          state === 'greeting' || state === 'confident' ? 'animate-wave-left' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br ${colors.secondary} rounded-lg border border-white/30"></div>
        </div>
        <div className={`absolute top-24 right-2 w-5 h-12 bg-gradient-to-br ${colors.primary} rounded-xl shadow-xl border-2 border-white/30 ${
          state === 'userTyping' ? 'animate-wave-right' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-l from-white/30 to-transparent rounded-xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br ${colors.secondary} rounded-lg border border-white/30"></div>
        </div>

        {/* Legs */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          <div className={`relative w-5 h-10 bg-gradient-to-br ${colors.primary} rounded-xl shadow-xl border-2 border-white/30`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
            {/* Foot */}
            <div className={`absolute -bottom-1 -left-1 w-7 h-3 bg-gradient-to-br ${colors.secondary} rounded-b-xl rounded-tr-xl border-2 border-white/30 shadow-lg`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-b-xl"></div>
            </div>
          </div>
          <div className={`relative w-5 h-10 bg-gradient-to-br ${colors.primary} rounded-xl shadow-xl border-2 border-white/30`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
            {/* Foot */}
            <div className={`absolute -bottom-1 -left-1 w-7 h-3 bg-gradient-to-br ${colors.secondary} rounded-b-xl rounded-tr-xl border-2 border-white/30 shadow-lg`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-b-xl"></div>
            </div>
          </div>
        </div>

        {/* Ground shadow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-3 bg-black/30 rounded-full blur-md"></div>
      </div>
    </div>
  );
}
