import React from 'react';
import Navbar from './Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <h1>Welcome to Wordle Clone</h1>
        <p>Try to guess the 5-letter word in 6 attempts!</p>
        {/* Add your game board and logic here */}
      </main>
    </div>
  );
}

export default App;
