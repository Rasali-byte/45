import React from 'react';
import './GuessGrid.css';

function GuessGrid({ guesses, currentGuess, turn, secretWord }) {
  return (
    <div className="grid">
      {guesses.map((guess, i) => {
        const isCurrentGuessRow = i === turn;
        const displayGuess = isCurrentGuessRow ? currentGuess : (guess || ''); // Show current input or submitted guess

        return (
          <div key={i} className="row">
            {Array(5).fill('').map((_, index) => {
              const letter = displayGuess[index] || '';
              let boxClass = 'box';

              // Apply styling for submitted guesses
              if (guess) { // This row has been submitted
                if (guess[index] === secretWord[index]) {
                  boxClass += ' correct-pos'; // Green
                } else if (secretWord.includes(guess[index])) {
                  boxClass += ' wrong-pos'; // Yellow
                } else {
                  boxClass += ' incorrect'; // Grey
                }
              } else if (isCurrentGuessRow && letter) {
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