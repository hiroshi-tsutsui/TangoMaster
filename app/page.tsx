'use client';

import { useState, useEffect } from 'react';

// MVP Data: Common high-school level English words
const VOCAB_LIST = [
  { word: 'Ambiguous', meaning: '曖昧な', example: 'His reply was ambiguous.' },
  { word: 'Inevitable', meaning: '避けられない', example: 'War was inevitable.' },
  { word: 'Simultaneous', meaning: '同時の', example: 'Simultaneous interpretation.' },
  { word: 'Reluctant', meaning: '気が進まない', example: 'He was reluctant to go.' },
  { word: 'Subsequent', meaning: 'その後の', example: 'Subsequent events proved him wrong.' },
  { word: 'Crucial', meaning: '重大な', example: 'A crucial decision.' },
  { word: 'Distinguish', meaning: '区別する', example: 'Distinguish right from wrong.' },
  { word: 'Emphasis', meaning: '強調', example: 'Emphasis on quality.' },
  { word: 'Prohibit', meaning: '禁止する', example: 'Smoking is prohibited.' },
  { word: 'Relieve', meaning: '和らげる', example: 'Relieve pain.' },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
      }
    }, 0);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${mounted && darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center max-w-2xl mx-auto right-0">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${mounted && darkMode ? 'text-blue-400' : 'text-blue-600'}`}>TangoMaster</h1>
            <p className={`text-xs ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alpha v0.2</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${mounted && darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-all`}
            aria-label="Toggle Dark Mode"
          >
            {mounted && darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </header>

        {/* Main Card */}
        <main className={`w-full max-w-md rounded-2xl shadow-2xl p-8 text-center min-h-[400px] flex flex-col justify-between transition-all duration-300 ${mounted && darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className="flex-grow flex flex-col justify-center items-center relative">
            <span className={`absolute top-0 right-0 text-xs font-mono opacity-30 ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              #{currentIndex + 1} / {VOCAB_LIST.length}
            </span>
            
            <h2 className="text-5xl font-extrabold mb-6 tracking-wide">{currentItem.word}</h2>
            
            <div className={`transition-all duration-500 transform ${isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
              <p className={`text-3xl font-bold mb-3 ${mounted && darkMode ? 'text-green-400' : 'text-green-600'}`}>{currentItem.meaning}</p>
              {currentItem.example && (
                <p className={`text-sm italic ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  &quot;{currentItem.example}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {!isRevealed ? (
              <button
                onClick={handleReveal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-500/30"
              >
                Reveal Meaning
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`w-full font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg ${mounted && darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-gray-900/50' : 'bg-gray-900 hover:bg-black text-white shadow-gray-400/50'}`}
              >
                Next Word →
              </button>
            )}
          </div>
        </main>

        <footer className="mt-12 text-xs text-gray-500 text-center opacity-60">
          © 2025 TangoMaster • Designed for Students
        </footer>
      </div>
    </div>
  );
}
