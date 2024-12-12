export const supportedLanguages = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr'
  },
  th: {
    name: 'Thai',
    nativeName: 'ภาษาไทย',
    direction: 'ltr'
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: 'ltr'
  },
  zh: {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr'
  }
};

export const defaultLanguage = 'en';

export const getLanguagePair = (nativeLanguage) => ({
  source: nativeLanguage,
  target: 'en'
});

// CEFR Levels with bilingual descriptions
export const languageLevels = {
  beginner: {
    en: 'Beginner (A1)',
    th: 'ระดับเริ่มต้น (A1)',
    vi: 'Người mới bắt đầu (A1)',
    zh: '初学者 (A1)',
    ja: '初級 (A1)',
    ko: '초급 (A1)'
  },
  intermediate: {
    en: 'Intermediate (B1)',
    th: 'ระดับกลาง (B1)',
    vi: 'Trung cấp (B1)',
    zh: '中级 (B1)',
    ja: '中級 (B1)',
    ko: '중급 (B1)'
  },
  advanced: {
    en: 'Advanced (C1)',
    th: 'ระดับสูง (C1)',
    vi: 'Nâng cao (C1)',
    zh: '高级 (C1)',
    ja: '上級 (C1)',
    ko: '고급 (C1)'
  }
}; 