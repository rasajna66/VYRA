import React, { useState } from 'react';
import { DailyHabit } from '../../types';
import { ambientSound } from '../../utils/audioSynth';
import {
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react';

interface DailyHabitTrackerProps {
  habits: DailyHabit[];
  streakDays: number;
  onUpdateHabit: (habitId: string, updated: Partial<DailyHabit>) => void;
  onAddHabit?: (newHabit: Omit<DailyHabit, 'id'>) => void;
  onAwardXp?: (amount: number, reason?: string) => void;
  onTriggerCelebration?: () => void;
}

interface FloatingBadge {
  id: number;
  habitId: string;
  text: string;
  icon: string;
}

interface MiniParticle {
  id: number;
  habitId: string;
  tx: string;
  ty: string;
  rot: string;
  color: string;
  shape: 'star' | 'circle' | 'sparkle';
}

export const DailyHabitTracker: React.FC<DailyHabitTrackerProps> = ({
  habits,
  streakDays,
  onUpdateHabit,
  onAddHabit,
  onAwardXp,
  onTriggerCelebration,
}) => {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('🌱');
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState('time');
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'anytime' | 'evening'>('all');

  // Micro-animation states
  const [recentHabitId, setRecentHabitId] = useState<string | null>(null);
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const [particles, setParticles] = useState<MiniParticle[]>([]);
  const [isBarGleaming, setIsBarGleaming] = useState(false);
  const [isFlameWiggling, setIsFlameWiggling] = useState(false);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // Trigger rich in-component micro-animations on completed action
  const triggerHabitMicroAnimation = (habitId: string, text: string, icon: string) => {
    // 1. Card spring bounce
    setRecentHabitId(habitId);
    setTimeout(() => setRecentHabitId(null), 500);

    // 2. Progress bar gleam sweep
    setIsBarGleaming(true);
    setTimeout(() => setIsBarGleaming(false), 1200);

    // 3. Streak flame playful wiggle
    setIsFlameWiggling(true);
    setTimeout(() => setIsFlameWiggling(false), 700);

    // 4. Floating XP badge above the button
    const badgeId = Date.now() + Math.random();
    setFloatingBadges((prev) => [...prev, { id: badgeId, habitId, text, icon }]);
    setTimeout(() => {
      setFloatingBadges((prev) => prev.filter((b) => b.id !== badgeId));
    }, 1200);

    // 5. Local confetti particle burst directly at button location
    const colors = ['#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#FBBF24', '#06B6D4'];
    const newParticles: MiniParticle[] = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = 25 + Math.random() * 45;
      const tx = `${Math.cos(angle) * distance}px`;
      const ty = `${Math.sin(angle) * distance - 18}px`;
      const rot = `${Math.round(Math.random() * 360)}deg`;
      const shape: 'star' | 'circle' | 'sparkle' =
        i % 3 === 0 ? 'star' : i % 3 === 1 ? 'sparkle' : 'circle';
      return {
        id: Date.now() + i,
        habitId,
        tx,
        ty,
        rot,
        color: colors[i % colors.length],
        shape,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 850);
  };

  // Handle single-step increment (e.g. drinking a glass of water)
  const handleIncrement = (habit: DailyHabit) => {
    if (habit.completed) return;

    const nextCount = habit.currentCount + 1;
    const isNowCompleted = nextCount >= habit.targetCount;

    if (habit.category === 'hydration') {
      ambientSound.playWaterDrop();
    } else {
      ambientSound.playSparkle();
    }

    onUpdateHabit(habit.id, {
      currentCount: Math.min(habit.targetCount, nextCount),
      completed: isNowCompleted,
    });

    // Fire micro-animations
    const badgeText = isNowCompleted
      ? `Completed! +${habit.xpReward} XP`
      : `+1 ${habit.unit} logged`;
    triggerHabitMicroAnimation(habit.id, badgeText, habit.icon);

    if (isNowCompleted) {
      if (onAwardXp) onAwardXp(habit.xpReward, `habit-${habit.id}`);
      if (completedCount + 1 === totalCount && onTriggerCelebration) {
        ambientSound.playLevelUp();
        onTriggerCelebration();
      }
    }
  };

  // Handle decrement for multi-step habit
  const handleDecrement = (habit: DailyHabit) => {
    if (habit.currentCount <= 0) return;
    const nextCount = habit.currentCount - 1;
    onUpdateHabit(habit.id, {
      currentCount: Math.max(0, nextCount),
      completed: false,
    });
  };

  // Toggle binary habit (e.g. sunlight exposure, stretch)
  const handleToggleHabit = (habit: DailyHabit) => {
    const isNowCompleted = !habit.completed;

    if (isNowCompleted) {
      if (habit.category === 'sunlight' || habit.category === 'hydration') {
        ambientSound.playWaterDrop();
      } else {
        ambientSound.playSparkle();
      }

      onUpdateHabit(habit.id, {
        completed: true,
        currentCount: habit.targetCount,
      });

      triggerHabitMicroAnimation(habit.id, `Done! +${habit.xpReward} XP`, habit.icon);

      if (onAwardXp) onAwardXp(habit.xpReward, `habit-${habit.id}`);

      if (completedCount + 1 === totalCount && onTriggerCelebration) {
        ambientSound.playLevelUp();
        onTriggerCelebration();
      }
    } else {
      onUpdateHabit(habit.id, {
        completed: false,
        currentCount: 0,
      });
    }
  };

  const handleCreateCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddHabit) {
      onAddHabit({
        title: newTitle.trim(),
        description: newDescription.trim() || 'Small, mindful daily habit.',
        category: 'mindfulness',
        icon: newIcon,
        targetCount: Number(newTarget) || 1,
        currentCount: 0,
        unit: newUnit,
        completed: false,
        xpReward: 20,
        timeOfDay: 'anytime',
      });
    }

    setNewTitle('');
    setNewDescription('');
    setIsAddingHabit(false);
    ambientSound.playSparkle();
  };

  const filteredHabits = habits.filter((h) => {
    if (activeFilter === 'all') return true;
    return h.timeOfDay === activeFilter;
  });

  const availableIcons = ['💧', '☀️', '🧘', '🌙', '🍎', '🍵', '🚶', '📖', '🫁', '🌱'];

  return (
    <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl p-5 sm:p-6 border border-[#B2CBD8]/50 dark:border-[#1E3A52] shadow-sm relative overflow-hidden transition-colors">
      {/* Background glow when finished */}
      {allCompleted && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/15 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Top Row: Title, Habit Streak Counter, and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#B2CBD8]/30 dark:border-[#1E3A52]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span>Daily Habit Tracker</span>
            </h2>
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-2xs transition-transform ${
                isFlameWiggling ? 'animate-cartoon-wiggle scale-105 border-amber-400 dark:border-amber-500 shadow-sm' : ''
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 text-amber-500 fill-amber-500 ${
                  isFlameWiggling ? 'animate-pulse' : ''
                }`}
              />
              <span className="tabular-nums">{streakDays}-day habit streak</span>
            </div>
          </div>
          <p className="text-xs text-[#547489] dark:text-[#8DAEC2] mt-1">
            Tiny, nourishing routines to steady your nervous system and energy.
          </p>
        </div>

        {/* Quick Add Custom Habit Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddingHabit(!isAddingHabit)}
            className="px-3 py-1.5 rounded-xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] transition-colors flex items-center gap-1 active:scale-95"
          >
            {isAddingHabit ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAddingHabit ? 'Cancel' : 'Add Habit'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Section with Gleam Micro-animation */}
      <div className="py-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-[#0F3A57] dark:text-[#F0F7FB] font-bold flex items-center gap-1.5">
            <span>Today's Progress</span>
            <span className="text-[#547489] dark:text-[#8DAEC2] font-normal">
              · <span className="tabular-nums font-semibold">{completedCount}</span> of{' '}
              <span className="tabular-nums font-semibold">{totalCount}</span> habits completed
            </span>
          </span>
          <span className="font-extrabold text-[#0F3A57] dark:text-[#F0F7FB] tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Animated Progress Bar container */}
        <div className="relative w-full h-3 bg-[#EFF9FD] dark:bg-[#132A3E] rounded-full overflow-hidden border border-[#B2CBD8]/40 dark:border-[#1E3A52] p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
              allCompleted
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500'
                : 'bg-gradient-to-r from-sky-400 via-teal-400 to-[#0F3A57] dark:to-sky-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer sweep animation when logging progress */}
            {isBarGleaming && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-bar-gleam pointer-events-none" />
            )}
          </div>
        </div>

        {allCompleted && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-fade-in shadow-2xs">
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
              <span>Incredible work! You completed every gentle habit today. ✨</span>
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
              Streak +1 Tomorrow!
            </span>
          </div>
        )}
      </div>

      {/* Time-of-Day Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EFF9FD] dark:bg-[#102436] rounded-xl border border-[#B2CBD8]/40 dark:border-[#1E3A52] mb-3 w-fit">
        {(['all', 'morning', 'anytime', 'evening'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          const labels = {
            all: 'All Habits',
            morning: '☀️ Morning',
            anytime: '🌱 Anytime',
            evening: '🌙 Evening',
          };
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-[#0D1E2D] text-[#0F3A57] dark:text-[#F0F7FB] shadow-2xs'
                  : 'text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>

      {/* Add Custom Habit Form Drawer */}
      {isAddingHabit && (
        <form
          onSubmit={handleCreateCustomHabit}
          className="mb-4 p-4 rounded-2xl bg-[#EFF9FD]/70 dark:bg-[#132A3E] border border-[#B2CBD8]/60 dark:border-[#1E3A52] space-y-3 animate-fade-in"
        >
          <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
            Create a New Gentle Habit
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[#547489] dark:text-[#8DAEC2]">
                Habit Name
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Morning sunlight, read 5 pages, stretch"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] focus:outline-none focus:ring-1 focus:ring-[#0F3A57]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#547489] dark:text-[#8DAEC2]">
                Target Count & Unit
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-2 text-xs rounded-xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] text-center"
                />
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="unit (e.g. glasses)"
                  className="w-full px-2 py-2 text-xs rounded-xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#547489] dark:text-[#8DAEC2]">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setNewIcon(ic)}
                  className={`w-8 h-8 rounded-xl text-base flex items-center justify-center border transition-all ${
                    newIcon === ic
                      ? 'bg-white dark:bg-[#0D1E2D] border-[#0F3A57] dark:border-sky-400 shadow-2xs scale-110'
                      : 'border-transparent hover:bg-white/60 dark:hover:bg-[#0D1E2D]/60'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingHabit(false)}
              className="px-3 py-1.5 text-xs text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#1E4666] shadow-2xs"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habits List Grid */}
      <div className="space-y-2.5">
        {filteredHabits.map((habit) => {
          const isHydrationOrMulti = habit.targetCount > 1;
          const isJustUpdated = recentHabitId === habit.id;

          return (
            <div
              key={habit.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative ${
                isJustUpdated ? 'animate-habit-bounce ring-2 ring-emerald-400/40' : ''
              } ${
                habit.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-[#EFF9FD]/30 dark:bg-[#102436]/60 border-[#B2CBD8]/50 dark:border-[#1E3A52] hover:border-[#547489]'
              }`}
            >
              {/* Left Zone: Icon, Title & Micro-details */}
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 border transition-transform ${
                    isJustUpdated ? 'scale-115 rotate-6' : ''
                  } ${
                    habit.completed
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700'
                      : 'bg-white dark:bg-[#132A3E] border-[#B2CBD8]/60 dark:border-[#1E3A52]'
                  }`}
                >
                  {habit.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-xs sm:text-sm font-bold leading-tight ${
                        habit.completed
                          ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85'
                          : 'text-[#0F3A57] dark:text-[#F0F7FB]'
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 whitespace-nowrap">
                      +{habit.xpReward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] line-clamp-1 mt-0.5">
                    {habit.description}
                  </p>
                </div>
              </div>

              {/* Right Zone: Interactive Controls with Particle Confetti & Floating Badge Overlays */}
              <div className="relative flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#B2CBD8]/20 dark:border-[#1E3A52]/40">
                {/* Floating XP badge animation */}
                {floatingBadges
                  .filter((b) => b.habitId === habit.id)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="absolute -top-5 right-0 sm:right-2 pointer-events-none z-40 animate-xp-float flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0F3A57] text-white text-[11px] font-extrabold shadow-lg border border-white/30 whitespace-nowrap"
                    >
                      <span>{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  ))}

                {/* Local Confetti Particles Emitter */}
                {particles
                  .filter((p) => p.habitId === habit.id)
                  .map((p) => (
                    <span
                      key={p.id}
                      className="absolute pointer-events-none animate-mini-confetti z-30 select-none"
                      style={
                        {
                          '--tx': p.tx,
                          '--ty': p.ty,
                          '--rot': p.rot,
                          right: '28px',
                          top: '16px',
                        } as React.CSSProperties
                      }
                    >
                      {p.shape === 'star' ? (
                        <span style={{ color: p.color }} className="text-sm font-black drop-shadow-xs">
                          ★
                        </span>
                      ) : p.shape === 'sparkle' ? (
                        <span style={{ color: p.color }} className="text-xs font-black drop-shadow-xs">
                          ✦
                        </span>
                      ) : (
                        <span
                          style={{ backgroundColor: p.color }}
                          className="inline-block w-2 h-2 rounded-full shadow-2xs"
                        />
                      )}
                    </span>
                  ))}

                {isHydrationOrMulti ? (
                  /* Multi-step Counter Controls (e.g. 3 of 4 glasses of water) */
                  <div className="flex items-center gap-2">
                    <div className="text-right text-[11px] font-bold text-[#0F3A57] dark:text-[#F0F7FB] tabular-nums mr-1">
                      <span>{habit.currentCount}</span> / <span>{habit.targetCount}</span>{' '}
                      <span className="font-normal text-[#547489] dark:text-[#8DAEC2]">
                        {habit.unit}
                      </span>
                    </div>

                    <div className="flex items-center p-0.5 bg-white dark:bg-[#0D1E2D] rounded-xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-2xs">
                      <button
                        onClick={() => handleDecrement(habit)}
                        disabled={habit.currentCount <= 0}
                        className="p-1 rounded-lg text-[#547489] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                        aria-label={`Decrease ${habit.title}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleIncrement(habit)}
                        disabled={habit.completed}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          habit.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F3A57] text-white hover:bg-[#1E4666] active:scale-95'
                        }`}
                      >
                        {habit.completed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Log {habit.unit}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Single Toggle Button */
                  <button
                    onClick={() => handleToggleHabit(habit)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                      habit.completed
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-[#132A3E] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] hover:border-[#0F3A57] hover:bg-[#EFF9FD]'
                    }`}
                  >
                    {habit.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-[#547489]" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
