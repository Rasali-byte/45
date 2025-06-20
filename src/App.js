import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Navbar';
import GuessGrid from './GuessGrid';
import Keyboard from './Keyboard';

function App() {
  // A larger list of 5-letter words is recommended for a better game experience.
  // For simplicity, a small list is provided here.
  const words = [
    "APPLE", "BAKER", "CRANE", "DREAM", "EAGLE", "FROGS", "GRAPE", "HOUSE", "IDEAS", "JUICE",
    "PLANT", "CLOUD", "BRICK", "LIGHT", "HAPPY", "BEACH", "CHAIR", "TABLE", "RIVER", "OCEAN",
    "MAGIC", "SWEET", "TRUTH", "SHINE", "GLORY", "WINDY", "SPACE", "QUIET", "FAITH", "GRACE",
    "BLANK", "STORY", "CRISP", "DRIVE", "EVERY", "FIGHT", "GREAT", "HEART", "INBOX", "JOINT"
  ];

  const [secretWord, setSecretWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null)); // Array to store all 6 guesses
  const [turn, setTurn] = useState(0); // Current guess number (0-5)
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({}); // To track letter status on keyboard

  // Initialize game (pick a random word)
  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord.toUpperCase()); // Ensure uppercase
    console.log("Secret word:", randomWord.toUpperCase()); // For debugging
  }, []);

  // Function to handle a guess submission
  const handleGuess = () => {
    if (isGameOver) { // Prevent guessing if game is already over
      return;
    }

    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters long.');
      return;
    }
    
    // Convert current guess to uppercase for comparison and validation
    const currentGuessUpper = currentGuess.toUpperCase();

    // The image shows "Not a valid word." for "WWWWF" so this check is important.
    // Ensure that your 'words' array includes valid English 5-letter words.
    if (!words.includes(currentGuessUpper)) { // Check if it's a valid word from your list
      setMessage('Not a valid word from our dictionary.');
      return;
    }

    // Process the guess
    const newGuesses = [...guesses];
    newGuesses[turn] = currentGuessUpper;
    setGuesses(newGuesses);

    // Update usedLetters for keyboard coloring
    const newUsedLetters = { ...usedLetters };
    currentGuessUpper.split('').forEach((letter, i) => {
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
    if (currentGuessUpper === secretWord) {
      setIsGameOver(true);
      setMessage(`You guessed the word in ${turn + 1} turns!`);
    } else if (turn === 5) { // Last turn and not correct
      setIsGameOver(true);
      setMessage(`Game Over! The word was ${secretWord}`);
    }

    // Only increment turn and clear guess if the game is not over yet
    // This handles the "didn't give another chance" issue
    if (!isGameOver) { // Check again after updating game state
        setTurn(prevTurn => prevTurn + 1);
        setCurrentGuess(''); // Clear current guess for next turn
        setMessage(''); // Clear any previous messages
    }
  };

  // Handle keyboard input (physical and virtual)
  const handleKeyClick = (key) => {
    if (isGameOver) return; // Don't allow input if game is over

    if (key === 'Enter') {
      handleGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setMessage(''); // Clear message on backspace
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      setMessage(''); // Clear message on valid input
    }
  };

  // Listen for physical keyboard events
  useEffect(() => {
    const handlePhysicalKeyUp = ({ key }) => {
      // Only process alphanumeric, Enter, and Backspace keys
      if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
        handleKeyClick(key.toUpperCase()); // Convert physical key to uppercase
      }
    };
    window.addEventListener('keyup', handlePhysicalKeyUp);
    // Cleanup function to remove event listener
    return () => window.removeEventListener('keyup', handlePhysicalKeyUp);
  }, [currentGuess, isGameOver, turn, secretWord, guesses, usedLetters]); // Dependencies for useEffect

  return (
    <div className="App">
      <Navbar />
      <div className="game-container">
        <h1>Welcome to Wordle Clone</h1>
        <p>Try to guess the 5-letter word in 6 attempts!</p>

        {/* Display messages */}
        {message && <p className="message">{message}</p>}

        {/* Render the guesses grid */}
        <GuessGrid
          guesses={guesses}
          currentGuess={currentGuess}
          turn={turn}
          secretWord={secretWord}
        />

        {/* Play Again button */}
        {isGameOver && (
          <button onClick={() => window.location.reload()} className="play-again-button">
            Play Again
          </button>
        )}

        {/* Render the keyboard */}
        <Keyboard onKeyClick={handleKeyClick} usedLetters={usedLetters} />
      </div>
    </div>
  );
}

export default App;