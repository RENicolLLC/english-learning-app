import { DatabaseService } from '../../../services/database';

export async function seedChineseTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();

  const commonPhrases = [
    {
      english: 'Hello',
      text: '你好',
      romanization: 'Nǐ hǎo',
      context: 'greeting',
      usage_notes: 'Formal and informal greeting, used any time of day'
    },
    {
      english: 'Good morning',
      text: '早安',
      romanization: 'Zǎo ān',
      context: 'greeting',
      usage_notes: 'Used in the morning until about 11am'
    },
    {
      english: "I don't understand",
      text: '我不明白',
      romanization: 'Wǒ bù míngbái',
      context: 'classroom',
      usage_notes: 'Polite way to indicate lack of understanding'
    }
  ];

  const grammarPatterns = [
    {
      english_pattern: 'Subject + verb + object',
      translated_pattern: '主语 + 谓语 + 宾语',
      explanation: '中文句子结构与英语相似，但没有时态变化',
      examples: [
        { english: 'I love coffee', chinese: '我喜欢咖啡', romanization: 'Wǒ xǐhuān kāfēi' },
        { english: 'She reads books', chinese: '她看书', romanization: 'Tā kàn shū' }
      ],
      difficulty_level: 1
    }
  ];

  const commonMistakes = [
    {
      english_correct: 'I am a student',
      english_mistake: 'I am student',
      native_explanation: '在英语中，"a/an" 是必须的，但在中文中不需要"一个"',
      correction_tips: [
        '记住在英语中提到单个职业或身份时需要加 "a" 或 "an"',
        '中文说 "我是学生" 而英语要说 "I am a student"'
      ]
    }
  ];

  const idioms = [
    {
      english_idiom: 'Time is money',
      translated_idiom: '时间就是金钱',
      literal_translation: 'Time is gold/money',
      romanization: 'Shíjiān jiùshì jīnqián',
      meaning_explanation: 'Both cultures share this concept of time being valuable',
      usage_examples: [
        {
          english: "Don't waste time, time is money",
          chinese: "别浪费时间，时间就是金钱",
          romanization: "Bié làngfèi shíjiān, shíjiān jiùshì jīnqián"
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
      'zh',
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
      'zh',
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
      'zh',
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
      'zh',
      idiom.translated_idiom,
      idiom.literal_translation,
      idiom.meaning_explanation,
      JSON.stringify(idiom.usage_examples)
    ]);
  }
} 