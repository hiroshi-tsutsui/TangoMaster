'use client';

import { useState, useEffect } from 'react';
import { VOCAB_DATA } from '../data/vocab';

export default function Home() {
  const [category, setCategory] = useState<string>('Standard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState(false);

  const currentList = VOCAB_DATA[category];
  const currentItem = currentList[currentIndex];

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const updateStreak = () => {
    const today = getTodayString();
    const lastDate = localStorage.getItem('vocab_last_date');
    const savedStreak = parseInt(localStorage.getItem('vocab_streak') || '0', 10);

    if (lastDate === today) return; // Already updated today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDate === yesterdayString) {
      newStreak = savedStreak + 1;
    }

    setStreak(newStreak);
    setStreakUpdatedToday(true);
    localStorage.setItem('vocab_streak', newStreak.toString());
    localStorage.setItem('vocab_last_date', today);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentIndex(nextIndex);
    setIsRevealed(false);
    updateStreak();
    
    // XP Logic
    const newXp = xp + 10;
    setXp(newXp);
    localStorage.setItem('vocab_xp', newXp.toString());
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  const handleShare = () => {
    const text = `🔥 I'm on a ${streak}-day streak and have ${xp} XP on TangoMaster! Can you beat me? #TangoMaster #Study`;
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
  };

  // Init Effect
  useEffect(() => {
    setMounted(true);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Load Data
    const savedStreak = parseInt(localStorage.getItem('vocab_streak') || '0', 10);
    const savedXp = parseInt(localStorage.getItem('vocab_xp') || '0', 10);
    const lastDate = localStorage.getItem('vocab_last_date');
    const today = getTodayString();

    setXp(savedXp);

    if (lastDate === today) {
      setStreak(savedStreak);
      setStreakUpdatedToday(true);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayString) {
        setStreak(savedStreak);
      } else {
        setStreak(0);
      }
      setStreakUpdatedToday(false);
    }
  }, []);

  // Keyboard Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (isRevealed) {
          handleNext();
        } else {
          handleReveal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, currentIndex, category, xp]); // Added xp dependency to keep handleNext fresh? actually state closure might be an issue if effect binds old handleNext. 
  // Wait, handleNext uses 'xp' from closure. If I don't update the effect dependency or use functional update, it might be stale?
  // Actually, functional update is safer: setXp(prev => prev + 10).
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${mounted && darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center max-w-2xl mx-auto right-0">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${mounted && darkMode ? 'text-blue-400' : 'text-blue-600'}`}>TangoMaster</h1>
            <p className={`text-xs ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alpha v0.6</p>
          </div>

          <div className="flex items-center gap-4">
             {/* XP Display */}
             <div className={`text-sm font-bold px-3 py-1 rounded-full ${mounted && darkMode ? 'bg-gray-800 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              {xp} XP
            </div>

            {/* Streak Display */}
            <button 
              onClick={handleShare}
              className={`flex items-center gap-1 font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer ${streakUpdatedToday ? 'text-orange-500' : 'text-gray-400'}`} 
              title="Share your streak!"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${streakUpdatedToday ? 'animate-pulse' : ''}`}>
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <span>{streak}</span>
            </button>

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
          </div>
        </header>

        {/* Category Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto max-w-full pb-2">
          {Object.keys(VOCAB_DATA).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === cat 
                  ? (mounted && darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-md shadow-blue-500/30') 
                  : (mounted && darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <main className={`w-full max-w-md rounded-2xl shadow-2xl p-8 text-center min-h-[400px] flex flex-col justify-between transition-all duration-300 ${mounted && darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
          <div className="flex-grow flex flex-col justify-center items-center relative">
            <span className={`absolute top-0 right-0 text-xs font-mono opacity-30 ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              #{currentIndex + 1} / {currentList.length}
            </span>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-wide break-all">{currentItem.word}</h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(currentItem.word);
                    utterance.lang = 'en-US';
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className={`flex-shrink-0 p-3 rounded-full transition-all active:scale-95 ${mounted && darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}
                title="Listen to pronunciation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </button>
            </div>
            
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
          
          <div className={`mt-4 text-xs ${mounted && darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Tip: Press <span className="font-bold border border-current px-1 rounded">Space</span> to reveal/next
          </div>
        </main>

        <footer className="mt-12 text-xs text-gray-500 text-center opacity-60">
          © 2025 TangoMaster • Designed for Students
        </footer>
      </div>
    </div>
  );
}