import { speechRecognitionService } from '../speech/speechRecognitionService';

// Pronunciation guides using International Phonetic Alphabet (IPA)
export const pronunciationGuides = {
  basicSymptoms: {
    headache: {
      ipa: "ˈhɛdeɪk",
      audioUrl: "/audio/medical/headache.mp3",
      syllables: "head·ache",
      stress: "First syllable",
      tips: [
        "Stress 'head' more than 'ache'",
        "Short 'e' sound in 'head'",
        "Long 'a' sound in 'ache'"
      ],
      commonErrors: {
        th: "Difficulty with 'h' sound",
        vi: "Final 'k' sound may be unclear",
        zh: "Stress pattern may be reversed",
        ja: "May add vowel after final 'k'"
      }
    },
    fever: {
      ipa: "ˈfiːvər",
      audioUrl: "/audio/medical/fever.mp3",
      syllables: "fe·ver",
      stress: "First syllable",
      tips: [
        "Long 'ee' sound in first syllable",
        "Soft 'v' sound",
        "Unstressed 'er' ending"
      ],
      commonErrors: {
        th: "May confuse 'v' with 'w'",
        vi: "Final 'r' may be omitted",
        zh: "Length of first vowel may be short",
        ja: "May pronounce as 'fee-baa'"
      }
    }
  },

  medications: {
    antibiotic: {
      ipa: "ˌæntibʌɪˈɒtɪk",
      audioUrl: "/audio/medical/antibiotic.mp3",
      syllables: "an·ti·bi·o·tic",
      stress: "Fourth syllable",
      tips: [
        "Five syllables with stress on 'o'",
        "Clear 't' sound",
        "Short 'i' in first syllable"
      ],
      commonErrors: {
        th: "May stress wrong syllable",
        vi: "Difficulty with 'ti' combination",
        zh: "May compress syllables",
        ja: "May add vowels between consonants"
      }
    },
    painkiller: {
      ipa: "ˈpeɪnˌkɪlər",
      audioUrl: "/audio/medical/painkiller.mp3",
      syllables: "pain·kil·ler",
      stress: "First syllable",
      tips: [
        "Strong stress on 'pain'",
        "Clear 'k' sound",
        "Unstressed final syllable"
      ]
    }
  },

  medicalProcedures: {
    xray: {
      ipa: "ˈɛksreɪ",
      audioUrl: "/audio/medical/xray.mp3",
      syllables: "x·ray",
      stress: "Equal stress",
      tips: [
        "Pronounce 'x' as 'eks'",
        "Long 'a' sound in 'ray'",
        "Both parts clearly separated"
      ]
    }
  }
};

// Audio playback service
export const pronunciationAudio = {
  play: async (term) => {
    try {
      const audio = new Audio(findAudioUrl(term));
      await audio.play();
      return true;
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      return false;
    }
  },

  record: async () => {
    try {
      const recording = await speechRecognitionService.startRecording();
      return recording;
    } catch (error) {
      console.error('Error recording pronunciation:', error);
      return null;
    }
  },

  compare: async (original, recorded) => {
    try {
      const similarity = await speechRecognitionService.comparePronunciation(
        original,
        recorded
      );
      return {
        score: similarity.score,
        feedback: generatePronunciationFeedback(similarity)
      };
    } catch (error) {
      console.error('Error comparing pronunciations:', error);
      return null;
    }
  }
};

// Helper functions
const findAudioUrl = (term) => {
  for (const category of Object.values(pronunciationGuides)) {
    if (category[term]?.audioUrl) {
      return category[term].audioUrl;
    }
  }
  return null;
};

const generatePronunciationFeedback = (similarity) => {
  const feedback = [];
  
  if (similarity.score >= 0.9) {
    feedback.push("Excellent pronunciation!");
  } else if (similarity.score >= 0.7) {
    feedback.push("Good pronunciation. Minor improvements possible:");
    if (similarity.issues.stress) {
      feedback.push("- Pay attention to word stress");
    }
    if (similarity.issues.vowels) {
      feedback.push("- Focus on vowel sounds");
    }
  } else {
    feedback.push("Areas for improvement:");
    if (similarity.issues.stress) {
      feedback.push("- Word stress needs adjustment");
    }
    if (similarity.issues.vowels) {
      feedback.push("- Vowel sounds need practice");
    }
    if (similarity.issues.consonants) {
      feedback.push("- Consonant sounds need clarity");
    }
  }

  return feedback.join("\n");
};

// Practice session generator
export const generatePronunciationExercise = (level = 1, category = null) => {
  const terms = [];
  
  Object.entries(pronunciationGuides).forEach(([cat, words]) => {
    if (!category || category === cat) {
      Object.entries(words).forEach(([word, guide]) => {
        terms.push({
          word,
          ...guide,
          practice: [
            "Listen to the pronunciation",
            "Practice each syllable separately",
            "Record your pronunciation",
            "Compare with the original"
          ]
        });
      });
    }
  });

  return terms;
};

export default {
  pronunciationGuides,
  pronunciationAudio,
  generatePronunciationExercise
}; 