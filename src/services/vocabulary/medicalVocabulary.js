// Medical Vocabulary Database
export const medicalVocabulary = {
  basicSymptoms: {
    category: "Basic Symptoms",
    level: 1,
    terms: {
      headache: {
        term: "headache",
        definition: "Pain in the head or upper neck",
        usage: "I have a severe headache.",
        type: "noun",
        translations: {
          th: "ปวดหัว",
          vi: "đau đầu",
          zh: "头痛",
          ja: "頭痛"
        },
        synonyms: ["migraine", "head pain"],
        collocations: ["severe headache", "mild headache", "chronic headache"]
      },
      fever: {
        term: "fever",
        definition: "Body temperature above normal",
        usage: "The child has a high fever.",
        type: "noun",
        translations: {
          th: "ไข้",
          vi: "sốt",
          zh: "发烧",
          ja: "熱"
        },
        synonyms: ["temperature", "high temperature"],
        collocations: ["high fever", "low-grade fever", "break a fever"]
      },
      cough: {
        term: "cough",
        definition: "Sudden expulsion of air from lungs",
        usage: ["I have a dry cough", "The cough has lasted for days"],
        type: "noun/verb",
        translations: {
          th: "ไอ",
          vi: "ho",
          zh: "咳嗽",
          ja: "咳"
        },
        synonyms: ["hack", "wheeze"],
        collocations: ["dry cough", "persistent cough", "chronic cough"]
      }
    }
  },

  bodyParts: {
    category: "Body Parts",
    level: 1,
    terms: {
      head: {
        term: "head",
        definition: "Upper part of body containing brain",
        usage: "The doctor examined my head.",
        type: "noun",
        translations: {
          th: "ศีรษะ",
          vi: "đầu",
          zh: "头",
          ja: "頭"
        },
        relatedTerms: ["skull", "brain", "scalp"]
      },
      chest: {
        term: "chest",
        definition: "Upper front part of torso",
        usage: "The doctor listened to my chest with a stethoscope.",
        type: "noun",
        translations: {
          th: "หน้าอก",
          vi: "ngực",
          zh: "胸部",
          ja: "胸"
        },
        relatedTerms: ["thorax", "breast", "ribcage"]
      }
    }
  },

  medications: {
    category: "Medications",
    level: 2,
    terms: {
      painkiller: {
        term: "painkiller",
        definition: "Medicine that relieves pain",
        usage: "Take this painkiller every 6 hours.",
        type: "noun",
        translations: {
          th: "ยาแก้ปวด",
          vi: "thuốc giảm đau",
          zh: "止痛药",
          ja: "鎮痛剤"
        },
        synonyms: ["analgesic", "pain reliever"],
        commonTypes: ["aspirin", "ibuprofen", "acetaminophen"]
      },
      antibiotic: {
        term: "antibiotic",
        definition: "Medicine that fights bacterial infections",
        usage: "Complete the full course of antibiotics.",
        type: "noun",
        translations: {
          th: "ยาปฏิชีวนะ",
          vi: "kháng sinh",
          zh: "抗生素",
          ja: "抗生物質"
        },
        warnings: ["Complete full course", "May cause side effects"],
        commonTypes: ["penicillin", "amoxicillin", "tetracycline"]
      }
    }
  },

  medicalProcedures: {
    category: "Medical Procedures",
    level: 3,
    terms: {
      xray: {
        term: "X-ray",
        definition: "Imaging test using radiation",
        usage: "The doctor ordered a chest X-ray.",
        type: "noun",
        translations: {
          th: "เอ็กซเรย์",
          vi: "chụp X-quang",
          zh: "X光检查",
          ja: "レントゲン"
        },
        types: ["chest X-ray", "dental X-ray", "bone X-ray"],
        preparation: ["Remove metal objects", "Wear hospital gown"]
      },
      bloodTest: {
        term: "blood test",
        definition: "Examination of blood sample",
        usage: "Your blood test results are normal.",
        type: "noun",
        translations: {
          th: "การตรวจเลือด",
          vi: "xét nghiệm máu",
          zh: "验血",
          ja: "血液検査"
        },
        types: ["complete blood count", "cholesterol test", "glucose test"],
        preparation: ["Fasting may be required", "Morning appointment recommended"]
      }
    }
  },

  emergencyTerms: {
    category: "Emergency Terms",
    level: 4,
    terms: {
      emergency: {
        term: "emergency",
        definition: "Serious situation requiring immediate action",
        usage: "This is a medical emergency, call 911.",
        type: "noun",
        translations: {
          th: "ฉุกเฉิน",
          vi: "khẩn cấp",
          zh: "紧急情况",
          ja: "緊急"
        },
        emergencyNumbers: {
          US: "911",
          UK: "999",
          EU: "112",
          TH: "1669",
          JP: "119"
        }
      },
      unconscious: {
        term: "unconscious",
        definition: "Not awake and unaware of surroundings",
        usage: "The patient is unconscious and not responding.",
        type: "adjective",
        translations: {
          th: "หมดสติ",
          vi: "bất tỉnh",
          zh: "失去知觉",
          ja: "意識不明"
        },
        relatedTerms: ["fainting", "blackout", "coma"]
      }
    }
  }
};

// Helper functions for vocabulary access
export const getVocabularyByLevel = (level) => {
  return Object.entries(medicalVocabulary).reduce((acc, [category, data]) => {
    if (data.level === level) {
      acc[category] = data;
    }
    return acc;
  }, {});
};

export const getVocabularyByCategory = (category) => {
  return medicalVocabulary[category] || null;
};

export const searchVocabulary = (searchTerm) => {
  const results = [];
  Object.values(medicalVocabulary).forEach(category => {
    Object.values(category.terms).forEach(term => {
      if (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          ...term,
          category: category.category,
          level: category.level
        });
      }
    });
  });
  return results;
};

export const getRelatedTerms = (term) => {
  const results = [];
  Object.values(medicalVocabulary).forEach(category => {
    Object.values(category.terms).forEach(vocabTerm => {
      if (vocabTerm.relatedTerms?.includes(term) ||
          vocabTerm.synonyms?.includes(term)) {
        results.push(vocabTerm);
      }
    });
  });
  return results;
};

// Vocabulary practice generator
export const generateVocabularyExercise = (level, category = null) => {
  const vocab = category ? 
    getVocabularyByCategory(category) :
    getVocabularyByLevel(level);

  const terms = Object.values(vocab.terms);
  const exercises = terms.map(term => ({
    term: term.term,
    type: 'multiple_choice',
    question: `What is the meaning of "${term.term}"?`,
    options: [
      term.definition,
      // Add distractor options here
      "Incorrect definition 1",
      "Incorrect definition 2",
      "Incorrect definition 3"
    ],
    correctAnswer: term.definition,
    explanation: `${term.term}: ${term.definition}\nExample: ${term.usage}`
  }));

  return exercises;
};

export default {
  medicalVocabulary,
  getVocabularyByLevel,
  getVocabularyByCategory,
  searchVocabulary,
  getRelatedTerms,
  generateVocabularyExercise
}; 