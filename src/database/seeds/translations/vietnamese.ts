import { DatabaseService } from '../../../services/database';

export async function seedVietnameseTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();

  const commonPhrases = [
    {
      english: 'Hello',
      text: 'Xin chào',
      context: 'greeting',
      usage_notes: 'Formal greeting, can be used any time'
    },
    {
      english: 'Good morning',
      text: 'Chào buổi sáng',
      context: 'greeting',
      usage_notes: 'Used in the morning until about 11am'
    },
    {
      english: "I don't understand",
      text: 'Tôi không hiểu',
      context: 'classroom',
      usage_notes: 'Polite way to indicate lack of understanding'
    },
    {
      english: 'Thank you',
      text: 'Cảm ơn',
      context: 'courtesy',
      usage_notes: 'Basic way to express gratitude'
    }
  ];

  const grammarPatterns = [
    {
      english_pattern: 'Subject + verb + object',
      translated_pattern: 'Chủ ngữ + động từ + tân ngữ',
      explanation: 'Tiếng Việt có cấu trúc câu tương tự tiếng Anh nhưng không có thay đổi thì',
      examples: [
        { english: 'I eat rice', vietnamese: 'Tôi ăn cơm' },
        { english: 'She reads books', vietnamese: 'Cô ấy đọc sách' }
      ],
      difficulty_level: 1
    },
    {
      english_pattern: 'Past tense',
      translated_pattern: 'Đã + verb',
      explanation: 'Dùng "đã" trước động từ để chỉ thời gian đã qua',
      examples: [
        { english: 'I went to school', vietnamese: 'Tôi đã đi học' },
        { english: 'She ate dinner', vietnamese: 'Cô ấy đã ăn tối' }
      ],
      difficulty_level: 2
    }
  ];

  const commonMistakes = [
    {
      english_correct: 'I am going to school',
      english_mistake: 'I go to school',
      native_explanation: 'Trong tiếng Anh, hành động sắp xảy ra dùng "am/is/are going to"',
      correction_tips: [
        'Nhớ dùng "am/is/are going to" cho kế hoạch tương lai',
        'Không dùng thì hiện tại đơn cho việc sắp làm'
      ]
    },
    {
      english_correct: 'I have been to Hanoi',
      english_mistake: 'I went to Hanoi',
      native_explanation: 'Dùng Present Perfect để nói về kinh nghiệm trong quá khứ',
      correction_tips: [
        'Dùng "have been to" khi nói về nơi đã từng đến',
        'Dùng "went to" khi nói về một chuyến đi cụ thể trong quá khứ'
      ]
    }
  ];

  const idioms = [
    {
      english_idiom: 'It's raining cats and dogs',
      translated_idiom: 'Mưa như trút nước',
      literal_translation: 'Rain like pouring water',
      meaning_explanation: 'Both expressions describe heavy rain',
      usage_examples: [
        {
          english: "Don't go out now, it's raining cats and dogs",
          vietnamese: "Đừng ra ngoài bây giờ, trời đang mưa như trút nước"
        }
      ]
    },
    {
      english_idiom: 'Time is gold',
      translated_idiom: 'Thời gian là vàng',
      literal_translation: 'Time is gold',
      meaning_explanation: 'Emphasizes the value of time in both cultures',
      usage_examples: [
        {
          english: "Don't waste time, remember time is gold",
          vietnamese: "Đừng lãng phí thời gian, nhớ rằng thời gian là vàng"
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
        context_category,
        usage_notes
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
    `, [
      phrase.english,
      'vi',
      phrase.text,
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
      'vi',
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
      'vi',
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
      'vi',
      idiom.translated_idiom,
      idiom.literal_translation,
      idiom.meaning_explanation,
      JSON.stringify(idiom.usage_examples)
    ]);
  }
} 