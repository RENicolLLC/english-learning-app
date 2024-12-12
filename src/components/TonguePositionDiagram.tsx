import React from 'react';

interface TonguePositionProps {
  phoneme: string;
  step: number;
}

export const TonguePositionDiagram: React.FC<TonguePositionProps> = ({ phoneme, step }) => {
  const getTonguePosition = (phoneme: string, step: number) => {
    const positions = {
      'th': [
        { transform: 'translateY(0px)', description: 'Start with tongue relaxed' },
        { transform: 'translateY(-10px)', description: 'Raise tongue tip' },
        { transform: 'translateX(5px)', description: 'Move tongue forward' },
        { transform: 'scale(1.1)', description: 'Place between teeth' }
      ],
      'r': [
        { transform: 'translateY(0px)', description: 'Start with tongue relaxed' },
        { transform: 'translateY(-15px)', description: 'Curl tongue back' },
        { transform: 'rotate(-20deg)', description: 'Shape into retroflex' }
      ],
      // Add more phonemes...
    };
    return positions[phoneme]?.[step] || positions['th'][0];
  };

  const position = getTonguePosition(phoneme, step);

  return (
    <div className="tongue-diagram">
      <svg viewBox="0 0 100 100">
        {/* Mouth outline */}
        <path d="M10,50 Q50,90 90,50" fill="none" stroke="black" />
        {/* Teeth */}
        <path d="M20,45 Q50,55 80,45" fill="none" stroke="black" strokeDasharray="2" />
        {/* Animated tongue */}
        <path 
          className="tongue"
          d="M30,60 Q50,70 70,60" 
          fill="#ff9999" 
          style={{
            transform: position.transform,
            transition: 'all 0.5s ease-in-out'
          }}
        />
      </svg>
      <div className="step-description">{position.description}</div>
    </div>
  );
}; 