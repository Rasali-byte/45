import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import Navbar from './Navbar';
import GuessGrid from './GuessGrid';
import Keyboard from './Keyboard';

function App() {
  const words = useMemo(() => [
    "APPLE", "BAKER", "CRANE", "DREAM", "EAGLE", "FROGS", "GRAPE", "HOUSE", "IDEAS", "JUICE",
    "PLANT", "CLOUD", "BRICK", "LIGHT", "HAPPY", "BEACH", "CHAIR", "TABLE", "RIVER", "OCEAN",
    "MAGIC", "SWEET", "TRUTH", "SHINE", "GLORY", "WINDY", "SPACE", "QUIET", "FAITH", "GRACE",
    "BLANK", "STORY", "CRISP", "DRIVE", "EVERY", "FIGHT", "GREAT", "HEART", "INBOX", "JOINT"
  ], []);

  const [secretWord, setSecretWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [turn, setTurn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({});

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord.toUpperCase());
    console.log("Secret word:", randomWord.toUpperCase());
  }, [words]);

  const handleGuess = useCallback(() => {
    if (isGameOver) {
      return;
    }

    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters long.');
      return;
    }
    
    const currentGuessUpper = currentGuess.toUpperCase();

    if (!words.includes(currentGuessUpper)) {
      setMessage('Not a valid word from our dictionary.');
      return; 
    }

    setMessage(''); 

    setGuesses(prevGuesses => {
      const newGuesses = [...prevGuesses];
      newGuesses[turn] = currentGuessUpper;
      return newGuesses;
    });

    setUsedLetters(prevUsedLetters => {
      const newUsedLetters = { ...prevUsedLetters };
      currentGuessUpper.split('').forEach((letter, i) => {
        if (secretWord[i] === letter) {
          newUsedLetters[letter] = 'correct-pos';
        }
        else if (secretWord.includes(letter) && newUsedLetters[letter] !== 'correct-pos') {
          newUsedLetters[letter] = 'wrong-pos';
        }
        else if (!secretWord.includes(letter) && newUsedLetters[letter] !== 'correct-pos' && newUsedLetters[letter] !== 'wrong-pos') {
          newUsedLetters[letter] = 'incorrect';
        }
      });
      return newUsedLetters;
    });

    if (currentGuessUpper === secretWord) {
      setIsGameOver(true);
      setMessage(`You guessed the word in ${turn + 1} turns!`);
      setCurrentGuess('');
    } else if (turn === 5) {
      setIsGameOver(true);
      setMessage(`Game Over! The word was ${secretWord}`);
      setCurrentGuess('');
    } else {
      setTurn(prevTurn => prevTurn + 1);
      setCurrentGuess('');
    }
  }, [isGameOver, currentGuess, turn, secretWord, words, setMessage, setGuesses, setTurn, setIsGameOver, setCurrentGuess, setUsedLetters]);


  const handleKeyClick = useCallback((key) => {
    if (isGameOver) return;

    if (message === 'Not a valid word from our dictionary.' && (key !== 'Enter' || key === 'Backspace')) {
        setMessage('');
    }

    if (key === 'Enter') {
      handleGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [isGameOver, message, currentGuess, handleGuess, setCurrentGuess, setMessage]);


  // Effect to attach and clean up the physical keyboard event listener
  useEffect(() => {
    const handlePhysicalKeyUp = ({ key }) => {
      if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
        handleKeyClick(key.toUpperCase());
      }
    };
    window.addEventListener('keyup', handlePhysicalKeyUp);
    return () => window.removeEventListener('keyup', handlePhysicalKeyUp);
  }, [handleKeyClick]); // This is the line that was problematic. Ensure it's exactly this.

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
          <button onClick={() => window.location.reload()} className="play-again-button">
            Play Again
          </button>
        )}

        <Keyboard onKeyClick={handleKeyClick} usedLetters={usedLetters} />
      </div>
    </div>
  );
}

export default App;