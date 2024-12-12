import { useEffect, useState, useCallback } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export const useSpeechRecognition = (nativeLanguage = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = nativeLanguage;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          setConfidence(event.results[i][0].confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [nativeLanguage]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setError(null);
      } catch (err) {
        setError('Error starting speech recognition');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  return {
    isListening,
    transcript,
    error,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!recognition
  };
};

// Language-specific configurations
export const languageConfig = {
  'en-US': {
    name: 'English (US)',
    accent: 'American',
    commands: ['start', 'stop', 'reset']
  },
  'th-TH': {
    name: 'Thai',
    accent: 'Standard Thai',
    commands: ['เริ่ม', 'หยุด', 'รีเซ็ต']
  },
  'vi-VN': {
    name: 'Vietnamese',
    accent: 'Standard Vietnamese',
    commands: ['bắt đầu', 'dừng lại', 'đặt lại']
  },
  'zh-CN': {
    name: 'Chinese (Simplified)',
    accent: 'Mandarin',
    commands: ['开始', '停止', '重置']
  },
  'ja-JP': {
    name: 'Japanese',
    accent: 'Standard Japanese',
    commands: ['開始', '停止', 'リセット']
  },
  'ko-KR': {
    name: 'Korean',
    accent: 'Standard Korean',
    commands: ['시작', '정지', '초기화']
  }
};

// Speech synthesis with language support
export const speak = (text, lang = 'en-US') => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);
    window.speechSynthesis.speak(utterance);
  });
};

// Pronunciation assessment
export const assessPronunciation = async (original, spoken, targetLanguage = 'en-US') => {
  // This is a placeholder for actual pronunciation assessment
  // In a real implementation, you would use a service like Azure Speech Services
  return {
    accuracy: 0.85,
    errors: [],
    suggestions: []
  };
};

// Voice commands handler
export const handleVoiceCommand = (command, language = 'en-US') => {
  const commands = languageConfig[language].commands;
  const normalizedCommand = command.toLowerCase().trim();

  switch (normalizedCommand) {
    case commands[0]: // start
      return 'START';
    case commands[1]: // stop
      return 'STOP';
    case commands[2]: // reset
      return 'RESET';
    default:
      return null;
  }
};

export default {
  useSpeechRecognition,
  languageConfig,
  speak,
  assessPronunciation,
  handleVoiceCommand
}; 