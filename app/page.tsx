'use client';

import { useState, useEffect } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard' | null;

const EASY_WORDS = [
  { word: 'ELEPHANT', hint: 'Large animal with big ears' },
  { word: 'RAINBOW', hint: 'Colorful after rain' },
  { word: 'BUTTERFLY', hint: 'Flying insect' },
  { word: 'MOUNTAIN', hint: 'Very tall' },
  { word: 'HOSPITAL', hint: 'Medical place' },
  { word: 'DINOSAUR', hint: 'Extinct reptile' },
  { word: 'VOLCANO', hint: 'Erupts lava' },
  { word: 'CARNIVAL', hint: 'Fun fair' },
  { word: 'CHAMPION', hint: 'Winner' },
  { word: 'JOURNEY', hint: 'A trip' },
];

const MEDIUM_WORDS = [
  { word: 'CHOCOLATE', hint: 'Sweet brown treat made from cocoa' },
  { word: 'ADVENTURE', hint: 'An exciting journey or experience' },
  { word: 'FESTIVAL', hint: 'A celebration or event with music and food' },
  { word: 'TREASURE', hint: 'Valuable hidden items or riches' },
  { word: 'MYSTERY', hint: 'Something unknown or puzzling' },
  { word: 'PASSPORT', hint: 'Document needed for international travel' },
  { word: 'TELESCOPE', hint: 'Tool to see stars and planets' },
  { word: 'UNIVERSE', hint: 'All of space and everything in it' },
  { word: 'PARADISE', hint: 'A perfect beautiful place' },
  { word: 'WHISPER', hint: 'Speak very softly and quietly' },
];

const HARD_WORDS = [
  { word: 'LABYRINTH', hint: 'Maze-like structure' },
  { word: 'OBSCURE', hint: 'Not clear or well-known' },
  { word: 'QUINTESSENTIAL', hint: 'Perfect example of something' },
  { word: 'PARADIGM', hint: 'Framework or model' },
  { word: 'SERENDIPITY', hint: 'Lucky coincidence' },
  { word: 'EPHEMERAL', hint: 'Short-lived, fleeting' },
  { word: 'RECONNAISSANCE', hint: 'Military survey' },
  { word: 'METICULOUS', hint: 'Very careful and precise' },
  { word: 'INEFFABLE', hint: 'Cannot be described in words' },
  { word: 'ANOMALY', hint: 'Something irregular' },
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
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [wordObj, setWordObj] = useState<{ word: string; hint: string } | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const maxWrongGuesses = {
    easy: 8,
    medium: 6,
    hard: 4,
  };

  const getWordList = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return EASY_WORDS;
      case 'medium':
        return MEDIUM_WORDS;
      case 'hard':
        return HARD_WORDS;
      default:
        return MEDIUM_WORDS;
    }
  };

  // Initialize game
  useEffect(() => {
    if (difficulty) {
      initializeGame();
    }
  }, [difficulty]);

  const initializeGame = () => {
    const wordList = getWordList(difficulty);
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWordObj(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  const startNewGame = (diff: Difficulty) => {
    setDifficulty(diff);
  };

  const resetToMenu = () => {
    setDifficulty(null);
    setWordObj(null);
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

      if (newWrongGuesses >= (difficulty ? maxWrongGuesses[difficulty] : 6)) {
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

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-purple-500/20 backdrop-blur-xl text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Hangman
          </h1>
          <p className="text-purple-300/70 mb-8 text-lg">Select your difficulty level</p>

          <div className="space-y-4">
            <button
              onClick={() => startNewGame('easy')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-green-500/50 text-lg mb-3"
            >
              🟢 Easy
              <p className="text-sm font-normal mt-1 opacity-90">8 wrong guesses, simple words</p>
            </button>

            <button
              onClick={() => startNewGame('medium')}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-orange-500/50 text-lg mb-3"
            >
              🟡 Medium
              <p className="text-sm font-normal mt-1 opacity-90">6 wrong guesses, balanced words</p>
            </button>

            <button
              onClick={() => startNewGame('hard')}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-red-500/50 text-lg"
            >
              🔴 Hard
              <p className="text-sm font-normal mt-1 opacity-90">4 wrong guesses, challenging words</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-purple-500/20 backdrop-blur-xl">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Hangman
          </h1>
          <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
            difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
            difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
            'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {difficulty?.toUpperCase()}
          </span>
        </div>
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
                <span className={`text-2xl font-bold ${wrongGuesses >= (difficulty ? maxWrongGuesses[difficulty] : 6) ? 'text-red-500' : wrongGuesses >= Math.ceil((difficulty ? maxWrongGuesses[difficulty] : 6) * 0.66) ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {wrongGuesses}/{difficulty ? maxWrongGuesses[difficulty] : 6}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 border border-purple-500/20">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wrongGuesses >= (difficulty ? maxWrongGuesses[difficulty] : 6)
                      ? 'bg-red-500'
                      : wrongGuesses >= Math.ceil((difficulty ? maxWrongGuesses[difficulty] : 6) * 0.66)
                      ? 'bg-orange-400'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(wrongGuesses / (difficulty ? maxWrongGuesses[difficulty] : 6)) * 100}%` }}
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

        {/* Button Group */}
        <div className="flex gap-3">
          <button
            onClick={initializeGame}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-purple-500/50"
          >
            🔄 New Game
          </button>
          <button
            onClick={resetToMenu}
            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-slate-500/50"
          >
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}
