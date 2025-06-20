import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Navbar';
import GuessGrid from './GuessGrid';
import Keyboard from './Keyboard';

function App() {
  const words = ["APPLE", "BAKER", "CRANE", "DREAM", "EAGLE", "FROGS", "GRAPE", "HOUSE", "IDEAS", "JUICE", /* Add many more */ "PLANT", "CLOUD", "BRICK", "LIGHT", "HAPPY"];
  const [secretWord, setSecretWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [turn, setTurn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({}); // To track letter status on keyboard

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord.toUpperCase());
    console.log("Secret word:", randomWord.toUpperCase());
  }, []);

  // Function to handle a guess submission
  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters long.');
      return;
    }
    if (!words.includes(currentGuess.toUpperCase())) {
      setMessage('Not a valid word.');
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[turn] = currentGuess.toUpperCase();
    setGuesses(newGuesses);

    // Update usedLetters for keyboard coloring
    const newUsedLetters = { ...usedLetters };
    currentGuess.toUpperCase().split('').forEach((letter, i) => {
      if (secretWord[i] === letter) {
        newUsedLetters[letter] = 'correct-pos';
      } else if (secretWord.includes(letter) && newUsedLetters[letter] !== 'correct-pos') {
        newUsedLetters[letter] = 'wrong-pos';
      } else if (!secretWord.includes(letter) && newUsedLetters[letter] !== 'correct-pos' && newUsedLetters[letter] !== 'wrong-pos') {
        newUsedLetters[letter] = 'incorrect';
      }
    });
    setUsedLetters(newUsedLetters);

    // Check if win or lose
    if (currentGuess.toUpperCase() === secretWord) {
      setIsGameOver(true);
      setMessage(`You guessed the word in ${turn + 1} turns!`);
    } else if (turn === 5) {
      setIsGameOver(true);
      setMessage(`Game Over! The word was ${secretWord}`);
    }

    setTurn(prevTurn => prevTurn + 1);
    setCurrentGuess('');
    setMessage('');
  };

  // Handle keyboard input (physical and virtual)
  const handleKeyClick = (key) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      handleGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setMessage('');
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      setMessage('');
    }
  };

  useEffect(() => {
    // Physical keyboard event listener
    const handlePhysicalKeyUp = ({ key }) => {
        if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
            handleKeyClick(key.toUpperCase()); // Convert physical key to uppercase
        }
    };
    window.addEventListener('keyup', handlePhysicalKeyUp);
    return () => window.removeEventListener('keyup', handlePhysicalKeyUp);
  }, [currentGuess, isGameOver, turn, secretWord, guesses, usedLetters]); // Dependencies

  return (
    <div className="App">
      <Navbar />
      <div className="game-container">
        <h1>Welcome to Wordle Clone</h1>
        <p>Try to guess the 5-letter word in 6 attempts!</p>

        {message && <p className="message">{message}</p>}

        <GuessGrid
          guesses={guesses}
          currentGuess={currentGuess}
          turn={turn}
          secretWord={secretWord}
        />

        {isGameOver && (
          <button onClick={() => window.location.reload()}>Play Again</button>
        )}

        <Keyboard onKeyClick={handleKeyClick} usedLetters={usedLetters} />
      </div>
    </div>
  );
}

export default App;