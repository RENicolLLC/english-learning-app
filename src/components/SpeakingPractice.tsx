import React, { useState } from 'react';

interface SpeakingPracticeProps {
  referenceText: string;
}

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ referenceText }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      // Recording logic will be added here
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording logic will be added here
  };

  return (
    <div className="speaking-practice">
      <h3>Speaking Practice</h3>
      <div className="practice-content">
        <p className="reference-text">{referenceText}</p>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'recording' : ''}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}; 