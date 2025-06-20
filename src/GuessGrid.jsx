import React from 'react';
import './GuessGrid.css';

function GuessGrid({ guesses, currentGuess, turn, secretWord }) { // <-- secretWord is now used here
  return (
    <div className="grid">
      {guesses.map((guess, i) => {
        const isCurrentGuessRow = i === turn;
        const displayGuess = isCurrentGuessRow ? currentGuess : (guess || '');

        return (
          <div key={i} className="row">
            {Array(5).fill('').map((_, index) => {
              const letter = displayGuess[index] || '';
              let boxClass = 'box';

              // Apply styling for submitted guesses (priority 1: if guess exists)
              if (guess) { 
                if (guess[index] === secretWord[index]) {
                  boxClass += ' correct-pos'; // Green
                } else if (secretWord.includes(guess[index])) {
                  boxClass += ' wrong-pos'; // Yellow
                } else {
                  boxClass += ' incorrect'; // Grey
                }
              } 
              // Apply styling for current guess being typed (priority 2: if it's current row AND letter exists)
              else if (isCurrentGuessRow && letter) {
                // Determine color based on current input and secret word (real-time feedback)
                if (secretWord[index] === letter) {
                  boxClass += ' current-correct-pos'; // Green for currently typed correct letter
                } else if (secretWord.includes(letter)) {
                  boxClass += ' current-wrong-pos'; // Yellow for currently typed wrong position letter
                } else {
                  boxClass += ' current-incorrect'; // Grey for currently typed incorrect letter
                }
              } 

              // Active input style for the current letter being typed
              if (isCurrentGuessRow && letter && index < currentGuess.length) {
                boxClass += ' active-input';
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