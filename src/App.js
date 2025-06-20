import React, { useState } from 'react';
import './App.css';

const WORD_LIST = ['apple', 'grape', 'peach', 'melon', 'berry']; // Sample word list
const SOLUTION = 'grape'; // Set a static solution for simplicity

function App() {
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [turn, setTurn] = useState(0);
  const [gameStatus, setGameStatus] = useState('');

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' && currentGuess.length === 5) {
      if (turn < 6) {
        const newGuesses = [...guesses];
        newGuesses[turn] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');
        setTurn(turn + 1);

        if (currentGuess === SOLUTION) {
          setGameStatus('You Win!');
        } else if (turn === 5) {
          setGameStatus('You Lose!');
        }
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + e.key.toLowerCase());
    }
  };

  const getTileClass = (letter, index) => {
    if (gameStatus) {
      if (letter === SOLUTION[index]) return 'correct';
      if (SOLUTION.includes(letter)) return 'present';
      return 'absent';
    }
    return '';
  };

  return (
    <div className="App" onKeyUp={handleKeyUp} tabIndex={0}>
      <h1>Wordle Clone</h1>
      <div className="board">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="row">
            {guess.split('').map((letter, index) => (
              <div
                key={index}
                className={`tile ${getTileClass(letter, index)}`}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          maxLength={5}
        />
      </div>
      {gameStatus && <div className="status">{gameStatus}</div>}
    </div>
  );
}

export default App;
