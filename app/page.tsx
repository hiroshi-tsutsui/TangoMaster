'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VOCAB_DATA } from '../data/vocab';
import { audio } from '../utils/audio';
import { THEMES, ThemeKey } from '../utils/themes';
import { generateAIExample } from '../utils/ai';
import Leaderboard from '../components/Leaderboard';
import ChallengeModal from '../components/ChallengeModal';
import ThemeSelector from '../components/ThemeSelector';
import ProModal from '../components/ProModal';
import ProfileModal from '../components/ProfileModal';

export default function Home() {
  const [category, setCategory] = useState<string>('Standard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>('light'); // Replaces darkMode
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [dailyXp, setDailyXp] = useState(0);
  const [streakUpdatedToday, setStreakUpdatedToday] = useState(false);
  const [hardWords, setHardWords] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [customExample, setCustomExample] = useState<string | null>(null);
  
  // Profile State
  const [username, setUsername] = useState('Guest');
  const [avatar, setAvatar] = useState('🎓');
  const [joinDate, setJoinDate] = useState('');
  
  // Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Speed Run State
  const [gameMode, setGameMode] = useState<'standard' | 'speedrun'>('standard');
  const [timeLeft, setTimeLeft] = useState(60);
  const [speedScore, setSpeedScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [speedRunList, setSpeedRunList] = useState<any[]>([]);

  // Swipe State
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = endY - touchStartRef.current.y;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
        // Horizontal Swipe
        if (isRevealed) {
            if (deltaX > 0) {
                // Right -> Known
                handleNext(true);
            } else {
                // Left -> Hard
                handleNext(false);
            }
        }
    } else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 100) {
        // Vertical Swipe
        if (deltaY < 0 && !isRevealed) {
            // Swipe Up -> Reveal
            handleReveal();
        }
    }
    touchStartRef.current = null;
  };

  // Helpers
  const currentTheme = THEMES[theme];
  const isDark = theme !== 'light'; // For specific conditional tweaks if needed

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

  useEffect(() => {
    setCustomExample(null);
  }, [currentIndex, category]);

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

    const xpGain = known ? 20 : 5;
    const newXp = xp + xpGain;
    const newDailyXp = dailyXp + xpGain;
    const currentLevel = calculateLevel(xp);
    const nextLevel = calculateLevel(newXp);

    if (dailyXp < 100 && newDailyXp >= 100) {
        audio.playLevelUp();
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.2 } });
    }

    if (nextLevel > currentLevel) {
        audio.playLevelUp();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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

  const handleThemeChange = (newTheme: ThemeKey) => {
    setTheme(newTheme);
    localStorage.setItem('vocab_theme', newTheme);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audio.toggle(newState);
    localStorage.setItem('vocab_sound', newState.toString());
  };

  const handleCategoryChange = (cat: string) => {
    if (gameMode === 'speedrun') return;
    setCategory(cat);
    setCurrentIndex(0);
    setIsRevealed(false);
  };

  const handleShare = () => {
    setShowChallengeModal(true);
  };

  const handleSubscribe = () => {
    setIsPro(true);
    localStorage.setItem('vocab_pro', 'true');
    audio.playChime();
    // Confetti handled in modal, but we can do extra here if needed
  };

  const handleGenerateAI = () => {
    if (!currentItem) return;
    const aiSentence = generateAIExample(currentItem.word, category);
    setCustomExample(aiSentence);
    audio.playPop();
  };

  const handleSaveProfile = (name: string, newAvatar: string) => {
    setUsername(name);
    setAvatar(newAvatar);
    localStorage.setItem('vocab_username', name);
    localStorage.setItem('vocab_avatar', newAvatar);
  };

  // Init Effect
  useEffect(() => {
    setMounted(true);
    
    // Load Data
    const savedStreak = parseInt(localStorage.getItem('vocab_streak') || '0', 10);
    const savedXp = parseInt(localStorage.getItem('vocab_xp') || '0', 10);
    const savedDailyXp = parseInt(localStorage.getItem('vocab_daily_xp') || '0', 10);
    const lastDate = localStorage.getItem('vocab_last_date');
    const savedHardWords = JSON.parse(localStorage.getItem('vocab_hard_words') || '[]');
    const savedSound = localStorage.getItem('vocab_sound') !== 'false';
    const savedTheme = localStorage.getItem('vocab_theme') as ThemeKey;
    const savedPro = localStorage.getItem('vocab_pro') === 'true';
    const savedUsername = localStorage.getItem('vocab_username') || 'Guest';
    const savedAvatar = localStorage.getItem('vocab_avatar') || '🎓';
    const savedJoinDate = localStorage.getItem('vocab_join_date');
    const today = getTodayString();

    setXp(savedXp);
    setHardWords(new Set(savedHardWords));
    setSoundEnabled(savedSound);
    setIsPro(savedPro);
    setUsername(savedUsername);
    setAvatar(savedAvatar);
    audio.toggle(savedSound);

    if (!savedJoinDate) {
        localStorage.setItem('vocab_join_date', today);
        setJoinDate(today);
    } else {
        setJoinDate(savedJoinDate);
    }

    // Theme init
    if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

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
      setDailyXp(0);
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
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>
      {/* Daily Progress Bar */}
      <div className={`w-full h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div
          className={`h-full transition-all duration-500 bg-${currentTheme.accent}-500`}
          style={{ width: `${Math.min(100, (dailyXp / 100) * 100)}%` }}
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">

        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center max-w-2xl mx-auto right-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${currentTheme.headerText}`}>TangoMaster</h1>
              <p className={`text-xs opacity-60`}>Alpha v0.10</p>
            </div>

            {/* Pro & Speed Run Buttons */}
            <div className="flex gap-2">
                <button
                  onClick={() => setShowProModal(true)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${isPro ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-transparent shadow-md' : (isDark ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-900/30' : 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100')}`}
                >
                  <span className="hidden sm:inline">{isPro ? 'PRO MEMBER' : 'Pro'}</span>
                  <span className="sm:hidden">{isPro ? '👑' : 'Pro'}</span>
                </button>
                <button
                  onClick={gameMode === 'speedrun' ? endSpeedRun : startSpeedRun}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors uppercase tracking-wider ${gameMode === 'speedrun' ? 'bg-red-500 text-white border-red-500 animate-pulse' : (isDark ? 'text-red-400 border-red-400 hover:bg-red-900/30' : 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100')}`}
                >
                  {gameMode === 'speedrun' ? `${timeLeft}s` : 'Speed Run'}
                </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* XP / Level / Profile Display - Hide in Speed Run */}
             {gameMode !== 'speedrun' && (
                <button 
                    onClick={() => setShowProfileModal(true)}
                    className={`text-sm font-bold px-3 py-1 rounded-full flex gap-2 items-center transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`} 
                    title="View Profile"
                >
                    <span className="text-base">{avatar}</span>
                    <span className="text-xs uppercase opacity-70">Lvl {level}</span>
                </button>
             )}

             {/* Score Display - Show in Speed Run */}
             {gameMode === 'speedrun' && (
                <div className={`text-xl font-black px-3 py-1 rounded-full flex gap-2 items-center bg-red-600 text-white shadow-lg shadow-red-500/50 scale-110`}>
                <span>{speedScore}</span>
                </div>
             )}

             <button
               onClick={() => setShowLeaderboard(true)}
               className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-white text-yellow-600 hover:bg-gray-100'} shadow-sm transition-all`}
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
              className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-pink-400 hover:bg-gray-700' : 'bg-white text-pink-500 hover:bg-gray-100'} shadow-sm transition-all`}
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

            {/* Theme Selector Button (Was Dark Mode Toggle) */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-all`}
              aria-label="Change Theme"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.635m0 0a3.375 3.375 0 0 1-3.996-3.996m3.996 3.996a4.5 4.5 0 0 1 1.487 7.378c-.765.684-1.62.845-2.228.672-.882-.253-1.616-.764-2.179-1.428m-3.076-4.62a3.375 3.375 0 0 0-3.996-3.996" />
                </svg>
            </button>
          </div>
        </header>

        {/* Category Selector */}
        <div className={`mb-6 flex gap-2 overflow-x-auto max-w-full pb-2 ${gameMode === 'speedrun' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? currentTheme.primaryBtn
                  : currentTheme.secondaryBtn
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
        <main 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-full max-w-md rounded-2xl shadow-2xl p-8 text-center min-h-[400px] flex flex-col justify-between transition-all duration-300 ${currentTheme.cardBg} ${gameMode === 'speedrun' ? 'border-red-500 ring-2 ring-red-500/50' : ''}`}
        >
          <div key={currentIndex} className="flex-grow flex flex-col justify-center items-center relative animate-slide-in">
            <span className={`absolute top-0 right-0 text-xs font-mono opacity-30`}>
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
                className={`flex-shrink-0 p-3 rounded-full transition-all active:scale-95 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}
                title="Listen to pronunciation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </button>
            </div>

            <div className={`transition-all duration-500 transform ${isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
              <p className={`text-3xl font-bold mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>{currentItem.meaning}</p>
              {(currentItem.example || customExample) && (
                <div className="relative group">
                    <p className={`text-sm italic opacity-70 transition-all`}>
                    &quot;{customExample || currentItem.example}&quot;
                    </p>
                    {isPro && !customExample && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleGenerateAI(); }}
                            className="mt-2 text-[10px] bg-purple-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mx-auto"
                        >
                            <span>✨ AI Generate New Example</span>
                        </button>
                    )}
                    {isPro && customExample && (
                        <div className="mt-1 text-[10px] text-purple-500 font-bold flex items-center justify-center gap-1">
                            <span>✨ AI Generated</span>
                        </div>
                    )}
                </div>
              )}
              {currentItem.mnemonic && (
                <div className={`mt-4 p-3 rounded-lg text-sm border ${isDark ? 'bg-indigo-900/30 border-indigo-700 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
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
                className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg ${gameMode === 'speedrun' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : currentTheme.primaryBtn}`}
              >
                Reveal Meaning
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleNext(false)}
                  className={`flex-1 font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg ${currentTheme.secondaryBtn}`}
                >
                  {gameMode === 'speedrun' ? 'Skip' : 'Hard (+5 XP)'}
                </button>
                <button
                  onClick={() => handleNext(true)}
                  className={`flex-1 font-bold py-4 px-4 rounded-xl transition-all transform active:scale-95 shadow-lg ${currentTheme.successBtn}`}
                >
                  {gameMode === 'speedrun' ? 'Got it! (+1)' : 'I Knew It! (+20 XP)'}
                </button>
              </div>
            )}
          </div>

          <div className={`mt-4 text-xs opacity-50`}>
            Tip: Press <span className="font-bold border border-current px-1 rounded">Space</span> or <span className="font-bold">Swipe</span> to play
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

        {showThemeSelector && (
          <ThemeSelector currentTheme={theme} level={level} onSelect={handleThemeChange} onClose={() => setShowThemeSelector(false)} />
        )}

        {showProModal && (
          <ProModal onClose={() => setShowProModal(false)} onSubscribe={handleSubscribe} />
        )}

        {showProfileModal && (
          <ProfileModal 
            username={username}
            avatar={avatar}
            stats={{
              xp,
              streak,
              level,
              joinDate,
              wordsLearned: Math.floor(xp / 15) // Estimation for now
            }}
            onSave={handleSaveProfile}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </div>
    </div>
  );
}
