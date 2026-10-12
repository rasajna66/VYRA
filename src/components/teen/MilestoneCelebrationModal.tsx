import React, { useEffect, useState } from 'react';
import { Milestone, AchievementBadge } from '../../types';
import { X, Sparkles, Heart, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { ambientSound } from '../../utils/audioSynth';

interface MilestoneCelebrationModalProps {
  milestone: Milestone | AchievementBadge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestone,
  isOpen,
  onClose,
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; size: number; color: string }[]>([]);

  useEffect(() => {
    if (isOpen && milestone) {
      // Play gentle chime
      ambientSound.playChime();

      // Generate soft, calming floating particles
      const colors = ['#0F3A57', '#234C68', '#4A88AC', '#7FB7D6', '#B2CBD8', '#EFF9FD'];
      const generated = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100,
        delay: Math.random() * 0.8,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(generated);
    }
  }, [isOpen, milestone]);

  if (!isOpen || !milestone) return null;

  // Polymorphic normalization between Milestone and AchievementBadge
  const title = 'title' in milestone ? milestone.title : milestone.name;
  const praise = 'gentlePraise' in milestone ? milestone.gentlePraise : milestone.perk;
  const quote = 'celebrationQuote' in milestone ? milestone.celebrationQuote : milestone.description;
  const reminder = 'gentleReminder' in milestone
    ? milestone.gentleReminder
    : 'Unlocked quietly at your own pace — never pressure, guilt, or expirations.';
  const tierTag = 'tier' in milestone ? `${milestone.tier} Achievement` : 'Gentle Milestone';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3A57]/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#B2CBD8]/60 relative overflow-hidden flex flex-col items-center text-center">
        {/* Soft Background Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full opacity-60 animate-pulse"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                animationDuration: `${3 + p.delay * 2}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#EFF9FD] blur-3xl -z-10" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors z-10"
          aria-label="Close celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gentle Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]/60 text-xs font-semibold text-[#0F3A57] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#234C68]" />
          <span>{tierTag} ✨</span>
        </div>

        {/* Main Pulsing Badge */}
        <div className="relative my-2">
          {/* Outer gentle ring */}
          <div className="w-24 h-24 rounded-full bg-[#EFF9FD] border-4 border-[#B2CBD8] flex items-center justify-center shadow-lg relative group transition-transform hover:scale-105 duration-300">
            <span className="text-4xl select-none animate-bounce" style={{ animationDuration: '2.5s' }}>
              {milestone.icon}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0F3A57] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            ✓
          </div>
        </div>

        {/* Milestone Title & Praise */}
        <h2 className="text-2xl font-black text-[#0F3A57] mt-3 tracking-tight">
          {title}
        </h2>
        <p className="text-xs font-bold text-[#234C68] mt-0.5">
          {praise}
        </p>

        {/* Poetic Quote Box */}
        <div className="w-full my-4 p-4 rounded-2xl bg-[#EFF9FD]/70 border border-[#B2CBD8]/60 text-xs text-[#0F3A57] leading-relaxed">
          <p className="italic font-medium">"{quote}"</p>
          {'description' in milestone && 'celebrationQuote' in milestone && (
            <p className="text-[11px] text-[#547489] mt-1.5">
              {milestone.description}
            </p>
          )}
        </div>

        {/* Anti-Pressure Reassurance */}
        <div className="flex items-center gap-2 text-[11px] text-[#547489] mb-6 text-left w-full px-1">
          <ShieldCheck className="w-4 h-4 text-[#0F3A57] shrink-0" />
          <span>{reminder}</span>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0F3A57] text-white font-bold text-xs hover:bg-[#234C68] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0F3A57]/15 active:scale-[0.99]"
          >
            <span>Continue at my own pace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => ambientSound.playChime()}
            className="w-full py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57] transition-colors flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Replay gentle chime</span>
          </button>
        </div>
      </div>
    </div>
  );
};
