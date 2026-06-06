'use client';

import { useState, useEffect, useCallback } from 'react';
import HangmanDrawing from '@/components/HangmanDrawing';

type Difficulty = 'easy' | 'medium' | 'hard' | null;

const EASY_WORDS = [
  { word: 'ELEPHANT', hint: 'Large animal with big ears' },
  { word: 'RAINBOW', hint: 'Colorful after rain' },
  { word: 'BUTTERFLY', hint: 'Flying insect with colorful wings' },
  { word: 'MOUNTAIN', hint: 'Very tall natural landform' },
  { word: 'HOSPITAL', hint: 'Medical place' },
  { word: 'DINOSAUR', hint: 'Extinct reptile' },
  { word: 'VOLCANO', hint: 'Erupts lava' },
  { word: 'CARNIVAL', hint: 'Fun fair' },
  { word: 'CHAMPION', hint: 'Winner' },
  { word: 'JOURNEY', hint: 'A trip' },
  { word: 'GARDEN', hint: 'Place where flowers grow' },
  { word: 'FRIEND', hint: 'Someone you like' },
  { word: 'PLANET', hint: 'Earth is one' },
  { word: 'PIRATE', hint: 'Sailing robber' },
  { word: 'KNIGHT', hint: 'Armored warrior' },
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
  { word: 'HARMONY', hint: 'Peaceful agreement' },
  { word: 'WONDER', hint: 'A feeling of amazement' },
  { word: 'BALLOON', hint: 'Floating inflatable' },
  { word: 'CUSHION', hint: 'Soft seat pad' },
  { word: 'BISCUIT', hint: 'Small baked treat' },
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
  { word: 'PERIPATETIC', hint: 'Traveling from place to place' },
  { word: 'SURRESTITIOUS', hint: 'Done secretly' },
];

const MAX_WRONG = {
  easy: 8,
  medium: 6,
  hard: 4,
};

function createConfetti() {
  const colors = ['#a855f7', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#eab308'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = Math.random() * 8 + 4 + 'px';
    el.style.height = Math.random() * 8 + 4 + 'px';
    el.style.animationDuration = Math.random() * 2 + 2 + 's';
    el.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [wordObj, setWordObj] = useState<{ word: string; hint: string } | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [guesses, setGuesses] = useState(0);
  const [correct, setCorrect] = useState(0);

  const maxWrong = difficulty ? MAX_WRONG[difficulty] : 6;

  const initializeGame = useCallback((diff: Difficulty) => {
    const wordList = (() => {
      switch (diff) {
        case 'easy': return EASY_WORDS;
        case 'medium': return MEDIUM_WORDS;
        case 'hard': return HARD_WORDS;
        default: return MEDIUM_WORDS;
      }
    })();
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWordObj(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
    setShowStats(false);
    setGuesses(0);
    setCorrect(0);
  }, []);

  const startNewGame = (diff: Difficulty) => {
    setDifficulty(diff);
    initializeGame(diff);
  };

  const resetToMenu = () => {
    setDifficulty(null);
    setWordObj(null);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setWon(false);
    setShowStats(false);
    setGuesses(0);
    setCorrect(0);
  };

  const newWord = () => {
    if (difficulty) initializeGame(difficulty);
  };

  const handleGuess = (letter: string) => {
    if (!wordObj || guessedLetters.has(letter) || gameOver || won) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);
    setGuesses((g) => g + 1);

    if (!wordObj.word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrong) {
        setGameOver(true);
      }
    } else {
      setCorrect((c) => c + 1);
      const isComplete = wordObj.word.split('').every((char) => newGuessed.has(char));
      if (isComplete) {
        setWon(true);
        setTimeout(createConfetti, 100);
      }
    }
  };

  useEffect(() => {
    if ((gameOver || won) && guesses > 0) {
      fetch('/api/user/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ won, guesses, correct }),
      }).catch(() => {});
    }
  }, [gameOver, won, guesses, correct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const displayWord = wordObj
    ? wordObj.word.split('').map((letter) => (guessedLetters.has(letter) ? letter : '_')).join(' ')
    : '';

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 pt-20">
        <div className="absolute top-40 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}></div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-purple-500/20 animate-slideUp">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hangman
            </h1>
            <p className="text-purple-300/70 text-lg">Guess the word before it&apos;s too late!</p>
          </div>

          <div className="space-y-4">
            <DifficultyButton
              label="Easy"
              emoji="🟢"
              desc="8 wrong guesses, simple words"
              color="green"
              onClick={() => startNewGame('easy')}
            />
            <DifficultyButton
              label="Medium"
              emoji="🟡"
              desc="6 wrong guesses, balanced words"
              color="yellow"
              onClick={() => startNewGame('medium')}
            />
            <DifficultyButton
              label="Hard"
              emoji="🔴"
              desc="4 wrong guesses, challenging words"
              color="red"
              onClick={() => startNewGame('hard')}
            />
          </div>

          <p className="text-center text-purple-300/40 text-xs mt-8">
            Sign in to track your stats and compete on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 pt-20">
      <div className="absolute top-40 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 max-w-4xl w-full border border-purple-500/20 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hangman
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
              difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
              difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
              'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
              {difficulty?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Hangman Drawing & Progress */}
          <div className="flex flex-col items-center">
            <HangmanDrawing stage={wrongGuesses} maxStages={maxWrong} />

            {/* Progress Bar */}
            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Wrong Attempts</span>
                <span className={`font-bold ${
                  wrongGuesses >= maxWrong ? 'text-red-500' :
                  wrongGuesses >= Math.ceil(maxWrong * 0.66) ? 'text-orange-400' :
                  'text-yellow-400'
                }`}>
                  {wrongGuesses}/{maxWrong}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 border border-purple-500/20 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wrongGuesses >= maxWrong ? 'bg-red-500' :
                    wrongGuesses >= Math.ceil(maxWrong * 0.66) ? 'bg-orange-400' :
                    'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${(wrongGuesses / maxWrong) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right - Game Content */}
          <div className="flex flex-col">
            {/* Hint */}
            {wordObj && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg p-4 mb-4 animate-fadeIn">
                <p className="text-sm text-amber-200">
                  <span className="font-bold">💡 Hint:</span> {wordObj.hint}
                </p>
              </div>
            )}

            {/* Word Display */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-4 text-center border border-blue-500/30">
              <p className="text-4xl md:text-5xl font-bold text-cyan-300 tracking-widest font-mono leading-relaxed">
                {displayWord}
              </p>
            </div>

            {/* Game Status */}
            {won && (
              <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 rounded-lg p-4 mb-4 animate-pulse">
                <p className="text-green-300 font-bold text-xl text-center">
                  🎉 You Won! The word was <span className="text-green-400">{wordObj?.word}</span>
                </p>
              </div>
            )}

            {gameOver && (
              <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-500/50 rounded-lg p-4 mb-4 animate-pulse">
                <p className="text-red-300 font-bold text-xl text-center">
                  💀 Game Over! The word was <span className="text-red-400">{wordObj?.word}</span>
                </p>
              </div>
            )}

            {/* Stats toggle */}
            {showStats && (
              <div className="bg-slate-700/50 border border-purple-500/30 rounded-lg p-4 mb-4 animate-fadeIn">
                <p className="text-purple-300 text-sm">Guesses: {guesses} | Correct: {correct}</p>
              </div>
            )}
          </div>
        </div>

        {/* Letter Buttons */}
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 mb-6 mt-6">
          {alphabet.map((letter) => {
            const isGuessed = guessedLetters.has(letter);
            const isCorrect = wordObj?.word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || gameOver || won}
                className={`py-2.5 font-bold rounded-lg transition-all transform active:scale-95 ${
                  isGuessed
                    ? isCorrect
                      ? 'bg-green-500/80 text-white cursor-default'
                      : 'bg-red-500/80 text-white cursor-default'
                    : gameOver || won
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer shadow-lg hover:shadow-purple-500/40'
                } text-sm`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={newWord}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-purple-500/50"
          >
            🔄 New Word
          </button>
          <button
            onClick={() => setShowStats((s) => !s)}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
            title="Toggle stats"
          >
            📊
          </button>
          <button
            onClick={resetToMenu}
            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-3 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-slate-500/50"
          >
            🏠 Menu
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-center text-purple-300/30 text-xs mt-4">
          Tip: You can also type letters on your keyboard!
        </p>
      </div>
    </div>
  );
}

function DifficultyButton({
  label,
  emoji,
  desc,
  color,
  onClick,
}: {
  label: string;
  emoji: string;
  desc: string;
  color: 'green' | 'yellow' | 'red';
  onClick: () => void;
}) {
  const colorClasses = {
    green: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/50',
    yellow: 'from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:shadow-orange-500/50',
    red: 'from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 hover:shadow-red-500/50',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r ${colorClasses[color]} text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] hover:shadow-2xl text-lg`}
    >
      {emoji} {label}
      <p className="text-sm font-normal mt-1 opacity-90">{desc}</p>
    </button>
  );
}
