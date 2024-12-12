export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  commonIssues: {
    phonemes: string[];
    tones?: boolean;
    stress?: boolean;
    intonation?: boolean;
  };
  writing: {
    usesPinyin?: boolean;
    usesKana?: boolean;
    usesHangul?: boolean;
  };
}

export const supportedLanguages: Record<string, LanguageConfig> = {
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    commonIssues: {
      phonemes: ['th', 'r', 'l', 'v'],
      tones: true,
      stress: false,
      intonation: true
    },
    writing: {
      usesPinyin: true
    }
  },
  'ja': {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    commonIssues: {
      phonemes: ['l', 'r', 'th', 'v', 'f'],
      stress: true,
      intonation: true
    },
    writing: {
      usesKana: true
    }
  },
  'ko': {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    commonIssues: {
      phonemes: ['f', 'v', 'th', 'z'],
      stress: true,
      intonation: true
    },
    writing: {
      usesHangul: true
    }
  },
  'vi': {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: 'ltr',
    commonIssues: {
      phonemes: ['th', 'sh', 'ch'],
      tones: true,
      stress: true
    },
    writing: {
      usesPinyin: false
    }
  }
}; 