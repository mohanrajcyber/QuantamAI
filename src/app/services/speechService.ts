/**
 * Speech Service - Voice Input & Text-to-Speech
 * Supports Tamil, Hindi, English
 * Perfect for "AI for Bharat" theme!
 */

export type SupportedLanguage = 'en-IN' | 'ta-IN' | 'hi-IN';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' }
];

class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private currentLanguage: SupportedLanguage = 'en-IN';

  constructor() {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  /**
   * Check if speech recognition is supported
   */
  isRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Check if text-to-speech is supported
   */
  isSynthesisSupported(): boolean {
    return this.synthesis !== null;
  }

  /**
   * Set current language
   */
  setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  /**
   * Start voice recognition
   */
  startRecognition(
    onResult: (text: string) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.recognition.lang = this.currentLanguage;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice input:', transcript);
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
    };

    this.recognition.start();
    console.log('🎤 Listening in', this.currentLanguage);
  }

  /**
   * Stop voice recognition
   */
  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Speak text (Text-to-Speech)
   */
  speak(text: string, language?: SupportedLanguage): void {
    if (!this.synthesis) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language || this.currentLanguage;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a voice for the selected language
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    console.log('🔊 Speaking:', text.substring(0, 50) + '...');
    this.synthesis.speak(utterance);
  }

  /**
   * Stop speaking
   */
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Translate text to selected language (using AI)
   */
  async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    // This will use the AI service to translate
    // For now, return original text
    return text;
  }
}

// Export singleton instance
export const speechService = new SpeechService();

// Load voices when available
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('🔊 Voices loaded:', speechService.getVoices().length);
  };
}
