'use client';

import { useState, useEffect } from 'react';

const WORDS = [
  { word: 'ELEPHANT', hint: 'Largest land animal with a long trunk' },
  { word: 'MOUNTAIN', hint: 'Very tall landform, great for hiking' },
  { word: 'BUTTERFLY', hint: 'Colorful insect with wings' },
  { word: 'CHOCOLATE', hint: 'Sweet brown treat made from cocoa' },
  { word: 'ADVENTURE', hint: 'An exciting journey or experience' },
  { word: 'RAINBOW', hint: 'Colorful arc that appears after rain' },
  { word: 'HOSPITAL', hint: 'Place where doctors treat sick people' },
  { word: 'TELESCOPE', hint: 'Tool to see stars and planets' },
  { word: 'DINOSAUR', hint: 'Extinct prehistoric creature' },
  { word: 'FESTIVAL', hint: 'A celebration or event with music and food' },
  { word: 'TREASURE', hint: 'Valuable hidden items or riches' },
  { word: 'MYSTERY', hint: 'Something unknown or puzzling' },
  { word: 'PASSPORT', hint: 'Document needed for international travel' },
  { word: 'VOLCANO', hint: 'Mountain that erupts with lava' },
  { word: 'CARNIVAL', hint: 'Fun fair with rides and games' },
  { word: 'UNIVERSE', hint: 'All of space and everything in it' },
  { word: 'PARADISE', hint: 'A perfect beautiful place' },
  { word: 'CHAMPION', hint: 'Winner of a competition' },
  { word: 'JOURNEY', hint: 'A long trip or adventure' },
  { word: 'WHISPER', hint: 'Speak very softly and quietly' },
];

const HANGMAN_STAGES = [
  `
   ------
   |    |
   |
   |
   |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |
   |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |    |
   |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |   \\|
   |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |   \\|/
   |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |   \\|/
   |    |
   |
 -----`,
  `
   ------
   |    |
   |    O
   |   \\|/
   |    |
   |   / \\
 -----`,
];

export default function HangmanGame() {
  const [wordObj, setWordObj] = useState<{ word: string; hint: string } | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWordObj(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  const handleGuess = (letter: string) => {
    if (!wordObj || guessedLetters.has(letter) || gameOver || won) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!wordObj.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= HANGMAN_STAGES.length - 1) {
        setGameOver(true);
      }
    } else {
      // Check if word is complete
      const isWordComplete = wordObj.word
        .split('')
        .every((char) => newGuessed.has(char));
      if (isWordComplete) {
        setWon(true);
      }
    }
  };

  const displayWord = wordObj
    ? wordObj.word
        .split('')
        .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
        .join(' ')
    : '';

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-purple-500/20 backdrop-blur-xl">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎮 Hangman
        </h1>
        <p className="text-center text-purple-300/70 mb-8 text-sm">Guess the word before you run out of tries!</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Hangman Drawing */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-700/50 rounded-xl p-6 mb-4 font-mono text-xs leading-relaxed overflow-hidden border border-purple-500/20 w-full">
              <pre className="text-cyan-300">{HANGMAN_STAGES[wrongGuesses]}</pre>
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Wrong Attempts</span>
                <span className={`text-2xl font-bold ${wrongGuesses >= HANGMAN_STAGES.length - 1 ? 'text-red-500' : wrongGuesses >= 4 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {wrongGuesses}/{HANGMAN_STAGES.length - 1}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 border border-purple-500/20">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wrongGuesses >= HANGMAN_STAGES.length - 1
                      ? 'bg-red-500'
                      : wrongGuesses >= 4
                      ? 'bg-orange-400'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(wrongGuesses / (HANGMAN_STAGES.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Column - Game Content */}
          <div className="flex flex-col">
            {/* Hint */}
            {wordObj && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-200">
                  <span className="font-bold">💡 Hint:</span> {wordObj.hint}
                </p>
              </div>
            )}

            {/* Word Display */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-4 text-center border border-blue-500/30">
              <p className="text-5xl font-bold text-cyan-300 tracking-widest font-mono leading-relaxed">
                {displayWord}
              </p>
            </div>

            {/* Game Status */}
            {won && (
              <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 rounded-lg p-4 mb-4 animate-pulse">
                <p className="text-green-300 font-bold text-center">
                  🎉 You Won! Word: <span className="text-green-400">{wordObj?.word}</span>
                </p>
              </div>
            )}

            {gameOver && (
              <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-500/50 rounded-lg p-4 mb-4 animate-pulse">
                <p className="text-red-300 font-bold text-center">
                  😢 Game Over! Word: <span className="text-red-400">{wordObj?.word}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Letter Buttons */}
        <div className="grid grid-cols-7 gap-2 mb-6 mt-6">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gameOver || won}
              className={`py-2 px-1 font-bold rounded-lg transition-all transform hover:scale-105 ${
                guessedLetters.has(letter)
                  ? wordObj?.word.includes(letter)
                    ? 'bg-green-500/80 text-white cursor-default'
                    : 'bg-red-500/80 text-white cursor-default'
                  : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer shadow-lg'
              } disabled:opacity-50 disabled:hover:scale-100 text-sm`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={initializeGame}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-purple-500/50 text-lg"
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}
