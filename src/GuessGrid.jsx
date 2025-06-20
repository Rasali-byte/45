import React from 'react';
import './GuessGrid.css'; // Create this CSS file later

function GuessGrid({ guesses, currentGuess, turn, secretWord }) {
  return (
    <div className="grid">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === turn;

        return (
          <div key={i} className="row">
            {Array(5).fill('').map((_, index) => {
              const letter = guess ? guess[index] : (isCurrentGuess ? currentGuess[index] : '');
              let boxClass = 'box';

              // Apply styling based on guess
              if (guess) {
                if (guess[index] === secretWord[index]) {
                  boxClass += ' correct-pos'; // Green
                } else if (secretWord.includes(guess[index])) {
                  boxClass += ' wrong-pos'; // Yellow
                } else {
                  boxClass += ' incorrect'; // Grey
                }
              } else if (isCurrentGuess && letter) {
                  boxClass += ' active-input'; // Style for current active letter
              }

              return (
                <div key={index} className={boxClass}>
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default GuessGrid;