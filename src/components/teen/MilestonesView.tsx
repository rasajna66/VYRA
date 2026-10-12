import React, { useState } from 'react';
import { Milestone, MilestoneCategory, AchievementBadge } from '../../types';
import { INITIAL_ACHIEVEMENT_BADGES } from '../../data/mockData';
import { MilestoneBadges } from './MilestoneBadges';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Flame,
  BookOpen,
  Volume2,
  Award,
} from 'lucide-react';
import { ambientSound } from '../../utils/audioSynth';

interface MilestonesViewProps {
  milestones: Milestone[];
  achievementBadges?: AchievementBadge[];
  onTriggerCelebration: (milestone: Milestone | AchievementBadge) => void;
  onBackToHome: () => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  milestones,
  achievementBadges = INITIAL_ACHIEVEMENT_BADGES,
  onTriggerCelebration,
  onBackToHome,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in_progress' | MilestoneCategory>('all');

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const totalCount = milestones.length;

  const filtered = milestones.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unlocked') return m.isUnlocked;
    if (activeFilter === 'in_progress') return !m.isUnlocked;
    return m.category === activeFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Header */}
      <div>
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-[#0F3A57] hover:underline mb-2 flex items-center gap-1"
        >
          ← Back to Home
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h1 className="text-2xl font-bold text-[#0F3A57]">Gentle Milestones & Badges</h1>
            </div>
            <p className="text-xs text-[#547489] mt-0.5">
              Honoring your journey with gentle encouragement — never pressure, guilt, or countdown penalties.
            </p>
          </div>

          {/* Quick Demo Celebration Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const s = milestones.find((m) => m.id === 'ms-7-day-streak') || milestones[0];
                onTriggerCelebration(s);
              }}
              className="px-3 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate 7-Day Streak 🔥</span>
            </button>
            <button
              onClick={() => {
                const j = milestones.find((m) => m.id === 'ms-first-journal') || milestones[1];
                onTriggerCelebration(j);
              }}
              className="px-3 py-2 rounded-xl bg-white border border-[#0F3A57] text-[#0F3A57] text-xs font-bold hover:bg-[#EFF9FD] transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>First Journal Entry ✍️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57] shrink-0 mt-0.5">
          <Heart className="w-5 h-5 text-[#0F3A57]" />
        </div>
        <div className="text-xs text-[#234C68] leading-relaxed">
          <span className="font-bold text-[#0F3A57] block mb-0.5">
            The VYRA Anti-Pressure Commitment
          </span>
          Milestones in VYRA are quiet celebrations of showing up for yourself. Missed a day? Your streaks never reset to zero in anger. Life happens, and your progress waits patiently whenever you return.
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-[11px] font-bold text-[#547489] uppercase">Moments Honored</span>
          <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-1">
            {unlockedCount} of {totalCount}
          </div>
          <span className="text-[10px] text-[#234C68] font-medium">Quiet celebrations collected</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-[11px] font-bold text-[#547489] uppercase">Mindful Rhythm</span>
          <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-1 flex items-center gap-1.5">
            <span>7 Days</span>
            <span className="text-base">🔥</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Gentle flow active</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-[11px] font-bold text-[#547489] uppercase">Pressure Level</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">Zero</div>
          <span className="text-[10px] text-[#547489]">No punitive expirations</span>
        </div>
      </div>

      {/* 1. SMALL FRIENDLY MILESTONE ACHIEVEMENT BADGES (Embedded directly) */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F3A57] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#234C68]" />
            <span>Achievement Badges & Engagement Tiers</span>
          </h2>
          <p className="text-xs text-[#547489] mt-0.5">
            Tap any badge to see its meaning, gentle perk, and unlocked date.
          </p>
        </div>

        <MilestoneBadges
          badges={achievementBadges}
          compact={false}
          showHeaderBanner={true}
          onTriggerCelebration={(b) => onTriggerCelebration(b)}
        />
      </div>

      {/* 2. DETAILED MILESTONE TRACKERS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#0F3A57]">Detailed Reflection & Habit Trackers</h2>
            <p className="text-xs text-[#547489]">
              Praise notes and encouraging quotes for each step of your self-care journey.
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all' as const, label: 'All Trackers' },
            { id: 'unlocked' as const, label: `Celebrated ✨ (${unlockedCount})` },
            { id: 'in_progress' as const, label: `In Progress 🌱 (${totalCount - unlockedCount})` },
            { id: 'streak' as const, label: 'Mindful Rhythms' },
            { id: 'reflection' as const, label: 'Reflections' },
            { id: 'calm' as const, label: 'Calm Space' },
            { id: 'connection' as const, label: 'Support Circle' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'bg-white text-[#547489] hover:text-[#0F3A57] border border-[#B2CBD8]/50 hover:bg-[#EFF9FD]/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ms) => {
            const percent = Math.min(100, Math.round((ms.progress / ms.target) * 100));

            return (
              <div
                key={ms.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  ms.isUnlocked
                    ? 'bg-white border-[#B2CBD8]/70 hover:border-[#0F3A57]'
                    : 'bg-white/80 border-[#B2CBD8]/40 hover:border-[#547489]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform hover:scale-105 ${
                          ms.isUnlocked
                            ? 'bg-[#EFF9FD] border border-[#B2CBD8]/60 shadow-xs'
                            : 'bg-slate-50 border border-slate-200 opacity-70'
                        }`}
                      >
                        {ms.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0F3A57]">{ms.title}</h3>
                        <p className="text-xs text-[#234C68] font-medium">{ms.gentlePraise}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ms.isUnlocked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]/40'
                      }`}
                    >
                      {ms.isUnlocked ? 'Celebrated ✨' : `${ms.progress}/${ms.target} ${ms.unit}`}
                    </span>
                  </div>

                  <p className="text-xs text-[#547489] leading-relaxed mb-3">
                    {ms.description}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-[#EFF9FD] rounded-full h-2 overflow-hidden border border-[#B2CBD8]/40 mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#234C68] to-[#4A88AC] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#6E8C9F] italic leading-tight">
                    "{ms.celebrationQuote}"
                  </p>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-2 border-t border-[#B2CBD8]/30 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#547489]">
                    {ms.unlockedAt ? `Celebrated on ${ms.unlockedAt}` : 'In steady progress 🌱'}
                  </span>

                  <button
                    onClick={() => onTriggerCelebration(ms)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                      ms.isUnlocked
                        ? 'bg-[#EFF9FD] text-[#0F3A57] hover:bg-[#B2CBD8]/40 border border-[#B2CBD8]/60'
                        : 'bg-[#0F3A57] text-white hover:bg-[#234C68]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#234C68]" />
                    <span>{ms.isUnlocked ? 'Re-celebrate ✨' : 'View moment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
