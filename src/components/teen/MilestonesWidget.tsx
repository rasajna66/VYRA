import React from 'react';
import { Milestone } from '../../types';
import { Sparkles, ChevronRight, Award, Flame, Heart } from 'lucide-react';

interface MilestonesWidgetProps {
  milestones: Milestone[];
  onOpenMilestones: () => void;
  onTriggerCelebration: (milestone: Milestone) => void;
}

export const MilestonesWidget: React.FC<MilestonesWidgetProps> = ({
  milestones,
  onOpenMilestones,
  onTriggerCelebration,
}) => {
  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const totalCount = milestones.length;
  const recentUnlocked = milestones.filter((m) => m.isUnlocked).slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/60 shadow-xs hover:border-[#547489] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F3A57]">Gentle Milestones</h3>
            <p className="text-[11px] text-[#547489]">Recognizing moments of personal care</p>
          </div>
        </div>

        <button
          onClick={onOpenMilestones}
          className="text-xs font-bold text-[#0F3A57] hover:text-[#234C68] hover:underline flex items-center gap-1"
        >
          <span>View all ({unlockedCount}/{totalCount})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50 flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-xs font-bold text-[#0F3A57]">
              7-Day Mindful Flow • Celebrated!
            </div>
            <div className="text-[10px] text-[#547489]">
              Steady habit with zero penalty or pressure.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const streakMs = milestones.find((m) => m.id === 'ms-7-day-streak') || milestones[0];
            onTriggerCelebration(streakMs);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#0F3A57] text-white text-[11px] font-bold hover:bg-[#234C68] transition-all shadow-xs active:scale-95 whitespace-nowrap"
        >
          Celebrate ✨
        </button>
      </div>

      {/* Mini badge row */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {milestones.slice(0, 4).map((ms) => (
          <button
            key={ms.id}
            onClick={() => onTriggerCelebration(ms)}
            className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center group active:scale-95 ${
              ms.isUnlocked
                ? 'bg-white border-[#B2CBD8] hover:border-[#0F3A57] hover:bg-[#EFF9FD]/40'
                : 'bg-[#EFF9FD]/30 border-dashed border-[#B2CBD8]/60 opacity-60'
            }`}
          >
            <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
              {ms.icon}
            </span>
            <span className="text-[10px] font-bold text-[#0F3A57] truncate w-full">
              {ms.title}
            </span>
            <span className="text-[9px] text-[#547489]">
              {ms.isUnlocked ? '✓ Honored' : `${ms.progress}/${ms.target}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
