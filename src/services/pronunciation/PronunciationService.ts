import { PronunciationFeedback, PronunciationIssue, PronunciationIssueType } from './types';
import { TranslationPair } from '../../types/translation';
import { LanguageConfig, supportedLanguages } from '../../types/languages';
import { IPAGuide, phonemeGuides } from '../../types/pronunciation';
import { GoogleSpeechService } from '../google/SpeechService';
import { PronunciationAssessment } from '../azure/types';

export class AudioInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AudioInitializationError';
  }
}

interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
}

interface AudioFeatures {
  energy: number;
  pitch: number[];
  formants: number[][];
  duration: number;
  zeroCrossings: number;
  spectralCentroid: number;
  mfcc: number[];
}

interface SyllableFeatures {
  start: number;
  end: number;
  energy: number;
  pitch: number;
  duration: number;
}

export class PronunciationService {
  private speechRecognition!: SpeechRecognition;
  private audioContext!: AudioContext;
  private currentLanguage!: LanguageConfig;
  private googleService!: GoogleSpeechService;
  private isInitialized: boolean = false;
  private offlineMode: boolean = false;
  private readonly retryConfig: RetryConfig = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffFactor: 2
  };

  constructor(languageCode: string) {
    if (!this.isValidLanguageCode(languageCode)) {
      throw new Error(`Unsupported language code: ${languageCode}`);
    }

    this.currentLanguage = supportedLanguages[languageCode];
    
    try {
      this.initializeServices();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new AudioInitializationError(`Failed to initialize audio services: ${errorMessage}`);
    }
  }

  private async initializeServices(): Promise<void> {
    try {
      await this.initializeAudioContext();
      await this.initializeSpeechRecognition();
      await this.initializeGoogleService();
      this.isInitialized = true;
    } catch (error: unknown) {
      this.handleInitializationError(error);
    }
  }

  private handleInitializationError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Initialization error:', errorMessage);

    // Try to enable offline mode if online services fail
    if (this.canFallbackToOffline(error)) {
      this.enableOfflineMode();
    } else {
      throw error;
    }
  }

  private canFallbackToOffline(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('network') || 
             error.message.includes('connection') ||
             error.message.includes('offline');
    }
    return false;
  }

  private enableOfflineMode(): void {
    this.offlineMode = true;
    console.warn('Switching to offline mode with limited functionality');
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: unknown;
    let delay = this.retryConfig.delayMs;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: unknown) {
        lastError = error;
        console.warn(`${context} attempt ${attempt} failed:`, error);

        if (attempt < this.retryConfig.maxAttempts) {
          await this.delay(delay);
          delay *= this.retryConfig.backoffFactor;
        }
      }
    }

    throw this.createDetailedError(lastError, context);
  }

  private createDetailedError(error: unknown, context: string): Error {
    const baseMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`${context} failed after ${this.retryConfig.maxAttempts} attempts: ${baseMessage}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Test audio context
      const testOscillator = this.audioContext.createOscillator();
      testOscillator.connect(this.audioContext.destination);
      testOscillator.disconnect();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`AudioContext initialization failed: ${errorMessage}`);
    }
  }

  private async initializeSpeechRecognition(): Promise<void> {
    try {
      this.speechRecognition = new SpeechRecognition();
      await this.configureSpeechRecognition();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`SpeechRecognition initialization failed: ${errorMessage}`);
    }
  }

  private async configureSpeechRecognition(): Promise<void> {
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.lang = this.currentLanguage.code;

    this.setupSpeechRecognitionHandlers();
  }

  private setupSpeechRecognitionHandlers(): void {
    this.speechRecognition.onerror = this.handleSpeechRecognitionError.bind(this);
    this.speechRecognition.onend = () => {
      if (!this.offlineMode) {
        this.speechRecognition.start();
      }
    };
  }

  private handleSpeechRecognitionError(event: SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error:', event.error, event.message);

    switch (event.error) {
      case 'network':
        this.enableOfflineMode();
        break;
      case 'not-allowed':
      case 'permission-denied':
        throw new Error('Microphone access denied by user');
      case 'no-speech':
        console.warn('No speech detected');
        break;
      case 'audio-capture':
        throw new Error('No microphone was found or microphone is disabled');
      default:
        console.warn('Unhandled speech recognition error:', event.error);
    }
  }

  private async initializeGoogleService(): Promise<void> {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    const projectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID;

    if (!apiKey || !projectId) {
      throw new Error('Missing Google Cloud credentials');
    }

    this.googleService = new GoogleSpeechService({
      apiKey,
      projectId,
      language: this.currentLanguage.code
    });
  }

  private isValidLanguageCode(code: string): boolean {
    return code in supportedLanguages;
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('PronunciationService is not properly initialized');
    }
  }

  async analyzePronunciation(audioBlob: Blob): Promise<PronunciationFeedback> {
    this.ensureInitialized();

    if (this.offlineMode) {
      return this.analyzeOffline(audioBlob);
    }
    
    return this.retryOperation(
      async () => {
        const assessment = await this.googleService.assessPronunciation(
          audioBlob,
          "example" // Replace with actual word being practiced
        );
        return this.convertAssessmentToFeedback(assessment);
      },
      'Pronunciation analysis'
    );
  }

  private async analyzeOffline(audioBlob: Blob): Promise<PronunciationFeedback> {
    // Implement basic offline analysis using Web Audio API
    const audioData = await this.extractAudioData(audioBlob);
    const features = await this.extractAudioFeatures(audioData);
    
    return {
      word: "example",
      nativeTranslation: {
        sourceText: "example",
        targetText: "例子",
        language: this.currentLanguage.code,
        romanization: "lì zi"
      },
      accuracy: features.energy > 0.5 ? 0.7 : 0.3,
      issues: [],
      suggestions: [],
      audioUrl: URL.createObjectURL(audioBlob)
    };
  }

  private async extractAudioData(blob: Blob): Promise<Float32Array> {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0);
  }

  private async extractAudioFeatures(audioData: Float32Array): Promise<AudioFeatures> {
    const frameSize = 1024;
    const hopSize = 512;
    const sampleRate = this.audioContext.sampleRate;
    
    // Create analyzer node for frequency analysis
    const analyzer = this.audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    
    const frames = this.splitIntoFrames(audioData, frameSize, hopSize);
    const features: AudioFeatures = {
      energy: this.calculateEnergy(audioData),
      pitch: await this.extractPitch(frames, sampleRate),
      formants: this.extractFormants(frames, sampleRate),
      duration: audioData.length / sampleRate,
      zeroCrossings: this.calculateZeroCrossings(audioData),
      spectralCentroid: this.calculateSpectralCentroid(frames, sampleRate),
      mfcc: await this.calculateMFCC(frames, sampleRate)
    };

    return features;
  }

  private splitIntoFrames(
    audioData: Float32Array, 
    frameSize: number, 
    hopSize: number
  ): Float32Array[] {
    const frames: Float32Array[] = [];
    for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
      frames.push(audioData.slice(i, i + frameSize));
    }
    return frames;
  }

  private calculateEnergy(audioData: Float32Array): number {
    return audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length;
  }

  private async extractPitch(frames: Float32Array[], sampleRate: number): Promise<number[]> {
    // Using autocorrelation for pitch detection
    return frames.map(frame => {
      const acf = this.autoCorrelation(frame);
      const peakIndex = this.findACFPeak(acf);
      return peakIndex ? sampleRate / peakIndex : 0;
    });
  }

  private autoCorrelation(frame: Float32Array): Float32Array {
    const result = new Float32Array(frame.length);
    for (let lag = 0; lag < frame.length; lag++) {
      let sum = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        sum += frame[i] * frame[i + lag];
      }
      result[lag] = sum;
    }
    return result;
  }

  private findACFPeak(acf: Float32Array): number | null {
    const minLag = Math.floor(this.audioContext.sampleRate / 1000); // 1kHz max
    const maxLag = Math.floor(this.audioContext.sampleRate / 50);  // 50Hz min
    
    let maxVal = -Infinity;
    let maxIndex = null;
    
    for (let i = minLag; i < maxLag; i++) {
      if (acf[i] > maxVal) {
        maxVal = acf[i];
        maxIndex = i;
      }
    }
    
    return maxIndex;
  }

  private extractFormants(frames: Float32Array[], sampleRate: number): number[][] {
    // Linear Prediction Coding for formant extraction
    return frames.map(frame => {
      const lpcCoeffs = this.calculateLPC(frame, 12);
      return this.findFormantFrequencies(lpcCoeffs, sampleRate);
    });
  }

  private calculateLPC(frame: Float32Array, order: number): Float32Array {
    // Levinson-Durbin recursion for LPC
    const R = new Float32Array(order + 1);
    for (let i = 0; i <= order; i++) {
      R[i] = frame.slice(0, frame.length - i).reduce(
        (sum, sample, j) => sum + sample * frame[j + i], 0
      );
    }
    
    const a = new Float32Array(order + 1);
    a[0] = 1;
    
    let E = R[0];
    
    for (let i = 1; i <= order; i++) {
      let k = -R[i];
      for (let j = 1; j < i; j++) {
        k -= a[j] * R[i - j];
      }
      k /= E;
      
      a[i] = k;
      for (let j = 1; j < i; j++) {
        a[j] = a[j] + k * a[i - j];
      }
      
      E *= (1 - k * k);
    }
    
    return a;
  }

  private findFormantFrequencies(lpcCoeffs: Float32Array, sampleRate: number): number[] {
    // Find roots of LPC polynomial
    const roots = this.findRoots(lpcCoeffs);
    
    // Convert roots to frequencies
    return roots
      .map(root => Math.atan2(root.imag, root.real) * (sampleRate / (2 * Math.PI)))
      .filter(freq => freq > 0 && freq < sampleRate / 2)
      .sort((a, b) => a - b);
  }

  private findRoots(coeffs: Float32Array): { real: number; imag: number }[] {
    // Implement root-finding algorithm (e.g., Bairstow's method)
    // This is a simplified version
    return [];
  }

  private calculateZeroCrossings(audioData: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < audioData.length; i++) {
      if (audioData[i] * audioData[i - 1] < 0) {
        crossings++;
      }
    }
    return crossings;
  }

  private calculateSpectralCentroid(frames: Float32Array[], sampleRate: number): number {
    const fft = new Float32Array(2048);
    const frequencies = new Float32Array(1024).map((_, i) => i * sampleRate / 2048);
    
    let totalCentroid = 0;
    frames.forEach(frame => {
      // Perform FFT
      // This is a placeholder - you'd use a proper FFT implementation
      const magnitudes = this.calculateFFTMagnitudes(frame);
      
      // Calculate centroid
      const weightedSum = magnitudes.reduce((sum, mag, i) => sum + mag * frequencies[i], 0);
      const magnitudeSum = magnitudes.reduce((sum, mag) => sum + mag, 0);
      
      totalCentroid += weightedSum / magnitudeSum;
    });
    
    return totalCentroid / frames.length;
  }

  private calculateFFTMagnitudes(frame: Float32Array): Float32Array {
    // Placeholder for FFT implementation
    return new Float32Array(frame.length / 2);
  }

  private async calculateMFCC(frames: Float32Array[], sampleRate: number): Promise<number[]> {
    const numCoefficients = 13;
    const melFilters = this.createMelFilterbank(sampleRate);
    
    // Calculate MFCCs for each frame and average
    const mfccs = frames.map(frame => {
      const spectrum = this.calculateFFTMagnitudes(frame);
      const melSpectrum = this.applyMelFilters(spectrum, melFilters);
      return this.discreteCosineTransform(melSpectrum.map(x => Math.log(x + 1e-6)));
    });
    
    // Average MFCCs across frames
    return Array.from({ length: numCoefficients }, (_, i) => 
      mfccs.reduce((sum, frame) => sum + frame[i], 0) / mfccs.length
    );
  }

  private createMelFilterbank(sampleRate: number): Float32Array[] {
    // Create mel-scale filterbank
    // This is a simplified version
    return [];
  }

  private applyMelFilters(spectrum: Float32Array, filters: Float32Array[]): number[] {
    return filters.map(filter => 
      spectrum.reduce((sum, value, i) => sum + value * filter[i], 0)
    );
  }

  private discreteCosineTransform(input: number[]): number[] {
    const N = input.length;
    return Array.from({ length: 13 }, (_, k) => {
      let sum = 0;
      for (let n = 0; n < N; n++) {
        sum += input[n] * Math.cos((Math.PI * k * (2 * n + 1)) / (2 * N));
      }
      return sum;
    });
  }

  private async convertAssessmentToFeedback(assessment: PronunciationAssessment): Promise<PronunciationFeedback> {
    const issues: PronunciationIssue[] = [];
    const suggestions: TranslationPair[] = [];

    for (const word of assessment.words) {
      for (const phoneme of word.phonemes) {
        if (phoneme.accuracyScore < 0.7) {
          const guide = await this.getPhonemeGuide(phoneme.phoneme);
          if (guide && guide.commonMistakes.length > 0) {
            issues.push({
              type: PronunciationIssueType.PHONEME,
              description: guide.commonMistakes[0].description,
              position: word.offset,
              severity: this.getSeverity(phoneme.accuracyScore),
              commonForNativeLanguage: this.isCommonIssue(phoneme.phoneme)
            });
          }
        }
      }
    }

    return {
      word: assessment.words[0].word,
      nativeTranslation: {
        sourceText: assessment.words[0].word,
        targetText: "例子", // Replace with actual translation
        language: this.currentLanguage.code,
        romanization: "lì zi" // Replace with actual romanization
      },
      accuracy: assessment.pronunciationScore / 100,
      issues,
      suggestions,
      audioUrl: "user-recording.wav",
      nativeSpeakerAudioUrl: "native-example.wav"
    };
  }

  private getSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.4) return 'high';
    if (score < 0.7) return 'medium';
    return 'low';
  }

  private isCommonIssue(phoneme: string): boolean {
    return this.currentLanguage.commonIssues.phonemes.includes(phoneme);
  }

  private async getPhonemeGuide(phoneme: string): Promise<IPAGuide | null> {
    return phonemeGuides[this.currentLanguage.code]?.find(
      guide => guide.phoneme === phoneme
    ) || null;
  }

  // ... rest of the implementation
} 