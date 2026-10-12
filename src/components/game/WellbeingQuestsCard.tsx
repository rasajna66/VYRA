import React, { useState } from 'react';
import { WellbeingQuest, GameProgress } from '../../types';
import { ambientSound } from '../../utils/audioSynth';
import { Trophy, Gift, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface WellbeingQuestsCardProps {
  quests: WellbeingQuest[];
  gameProgress: GameProgress;
  onOpenArcade: (defaultGame?: 'clouds' | 'garden' | 'match') => void;
  onOpenCalm: () => void;
  onOpenCheckIn: () => void;
  onClaimChestReward: (rewardName: string) => void;
}

export const WellbeingQuestsCard: React.FC<WellbeingQuestsCardProps> = ({
  quests,
  gameProgress,
  onOpenArcade,
  onOpenCalm,
  onOpenCheckIn,
  onClaimChestReward,
}) => {
  const [isChestOpened, setIsChestOpened] = useState(false);
  const [chestPrize, setChestPrize] = useState<string | null>(null);

  const completedQuestsCount = quests.filter((q) => q.isCompleted).length;
  const canUnlockChest = completedQuestsCount >= 3;

  const xpPercent = Math.min(
    100,
    Math.round((gameProgress.xp / gameProgress.xpToNextLevel) * 100)
  );

  const handleOpenChest = () => {
    if (!canUnlockChest || isChestOpened) return;

    ambientSound.playLevelUp();
    setIsChestOpened(true);
    const prize = 'Angel Wings & +100 Bonus Starlight XP!';
    setChestPrize(prize);
    onClaimChestReward(prize);
  };

  const handleQuestAction = (quest: WellbeingQuest) => {
    if (quest.category === 'arcade') {
      if (quest.id.includes('cloud')) {
        onOpenArcade('clouds');
      } else {
        onOpenArcade('garden');
      }
    } else if (quest.category === 'calm') {
      onOpenCalm();
    } else if (quest.category === 'checkin') {
      onOpenCheckIn();
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl p-5 sm:p-6 border border-[#B2CBD8]/50 dark:border-[#1E3A52] shadow-sm relative overflow-hidden transition-colors">
      {/* Header: Level Status & XP Progression Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#B2CBD8]/30 dark:border-[#1E3A52]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-500/30 flex items-center justify-center text-xl shadow-xs shrink-0">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Level {gameProgress.level}
              </span>
              <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                {gameProgress.levelTitle}
              </span>
            </div>
            <div className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
              {gameProgress.xp} / {gameProgress.xpToNextLevel} XP to Level {gameProgress.level + 1}
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-[#547489] dark:text-[#8DAEC2]">
            <span>Progress</span>
            <span>{xpPercent}%</span>
          </div>
          <div className="w-full h-3 bg-[#EFF9FD] dark:bg-[#132A3E] rounded-full overflow-hidden border border-[#B2CBD8]/40 dark:border-[#1E3A52] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-[#0F3A57] rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quests List & Mystery Chest Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4">
        {/* Quests Column (2 cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Daily Wellbeing Quests</span>
            </h3>
            <span className="text-xs text-[#547489] dark:text-[#8DAEC2]">
              {completedQuestsCount}/{quests.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {quests.map((q) => {
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    q.isCompleted
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-[#EFF9FD]/50 dark:bg-[#102436] border-[#B2CBD8]/50 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{q.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-tight">
                          {q.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                          +{q.xpReward} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] line-clamp-1 mt-0.5">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {q.isCompleted ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuestAction(q)}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#132A3E] border border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#0F3A57] hover:text-white dark:hover:bg-[#0F3A57] text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Go</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mystery Reward Chest Box (1 col) */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#1A261C] dark:to-[#172235] border border-amber-200 dark:border-amber-900/40 text-center relative overflow-hidden">
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Daily Mystery Chest</span>
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
              Complete 3 quests to unlock secret companion accessories!
            </p>
          </div>

          {/* Animated Treasure Chest */}
          <div className="py-3 flex flex-col items-center">
            <button
              onClick={handleOpenChest}
              disabled={!canUnlockChest || isChestOpened}
              className={`text-5xl transition-transform active:scale-95 ${
                canUnlockChest && !isChestOpened
                  ? 'animate-cartoon-wiggle hover:scale-110 cursor-pointer filter drop-shadow-md'
                  : isChestOpened
                  ? 'scale-100 opacity-90'
                  : 'opacity-50 grayscale'
              }`}
              title={canUnlockChest ? 'Click to open chest!' : 'Complete 3 quests first'}
            >
              {isChestOpened ? '🎁' : canUnlockChest ? '✨🧰✨' : '🔒📦'}
            </button>

            {chestPrize && (
              <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-fade-in">
                Unlocked: {chestPrize}
              </div>
            )}
          </div>

          <div>
            {isChestOpened ? (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                🎉 Reward Claimed for Today!
              </div>
            ) : canUnlockChest ? (
              <button
                onClick={handleOpenChest}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Open Mystery Chest!</span>
              </button>
            ) : (
              <div className="text-[11px] font-semibold text-amber-800/70 dark:text-amber-300/70">
                {3 - completedQuestsCount} more quest{3 - completedQuestsCount > 1 ? 's' : ''} needed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
