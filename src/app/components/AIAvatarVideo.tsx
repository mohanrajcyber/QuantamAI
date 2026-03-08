import { useEffect, useRef, useState } from 'react';

export type AIState = 
  | 'idle'           // Default - breathing, occasional blink
  | 'userTyping'     // User is typing - attentive
  | 'thinking'       // AI processing - head tilt + glow
  | 'confident'      // High confidence response - bounce/sparkle
  | 'neutral'        // Normal response
  | 'confused'       // Low confidence - head shake
  | 'error'          // Error - glitch effect
  | 'greeting';      // Initial greeting

interface AIAvatarVideoProps {
  state: AIState;
}

export function AIAvatarVideo({ state }: AIAvatarVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState('/cute robot v/Gen-4 Turbo cute futuristic AI assistant robot,rounded head, glowing blue eyes,premium SaaS mascot,friendly but intelligent,not childish, not toy,dark background,high quality, 3D cartoon style 3771318.mp4');

  // Map states to video files and specific timestamps/behaviors
  const getVideoForState = (aiState: AIState) => {
    switch (aiState) {
      case 'greeting':
        // Happy, waving, bye bye - use reactions video
        return {
          video: '/cute robot v/Gen-4 Turbo add more reactions , sad, happy, sleep , dance , bye bye , love you , add more moements and actions sway etc 1152644754.mp4',
          startTime: 0, // Happy/greeting/bye bye section
          loop: false,
          playbackRate: 1.0
        };
      
      case 'confident':
        // Happy, dance, love you - use reactions video
        return {
          video: '/cute robot v/Gen-4 Turbo add more reactions , sad, happy, sleep , dance , bye bye , love you , add more moements and actions sway etc 1152644754.mp4',
          startTime: 2, // Happy/confident section
          loop: false,
          playbackRate: 1.0
        };
      
      case 'thinking':
        // Thinking, processing animation - use thinking video
        return {
          video: '/cute robot v/Gen-4 Turbo 2449235507.mp4',
          startTime: 0,
          loop: true,
          playbackRate: 1.0
        };
      
      case 'confused':
        // Sad, confused reactions - use reactions video
        return {
          video: '/cute robot v/Gen-4 Turbo add more reactions , sad, happy, sleep , dance , bye bye , love you , add more moements and actions sway etc 1152644754.mp4',
          startTime: 5, // Sad/confused section
          loop: false,
          playbackRate: 1.0
        };
      
      case 'error':
        // Error/sad - use reactions video
        return {
          video: '/cute robot v/Gen-4 Turbo add more reactions , sad, happy, sleep , dance , bye bye , love you , add more moements and actions sway etc 1152644754.mp4',
          startTime: 6, // Error/sad section
          loop: false,
          playbackRate: 1.0
        };
      
      case 'userTyping':
        // Attentive, listening - use idle video
        return {
          video: '/cute robot v/Gen-4 Turbo cute futuristic AI assistant robot,rounded head, glowing blue eyes,premium SaaS mascot,friendly but intelligent,not childish, not toy,dark background,high quality, 3D cartoon style 3771318.mp4',
          startTime: 0,
          loop: true,
          playbackRate: 1.0
        };
      
      case 'idle':
      case 'neutral':
      default:
        // Idle breathing animation - use idle video
        return {
          video: '/cute robot v/Gen-4 Turbo cute futuristic AI assistant robot,rounded head, glowing blue eyes,premium SaaS mascot,friendly but intelligent,not childish, not toy,dark background,high quality, 3D cartoon style 3771318.mp4',
          startTime: 0,
          loop: true,
          playbackRate: 1.0
        };
    }
  };

  useEffect(() => {
    const videoConfig = getVideoForState(state);
    
    if (videoRef.current) {
      // Change video source if different
      if (currentVideo !== videoConfig.video) {
        setCurrentVideo(videoConfig.video);
        // Wait for video to load before setting properties
        videoRef.current.onloadeddata = () => {
          if (videoRef.current) {
            videoRef.current.loop = videoConfig.loop;
            videoRef.current.playbackRate = videoConfig.playbackRate;
            videoRef.current.currentTime = videoConfig.startTime;
            videoRef.current.play().catch(err => {
              console.log('Video autoplay prevented:', err);
            });
          }
        };
      } else {
        // Same video, just update properties
        videoRef.current.loop = videoConfig.loop;
        videoRef.current.playbackRate = videoConfig.playbackRate;
        videoRef.current.currentTime = videoConfig.startTime;
        videoRef.current.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      }
    }
  }, [state, currentVideo]);

  const getStateLabel = () => {
    switch (state) {
      case 'greeting':
        return 'Welcome! Ready to Assist';
      case 'idle':
        return 'Idle - Awaiting Input';
      case 'userTyping':
        return 'Listening...';
      case 'thinking':
        return 'Processing Your Request';
      case 'confident':
        return 'High Confidence Response';
      case 'neutral':
        return 'Responding';
      case 'confused':
        return 'Uncertain - Low Confidence';
      case 'error':
        return 'Error Occurred';
      default:
        return 'Ready';
    }
  };

  const getStateDescription = () => {
    switch (state) {
      case 'greeting':
        return 'Visual AI Presence';
      case 'idle':
        return 'Breathing gently';
      case 'userTyping':
        return 'Paying attention';
      case 'thinking':
        return 'Deep processing';
      case 'confident':
        return 'Very sure!';
      case 'confused':
        return 'Needs clarification';
      case 'error':
        return 'Something went wrong';
      default:
        return 'Visual AI Presence';
    }
  };

  return (
    <div className="w-full">
      {/* Video */}
      <video
        ref={videoRef}
        src={currentVideo}
        className="w-full h-auto object-cover rounded-lg"
        muted
        playsInline
        autoPlay
        style={{ aspectRatio: '16/9' }}
      />
      
      {/* State Labels */}
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-gray-200">
          {getStateLabel()}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {getStateDescription()}
        </div>
      </div>
    </div>
  );
}
