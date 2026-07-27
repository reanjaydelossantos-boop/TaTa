// Speech Recognition and Text-To-Speech Helper Utilities

export interface SpeechRecognitionHandlers {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechController {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private accumulatedText: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public isTTSSupported(): boolean {
    return !!this.synth;
  }

  public startListening(handlers: SpeechRecognitionHandlers): boolean {
    if (!this.recognition) {
      handlers.onError('Speech recognition is not supported in this browser environment. You can also type commands or use audio upload.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.accumulatedText = '';

    this.recognition.onresult = (event: any) => {
      let currentInterim = '';
      let newFinals = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newFinals += event.results[i][0].transcript + ' ';
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (newFinals) {
        this.accumulatedText += newFinals;
      }

      const fullText = (this.accumulatedText + currentInterim).trim();
      handlers.onResult(fullText, !!newFinals);
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Ignore temporary silence events during continuous listening
        return;
      }
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      handlers.onError(event.error || 'Speech input error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      handlers.onError(err.message || 'Could not start microphone');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void): boolean {
    if (!this.synth) return false;

    // Stop any current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Pick a natural sounding English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    this.synth.speak(utterance);
    return true;
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechController = new SpeechController();
