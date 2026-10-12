import React, { useState } from 'react';
import { CompanionData, CompanionAccessoryId, MoodType } from '../../types';
import { InteractiveCartoonCharacter } from './InteractiveCartoonCharacter';
import { ambientSound } from '../../utils/audioSynth';
import { Sparkles, Heart, Shirt, Users, Gamepad2, ChevronDown, ChevronUp } from 'lucide-react';

interface CompanionWidgetProps {
  currentCompanion: CompanionData;
  availableCompanions: CompanionData[];
  unlockedAccessories: CompanionAccessoryId[];
  userMood: MoodType | null;
  userName: string;
  onSelectCompanion: (companion: CompanionData) => void;
  onSelectAccessory: (accessory: CompanionAccessoryId) => void;
  onOpenArcade: () => void;
  onPetCompanion: () => void;
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({
  currentCompanion,
  availableCompanions,
  unlockedAccessories,
  userMood,
  userName,
  onSelectCompanion,
  onSelectAccessory,
  onOpenArcade,
  onPetCompanion,
}) => {
  const [petCount, setPetCount] = useState(0);
  const [isPetting, setIsPetting] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customTab, setCustomTab] = useState<'buddies' | 'accessories'>('buddies');

  // Dynamic voice / quote from cartoon companion based on mood and state
  const getCompanionSpeech = () => {
    if (isPetting) {
      return `*happy purr* ✨ Thank you, ${userName}! You're the best!`;
    }
    if (userMood === 'great') {
      return `Your positive energy today makes my sparkles shine extra bright! 🌟`;
    }
    if (userMood === 'good') {
      return `Steady, peaceful days like today are wonderful to celebrate 🌱`;
    }
    if (userMood === 'meh') {
      return `Just floating here with you, ${userName}. No pressure to be anything but you 🤍`;
    }
    if (userMood === 'low') {
      return `I brought a soft cloud for us to sit on. Breathe in... breathe out 🕊️`;
    }
    if (userMood === 'struggling') {
      return `You don't have to carry this alone, ${userName}. We're taking it one tiny breath at a time 🫂`;
    }
    return `Hey ${userName}! I'm ${currentCompanion.name}. Ready for a mindful adventure today? ✨`;
  };

  const handlePet = () => {
    setIsPetting(true);
    setShowHearts(true);
    setPetCount((prev) => prev + 1);

    // Play cheerful synthesized chime/sparkle sound
    ambientSound.playSparkle();

    if (onPetCompanion) {
      onPetCompanion();
    }

    setTimeout(() => {
      setIsPetting(false);
    }, 700);

    setTimeout(() => {
      setShowHearts(false);
    }, 1400);
  };

  const accessoriesList: { id: CompanionAccessoryId; name: string; emoji: string; desc: string }[] = [
    { id: 'crown', name: 'Golden Crown', emoji: '👑', desc: 'Regal starlight laurel' },
    { id: 'flower', name: 'Daisy Pin', emoji: '🌸', desc: 'Sweet fresh blossom' },
    { id: 'scarf', name: 'Cozy Scarf', emoji: '🧣', desc: 'Warm knitted hug' },
    { id: 'glasses', name: 'Retro Shades', emoji: '🕶️', desc: 'Wise & cool frames' },
    { id: 'wings', name: 'Angel Wings', emoji: '🪽', desc: 'Gentle sky feathers' },
    { id: 'none', name: 'Natural Look', emoji: '✨', desc: 'Pure cute mascot' },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[#EFF9FD]/40 dark:from-[#0D1E2D] dark:to-[#08121A] rounded-3xl p-5 sm:p-6 border border-[#B2CBD8]/50 dark:border-[#1E3A52] shadow-sm relative overflow-hidden transition-all">
      {/* Background decorative soft pastel blobs */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#38BDF8]/10 dark:bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FBBF24]/10 dark:bg-[#FBBF24]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Companion Display Row */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative z-10">
        {/* Interactive Character Avatar */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="p-3 rounded-3xl bg-[#EFF9FD] dark:bg-[#132A3E] border-2 border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-inner relative group cursor-pointer"
            onClick={handlePet}
          >
            <InteractiveCartoonCharacter
              companionId={currentCompanion.id}
              accessory={currentCompanion.accessory}
              mood={isPetting ? 'cheering' : currentCompanion.mood}
              isInteracting={isPetting}
              showHearts={showHearts}
              size="lg"
            />
            {/* Quick pet hint pill */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0F3A57] text-white text-[10px] font-bold tracking-tight shadow-md flex items-center gap-1 whitespace-nowrap active:scale-95">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              <span>Tap to Pet</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] mt-3">
            {currentCompanion.name}
          </span>
          <span className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
            {currentCompanion.species}
          </span>
        </div>

        {/* Speech Bubble and Interactive Controls */}
        <div className="flex-1 space-y-3 w-full">
          {/* Animated Comic Speech Bubble */}
          <div className="relative bg-white dark:bg-[#102436] p-4 rounded-2xl border-2 border-[#B2CBD8]/70 dark:border-[#1E3A52] shadow-sm">
            {/* Speech bubble pointer arrow */}
            <div className="hidden sm:block absolute -left-2.5 top-6 w-3 h-3 bg-white dark:bg-[#102436] border-l-2 border-b-2 border-[#B2CBD8]/70 dark:border-[#1E3A52] rotate-45 transform" />

            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Companion Message</span>
              </div>
              <span className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                {petCount > 0 ? `Pet ${petCount} time${petCount > 1 ? 's' : ''}` : 'Happy buddy'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#234C68] dark:text-[#B4D5E8] leading-relaxed font-medium">
              "{getCompanionSpeech()}"
            </p>
          </div>

          {/* Action Row: Pet, Dress Up, Play Mini-Game */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handlePet}
              className="px-3.5 py-2 rounded-xl bg-[#0F3A57] text-white hover:bg-[#1E4666] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span>Pet {currentCompanion.name}</span>
            </button>

            <button
              onClick={onOpenArcade}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Play Arcade Games 🎮</span>
            </button>

            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#132A3E] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] font-semibold text-xs hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-all flex items-center gap-1"
            >
              <Shirt className="w-3.5 h-3.5 text-[#547489]" />
              <span>Customize</span>
              {isCustomizing ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Customization Drawer (Buddies & Wardrobe) */}
      {isCustomizing && (
        <div className="mt-5 pt-4 border-t border-[#B2CBD8]/40 dark:border-[#1E3A52] space-y-3 animate-fade-in">
          {/* Sub-tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomTab('buddies')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                customTab === 'buddies'
                  ? 'bg-[#0F3A57] text-white'
                  : 'bg-white dark:bg-[#132A3E] text-[#547489] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Choose Companion</span>
            </button>
            <button
              onClick={() => setCustomTab('accessories')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                customTab === 'accessories'
                  ? 'bg-[#0F3A57] text-white'
                  : 'bg-white dark:bg-[#132A3E] text-[#547489] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB]'
              }`}
            >
              <Shirt className="w-3 h-3" />
              <span>Wardrobe & Hats</span>
            </button>
          </div>

          {/* Buddies Grid */}
          {customTab === 'buddies' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableCompanions.map((comp) => {
                const isSelected = comp.id === currentCompanion.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => onSelectCompanion(comp)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#EFF9FD] dark:bg-[#132A3E] border-[#0F3A57] dark:border-[#38BDF8] ring-2 ring-[#0F3A57]/20 shadow-sm'
                        : 'bg-white dark:bg-[#0D1E2D] border-[#B2CBD8]/50 dark:border-[#1E3A52] hover:border-[#547489]'
                    }`}
                  >
                    <div className="w-12 h-12 shrink-0">
                      <InteractiveCartoonCharacter
                        companionId={comp.id}
                        accessory={comp.accessory}
                        size="sm"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                        {comp.name}
                      </div>
                      <div className="text-[10px] text-[#547489] dark:text-[#8DAEC2] line-clamp-1">
                        {comp.species}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Wardrobe Grid */}
          {customTab === 'accessories' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {accessoriesList.map((acc) => {
                const isUnlocked = unlockedAccessories.includes(acc.id);
                const isSelected = currentCompanion.accessory === acc.id;

                return (
                  <button
                    key={acc.id}
                    disabled={!isUnlocked}
                    onClick={() => onSelectAccessory(acc.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#EFF9FD] dark:bg-[#132A3E] border-[#0F3A57] dark:border-[#38BDF8] ring-2 ring-[#0F3A57]/20 shadow-sm'
                        : isUnlocked
                        ? 'bg-white dark:bg-[#0D1E2D] border-[#B2CBD8]/50 dark:border-[#1E3A52] hover:border-[#547489]'
                        : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xl mb-1">{acc.emoji}</span>
                    <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] line-clamp-1">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-[#547489] dark:text-[#8DAEC2]">
                      {isUnlocked ? (isSelected ? 'Wearing' : 'Equip') : 'Locked'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
