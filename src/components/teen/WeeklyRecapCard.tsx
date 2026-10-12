import React, { useState } from 'react';
import { MoodType, JournalEntry } from '../../types';
import {
  Sparkles,
  Calendar,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Heart,
  Quote,
  Feather,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smile,
  Volume2,
  Sun,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { ambientSound } from '../../utils/audioSynth';

interface WeeklyRecapCardProps {
  userName: string;
  weeklyTimeline: { day: string; fullDate: string; mood: MoodType | null; note: string }[];
  journalEntries: JournalEntry[];
  streakDays: number;
  onOpenJournal: () => void;
  onOpenTrends: () => void;
  onAddReflection?: (note: string) => void;
}

export const WeeklyRecapCard: React.FC<WeeklyRecapCardProps> = ({
  userName,
  weeklyTimeline,
  journalEntries,
  streakDays,
  onOpenJournal,
  onOpenTrends,
  onAddReflection,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'journal' | 'reflect'>('overview');
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionSavedToast, setReflectionSavedToast] = useState(false);
  const [celebratedWeek, setCelebratedWeek] = useState(false);
  const [selectedDaySnippet, setSelectedDaySnippet] = useState<number | null>(null);

  // Computed Check-in statistics
  const loggedDays = weeklyTimeline.filter((t) => t.mood !== null);
  const totalDays = weeklyTimeline.length;
  const loggedCount = loggedDays.length;

  const moodCounts: Record<MoodType, number> = {
    great: 0,
    good: 0,
    meh: 0,
    low: 0,
    struggling: 0,
  };

  loggedDays.forEach((t) => {
    if (t.mood) {
      moodCounts[t.mood] = (moodCounts[t.mood] || 0) + 1;
    }
  });

  const upliftingDaysCount = (moodCounts.great || 0) + (moodCounts.good || 0);
  const tenderDaysCount = (moodCounts.low || 0) + (moodCounts.struggling || 0);
  const neutralDaysCount = moodCounts.meh || 0;

  // Most common mood
  let dominantMood: MoodType = 'good';
  let maxCount = -1;
  (Object.keys(moodCounts) as MoodType[]).forEach((m) => {
    if (moodCounts[m] > maxCount) {
      maxCount = moodCounts[m];
      dominantMood = m;
    }
  });

  const getMoodEmoji = (mood: MoodType | null) => {
    switch (mood) {
      case 'great':
        return '😊';
      case 'good':
        return '🙂';
      case 'meh':
        return '😐';
      case 'low':
        return '😕';
      case 'struggling':
        return '😔';
      default:
        return '🌱';
    }
  };

  const getMoodColor = (mood: MoodType | null) => {
    switch (mood) {
      case 'great':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'good':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'meh':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'struggling':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-[#547489] bg-[#EFF9FD] border-[#B2CBD8]/50';
    }
  };

  // Recent weekly journal highlights
  const recentWeeklyJournals = journalEntries.slice(0, 3);

  const handleCelebrateWeek = () => {
    ambientSound.playChime();
    setCelebratedWeek(true);
    setTimeout(() => setCelebratedWeek(false), 5000);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    if (onAddReflection) {
      onAddReflection(reflectionInput.trim());
    }
    ambientSound.playChime();
    setReflectionSavedToast(true);
    setReflectionInput('');
    setTimeout(() => setReflectionSavedToast(false), 4500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B2CBD8]/60 shadow-sm relative overflow-hidden transition-all hover:border-[#547489]">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#EFF9FD] to-transparent rounded-full -mr-20 -mt-20 pointer-events-none opacity-80" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#B2CBD8]/30">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0F3A57] to-[#234C68] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-5 h-5 text-[#EFF9FD]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F3A57] tracking-tight">
                Weekly Recap
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]/60 text-[11px] font-semibold text-[#0F3A57] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Oct 01 – Oct 07</span>
              </span>
            </div>
            <p className="text-xs text-[#547489] mt-0.5">
              Aggregated check-in patterns and quiet journal reflections to honor your week.
            </p>
          </div>
        </div>

        {/* Celebrate button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCelebrateWeek}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
              celebratedWeek
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-[#EFF9FD] hover:bg-[#0F3A57] hover:text-white text-[#0F3A57] border border-[#B2CBD8]/60'
            }`}
            title="Play a peaceful chime to acknowledge your effort"
          >
            <span>{celebratedWeek ? '✨ Honored!' : 'Celebrate Week'}</span>
            <Sparkles className={`w-3.5 h-3.5 ${celebratedWeek ? 'text-amber-600 animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {celebratedWeek && (
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 text-xs text-[#0F3A57] font-medium flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>🌿</span>
            <span>
              <strong>Proud of you, {userName}.</strong> Showing up for your feelings—on good days and hard ones—is real growth.
            </span>
          </div>
          <button
            onClick={() => setCelebratedWeek(false)}
            className="text-xs text-[#547489] hover:text-[#0F3A57] px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Check-ins Logged
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-[#0F3A57]">{loggedCount}</span>
            <span className="text-xs font-medium text-[#547489]">/ {totalDays} days</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1">
            86% weekly consistency
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Journal Highlights
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-[#0F3A57]">{journalEntries.length}</span>
            <span className="text-xs font-medium text-[#547489]">entries</span>
          </div>
          <span className="text-[10px] text-[#234C68] font-semibold mt-1">
            Private reflections saved
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Dominant Rhythm
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xl">{getMoodEmoji(dominantMood)}</span>
            <span className="text-sm font-bold text-[#0F3A57] capitalize">{dominantMood}</span>
          </div>
          <span className="text-[10px] text-[#547489] mt-1">
            {upliftingDaysCount} lighter, {tenderDaysCount} tender days
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Gentle Streak
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-[#0F3A57]">{streakDays}</span>
            <span className="text-xs font-medium text-[#547489]">days active</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1">
            Zero penalty or stress 🌱
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-[#B2CBD8]/40 pb-2 mb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#0F3A57] text-white shadow-xs'
              : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Weekly Story</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'trends'
              ? 'bg-[#0F3A57] text-white shadow-xs'
              : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Check-in Trends ({loggedCount} days)</span>
        </button>

        <button
          onClick={() => setActiveTab('journal')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'journal'
              ? 'bg-[#0F3A57] text-white shadow-xs'
              : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Journal Highlights ({journalEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reflect')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reflect'
              ? 'bg-[#0F3A57] text-white shadow-xs'
              : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Reflect & Unwind</span>
        </button>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          {/* Compassionate Narrative Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EFF9FD] to-teal-50/40 border border-[#B2CBD8]/50 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#B2CBD8]/50 flex items-center justify-center text-lg shrink-0 text-[#0F3A57] shadow-xs">
              🕊️
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#0F3A57] flex items-center gap-1.5">
                <span>The Story of Your Week</span>
                <span className="text-[10px] text-[#547489] font-normal">
                  (Based on your daily check-ins & reflections)
                </span>
              </h4>
              <p className="text-xs text-[#234C68] leading-relaxed">
                You started strong on Monday with good energy after finishing school projects. Thursday and Friday brought noticeable fatigue and late nights revising, but you wisely carved out space to rest and take a walk on Saturday.
              </p>
            </div>
          </div>

          {/* Two-column summary: Check-in highlights & Journal snippet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Left: Check-in Rhythm Spotlight */}
            <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F3A57] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#547489]" />
                    <span>Check-in Rhythm</span>
                  </span>
                  <button
                    onClick={onOpenTrends}
                    className="text-[11px] font-bold text-[#0F3A57] hover:underline flex items-center gap-0.5"
                  >
                    <span>View graph</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Day Dots Trail */}
                <div className="grid grid-cols-7 gap-1.5 my-3">
                  {weeklyTimeline.map((item, idx) => {
                    const isSelected = selectedDaySnippet === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDaySnippet(isSelected ? null : idx)}
                        className={`p-1.5 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-[#0F3A57] text-white border-[#0F3A57]'
                            : item.mood
                            ? 'bg-[#EFF9FD]/60 border-[#B2CBD8]/40 hover:bg-[#EFF9FD]'
                            : 'bg-white border-dashed border-[#B2CBD8]/60 text-[#547489]'
                        }`}
                        title={`${item.day}: ${item.note}`}
                      >
                        <span className="text-[9px] font-bold block">{item.day}</span>
                        <span className="text-sm block">{getMoodEmoji(item.mood)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Note or default note */}
                <div className="p-2.5 rounded-xl bg-[#EFF9FD]/70 text-[11px] text-[#234C68]">
                  {selectedDaySnippet !== null ? (
                    <div>
                      <span className="font-bold text-[#0F3A57]">
                        {weeklyTimeline[selectedDaySnippet].day} ({weeklyTimeline[selectedDaySnippet].fullDate}):
                      </span>{' '}
                      {weeklyTimeline[selectedDaySnippet].note}
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-[#0F3A57]">Weekend Recovery:</span> Saturday gave you breathing room after test-heavy weekdays.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#B2CBD8]/30 mt-3 flex items-center justify-between text-[11px] text-[#547489]">
                <span>Tap any day pill above to inspect</span>
                <span className="text-emerald-700 font-semibold">3 uplifting days</span>
              </div>
            </div>

            {/* Right: Journal Highlights Spotlight */}
            <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F3A57] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#547489]" />
                    <span>Journal Reflections</span>
                  </span>
                  <button
                    onClick={onOpenJournal}
                    className="text-[11px] font-bold text-[#0F3A57] hover:underline flex items-center gap-0.5"
                  >
                    <span>Open journal</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {recentWeeklyJournals.length > 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs text-[#0F3A57] space-y-2 my-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate text-[11px] text-[#234C68]">
                        “{recentWeeklyJournals[0].title || 'Private Reflection'}”
                      </span>
                      <span className="text-[10px] text-[#547489] shrink-0">
                        {recentWeeklyJournals[0].date}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#234C68] italic line-clamp-3 leading-relaxed">
                      “{recentWeeklyJournals[0].content}”
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white text-[10px] text-[#547489] border border-amber-200">
                        {getMoodEmoji(recentWeeklyJournals[0].mood)} Logged as {recentWeeklyJournals[0].mood}
                      </span>
                      <span className="text-[10px] text-[#547489] flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> 100% Private
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#EFF9FD] text-xs text-[#547489] text-center my-2">
                    No journal reflections yet this week.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#B2CBD8]/30 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#547489]">
                  {journalEntries.length} reflection{journalEntries.length !== 1 ? 's' : ''} stored privately
                </span>
                <button
                  onClick={() => setActiveTab('reflect')}
                  className="text-xs font-bold text-[#0F3A57] hover:underline flex items-center gap-1"
                >
                  <span>Quick reflect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Gentle Reflection Prompt Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <h5 className="text-xs font-bold text-[#0F3A57]">
                  Weekly Reflection Prompt
                </h5>
                <p className="text-xs text-[#547489]">
                  “What is one tiny thing you did this week that brought you a sliver of peace?”
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('reflect')}
              className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Reflect on this</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: CHECK-IN TRENDS DEEP DIVE */}
      {activeTab === 'trends' && (
        <div className="space-y-4 animate-fade-in">
          {/* Mood distribution bar */}
          <div className="p-4 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F3A57]">
                Mood Balance This Week
              </span>
              <span className="text-[11px] text-[#547489]">
                {loggedCount} of 7 days logged
              </span>
            </div>

            {/* Visual ratio bar */}
            <div className="h-3 w-full rounded-full bg-[#B2CBD8]/30 flex overflow-hidden">
              {upliftingDaysCount > 0 && (
                <div
                  style={{ width: `${(upliftingDaysCount / (loggedCount || 1)) * 100}%` }}
                  className="bg-emerald-400 h-full"
                  title={`${upliftingDaysCount} uplifting days`}
                />
              )}
              {neutralDaysCount > 0 && (
                <div
                  style={{ width: `${(neutralDaysCount / (loggedCount || 1)) * 100}%` }}
                  className="bg-amber-300 h-full"
                  title={`${neutralDaysCount} steady/meh days`}
                />
              )}
              {tenderDaysCount > 0 && (
                <div
                  style={{ width: `${(tenderDaysCount / (loggedCount || 1)) * 100}%` }}
                  className="bg-rose-300 h-full"
                  title={`${tenderDaysCount} days needing extra care`}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#547489] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Uplifting / Good ({upliftingDaysCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span>Steady / Meh ({neutralDaysCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span>Tender / Heavy ({tenderDaysCount})</span>
              </div>
            </div>
          </div>

          {/* Daily breakdown cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#0F3A57] uppercase tracking-wider">
              Day-by-Day Journey
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {weeklyTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.mood
                      ? 'bg-white border-[#B2CBD8]/50 hover:border-[#0F3A57]'
                      : 'bg-[#EFF9FD]/30 border-dashed border-[#B2CBD8]/60 text-[#547489]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl shrink-0 mt-0.5">{getMoodEmoji(item.mood)}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F3A57]">{item.day}</span>
                        <span className="text-[10px] text-[#547489]">{item.fullDate}</span>
                        {item.mood && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${getMoodColor(item.mood)}`}>
                            {item.mood}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#234C68] mt-1 leading-snug">
                        {item.note || 'No notes added'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#547489]">
              Looking for clinical score trends and sleep metrics?
            </span>
            <button
              onClick={onOpenTrends}
              className="px-3.5 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] flex items-center gap-1"
            >
              <span>Explore My Trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: JOURNAL HIGHLIGHTS */}
      {activeTab === 'journal' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#0F3A57]">
                Weekly Journal Excerpts & Themes
              </h4>
              <p className="text-[11px] text-[#547489]">
                Private insights written in your voice over the past 7 days.
              </p>
            </div>
            <button
              onClick={onOpenJournal}
              className="px-3 py-1.5 rounded-xl bg-[#EFF9FD] hover:bg-[#0F3A57] hover:text-white text-[#0F3A57] border border-[#B2CBD8]/60 text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>View Full Journal</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Key recurring themes pills */}
          <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#0F3A57] flex items-center gap-1 mr-1">
              <Quote className="w-3 h-3 text-[#547489]" />
              <span>Noticed Themes:</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#B2CBD8]/50 text-[11px] text-[#0F3A57] font-medium">
              🎧 Calm Space audio grounding
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#B2CBD8]/50 text-[11px] text-[#0F3A57] font-medium">
              💬 Reaching out to sister Maya
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#B2CBD8]/50 text-[11px] text-[#0F3A57] font-medium">
              📚 Late-night exam pressure
            </span>
          </div>

          {/* Journal Entries Cards */}
          <div className="space-y-3">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 shadow-xs hover:border-[#547489] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <h5 className="text-xs font-bold text-[#0F3A57]">
                      {entry.title || 'Journal Reflection'}
                    </h5>
                  </div>
                  <span className="text-[10px] text-[#547489] bg-[#EFF9FD] px-2 py-0.5 rounded-md border border-[#B2CBD8]/40">
                    {entry.date}
                  </span>
                </div>

                <p className="text-xs text-[#234C68] leading-relaxed italic bg-stone-50/60 p-3 rounded-xl border border-stone-200/50">
                  “{entry.content}”
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#547489] pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Encrypted & Private</span>
                  </span>
                  <span className="text-[#0F3A57] font-semibold">
                    Mood: {entry.mood}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: REFLECT & UNWIND */}
      {activeTab === 'reflect' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border border-emerald-200/80 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5" />
              <span>Weekly Reflection Space</span>
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Taking 60 seconds at the end of the week to jot down a tiny reflection can help process emotional residue and set a peaceful intention for next week.
            </p>
          </div>

          {/* Quick reflection prompts chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#547489] uppercase tracking-wider">
              Choose a prompt or write freely:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'What made me feel even 5% lighter this week?',
                'A moment where I was kind to myself:',
                'Something I want to leave behind in last week:',
                'One person or thing I am grateful for:',
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setReflectionInput((prev) => (prev ? `${prev}\n\n${p} ` : `${p} `))}
                  className="px-2.5 py-1 rounded-xl bg-[#EFF9FD] hover:bg-[#0F3A57] hover:text-white text-[#0F3A57] border border-[#B2CBD8]/50 text-[11px] font-medium transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSaveReflection} className="space-y-2.5">
            <textarea
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="Jot down a gentle thought, a win, or something you are processing..."
              rows={3}
              className="w-full p-3.5 rounded-2xl border border-[#B2CBD8]/70 focus:border-[#0F3A57] focus:ring-1 focus:ring-[#0F3A57] text-xs text-[#0F3A57] placeholder:text-[#547489]/70 bg-white transition-all resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#547489] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Saves safely into your private journal</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenJournal}
                  className="px-3 py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
                >
                  Open Full Journal
                </button>
                <button
                  type="submit"
                  disabled={!reflectionInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0F3A57] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Reflection</span>
                </button>
              </div>
            </div>
          </form>

          {reflectionSavedToast && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Reflection safely added to your private journal! Thank you for taking time for yourself.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer reassurance */}
      <div className="mt-5 pt-3 border-t border-[#B2CBD8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#547489]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#547489]" />
          <span>Private weekly summary • Only visible to you • Never graded</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTrends}
            className="font-bold text-[#0F3A57] hover:underline"
          >
            Check-in Patterns
          </button>
          <span>•</span>
          <button
            onClick={onOpenJournal}
            className="font-bold text-[#0F3A57] hover:underline"
          >
            Past Reflections
          </button>
        </div>
      </div>
    </div>
  );
};
