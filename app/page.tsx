'use client';

import { useState, useEffect } from 'react';

// MVP Data: Common high-school level English words
const VOCAB_LIST = [
  { word: 'Ambiguous', meaning: '曖昧な' },
  { word: 'Inevitable', meaning: '避けられない' },
  { word: 'Simultaneous', meaning: '同時の' },
  { word: 'Reluctant', meaning: '気が進まない' },
  { word: 'Subsequent', meaning: 'その後の' },
  { word: 'Crucial', meaning: '重大な' },
  { word: 'Distinguish', meaning: '区別する' },
  { word: 'Emphasis', meaning: '強調' },
  { word: 'Prohibit', meaning: '禁止する' },
  { word: 'Relieve', meaning: '和らげる' },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Shuffle on start (optional, keeping simple for now)
  }, []);

  const currentItem = VOCAB_LIST[currentIndex];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % VOCAB_LIST.length;
    setCurrentIndex(nextIndex);
    setIsRevealed(false);
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  if (!isClient) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-800">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600">TangoMaster MVP</h1>
        <p className="text-sm text-gray-500">高校生のためのシンプル単語帳</p>
      </header>

      <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center min-h-[300px] flex flex-col justify-between">
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">{currentItem.word}</h2>
          
          <div className={`transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-2xl text-green-600 font-medium">{currentItem.meaning}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              答えを見る
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              次の単語へ
            </button>
          )}
        </div>
      </main>

      <footer className="mt-12 text-xs text-gray-400">
        © 2025 TangoMaster Project
      </footer>
    </div>
  );
}
