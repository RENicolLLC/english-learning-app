import React, { useState } from 'react';
import { SpeakingPractice } from '../components/SpeakingPractice';
import { UsageDashboard } from '../components/UsageDashboard';
import { SubscriptionTier } from '../types/subscription';
import '../styles/TestPage.css';

export const TestPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('basic');

  const subscriptionTiers = {
    basic: { name: 'Basic', practiceLimit: 10 },
    premium: { name: 'Premium', practiceLimit: 100 },
    enterprise: { name: 'Enterprise', practiceLimit: -1 }
  };

  const testPhrases = [
    "Hello, how are you?",
    "The quick brown fox jumps over the lazy dog",
    "I'd like to practice my English pronunciation"
  ];

  return (
    <div className="test-page">
      <h1>English Learning App - Test Page</h1>
      
      <section className="subscription-section">
        <h2>Select Subscription Tier</h2>
        <div className="tier-buttons">
          {Object.entries(subscriptionTiers).map(([tier, details]) => (
            <button
              key={tier}
              className={`tier-button ${selectedTier === tier ? 'selected' : ''}`}
              onClick={() => setSelectedTier(tier as SubscriptionTier)}
            >
              {details.name}
            </button>
          ))}
        </div>
      </section>

      <UsageDashboard />

      <section className="practice-section">
        <h2>Speaking Practice</h2>
        <div className="practice-phrases">
          {testPhrases.map((phrase, index) => (
            <div key={index} className="practice-item">
              <SpeakingPractice
                referenceText={phrase}
                subscriptionTier={selectedTier}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Current Settings</h2>
        <div className="info-content">
          <p>Selected Tier: {subscriptionTiers[selectedTier].name}</p>
          <p>Practice Limit: {
            subscriptionTiers[selectedTier].practiceLimit === -1 
              ? 'Unlimited' 
              : subscriptionTiers[selectedTier].practiceLimit
          }</p>
        </div>
      </section>
    </div>
  );
}; 