import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { AzureSpeechConfig, PronunciationAssessment } from './types';

export class AzureSpeechService {
  private speechConfig: SpeechSDK.SpeechConfig;
  private audioConfig: SpeechSDK.AudioConfig;

  constructor(config: AzureSpeechConfig) {
    this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      config.subscriptionKey,
      config.region
    );
    this.speechConfig.speechRecognitionLanguage = config.language;
    this.audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  }

  async assessPronunciation(audioBlob: Blob, referenceText: string): Promise<PronunciationAssessment> {
    const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioBlob);
    const pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(
      referenceText,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      true
    );

    const recognizer = new SpeechSDK.SpeechRecognizer(
      this.speechConfig,
      audioConfig
    );

    pronunciationAssessmentConfig.applyTo(recognizer);

    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        result => {
          const pronunciationAssessment = JSON.parse(
            result.properties.getProperty(
              SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
            )
          ).NBest[0].PronunciationAssessment;

          resolve(this.mapAssessmentResult(pronunciationAssessment));
        },
        error => {
          reject(error);
        }
      );
    });
  }

  private mapAssessmentResult(rawAssessment: any): PronunciationAssessment {
    return {
      accuracyScore: rawAssessment.AccuracyScore,
      fluencyScore: rawAssessment.FluencyScore,
      completenessScore: rawAssessment.CompletenessScore,
      pronunciationScore: rawAssessment.PronunciationScore,
      words: rawAssessment.Words.map(this.mapWordAssessment)
    };
  }

  private mapWordAssessment(word: any): WordAssessment {
    return {
      word: word.Word,
      offset: word.Offset,
      duration: word.Duration,
      accuracyScore: word.AccuracyScore,
      phonemes: word.Phonemes.map((p: any) => ({
        phoneme: p.Phoneme,
        accuracyScore: p.AccuracyScore,
        error: p.Error
      })),
      syllables: word.Syllables.map((s: any) => ({
        syllable: s.Syllable,
        accuracyScore: s.AccuracyScore,
        stress: s.Stress && {
          expected: s.Stress.Expected,
          actual: s.Stress.Actual
        }
      }))
    };
  }
} 