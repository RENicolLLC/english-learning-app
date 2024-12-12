import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>English Learning App</h1>
      </header>
      
      <main className="app-content">
        <div className="main-content">
          <h2>Welcome to English Learning</h2>
          <p>Your journey to mastering English starts here!</p>
          
          <div className="start-section">
            <button className="start-button">Start Learning</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
