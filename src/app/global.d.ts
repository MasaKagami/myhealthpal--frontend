// src/global.d.ts

interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;
    onstart: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    length: number;
    item: (index: number) => SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item: (index: number) => SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  