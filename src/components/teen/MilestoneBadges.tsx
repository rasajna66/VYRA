import React, { useState } from 'react';
import { Sparkles, Award, Lock, CheckCircle2, Heart, Shield, Flame, X } from 'lucide-react';
import { AchievementBadge } from '../../types';
import { INITIAL_ACHIEVEMENT_BADGES } from '../../data/mockData';
import { ambientSound } from '../../utils/audioSynth';

export { INITIAL_ACHIEVEMENT_BADGES };

interface MilestoneBadgesProps {
  badges?: AchievementBadge[];
  compact?: boolean;
  showHeaderBanner?: boolean;
  onBadgeClick?: (badge: AchievementBadge) => void;
  onTriggerCelebration?: (badge: AchievementBadge) => void;
}

export const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({
  badges = INITIAL_ACHIEVEMENT_BADGES,
  compact = false,
  showHeaderBanner = true,
  onBadgeClick,
  onTriggerCelebration,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'tiers' | 'special'>('all');

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const currentTier = 'Tier 2: Mindful Stream';

  const filteredBadges = badges.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'tiers') return b.tier.startsWith('Tier');
    if (filter === 'special') return b.tier === 'Special';
    return true;
  });

  const handleSelect = (badge: AchievementBadge) => {
    if (badge.unlocked) {
      ambientSound.playChime();
    }
    setSelectedBadge(badge);
    if (onBadgeClick) onBadgeClick(badge);
  };

  return (
    <div className="space-y-4">
      {/* Tier Header Banner */}
      {showHeaderBanner && !compact && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0F3A57] to-[#234C68] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B2CBD8]">
                Current Engagement Tier
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>{currentTier}</span>
              <span className="text-sm">🌊</span>
            </h3>
            <p className="text-xs text-[#EFF9FD]/90 max-w-md">
              Progress builds softly. You've unlocked {unlockedCount} of {badges.length} friendly achievement badges.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/20 self-start sm:self-auto text-right">
            <span className="text-[10px] text-[#B2CBD8] font-semibold block uppercase">Next Tier Goal</span>
            <span className="text-xs font-bold text-white">Tier 3: Rooted Sanctuary (7/14)</span>
          </div>
        </div>
      )}

      {/* Filter Tabs (when not compact) */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all' as const, label: `All Badges (${badges.length})` },
            { id: 'unlocked' as const, label: `Unlocked ✨ (${unlockedCount})` },
            { id: 'tiers' as const, label: 'Engagement Tiers 🏆' },
            { id: 'special' as const, label: 'Special Moments ✍️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'bg-white text-[#547489] hover:text-[#0F3A57] border border-[#B2CBD8]/50 hover:bg-[#EFF9FD]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Small, Friendly Badges Grid */}
      <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-4 gap-2.5' : 'grid-cols-2 sm:grid-cols-4 gap-3'}`}>
        {filteredBadges.map((badge) => {
          return (
            <button
              key={badge.id}
              onClick={() => handleSelect(badge)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group active:scale-95 ${
                badge.unlocked
                  ? `bg-gradient-to-br ${badge.color} ${badge.borderColor} shadow-xs hover:border-[#0F3A57] hover:shadow-md`
                  : 'bg-slate-50/70 border-slate-200 border-dashed opacity-65 hover:opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-110 ${
                      badge.unlocked ? 'bg-white border border-[#B2CBD8]/60' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      badge.unlocked
                        ? 'bg-white/80 text-[#0F3A57] border border-[#B2CBD8]/50'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {badge.tier}
                  </span>
                </div>

                <h4 className="text-xs font-black text-[#0F3A57] line-clamp-1">{badge.name}</h4>
                <p className="text-[10px] text-[#547489] line-clamp-2 mt-0.5 leading-tight">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-black/5 flex items-center justify-between text-[9px] font-bold">
                {badge.unlocked ? (
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Honored</span>
                  </span>
                ) : (
                  <span className="text-[#547489]">{badge.progressText || 'In Progress'}</span>
                )}
                <span className="text-[#234C68] group-hover:underline">View</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Detail Dialog */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3A57]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#B2CBD8] relative text-center">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm mb-3 ${
                selectedBadge.unlocked
                  ? 'bg-[#EFF9FD] border-2 border-[#0F3A57]'
                  : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}
            >
              {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFF9FD] text-[10px] font-bold text-[#0F3A57] border border-[#B2CBD8]/50 mb-1">
              {selectedBadge.tier} • {selectedBadge.category.toUpperCase()}
            </div>

            <h3 className="text-lg font-black text-[#0F3A57]">{selectedBadge.name}</h3>
            <p className="text-xs text-[#547489] mt-1 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3 my-3 rounded-2xl bg-[#EFF9FD]/70 border border-[#B2CBD8]/40 text-xs text-[#0F3A57]">
              <span className="font-bold block text-[11px] mb-0.5 text-[#234C68]">Gentle Meaning:</span>
              {selectedBadge.perk}
            </div>

            <div className="text-[11px] text-[#547489] mb-4">
              {selectedBadge.unlocked
                ? `Awarded on ${selectedBadge.unlockedAt} ✨`
                : `Progress: ${selectedBadge.progressText || 'Working towards it quietly'}`}
            </div>

            <div className="space-y-2">
              {selectedBadge.unlocked && onTriggerCelebration && (
                <button
                  onClick={() => {
                    const b = selectedBadge;
                    setSelectedBadge(null);
                    onTriggerCelebration(b);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0F3A57] to-[#234C68] text-white text-xs font-bold hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Celebrate this moment ✨</span>
                </button>
              )}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2 rounded-xl bg-[#EFF9FD] border border-[#B2CBD8] text-[#0F3A57] text-xs font-bold hover:bg-[#B2CBD8]/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
