import { GoogleSpeechService } from './SpeechService';
import { PronunciationAssessment } from '../azure/types';

interface BatchJob {
  audioBlob: Blob;
  referenceText: string;
  priority: number;
  retryCount: number;
}

export class BatchProcessor {
  private queue: BatchJob[] = [];
  private processing: boolean = false;
  private readonly maxRetries: number = 3;
  private readonly batchSize: number = 5;
  private readonly speechService: GoogleSpeechService;

  constructor(speechService: GoogleSpeechService) {
    this.speechService = speechService;
  }

  async addToBatch(audioBlob: Blob, referenceText: string, priority: number = 0): Promise<Promise<PronunciationAssessment>> {
    return new Promise((resolve, reject) => {
      const job: BatchJob = {
        audioBlob,
        referenceText,
        priority,
        retryCount: 0
      };

      this.queue.push(job);
      this.queue.sort((a, b) => b.priority - a.priority);

      if (!this.processing) {
        this.processBatch().catch(reject);
      }

      // Monitor this specific job
      const checkResult = setInterval(() => {
        if (job.result) {
          clearInterval(checkResult);
          resolve(job.result);
        } else if (job.error) {
          clearInterval(checkResult);
          reject(job.error);
        }
      }, 100);
    });
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      const results = await Promise.allSettled(
        batch.map(job => this.processJob(job))
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected' && batch[index].retryCount < this.maxRetries) {
          batch[index].retryCount++;
          this.queue.unshift(batch[index]); // Retry failed jobs
        }
      });
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.processBatch(), 1000); // Add delay between batches
      }
    }
  }

  private async processJob(job: BatchJob): Promise<void> {
    try {
      const result = await this.speechService.assessPronunciation(
        job.audioBlob,
        job.referenceText
      );
      job.result = result;
    } catch (error) {
      job.error = error;
      throw error;
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
  }
} 