const LANGUAGE_MARKERS = {
  ENGLISH: '🇬🇧',
  NATIVE: {
    th: '🇹🇭',
    vi: '🇻🇳',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷'
  }
};

export const parseResponse = {
  // Parse bilingual conversation responses
  conversation: (response) => {
    const lines = response.split('\n');
    const parsed = {
      english: '',
      native: '',
      corrections: []
    };

    lines.forEach(line => {
      if (line.startsWith(LANGUAGE_MARKERS.ENGLISH)) {
        parsed.english = line.replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
      } else if (Object.values(LANGUAGE_MARKERS.NATIVE).some(marker => line.startsWith(marker))) {
        parsed.native = line.substring(line.indexOf(' ')).trim();
      } else if (line.toLowerCase().includes('correction')) {
        parsed.corrections.push(line.trim());
      }
    });

    return parsed;
  },

  // Parse grammar explanations
  grammar: (response, nativeLanguage) => {
    const sections = response.split('\n\n');
    const parsed = {
      explanation: {
        english: '',
        native: ''
      },
      examples: {
        english: [],
        native: []
      },
      commonMistakes: []
    };

    sections.forEach(section => {
      if (section.startsWith('Explanation:')) {
        const [english, native] = section.split('\n').slice(1);
        parsed.explanation.english = english.replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
        parsed.explanation.native = native.replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim();
      } else if (section.startsWith('Examples:')) {
        const examples = section.split('\n').slice(1);
        examples.forEach((ex, i) => {
          if (i % 2 === 0) {
            parsed.examples.english.push(ex.replace(LANGUAGE_MARKERS.ENGLISH, '').trim());
          } else {
            parsed.examples.native.push(ex.replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim());
          }
        });
      } else if (section.startsWith('Common Mistakes:')) {
        parsed.commonMistakes = section.split('\n').slice(1).map(line => line.trim());
      }
    });

    return parsed;
  },

  // Parse vocabulary explanations
  vocabulary: (response, nativeLanguage) => {
    const sections = response.split('\n\n');
    const parsed = {
      definition: {
        english: '',
        native: ''
      },
      pronunciation: '',
      examples: {
        english: [],
        native: []
      },
      synonyms: {
        english: [],
        native: []
      },
      antonyms: {
        english: [],
        native: []
      },
      usage: {
        english: '',
        native: ''
      }
    };

    sections.forEach(section => {
      const [header, ...content] = section.split('\n');
      
      switch (header.toLowerCase()) {
        case 'definition:':
          parsed.definition.english = content[0].replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
          parsed.definition.native = content[1].replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim();
          break;
        case 'pronunciation:':
          parsed.pronunciation = content[0].trim();
          break;
        case 'examples:':
          content.forEach((ex, i) => {
            if (i % 2 === 0) {
              parsed.examples.english.push(ex.replace(LANGUAGE_MARKERS.ENGLISH, '').trim());
            } else {
              parsed.examples.native.push(ex.replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim());
            }
          });
          break;
        case 'synonyms:':
          const synonymPairs = content[0].split(',').map(pair => pair.trim());
          synonymPairs.forEach(pair => {
            const [eng, nat] = pair.split('/').map(word => word.trim());
            parsed.synonyms.english.push(eng);
            parsed.synonyms.native.push(nat);
          });
          break;
        case 'antonyms:':
          const antonymPairs = content[0].split(',').map(pair => pair.trim());
          antonymPairs.forEach(pair => {
            const [eng, nat] = pair.split('/').map(word => word.trim());
            parsed.antonyms.english.push(eng);
            parsed.antonyms.native.push(nat);
          });
          break;
        case 'usage:':
          parsed.usage.english = content[0].replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
          parsed.usage.native = content[1].replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim();
          break;
      }
    });

    return parsed;
  },

  // Parse cultural context explanations
  cultural: (response, nativeLanguage) => {
    const sections = response.split('\n\n');
    const parsed = {
      meaning: {
        english: '',
        native: ''
      },
      cultural_context: {
        english: '',
        native: ''
      },
      equivalent_expressions: [],
      usage_examples: {
        english: [],
        native: []
      }
    };

    sections.forEach(section => {
      const [header, ...content] = section.split('\n');
      
      switch (header.toLowerCase()) {
        case 'meaning:':
          parsed.meaning.english = content[0].replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
          parsed.meaning.native = content[1].replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim();
          break;
        case 'cultural context:':
          parsed.cultural_context.english = content[0].replace(LANGUAGE_MARKERS.ENGLISH, '').trim();
          parsed.cultural_context.native = content[1].replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim();
          break;
        case 'equivalent expressions:':
          parsed.equivalent_expressions = content.map(line => {
            const [eng, nat] = line.split('=').map(expr => expr.trim());
            return { english: eng, native: nat };
          });
          break;
        case 'usage examples:':
          content.forEach((ex, i) => {
            if (i % 2 === 0) {
              parsed.usage_examples.english.push(ex.replace(LANGUAGE_MARKERS.ENGLISH, '').trim());
            } else {
              parsed.usage_examples.native.push(ex.replace(LANGUAGE_MARKERS.NATIVE[nativeLanguage], '').trim());
            }
          });
          break;
      }
    });

    return parsed;
  }
};

export default parseResponse; 