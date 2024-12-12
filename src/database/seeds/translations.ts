import { DatabaseService } from '../../services/database';

export async function seedTranslations(): Promise<void> {
  const db = DatabaseService.getInstance();

  // Basic greetings for each language
  const basicGreetings = [
    {
      english: 'Hello',
      translations: {
        zh: { text: '你好', romanization: 'Nǐ hǎo' },
        vi: { text: 'Xin chào' },
        ja: { text: 'こんにちは', romanization: 'Konnichiwa' },
        th: { text: 'สวัสดี', romanization: 'Sawadee' }
      }
    },
    // Add more common phrases...
  ];

  // Common grammar patterns
  const grammarPatterns = [
    {
      english: 'Subject + am/is/are + verb-ing',
      translations: {
        zh: {
          pattern: '主语 + 正在 + 动词',
          explanation: '表示正在进行的动作',
          examples: ['我正在学习', '他正在工作']
        },
        // Add other languages...
      }
    },
    // Add more grammar patterns...
  ];

  // Insert data
  for (const greeting of basicGreetings) {
    for (const [lang, trans] of Object.entries(greeting.translations)) {
      await db.pool.query(`
        INSERT INTO translations (
          english_text, 
          language_code, 
          translation, 
          romanization,
          context_category
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        greeting.english,
        lang,
        trans.text,
        trans.romanization || null,
        'greeting'
      ]);
    }
  }

  // Insert grammar patterns
  for (const pattern of grammarPatterns) {
    for (const [lang, trans] of Object.entries(pattern.translations)) {
      await db.pool.query(`
        INSERT INTO grammar_translations (
          english_pattern,
          language_code,
          translated_pattern,
          explanation,
          usage_examples
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        pattern.english,
        lang,
        trans.pattern,
        trans.explanation,
        JSON.stringify(trans.examples)
      ]);
    }
  }
} 