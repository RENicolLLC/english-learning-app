export interface GoogleCloudConfig {
  apiKey: string;
  projectId: string;
  language: string;
}

export interface GoogleSpeechResponse {
  results: {
    alternatives: {
      transcript: string;
      confidence: number;
      words: {
        word: string;
        startTime: string;
        endTime: string;
        confidence: number;
      }[];
    }[];
  }[];
} 