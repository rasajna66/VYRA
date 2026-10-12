import React, { useState, useEffect } from 'react';
import { CompanionData, GameProgress } from '../../types';
import { ambientSound } from '../../utils/audioSynth';
import { InteractiveCartoonCharacter } from '../cartoon/InteractiveCartoonCharacter';
import { X, Trophy, Volume2, VolumeX, Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';

interface ArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanion: CompanionData;
  gameProgress: GameProgress;
  onAwardXp: (amount: number, questId?: string) => void;
  onCloudsPopped: (count: number) => void;
  onPlantBloomed: () => void;
  initialGame?: 'clouds' | 'garden' | 'match';
}

interface WorryCloud {
  id: number;
  worry: string;
  reframe: string;
  x: number; // percentage 10-85
  y: number; // percentage 15-75
  popped: boolean;
  color: string;
}

const INITIAL_WORRIES = [
  { worry: 'Test pressure', reframe: 'One step at a time 🌱' },
  { worry: 'Overthinking', reframe: 'I am safe in this moment 🕊️' },
  { worry: 'Feeling behind', reframe: 'My pace is completely valid ✨' },
  { worry: 'FOMO', reframe: 'JOMO: Joy of missing out 🤍' },
  { worry: 'Self-doubt', reframe: 'I am growing every single day 🌟' },
  { worry: 'Heavy thoughts', reframe: 'Clouds drift; the sky stays clear ☁️' },
  { worry: 'Tiredness', reframe: 'Rest is productive 🛌' },
  { worry: 'Comparison', reframe: 'Nobody has my unique story 🌸' },
];

const MEMORY_CARDS_DATA = [
  { id: '1', name: 'Starlet Joy', emoji: '⭐', color: 'bg-amber-100 text-amber-600' },
  { id: '2', name: 'Ocean Peace', emoji: '🌊', color: 'bg-sky-100 text-sky-600' },
  { id: '3', name: 'Grounded Bear', emoji: '🐻', color: 'bg-amber-100 text-amber-800' },
  { id: '4', name: 'Brave Heart', emoji: '💖', color: 'bg-rose-100 text-rose-600' },
  { id: '5', name: 'Sprout Hope', emoji: '🌱', color: 'bg-emerald-100 text-emerald-600' },
  { id: '6', name: 'Golden Fox', emoji: '🦊', color: 'bg-orange-100 text-orange-600' },
];

export const ArcadeModal: React.FC<ArcadeModalProps> = ({
  isOpen,
  onClose,
  currentCompanion,
  gameProgress,
  onAwardXp,
  onCloudsPopped,
  onPlantBloomed,
  initialGame = 'clouds',
}) => {
  const [activeGame, setActiveGame] = useState<'clouds' | 'garden' | 'match'>(initialGame);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- GAME 1: CLOUD POPPER STATE ---
  const [clouds, setClouds] = useState<WorryCloud[]>([]);
  const [popScore, setPopScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [recentReframe, setRecentReframe] = useState<string | null>(null);

  // --- GAME 2: ZEN BLOOM GARDEN STATE ---
  const [bloomStage, setBloomStage] = useState(0); // 0 to 4
  const [bloomEnergy, setBloomEnergy] = useState(0); // 0 to 100
  const [bloomMessage, setBloomMessage] = useState('Nurture the seed with sun, rain, and breeze!');

  // --- GAME 3: MEMORY MATCH STATE ---
  const [memoryCards, setMemoryCards] = useState<{ id: string; cardId: string; name: string; emoji: string; color: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [isMemoryWon, setIsMemoryWon] = useState(false);

  // Initialize Clouds
  useEffect(() => {
    if (activeGame === 'clouds') {
      initClouds();
    }
  }, [activeGame]);

  const initClouds = () => {
    const cloudColors = ['#E0F2FE', '#EFF6FF', '#F0FDF4', '#FAF5FF', '#FFFBEB'];
    const newClouds: WorryCloud[] = INITIAL_WORRIES.map((item, idx) => ({
      id: idx,
      worry: item.worry,
      reframe: item.reframe,
      x: 12 + (idx % 4) * 22 + (Math.random() * 6 - 3),
      y: 18 + Math.floor(idx / 4) * 36 + (Math.random() * 8 - 4),
      popped: false,
      color: cloudColors[idx % cloudColors.length],
    }));
    setClouds(newClouds);
    setPopScore(0);
    setCombo(0);
    setRecentReframe(null);
  };

  const handlePopCloud = (cloudId: number) => {
    setClouds((prev) =>
      prev.map((c) => {
        if (c.id === cloudId && !c.popped) {
          if (soundEnabled) ambientSound.playPop();
          setPopScore((s) => s + 10 * (combo + 1));
          setCombo((cm) => cm + 1);
          setRecentReframe(c.reframe);
          onCloudsPopped(1);
          onAwardXp(15, 'quest-clouds');
          return { ...c, popped: true };
        }
        return c;
      })
    );
  };

  // Initialize Memory Match
  useEffect(() => {
    if (activeGame === 'match') {
      initMemoryGame();
    }
  }, [activeGame]);

  const initMemoryGame = () => {
    const deck = [...MEMORY_CARDS_DATA, ...MEMORY_CARDS_DATA].map((card, index) => ({
      ...card,
      id: `${card.id}-${index}`,
      cardId: card.id,
      isFlipped: false,
      isMatched: false,
    }));
    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setSelectedCards([]);
    setMatchesFound(0);
    setMovesCount(0);
    setIsMemoryWon(false);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) {
      return;
    }

    if (soundEnabled) ambientSound.playPop();

    const newDeck = [...memoryCards];
    newDeck[index].isFlipped = true;
    setMemoryCards(newDeck);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMovesCount((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      if (newDeck[firstIdx].cardId === newDeck[secondIdx].cardId) {
        // MATCH!
        setTimeout(() => {
          if (soundEnabled) ambientSound.playSparkle();
          newDeck[firstIdx].isMatched = true;
          newDeck[secondIdx].isMatched = true;
          setMemoryCards([...newDeck]);
          setSelectedCards([]);
          setMatchesFound((mf) => {
            const next = mf + 1;
            if (next === MEMORY_CARDS_DATA.length) {
              setIsMemoryWon(true);
              if (soundEnabled) ambientSound.playLevelUp();
              onAwardXp(60);
            }
            return next;
          });
        }, 350);
      } else {
        // NO MATCH
        setTimeout(() => {
          newDeck[firstIdx].isFlipped = false;
          newDeck[secondIdx].isFlipped = false;
          setMemoryCards([...newDeck]);
          setSelectedCards([]);
        }, 850);
      }
    }
  };

  // Zen Bloom Garden Nurture
  const handleNurture = (type: 'sun' | 'water' | 'breeze') => {
    if (bloomStage >= 4) return;

    if (type === 'water') {
      if (soundEnabled) ambientSound.playWaterDrop();
    } else {
      if (soundEnabled) ambientSound.playSparkle();
    }

    const nextEnergy = bloomEnergy + 25;
    if (nextEnergy >= 100) {
      const nextStage = bloomStage + 1;
      setBloomStage(nextStage);
      setBloomEnergy(0);

      if (nextStage === 1) setBloomMessage('A tender green sprout poked through! 🌱');
      else if (nextStage === 2) setBloomMessage('Vibrant leafy branches stretching out! 🌿');
      else if (nextStage === 3) setBloomMessage('A glowing bud forms with sweet scent! 🌷');
      else if (nextStage === 4) {
        setBloomMessage('FULL BLOOM! A magnificent Rainbow Lotus! 🌸✨');
        if (soundEnabled) ambientSound.playLevelUp();
        onPlantBloomed();
        onAwardXp(50, 'quest-bloom');
      }
    } else {
      setBloomEnergy(nextEnergy);
      setBloomMessage(
        type === 'sun'
          ? 'Warm sunlight bathes the leaves! ☀️'
          : type === 'water'
          ? 'Refreshing water droplets sink to roots! 💧'
          : 'A soothing gentle breeze sways the stems! 🍃'
      );
    }
  };

  const resetGarden = () => {
    setBloomStage(0);
    setBloomEnergy(0);
    setBloomMessage('A fresh seed is ready in the mindful soil! 🌱');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-[#B2CBD8]/50 dark:border-[#1E3A52] overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#B2CBD8]/40 dark:border-[#1E3A52] bg-[#EFF9FD]/60 dark:bg-[#102436]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
              🎮
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                VYRA Wellbeing Arcade
              </h2>
              <div className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                Level {gameProgress.level} • {gameProgress.xp} XP
              </div>
            </div>
          </div>

          {/* Game Switcher Tabs */}
          <div className="hidden sm:flex items-center p-1 bg-white dark:bg-[#08121A] rounded-xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
            <button
              onClick={() => setActiveGame('clouds')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'clouds'
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              ☁️ Cloud Popper
            </button>
            <button
              onClick={() => setActiveGame('garden')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'garden'
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              🌸 Zen Blossom
            </button>
            <button
              onClick={() => setActiveGame('match')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'match'
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              🃏 Mood Match
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-[#547489] hover:bg-white dark:hover:bg-[#132A3E] transition-colors"
              title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0F3A57] dark:text-[#F0F7FB]" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#547489] hover:bg-white dark:hover:bg-[#132A3E] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Game Switcher Tabs */}
        <div className="flex sm:hidden items-center justify-around p-2 bg-[#EFF9FD] dark:bg-[#102436] border-b border-[#B2CBD8]/40 dark:border-[#1E3A52]">
          <button
            onClick={() => setActiveGame('clouds')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
              activeGame === 'clouds' ? 'bg-[#0F3A57] text-white' : 'text-[#547489]'
            }`}
          >
            ☁️ Cloud Popper
          </button>
          <button
            onClick={() => setActiveGame('garden')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
              activeGame === 'garden' ? 'bg-[#0F3A57] text-white' : 'text-[#547489]'
            }`}
          >
            🌸 Zen Blossom
          </button>
          <button
            onClick={() => setActiveGame('match')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
              activeGame === 'match' ? 'bg-[#0F3A57] text-white' : 'text-[#547489]'
            }`}
          >
            🃏 Mood Match
          </button>
        </div>

        {/* Game Area Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#EFF9FD]/50 to-white dark:from-[#08121A] dark:to-[#0D1E2D]">
          {/* ========================================================= */}
          {/* GAME 1: WORRY CLOUD POPPER */}
          {/* ========================================================= */}
          {activeGame === 'clouds' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#102436] p-3 rounded-2xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                    Score: <span className="text-amber-500">{popScore} pts</span>
                  </span>
                  {combo > 1 && (
                    <span className="text-xs font-extrabold text-rose-500 animate-pulse">
                      🔥 {combo}x Combo!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#547489] dark:text-[#8DAEC2]">
                    Tap clouds to release stress & reveal positive thoughts!
                  </span>
                  <button
                    onClick={initClouds}
                    className="p-1.5 rounded-lg hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] text-[#547489]"
                    title="Reset Clouds"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sky Arena */}
              <div
                className="relative w-full h-[400px] rounded-3xl border-2 border-[#B2CBD8]/60 dark:border-[#1E3A52] overflow-hidden select-none shadow-inner"
                style={{
                  backgroundImage: `url('/src/assets/images/vyra_cartoon_quest_island_1791798960659.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Translucent sky scrim */}
                <div className="absolute inset-0 bg-sky-200/40 dark:bg-slate-900/60 backdrop-blur-[1px]" />

                {/* Floating Clouds */}
                {clouds.map((cloud) => {
                  if (cloud.popped) return null;
                  return (
                    <button
                      key={cloud.id}
                      onClick={() => handlePopCloud(cloud.id)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95 group focus:outline-none"
                      style={{
                        left: `${cloud.x}%`,
                        top: `${cloud.y}%`,
                      }}
                    >
                      {/* Fluffy cartoon SVG cloud */}
                      <div className="relative p-4 rounded-3xl bg-white/95 dark:bg-[#0D1E2D]/95 border-2 border-sky-300 dark:border-sky-600 shadow-lg text-center backdrop-blur-sm animate-float-bob">
                        <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] whitespace-nowrap">
                          {cloud.worry}
                        </div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                          Tap to Pop! 💥
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* All clouds popped celebration banner */}
                {clouds.every((c) => c.popped) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 dark:bg-[#0D1E2D]/90 backdrop-blur-md p-6 text-center animate-fade-in z-20">
                    <span className="text-6xl mb-2 animate-bounce">🌈</span>
                    <h3 className="text-xl font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                      Sky is Clear & Mind is Light!
                    </h3>
                    <p className="text-xs text-[#547489] dark:text-[#8DAEC2] max-w-sm mt-1 mb-4">
                      You released all heavy clouds! You earned +50 XP and a calm heart.
                    </p>
                    <button
                      onClick={initClouds}
                      className="px-5 py-2.5 rounded-2xl bg-[#0F3A57] text-white font-bold text-xs shadow-md hover:bg-[#1E4666] active:scale-95 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Play Again</span>
                    </button>
                  </div>
                )}

                {/* Recent Reframe Toast Banner inside Arena */}
                {recentReframe && (
                  <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs p-3 rounded-2xl bg-white/95 dark:bg-[#102436]/95 border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-xl text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-2 animate-fade-in z-10">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{recentReframe}</span>
                  </div>
                )}

                {/* Active companion cheering in bottom left */}
                <div className="absolute bottom-2 left-2 z-10 hidden sm:flex items-center gap-2 bg-white/90 dark:bg-[#0D1E2D]/90 p-2 rounded-2xl border border-[#B2CBD8]/50 shadow-md">
                  <div className="w-12 h-12">
                    <InteractiveCartoonCharacter
                      companionId={currentCompanion.id}
                      accessory={currentCompanion.accessory}
                      mood="cheering"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#0F3A57] dark:text-[#F0F7FB] pr-2">
                    "Pop away that tension!"
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GAME 2: ZEN BLOOM GARDEN */}
          {/* ========================================================= */}
          {activeGame === 'garden' && (
            <div className="space-y-4 max-w-xl mx-auto text-center">
              <div className="bg-white dark:bg-[#102436] p-4 rounded-2xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
                <h3 className="text-sm font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                  {bloomMessage}
                </h3>
                <div className="w-full bg-[#EFF9FD] dark:bg-[#08121A] h-2.5 rounded-full overflow-hidden mt-3 border border-[#B2CBD8]/40">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                    style={{ width: `${bloomEnergy}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#547489] dark:text-[#8DAEC2] mt-1">
                  <span>Growth Stage {bloomStage + 1} / 5</span>
                  <span>{bloomEnergy}% Energy</span>
                </div>
              </div>

              {/* Plant Pot Canvas Container */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-sky-50 to-amber-50 dark:from-[#112433] dark:to-[#162719] border-2 border-[#B2CBD8]/60 dark:border-[#1E3A52] flex flex-col items-center justify-center min-h-[260px] relative">
                {/* Cartoon Plant Illustration based on stage */}
                <div className="relative text-7xl select-none animate-float-gentle">
                  {bloomStage === 0 && '🌱'}
                  {bloomStage === 1 && '🌿'}
                  {bloomStage === 2 && '🪴'}
                  {bloomStage === 3 && '🌷'}
                  {bloomStage === 4 && (
                    <div className="relative">
                      <span className="text-8xl">🌸</span>
                      <span className="absolute -top-2 -right-2 text-2xl animate-spin">✨</span>
                    </div>
                  )}
                </div>

                {/* Pot Base */}
                <div className="w-24 h-12 bg-amber-700 dark:bg-amber-800 rounded-b-3xl border-t-4 border-amber-900 dark:border-amber-950 shadow-md mt-2 flex items-center justify-center text-xs font-bold text-amber-100">
                  VYRA
                </div>

                {bloomStage === 4 && (
                  <div className="mt-4 animate-fade-in">
                    <button
                      onClick={resetGarden}
                      className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#1E4666] active:scale-95 transition-all flex items-center gap-1.5 mx-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Grow Another Flower</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Nurturing Interactive Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  disabled={bloomStage >= 4}
                  onClick={() => handleNurture('sun')}
                  className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 active:scale-95 transition-all flex flex-col items-center disabled:opacity-50"
                >
                  <span className="text-2xl mb-1">☀️</span>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Sunbeam
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Warm energy</span>
                </button>

                <button
                  disabled={bloomStage >= 4}
                  onClick={() => handleNurture('water')}
                  className="p-4 rounded-2xl bg-sky-100 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800/60 hover:bg-sky-200 active:scale-95 transition-all flex flex-col items-center disabled:opacity-50"
                >
                  <span className="text-2xl mb-1">💧</span>
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                    Raindrop
                  </span>
                  <span className="text-[10px] text-sky-700 dark:text-sky-400">Pure hydration</span>
                </button>

                <button
                  disabled={bloomStage >= 4}
                  onClick={() => handleNurture('breeze')}
                  className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-200 active:scale-95 transition-all flex flex-col items-center disabled:opacity-50"
                >
                  <span className="text-2xl mb-1">🍃</span>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Gentle Breeze
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Fresh calm</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GAME 3: MOOD MATCH & MEMORY */}
          {/* ========================================================= */}
          {activeGame === 'match' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between bg-white dark:bg-[#102436] p-3 rounded-2xl border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
                <div className="flex items-center gap-4 text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                  <span>Matches: {matchesFound} / {MEMORY_CARDS_DATA.length}</span>
                  <span>Moves: {movesCount}</span>
                </div>
                <button
                  onClick={initMemoryGame}
                  className="px-3 py-1.5 rounded-xl bg-[#EFF9FD] dark:bg-[#132A3E] text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#B2CBD8]/40 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </div>

              {/* 12-Card Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {memoryCards.map((card, idx) => {
                  const isVisible = card.isFlipped || card.isMatched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      disabled={isVisible}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 active:scale-95 ${
                        card.isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 opacity-90'
                          : card.isFlipped
                          ? `${card.color} border-[#0F3A57] shadow-md`
                          : 'bg-white dark:bg-[#102436] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:border-[#0F3A57] hover:shadow-sm'
                      }`}
                    >
                      {isVisible ? (
                        <div className="text-center animate-fade-in">
                          <span className="text-3xl sm:text-4xl block mb-1">{card.emoji}</span>
                          <span className="text-[10px] font-bold line-clamp-1">
                            {card.name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center text-[#547489] dark:text-[#8DAEC2]">
                          <span className="text-2xl block mb-1">✨</span>
                          <span className="text-[10px] font-bold">VYRA</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Victory Banner */}
              {isMemoryWon && (
                <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center animate-fade-in space-y-2">
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    🎉 Fantastic Memory & Focus!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    You matched all feelings in {movesCount} moves and earned +60 XP!
                  </p>
                  <button
                    onClick={initMemoryGame}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 active:scale-95 transition-all"
                  >
                    Play Another Round
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
