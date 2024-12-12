import { DatabaseService } from '../../../services/database';

export async function seedJapaneseTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();

  const commonPhrases = [
    {
      english: 'Hello',
      text: 'こんにちは',
      romanization: 'Konnichiwa',
      context: 'greeting',
      usage_notes: 'Formal afternoon greeting, use おはよう (Ohayou) for morning and こんばんは (Konbanwa) for evening'
    },
    {
      english: 'Thank you',
      text: 'ありがとうございます',
      romanization: 'Arigatou gozaimasu',
      context: 'courtesy',
      usage_notes: 'Formal thank you. Casual form is ありがとう (arigatou)'
    },
    {
      english: 'Excuse me',
      text: 'すみません',
      romanization: 'Sumimasen',
      context: 'courtesy',
      usage_notes: 'Multi-purpose phrase for excuse me/sorry/thank you'
    },
    {
      english: "I don't understand",
      text: 'わかりません',
      romanization: 'Wakarimasen',
      context: 'classroom',
      usage_notes: 'Polite form of not understanding. Casual: わからない (Wakaranai)'
    }
  ];

  const grammarPatterns = [
    {
      english_pattern: 'Subject + Object + Verb',
      translated_pattern: '主語 + 目的語 + 動詞',
      explanation: '日本語は英語と語順が違い、動詞が最後に来ます',
      examples: [
        { 
          english: 'I eat sushi', 
          japanese: '私は寿司を食べます', 
          romanization: 'Watashi wa sushi wo tabemasu',
          notes: 'Note particle は(wa) for subject and を(wo) for object'
        },
        { 
          english: 'She reads books', 
          japanese: '彼女は本を読みます', 
          romanization: 'Kanojo wa hon wo yomimasu' 
        }
      ],
      difficulty_level: 1
    },
    {
      english_pattern: 'Past tense',
      translated_pattern: '動詞の過去形',
      explanation: '動詞の最後を変化させて過去を表現します',
      examples: [
        { 
          english: 'I ate sushi', 
          japanese: '私は寿司を食べました', 
          romanization: 'Watashi wa sushi wo tabemashita',
          notes: 'ます(masu) changes to ました(mashita) for past tense'
        }
      ],
      difficulty_level: 2
    }
  ];

  const commonMistakes = [
    {
      english_correct: 'I am a student',
      english_mistake: 'I am student',
      native_explanation: '英語では "a/an" が必要ですが、日本語では「私は学生です」となります',
      correction_tips: [
        '職業や身分を表す時は "a/an" が必要です',
        '日本語の「私は学生です」を "I am student" と直訳しないでください'
      ]
    },
    {
      english_correct: 'She is reading a book',
      english_mistake: 'She reading book',
      native_explanation: '進行形には be動詞 (is/am/are) が必要です',
      correction_tips: [
        '進行形は「be動詞 + 動詞のing形」',
        '目的語の前には冠詞 (a/an/the) が必要です'
      ]
    }
  ];

  const idioms = [
    {
      english_idiom: 'Time is money',
      translated_idiom: '時は金なり',
      literal_translation: 'Time is money',
      romanization: 'Toki wa kane nari',
      meaning_explanation: 'Similar meaning in both cultures, emphasizing the value of time',
      usage_examples: [
        {
          english: "Don't waste time, time is money",
          japanese: "時間を無駄にするな、時は金なり",
          romanization: "Jikan wo muda ni suruna, toki wa kane nari"
        }
      ]
    },
    {
      english_idiom: 'Better late than never',
      translated_idiom: '遅くとも来なければ来ないよりまし',
      literal_translation: 'Being late is better than not coming',
      romanization: 'Osokutomo konakereba konai yori mashi',
      meaning_explanation: 'Both express that doing something late is better than not at all',
      usage_examples: [
        {
          english: "At least you finished the homework, better late than never",
          japanese: "宿題を終えただけでもよし、遅くとも来なければ来ないよりまし",
          romanization: "Shukudai wo oeta dake demo yoshi, osokutomo konakereba konai yori mashi"
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
      'ja',
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
      'ja',
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
      'ja',
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
      'ja',
      idiom.translated_idiom,
      idiom.literal_translation,
      idiom.meaning_explanation,
      JSON.stringify(idiom.usage_examples)
    ]);
  }
} 