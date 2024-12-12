import { SpeechClient } from '@google-cloud/speech';
import { PronunciationAssessment, WordAssessment } from '../pronunciation/types';

export class GoogleSpeechService {
  private client: SpeechClient;
  private languageCode: string = 'en-US';

  constructor() {
    this.client = new SpeechClient();
  }

  async analyzePronunciation(audioData: Buffer): Promise<PronunciationAssessment> {
    try {
      const request = {
        audio: {
          content: audioData.toString('base64'),
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: this.languageCode,
          enableWordTimeOffsets: true,
          enableWordConfidence: true,
          enableAutomaticPunctuation: true,
          model: 'video',
          useEnhanced: true,
        },
      };

      const [response] = await this.client.recognize(request);
      const transcription = response.results?.[0]?.alternatives?.[0];

      if (!transcription) {
        throw new Error('No transcription results');
      }

      const words: WordAssessment[] = transcription.words?.map(word => ({
        word: word.word || '',
        confidence: word.confidence || 0,
        startTime: this.convertDuration(word.startTime),
        endTime: this.convertDuration(word.endTime),
        accuracy: word.confidence || 0,
        stress: this.calculateStress(word),
        suggestions: []
      })) || [];

      return {
        text: transcription.transcript || '',
        confidence: transcription.confidence || 0,
        words,
        overallAccuracy: this.calculateOverallAccuracy(words),
        suggestions: this.generateSuggestions(words)
      };
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      throw error;
    }
  }

  private convertDuration(duration: any): number {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    return Number(duration.seconds || 0) + Number(duration.nanos || 0) / 1e9;
  }

  private calculateStress(word: any): number {
    // Implement stress detection algorithm
    // This is a simplified version
    return word.confidence || 0;
  }

  private calculateOverallAccuracy(words: WordAssessment[]): number {
    if (words.length === 0) return 0;
    const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);
    return totalConfidence / words.length;
  }

  private generateSuggestions(words: WordAssessment[]): string[] {
    const suggestions: string[] = [];
    const lowConfidenceThreshold = 0.7;

    words.forEach(word => {
      if (word.confidence < lowConfidenceThreshold) {
        suggestions.push(`Practice the pronunciation of "${word.word}"`);
      }
    });

    return suggestions;
  }

  async startStreaming(onData: (data: PronunciationAssessment) => void): Promise<any> {
    const stream = this.client.streamingRecognize({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: this.languageCode,
        enableWordTimeOffsets: true,
        enableWordConfidence: true,
        enableAutomaticPunctuation: true,
        model: 'video',
        useEnhanced: true,
      },
      interimResults: true,
    });

    stream.on('data', (data: any) => {
      const result = data.results[0];
      if (result.alternatives[0]) {
        const assessment: PronunciationAssessment = {
          text: result.alternatives[0].transcript,
          confidence: result.alternatives[0].confidence,
          words: [],
          overallAccuracy: result.alternatives[0].confidence,
          suggestions: []
        };
        onData(assessment);
      }
    });

    return stream;
  }
} 