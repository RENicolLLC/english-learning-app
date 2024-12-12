import { DatabaseService } from '../../../services/database';

export async function seedThaiTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();

  const commonPhrases = [
    {
      english: 'Hello',
      text: 'สวัสดี',
      romanization: 'Sawadee',
      context: 'greeting',
      usage_notes: 'Add ครับ (khrap) for male speaker or ค่ะ (kha) for female speaker to be polite'
    },
    {
      english: 'Thank you',
      text: 'ขอบคุณ',
      romanization: 'Khop khun',
      context: 'courtesy',
      usage_notes: 'Add ครับ/ค่ะ for politeness. Formal: ขอบคุณมาก (Khop khun maak)'
    },
    {
      english: "I don't understand",
      text: 'ไม่เข้าใจ',
      romanization: 'Mai khao jai',
      context: 'classroom',
      usage_notes: 'Polite way to indicate lack of understanding'
    },
    {
      english: 'Excuse me',
      text: 'ขอโทษ',
      romanization: 'Khor thot',
      context: 'courtesy',
      usage_notes: 'Used for both "excuse me" and "sorry"'
    }
  ];

  const grammarPatterns = [
    {
      english_pattern: 'Subject + Verb + Object',
      translated_pattern: 'ประธาน + กริยา + กรรม',
      explanation: 'ภาษาไทยใช้โครงสร้างประโยคคล้ายภาษาอังกฤษ แต่ไม่มีการเปลี่ยนรูปกริยาตามกาล',
      examples: [
        { 
          english: 'I eat rice', 
          thai: 'ผมกินข้าว', 
          romanization: 'Phom kin khao',
          notes: 'No verb conjugation needed'
        },
        { 
          english: 'She reads books', 
          thai: 'เธออ่านหนังสือ', 
          romanization: 'Ther aan nang-sue' 
        }
      ],
      difficulty_level: 1
    },
    {
      english_pattern: 'Past tense',
      translated_pattern: 'การแสดงอดีตกาล',
      explanation: 'ใช้คำว่า "แล้ว" หรือ "เมื่อวาน" เพื่อแสดงอดีตกาล',
      examples: [
        { 
          english: 'I ate already', 
          thai: 'ผมกินแล้ว', 
          romanization: 'Phom kin laew',
          notes: 'แล้ว (laew) indicates completion'
        }
      ],
      difficulty_level: 2
    }
  ];

  const commonMistakes = [
    {
      english_correct: 'I am a teacher',
      english_mistake: 'I am teacher',
      native_explanation: 'ในภาษาอังกฤษต้องใช้ a/an นำหน้าอาชีพ แต่ในภาษาไทยไม่ต้องใช้',
      correction_tips: [
        'เมื่อพูดถึงอาชีพต้องใช้ a/an',
        'ภาษาไทยพูด "ผมเป็นครู" แต่ภาษาอังกฤษต้องพูด "I am a teacher"'
      ]
    },
    {
      english_correct: 'She is beautiful',
      english_mistake: 'She beautiful',
      native_explanation: 'ต้องใช้ is/am/are ในประโยคที่มี adjective',
      correction_tips: [
        'ประโยคที่มี adjective ต้องมี verb to be',
        'ภาษาไทยพูด "เธอสวย" แต่ภาษาอังกฤษต้องพูด "She is beautiful"'
      ]
    }
  ];

  const idioms = [
    {
      english_idiom: 'Time is money',
      translated_idiom: 'เวลาเป็นเงินเป็นทอง',
      literal_translation: 'Time is money is gold',
      romanization: 'Wela pen ngern pen thong',
      meaning_explanation: 'Similar concept in both cultures about the value of time',
      usage_examples: [
        {
          english: "Don't waste time, time is money",
          thai: "อย่าเสียเวลา เวลาเป็นเงินเป็นทอง",
          romanization: "Yaa sia wela, wela pen ngern pen thong"
        }
      ]
    }
  ];

  // Insert common phrases
  for (const phrase of commonPhrases) {
    await db.pool.query(`
      INSERT INTO translations (
        english_text,
        language_code,
        translation,
        romanization,
        context_category,
        usage_notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [
      phrase.english,
      'th',
      phrase.text,
      phrase.romanization,
      phrase.context,
      phrase.usage_notes
    ]);
  }

  // Insert grammar patterns
  for (const pattern of grammarPatterns) {
    await db.pool.query(`
      INSERT INTO grammar_translations (
        english_pattern,
        language_code,
        translated_pattern,
        explanation,
        usage_examples,
        difficulty_level
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [
      pattern.english_pattern,
      'th',
      pattern.translated_pattern,
      pattern.explanation,
      JSON.stringify(pattern.examples),
      pattern.difficulty_level
    ]);
  }

  // Insert common mistakes
  for (const mistake of commonMistakes) {
    await db.pool.query(`
      INSERT INTO language_specific_mistakes (
        language_code,
        english_correct,
        english_mistake,
        native_explanation,
        correction_tips
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
    `, [
      'th',
      mistake.english_correct,
      mistake.english_mistake,
      mistake.native_explanation,
      mistake.correction_tips
    ]);
  }

  // Insert idioms
  for (const idiom of idioms) {
    await db.pool.query(`
      INSERT INTO idioms_translations (
        english_idiom,
        language_code,
        translated_idiom,
        literal_translation,
        meaning_explanation,
        usage_examples
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [
      idiom.english_idiom,
      'th',
      idiom.translated_idiom,
      idiom.literal_translation,
      idiom.meaning_explanation,
      JSON.stringify(idiom.usage_examples)
    ]);
  }
} 