import React, { useState } from 'react';
import { MoodType, MoodOption, Milestone, JournalEntry, CompanionData, CompanionAccessoryId, WellbeingQuest, GameProgress, DailyHabit } from '../../types';
import { MOOD_OPTIONS } from '../../data/mockData';
import { MilestonesWidget } from './MilestonesWidget';
import { WeeklyRecapCard } from './WeeklyRecapCard';
import { DailyAffirmationCard } from './DailyAffirmationCard';
import { DailyHabitTracker } from './DailyHabitTracker';
import { CompanionWidget } from '../cartoon/CompanionWidget';
import { WellbeingQuestsCard } from '../game/WellbeingQuestsCard';
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Headphones,
  BookOpen,
  LineChart,
  Heart,
  Lock,
  ChevronRight,
  Calendar,
  X,
  Info,
  Award,
  Gamepad2,
} from 'lucide-react';

interface HomeDashboardProps {
  userName: string;
  currentScore: number;
  scoreStatus: string;
  scoreChange: number;
  streakDays: number;
  weeklyTimeline: { day: string; fullDate: string; mood: MoodType | null; note: string }[];
  milestones: Milestone[];
  journalEntries?: JournalEntry[];
  currentCompanion: CompanionData;
  availableCompanions: CompanionData[];
  unlockedAccessories: CompanionAccessoryId[];
  quests: WellbeingQuest[];
  gameProgress: GameProgress;
  habits: DailyHabit[];
  habitStreakDays: number;
  onUpdateHabit: (habitId: string, updated: Partial<DailyHabit>) => void;
  onAddHabit?: (newHabit: Omit<DailyHabit, 'id'>) => void;
  onAwardXp?: (amount: number, reason?: string) => void;
  onStartCheckIn: () => void;
  onNavigateToTab: (tab: 'home' | 'checkin' | 'trends' | 'calm' | 'profile') => void;
  onOpenQuickAction: (action: string) => void;
  onOpenMilestones: () => void;
  onTriggerCelebration: (milestone: Milestone) => void;
  onAddReflection?: (note: string) => void;
  onSelectCompanion: (companion: CompanionData) => void;
  onSelectAccessory: (accessory: CompanionAccessoryId) => void;
  onOpenArcade: (defaultGame?: 'clouds' | 'garden' | 'match') => void;
  onPetCompanion: () => void;
  onClaimChestReward: (rewardName: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userName,
  currentScore,
  scoreStatus,
  scoreChange,
  streakDays,
  weeklyTimeline,
  milestones,
  journalEntries = [],
  currentCompanion,
  availableCompanions,
  unlockedAccessories,
  quests,
  gameProgress,
  habits,
  habitStreakDays,
  onUpdateHabit,
  onAddHabit,
  onAwardXp,
  onStartCheckIn,
  onNavigateToTab,
  onOpenQuickAction,
  onOpenMilestones,
  onTriggerCelebration,
  onAddReflection,
  onSelectCompanion,
  onSelectAccessory,
  onOpenArcade,
  onPetCompanion,
  onClaimChestReward,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<MoodType | null>('meh');
  const [vibeFeedback, setVibeFeedback] = useState<string | null>(null);
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    day: string;
    fullDate: string;
    mood: MoodType | null;
    note: string;
  } | null>(null);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [insightExpanded, setInsightExpanded] = useState(false);

  const handleSelectVibe = (moodId: MoodType) => {
    setSelectedVibe(moodId);
    if (moodId === 'great') {
      setVibeFeedback('Love that for you! Keep soaking in the good energy ✨');
    } else if (moodId === 'good') {
      setVibeFeedback('A steady, grounded day is a win 🌱');
    } else if (moodId === 'meh') {
      setVibeFeedback("Totally okay to just coast today. We're here with you 🤍");
    } else if (moodId === 'low') {
      setVibeFeedback("Sending extra warmth. Take things gentle today 🕊️");
    } else {
      setVibeFeedback("We hear you. Remember you don't have to carry this alone 🫂");
    }
  };

  const quickActions = [
    { id: 'arcade', label: 'Wellbeing Arcade', icon: Gamepad2, emoji: '🎮', desc: 'Popper, garden & mood match' },
    { id: 'milestones', label: 'Milestones', icon: Award, emoji: '✨', desc: 'Gentle moments celebrated' },
    { id: 'calm', label: 'Calm space', icon: Headphones, emoji: '🎧', desc: 'Guided breathing & ambient sounds' },
    { id: 'talk', label: 'Talk to someone', icon: MessageCircle, emoji: '💬', desc: 'Message counsellor or friend' },
    { id: 'journal', label: 'Journal', icon: BookOpen, emoji: '📝', desc: 'Private personal reflection' },
    { id: 'trends', label: 'My trends', icon: LineChart, emoji: '📊', desc: 'Visual score patterns & sleep' },
    { id: 'support', label: 'Support circle', icon: Heart, emoji: '🫶', desc: 'Your trusted contacts & clinic' },
    { id: 'privacy', label: 'Privacy center', icon: Lock, emoji: '🔒', desc: 'Manage your data & permissions' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* 1. Top: Greeting and Interactive Mood Selector */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F3A57] dark:text-[#F0F7FB]">
            Hey {userName} 👋
          </h1>
          <p className="text-sm font-medium text-[#547489] dark:text-[#8DAEC2] mt-1">
            What's your vibe today?
          </p>
        </div>

        {/* Interactive mood selector (horizontal scrollable) */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          {MOOD_OPTIONS.map((m) => {
            const isSelected = selectedVibe === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectVibe(m.id)}
                className={`min-h-[48px] px-4 py-3 rounded-2xl border transition-all flex items-center gap-2.5 shrink-0 active:scale-95 text-left ${
                  isSelected
                    ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-md shadow-[#0F3A57]/15'
                    : 'bg-white dark:bg-[#0D1E2D] text-[#0F3A57] dark:text-[#F0F7FB] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:border-[#547489] hover:bg-[#EFF9FD]/40'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <div className="text-xs font-bold leading-none">{m.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#EFF9FD]/80' : 'text-[#6E8C9F] dark:text-[#8DAEC2]'}`}>
                    {m.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {vibeFeedback && (
          <div className="p-3 rounded-2xl bg-[#EFF9FD] dark:bg-[#132A3E] border border-[#B2CBD8]/50 dark:border-[#1E3A52] text-xs font-medium text-[#234C68] dark:text-[#93C5FD] flex items-center justify-between gap-2 animate-fade-in">
            <span>{vibeFeedback}</span>
            <button
              onClick={() => setVibeFeedback(null)}
              className="text-[#6E8C9F] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Interactive Animated Cartoon Companion Widget */}
      <CompanionWidget
        currentCompanion={currentCompanion}
        availableCompanions={availableCompanions}
        unlockedAccessories={unlockedAccessories}
        userMood={selectedVibe}
        userName={userName}
        onSelectCompanion={onSelectCompanion}
        onSelectAccessory={onSelectAccessory}
        onOpenArcade={() => onOpenArcade('clouds')}
        onPetCompanion={onPetCompanion}
      />

      {/* 3. Game Structure: Wellbeing Quests & Daily Mystery Chest */}
      <WellbeingQuestsCard
        quests={quests}
        gameProgress={gameProgress}
        onOpenArcade={onOpenArcade}
        onOpenCalm={() => onNavigateToTab('calm')}
        onOpenCheckIn={onStartCheckIn}
        onClaimChestReward={onClaimChestReward}
      />

      {/* 4. Daily Habit Tracker (Hydration, Sunlight, Movement & Rest with Streak Counter) */}
      <DailyHabitTracker
        habits={habits}
        streakDays={habitStreakDays}
        onUpdateHabit={onUpdateHabit}
        onAddHabit={onAddHabit}
        onAwardXp={onAwardXp}
        onTriggerCelebration={() => onTriggerCelebration(milestones[0])}
      />

      {/* 5. Daily Affirmation Card */}
      <DailyAffirmationCard
        currentMood={selectedVibe}
        userName={userName}
        onSelectMood={(mood) => handleSelectVibe(mood)}
        onOpenJournalWithAffirmation={(quote, theme) => {
          if (onAddReflection) {
            onAddReflection(`Daily Affirmation Reflection (${theme}): "${quote}"`);
          }
          onOpenQuickAction('journal');
        }}
      />


      {/* Grid: 5. Today's Check-in Card & 6. My Wellbeing Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 5. TODAY'S CHECK-IN CARD */}
        <div className="bg-gradient-to-br from-[#0F3A57] to-[#234C68] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-[#B2CBD8] uppercase">
                Daily Check-in
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[#EFF9FD]">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{streakDays}-day streak</span>
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white mb-1.5">
              Take a tiny check-in 🌱
            </h2>
            <p className="text-xs text-[#EFF9FD]/90 leading-relaxed max-w-sm">
              It's only a minute. No right or wrong answers. Small check-ins can help you notice changes over time.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={onStartCheckIn}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-[#0F3A57] font-bold text-xs hover:bg-[#EFF9FD] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <span>Start check-in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. MY WELLBEING CARD */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#547489] uppercase tracking-wider">
                My Wellbeing
              </span>
              <span className="text-xs text-[#0F3A57] font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#0F3A57]" />
                ↑ {scoreChange} points this week
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-[#0F3A57] tabular-nums">
                {currentScore}
              </span>
              <span className="text-sm font-bold text-[#234C68] px-2.5 py-0.5 rounded-lg bg-[#EFF9FD] border border-[#B2CBD8]/50">
                {scoreStatus}
              </span>
            </div>

            <p className="text-xs text-[#547489] leading-relaxed mb-3">
              Your recent check-ins show some changes worth paying attention to.
            </p>
          </div>

          <div className="pt-2 border-t border-[#B2CBD8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-[11px] text-[#6E8C9F]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>AI-assisted indicator • Not a diagnosis</span>
            </div>

            <button
              onClick={() => onNavigateToTab('trends')}
              className="text-xs font-bold text-[#0F3A57] hover:text-[#234C68] hover:underline flex items-center gap-1 whitespace-nowrap self-start sm:self-auto"
            >
              <span>See my trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary Card: Friendly 'Weekly Recap' */}
      <WeeklyRecapCard
        userName={userName}
        weeklyTimeline={weeklyTimeline}
        journalEntries={journalEntries}
        streakDays={streakDays}
        onOpenJournal={() => onOpenQuickAction('journal')}
        onOpenTrends={() => onNavigateToTab('trends')}
        onAddReflection={onAddReflection}
      />

      {/* Gentle Milestones Celebration Widget */}
      <MilestonesWidget
        milestones={milestones}
        onOpenMilestones={onOpenMilestones}
        onTriggerCelebration={onTriggerCelebration}
      />

      {/* 7. MOOD TIMELINE */}
      <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/50 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0F3A57] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#547489]" />
              <span>Weekly Mood Timeline</span>
            </h3>
            <p className="text-xs text-[#547489] mt-0.5">
              Tap any day to view your reflections and check-in details.
            </p>
          </div>
          <span className="text-xs text-[#547489]">Past 7 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyTimeline.map((item, idx) => {
            const isSelected = selectedDayInfo?.day === item.day;
            const moodEmoji =
              item.mood === 'great'
                ? '😊'
                : item.mood === 'good'
                ? '🙂'
                : item.mood === 'meh'
                ? '😐'
                : item.mood === 'low'
                ? '😕'
                : item.mood === 'struggling'
                ? '😔'
                : '?';

            return (
              <button
                key={idx}
                onClick={() => setSelectedDayInfo(item)}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#0F3A57] text-white shadow-md'
                    : item.mood === null
                    ? 'bg-[#EFF9FD]/40 border border-dashed border-[#B2CBD8] text-[#547489] hover:bg-[#EFF9FD]'
                    : 'bg-[#EFF9FD]/60 hover:bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/40'
                }`}
              >
                <span className="text-[11px] font-bold tracking-tight mb-1">{item.day}</span>
                <span className="text-xl mb-1">{moodEmoji}</span>
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.mood ? 'bg-[#547489]' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Day Details drawer */}
        {selectedDayInfo && (
          <div className="mt-4 p-4 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 flex items-start justify-between gap-3 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F3A57]">
                  {selectedDayInfo.fullDate}
                </span>
                <span className="text-xs text-[#547489]">
                  {selectedDayInfo.mood
                    ? `Logged: ${selectedDayInfo.mood.toUpperCase()}`
                    : 'Pending check-in'}
                </span>
              </div>
              <p className="text-xs text-[#234C68] leading-relaxed">
                {selectedDayInfo.note}
              </p>
            </div>
            <button
              onClick={() => setSelectedDayInfo(null)}
              className="p-1 text-[#547489] hover:text-[#0F3A57]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 8. DAILY INSIGHT CARD */}
      {!insightDismissed && (
        <div className="bg-[#EFF9FD] rounded-3xl p-6 border border-[#B2CBD8]/70 shadow-xs relative">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#B2CBD8]/60 flex items-center justify-center text-xl shrink-0 shadow-xs">
              👀
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F3A57]">Something we noticed</h3>
                <span className="text-[11px] text-[#547489] bg-white px-2 py-0.5 rounded-full border border-[#B2CBD8]/50">
                  AI-assisted observation
                </span>
              </div>

              <p className="text-xs text-[#234C68] leading-relaxed">
                “Your recent responses suggest you may be experiencing more stress than usual. You've mentioned feeling tired more often this week.”
              </p>

              {insightExpanded ? (
                <div className="p-3 bg-white rounded-2xl border border-[#B2CBD8]/50 text-xs text-[#0F3A57] space-y-2 animate-fade-in mt-2">
                  <p>
                    When days get packed with exams and deadlines, our sleep is often the first thing to slip. A short 3-minute wind-down before bed can gently reset your nervous system.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigateToTab('calm')}
                      className="px-3 py-1.5 rounded-xl bg-[#0F3A57] text-white text-xs font-semibold hover:bg-[#234C68] transition-colors"
                    >
                      Try 3-min Calm Space 🌿
                    </button>
                    <button
                      onClick={() => setInsightExpanded(false)}
                      className="px-3 py-1.5 text-xs text-[#547489] hover:text-[#0F3A57]"
                    >
                      Close detail
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setInsightExpanded(true)}
                    className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors"
                  >
                    Tell me more
                  </button>
                  <button
                    onClick={() => setInsightDismissed(true)}
                    className="px-3 py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
                  >
                    Maybe later
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. QUICK ACTIONS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#0F3A57]">Quick Actions</h3>
          <span className="text-xs text-[#547489]">Easy access anytime</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.id}
                onClick={() => onOpenQuickAction(qa.id)}
                className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/50 hover:border-[#0F3A57] hover:shadow-md transition-all flex flex-col items-center text-center group active:scale-95 min-h-[110px] justify-center"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EFF9FD] group-hover:bg-[#0F3A57] group-hover:text-white transition-colors flex items-center justify-center text-[#0F3A57] mb-2 shadow-xs">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-xs font-bold text-[#0F3A57] group-hover:text-[#234C68] line-clamp-1">
                  {qa.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
