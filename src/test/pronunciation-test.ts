import { PronunciationService } from '../services/pronunciation/PronunciationService';

async function testPronunciation() {
  try {
    // Initialize the service with Chinese as the native language
    const service = new PronunciationService('zh-CN');

    // Test with a sample word
    const testWord = 'think';
    console.log(`Testing pronunciation for word: ${testWord}`);

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Microphone access granted');

    // Record for 3 seconds
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      console.log('Recording completed, analyzing...');

      try {
        const feedback = await service.analyzePronunciation(audioBlob);
        console.log('Pronunciation Analysis Results:');
        console.log('Word:', feedback.word);
        console.log('Accuracy:', (feedback.accuracy * 100).toFixed(1) + '%');
        console.log('Issues:', feedback.issues);
        console.log('Suggestions:', feedback.suggestions);
      } catch (error) {
        console.error('Analysis failed:', error);
      }
    };

    console.log('Starting recording...');
    mediaRecorder.start();

    // Stop recording after 3 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, 3000);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testPronunciation(); 