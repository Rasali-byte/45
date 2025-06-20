import React from 'react';
import './Keyboard.css'; // Create this CSS file later

function Keyboard({ onKeyClick, usedLetters }) {
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {row1.map(key => (
          <button
            key={key}
            onClick={() => onKeyClick(key)}
            className={`key ${usedLetters[key] || ''}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {row2.map(key => (
          <button
            key={key}
            onClick={() => onKeyClick(key)}
            className={`key ${usedLetters[key] || ''}`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        <button className="key large" onClick={() => onKeyClick('Enter')}>Enter</button>
        {row3.map(key => (
          <button
            key={key}
            onClick={() => onKeyClick(key)}
            className={`key ${usedLetters[key] || ''}`}
          >
            {key}
          </button>
        ))}
        <button className="key large" onClick={() => onKeyClick('Backspace')}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.12c.36.53.9.88 1.59.88h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59l3.59-3.59L9 8.41 10.41 7l3.59 3.59L17.59 7 19 8.41l-3.59 3.59L19 15.59z"/></svg>
        </button>
      </div>
    </div>
  );
}

export default Keyboard;