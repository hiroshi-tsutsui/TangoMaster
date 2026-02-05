'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { VOCAB_DATA } from '../data/vocab';
import { audio } from '../utils/audio';
import Leaderboard from '../components/Leaderboard';
import ChallengeModal from '../components/ChallengeModal';

export default function Home() {
  const [category, setCategory] = useState<string>('Standard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [dailyXp, setDailyXp] = useState(0);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState(false);
  const [hardWords, setHardWords] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // Speed Run State
  const [gameMode, setGameMode] = useState<'standard' | 'speedrun'>('standard');
  const [timeLeft, setTimeLeft] = useState(60);
  const [speedScore, setSpeedScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [speedRunList, setSpeedRunList] = useState<any[]>([]);

  const getReviewList = () => {
    const allWords = Object.values(VOCAB_DATA).flat();
    const uniqueWords = new Map();
    allWords.forEach(w => uniqueWords.set(w.word, w));
    return Array.from(uniqueWords.values()).filter((w: any) => hardWords.has(w.word));
  };

  const startSpeedRun = () => {
    const all = Object.values(VOCAB_DATA).flat();
    // Shuffle
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    setSpeedRunList(all);
    setGameMode('speedrun');
    setGameActive(true);
    setTimeLeft(60);
    setSpeedScore(0);
    setCategory('All');
    setCurrentIndex(0);
    setIsRevealed(false);
    audio.playLevelUp();
  };

  const endSpeedRun = () => {
    setGameActive(false);
    audio.playLevelUp();
    confetti({ particleCount: 200, spread: 100 });
    alert(`⏱ TIME'S UP! \nScore: ${speedScore} words!`);
    setGameMode('standard');
    setCategory('Standard');
  };

  useEffect(() => {
    if (gameMode === 'speedrun' && gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameMode === 'speedrun' && gameActive && timeLeft === 0) {
      endSpeedRun();
    }
  }, [gameMode, gameActive, timeLeft]);

  const currentList = gameMode === 'speedrun' ? speedRunList : (category === 'Review' ? getReviewList() : VOCAB_DATA[category]);
  const currentItem = currentList?.[currentIndex] || { word: "All Done!", meaning: "No words left to review.", example: "Great job!" };

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const calculateLevel = (points: number) => Math.floor(points / 100) + 1;

  const updateStreak = () => {
    const today = getTodayString();
    const lastDate = localStorage.getItem('vocab_last_date');
    const savedStreak = parseInt(localStorage.getItem('vocab_streak') || '0', 10);

    if (lastDate === today) return;

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

  const handleNext = (known: boolean) => {
    // Speed Run Logic
    if (gameMode === 'speedrun') {
        if (known) {
            setSpeedScore(prev => prev + 1);
            audio.playSuccess();
        } else {
            audio.playHard();
        }
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
        return;
    }

    // XP Logic
    const xpGain = known ? 20 : 5;
    const newXp = xp + xpGain;
    const newDailyXp = dailyXp + xpGain;

    // Level Up Logic
    const currentLevel = calculateLevel(xp);
    const nextLevel = calculateLevel(newXp);

    // Daily Quest Complete Logic
    if (dailyXp < 100 && newDailyXp >= 100) {
        audio.playLevelUp();
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.2 } });
        // Optional: Alert or toast
    }

    if (nextLevel > currentLevel) {
        audio.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Level Up! You are now level ${nextLevel}`);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
        alert(`🎉 LEVEL UP! \nYou reached Level ${nextLevel}! \nKeep learning! 🎓`);
    }

    setXp(newXp);
    setDailyXp(newDailyXp);
    localStorage.setItem('vocab_xp', newXp.toString());
    localStorage.setItem('vocab_daily_xp', newDailyXp.toString());

    // Hard Words Logic
    const newHardWords = new Set(hardWords);
    if (!known) {
      audio.playHard();
      newHardWords.add(currentItem.word);
    } else {
      audio.playSuccess();
      if (newHardWords.has(currentItem.word)) {
        newHardWords.delete(currentItem.word);
      }
    }
    setHardWords(newHardWords);
    localStorage.setItem('vocab_hard_words', JSON.stringify(Array.from(newHardWords)));

    // Analytics (MVP)
    console.log('[Analytics] Word Answered:', {
      word: currentItem.word,
      category,
      known,
      timestamp: new Date().toISOString()
    });

    // If in Review mode and list is empty after removal
    if (category === 'Review' && known && newHardWords.size === 0) {
        setCategory('Standard');
        setCurrentIndex(0);
        setIsRevealed(false);
        updateStreak();
        return;
    }

    let nextIndex = (currentIndex + 1) % currentList.length;

    if (category === 'Review' && known) {
        if (currentIndex >= newHardWords.size) {
            nextIndex = 0;
        } else {
            nextIndex = currentIndex;
        }
    }

    setCurrentIndex(nextIndex);
    setIsRevealed(false);
    updateStreak();
  };

  const handleReveal = () => {
    audio.playPop();
    setIsRevealed(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audio.toggle(newState);
    localStorage.setItem('vocab_sound', newState.toString());
  };

  const handleCategoryChange = (cat: string) => {
    if (gameMode === 'speedrun') return; // Lock category during speed run
    setCategory(cat);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  const handleShare = () => {
    setShowChallengeModal(true);
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
    const savedDailyXp = parseInt(localStorage.getItem('vocab_daily_xp') || '0', 10);
    const lastDate = localStorage.getItem('vocab_last_date');
    const savedHardWords = JSON.parse(localStorage.getItem('vocab_hard_words') || '[]');
    const savedSound = localStorage.getItem('vocab_sound') !== 'false';
    const today = getTodayString();

    setXp(savedXp);
    setHardWords(new Set(savedHardWords));
    setSoundEnabled(savedSound);
    audio.toggle(savedSound);

    if (lastDate === today) {
      setStreak(savedStreak);
      setDailyXp(savedDailyXp);
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
      setDailyXp(0); // Reset daily XP
      localStorage.setItem('vocab_daily_xp', '0');
      setStreakUpdatedToday(false);
    }
  }, []);

  // Keyboard Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (isRevealed) {
          handleNext(true); 
        } else {
          handleReveal();
        }
      }
      if (e.key === '1' && isRevealed) {
        handleNext(false);
      }
      if (e.key === '2' && isRevealed) {
        handleNext(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, currentIndex, category, xp, hardWords, gameMode, speedScore]);

  const level = calculateLevel(xp);
  const categories = ['Review', ...Object.keys(VOCAB_DATA)].filter(cat => cat !== 'Review' || hardWords.size > 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${mounted && darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Daily Progress Bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
          style={{ width: `${Math.min(100, (dailyXp / 100) * 100)}%` }}
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">

        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center max-w-2xl mx-auto right-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${mounted && darkMode ? 'text-blue-400' : 'text-blue-600'}`}>TangoMaster</h1>
              <p className={`text-xs ${mounted && darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alpha v0.10</p>
            </div>

            {/* Pro & Speed Run Buttons */}
            <div className="flex gap-2">
                <button
                  onClick={() => alert("TangoMaster Pro: Ad-free, Offline Mode, and AI Tutor coming soon!")}
                  className={`hidden sm:block text-[10px] font-bold px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${mounted && darkMode ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-900/30' : 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'}`}
                >
                  Pro
                </button>
                <button
                  onClick={gameMode === 'speedrun' ? endSpeedRun : startSpeedRun}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${gameMode === 'speedrun' ? 'bg-red-500 text-white border-red-500 animate-pulse' : (mounted && darkMode ? 'text-red-400 border-red-400 hover:bg-red-900/30' : 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100')}`}
                >
                  {gameMode === 'speedrun' ? `${timeLeft}s` : 'Speed Run'}
                </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* XP / Level Display - Hide in Speed Run */}
             {gameMode !== 'speedrun' && (
                <div className={`text-sm font-bold px-3 py-1 rounded-full flex gap-2 items-center ${mounted && darkMode ? 'bg-gray-800 text-purple-400' : 'bg-purple-100 text-purple-600'}`} title={`Total XP: ${xp}`}>
                <span className="text-xs uppercase opacity-70">Lvl {level}</span>
                <span>{xp % 100}/100</span>
                </div>
             )}

             {/* Score Display - Show in Speed Run */}
             {gameMode === 'speedrun' && (
                <div className={`text-xl font-black px-3 py-1 rounded-full flex gap-2 items-center bg-red-600 text-white shadow-lg shadow-red-500/50 scale-110`}>
                <span>{speedScore}</span>
                </div>
             )}

             <button
               onClick={() => setShowLeaderboard(true)}
               className={`p-2 rounded-full ${mounted && darkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-yellow-600 hover:bg-gray-100'} shadow-sm transition-all`}
               title="Leaderboard"
             >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                 <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.753 6.753 0 0 1 9.75 22a.75.75 0 0 1-.75-.75v-10.85c0-.414.336-.75.75-.75.73 0 1.432.126 2.076.354a5.275 5.275 0 0 0 2.21.314c1.077-.123 2.08-.68 2.85-1.503a.75.75 0 0 0-.25-1.238 3.78 3.78 0 0 1-1.353-.66c-.655-.504-1.28-1.298-1.428-2.316a.75.75 0 0 0-1.486.202c.162 1.11.889 2.046 1.68 2.656.467.36 1 .63 1.57.776-.364.67-1.026 1.15-1.789 1.235a3.78 3.78 0 0 1-1.583-.225 3.743 3.743 0 0 1-1.373-.837l-.022-.016C10.77 8.528 10.15 8.012 9.315 7.584ZM5.25 15a.75.75 0 0 0-.75.75v3.297l-.922.384a.75.75 0 1 0 .57 1.385l1.644-.685a.75.75 0 0 0 .458-.69V15.75A.75.75 0 0 0 5.25 15Z" clipRule="evenodd" />
                 <path d="M2.25 3A.75.75 0 0 1 3 2.25h.356c1.17 0 2.232.556 2.87 1.403l.97 1.292c.622.83.622 1.98 0 2.81l-.97 1.292c-.638.847-1.7 1.403-2.87 1.403H3A.75.75 0 0 1 2.25 9.75V3Z" />
               </svg>
             </button>

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
              onClick={toggleSound}
              className={`p-2 rounded-full ${mounted && darkMode ? 'bg-gray-800 text-pink-400 hover:bg-gray-700' : 'bg-white text-pink-500 hover:bg-gray-100'} shadow-sm transition-all`}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              )}
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

        {/* Category Selector - Hide in Speed Run */}
        <div className={`mb-6 flex gap-2 overflow-x-auto max-w-full pb-2 ${gameMode === 'speedrun' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          {categories.map((cat) => (
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
              {cat === 'Review' && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {hardWords.size}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <main className={`w-full max-w-md rounded-2xl shadow-2xl p-8 text-center min-h-[400px] flex flex-col justify-between transition-all duration-300 ${mounted && darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} ${gameMode === 'speedrun' ? 'border-red-500 ring-2 ring-red-500/50' : ''}`}>
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
              {currentItem.mnemonic && (
                <div className={`mt-4 p-3 rounded-lg text-sm border ${mounted && darkMode ? 'bg-indigo-900/30 border-indigo-700 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                    <span className="font-bold mr-2">🧠 Memory Hook:</span>
                    {currentItem.mnemonic}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {!isRevealed ? (
              <button
                onClick={handleReveal}
                className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg ${gameMode === 'speedrun' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
              >
                Reveal Meaning
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleNext(false)}
                  className={`flex-1 font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg ${mounted && darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                >
                  {gameMode === 'speedrun' ? 'Skip' : 'Hard (+5 XP)'}
                </button>
                <button
                  onClick={() => handleNext(true)}
                  className={`flex-1 font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg ${mounted && darkMode ? 'bg-green-700 hover:bg-green-600 text-white shadow-green-900/50' : 'bg-green-600 hover:bg-green-700 text-white shadow-green-400/50'}`}
                >
                  {gameMode === 'speedrun' ? 'Got it! (+1)' : 'I Knew It! (+20 XP)'}
                </button>
              </div>
            )}
          </div>

          <div className={`mt-4 text-xs ${mounted && darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Tip: Press <span className="font-bold border border-current px-1 rounded">Space</span> to reveal/next
          </div>
        </main>

        <footer className="mt-12 text-xs text-gray-500 text-center opacity-60">
          © 2025 TangoMaster • Designed for Students
        </footer>

        {showLeaderboard && (
          <Leaderboard currentXp={xp} onClose={() => setShowLeaderboard(false)} />
        )}

        {showChallengeModal && (
          <ChallengeModal streak={streak} level={level} onClose={() => setShowChallengeModal(false)} />
        )}
      </div>
    </div>
  );
}
