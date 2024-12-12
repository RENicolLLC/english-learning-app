import { DatabaseService } from '../services/database';
import { SpeechAnalyzer } from '../utils/speechAnalysis';
import {
  Assessment,
  AssessmentResult,
  Question,
  Answer,
  Feedback
} from '../types/assessment';
import { TranslationService } from '../services/TranslationService';

export class AssessmentService {
  private static instance: AssessmentService;
  private db: DatabaseService;
  private speechAnalyzer: SpeechAnalyzer;
  private translationService = TranslationService.getInstance();

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.speechAnalyzer = SpeechAnalyzer.getInstance();
  }

  static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService();
    }
    return AssessmentService.instance;
  }

  async createAssessment(level: number, type: string): Promise<Assessment> {
    // Generate assessment based on level and type
    const questions = await this.generateQuestions(level, type);
    
    return {
      id: crypto.randomUUID(),
      type: type as any,
      level,
      questions,
      timeLimit: this.calculateTimeLimit(type, questions.length),
      passingScore: this.calculatePassingScore(level),
      targetSkills: this.determineTargetSkills(type, level),
      instructions: await this.getInstructions(type)
    };
  }

  async evaluateAssessment(
    userId: string,
    assessmentId: string,
    answers: Answer[]
  ): Promise<AssessmentResult> {
    const assessment = await this.getAssessment(assessmentId);
    const results: Answer[] = [];
    const feedback: Feedback[] = [];
    let totalScore = 0;

    for (const answer of answers) {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const evaluatedAnswer = await this.evaluateAnswer(question, answer);
      results.push(evaluatedAnswer);
      
      if (!evaluatedAnswer.isCorrect) {
        feedback.push(await this.generateFeedback(question, evaluatedAnswer));
      }

      totalScore += evaluatedAnswer.isCorrect ? question.points : 0;
    }

    const result: AssessmentResult = {
      userId,
      assessmentId,
      score: this.calculateFinalScore(totalScore, assessment),
      answers: results,
      duration: this.calculateTotalDuration(results),
      completedAt: new Date(),
      feedback
    };

    await this.saveAssessmentResult(result);
    return result;
  }

  private async evaluateAnswer(question: Question, answer: Answer): Promise<Answer> {
    switch (question.type) {
      case 'pronunciation':
        return this.evaluatePronunciation(question, answer);
      case 'speaking':
        return this.evaluateSpeaking(question, answer);
      case 'writing':
        return this.evaluateWriting(question, answer);
      default:
        return this.evaluateBasicAnswer(question, answer);
    }
  }

  private async evaluatePronunciation(question: Question, answer: Answer): Promise<Answer> {
    const audioData = answer.userAnswer as string; // Base64 audio data
    const targetPhrase = question.correctAnswer as string;
    const analysis = await this.speechAnalyzer.analyzePronunciation(
      Buffer.from(audioData, 'base64'),
      targetPhrase,
      'en' // target language
    );

    return {
      ...answer,
      isCorrect: analysis.accuracy >= 0.8,
      timeTaken: answer.timeTaken,
      attempts: answer.attempts
    };
  }

  private async evaluateSpeaking(question: Question, answer: Answer): Promise<Answer> {
    // Implement speaking evaluation logic
    return answer;
  }

  private async evaluateWriting(question: Question, answer: Answer): Promise<Answer> {
    // Implement writing evaluation logic
    return answer;
  }

  private async evaluateBasicAnswer(question: Question, answer: Answer): Promise<Answer> {
    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(answer.userAnswer as string)
      : question.correctAnswer === answer.userAnswer;

    return {
      ...answer,
      isCorrect
    };
  }

  private async generateFeedback(question: Question, answer: Answer): Promise<Feedback> {
    // Generate detailed feedback based on question type and user's answer
    return {
      type: 'grammar',
      issue: 'Sample issue',
      correction: 'Sample correction',
      explanation: 'Sample explanation',
      resources: []
    };
  }

  private calculateFinalScore(rawScore: number, assessment: Assessment): number {
    // Implement scoring logic
    return (rawScore / assessment.questions.reduce((sum, q) => sum + q.points, 0)) * 100;
  }

  private calculateTotalDuration(answers: Answer[]): number {
    return answers.reduce((sum, answer) => sum + answer.timeTaken, 0);
  }

  private async saveAssessmentResult(result: AssessmentResult): Promise<void> {
    await this.db.pool.query(
      'INSERT INTO assessment_results (user_id, assessment_id, score, answers, duration, completed_at, feedback) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        result.userId,
        result.assessmentId,
        result.score,
        JSON.stringify(result.answers),
        result.duration,
        result.completedAt,
        JSON.stringify(result.feedback)
      ]
    );
  }

  // Helper methods...
  private async generateQuestions(level: number, type: string): Promise<Question[]> {
    // Implementation for question generation
    return [];
  }

  private calculateTimeLimit(type: string, questionCount: number): number {
    // Implementation for time limit calculation
    return 0;
  }

  private calculatePassingScore(level: number): number {
    // Implementation for passing score calculation
    return 0;
  }

  private determineTargetSkills(type: string, level: number): string[] {
    // Implementation for target skills determination
    return [];
  }

  private async getInstructions(type: string): Promise<any> {
    // Implementation for getting instructions
    return {};
  }

  private async getAssessment(assessmentId: string): Promise<Assessment> {
    // Implementation for getting assessment
    return {} as Assessment;
  }

  async createBilingualAssessment(
    level: number,
    type: string,
    nativeLanguage: 'zh' | 'vi' | 'ja' | 'th'
  ): Promise<Assessment> {
    const assessment = await this.createAssessment(level, type);
    
    // Transform questions to include native language
    const bilingualQuestions = await Promise.all(
      assessment.questions.map(async (q) => {
        const translatedContent = await this.translationService.getBilingualContent(
          q.content.text,
          nativeLanguage
        );

        return {
          ...q,
          content: {
            ...q.content,
            nativeText: translatedContent.translated,
            romanization: translatedContent.withRomanization,
            grammarNotes: await this.getGrammarNotes(q, nativeLanguage)
          }
        };
      })
    );

    return {
      ...assessment,
      questions: bilingualQuestions
    };
  }

  private async getGrammarNotes(
    question: Question,
    nativeLanguage: 'zh' | 'vi' | 'ja' | 'th'
  ): Promise<{ english: string; native: string }> {
    // Implementation for getting grammar notes in both languages
    return {
      english: '',
      native: ''
    };
  }
} 