import React from 'react';
import { IPAGuide } from '../types/pronunciation';

interface IPAChartProps {
  guide: IPAGuide;
  onPlaySound: (ipa: string) => void;
}

export const IPAChart: React.FC<IPAChartProps> = ({ guide, onPlaySound }) => {
  return (
    <div className="ipa-chart">
      <div className="phoneme-card">
        <div className="phoneme-header">
          <span className="phoneme">{guide.phoneme}</span>
          <span className="ipa">[{guide.ipa}]</span>
          {guide.nativeEquivalent && (
            <span className="native-equivalent">
              ≈ [{guide.nativeEquivalent}]
            </span>
          )}
        </div>

        <div className="examples">
          <h4>Examples</h4>
          {guide.examples.map((example, index) => (
            <div key={index} className="example-item">
              <button onClick={() => onPlaySound(example.ipa)}>
                🔊 {example.word} [{example.ipa}]
              </button>
              <div className="translation">
                {example.translation.native.targetText}
                <span className="romanization">
                  ({example.translation.native.romanization})
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="common-mistakes">
          <h4>Common Mistakes</h4>
          {guide.commonMistakes.map((mistake, index) => (
            <div key={index} className="mistake-item">
              <div className="incorrect">✗ [{mistake.incorrect}]</div>
              <div className="description">
                <div>{mistake.description.english}</div>
                <div className="native-text">
                  {mistake.description.native.targetText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 