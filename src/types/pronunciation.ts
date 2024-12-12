import { TranslationPair } from './translation';

export interface IPAGuide {
  phoneme: string;
  ipa: string;
  examples: {
    word: string;
    ipa: string;
    translation: TranslationPair;
  }[];
  nativeEquivalent?: string;
  commonMistakes: {
    incorrect: string;
    description: TranslationPair;
  }[];
}

export const phonemeGuides: Record<string, IPAGuide[]> = {
  'zh-CN': [
    {
      phoneme: 'th',
      ipa: 'θ',
      examples: [
        {
          word: 'think',
          ipa: 'θɪŋk',
          translation: {
            english: 'think',
            native: {
              sourceText: 'think',
              targetText: '想',
              language: 'zh-CN',
              romanization: 'xiǎng'
            },
            examples: [
              {
                english: "I think it's good",
                native: {
                  sourceText: "I think it's good",
                  targetText: '我觉得很好',
                  language: 'zh-CN',
                  romanization: 'wǒ jué de hěn hǎo'
                }
              }
            ]
          }
        }
      ],
      nativeEquivalent: 's',
      commonMistakes: [
        {
          incorrect: 's',
          description: {
            english: "Don't make an 's' sound, place tongue between teeth",
            native: {
              sourceText: "Don't make an 's' sound, place tongue between teeth",
              targetText: '不要发"s"音，要把舌头放在牙齿之间',
              language: 'zh-CN',
              romanization: 'bú yào fā "s" yīn, yào bǎ shé tou fàng zài yá chǐ zhī jiān'
            },
            examples: []
          }
        }
      ]
    }
  ]
}; 