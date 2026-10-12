import React, { useState, useEffect } from 'react';
import { MoodType } from '../../types';
import { MOOD_OPTIONS } from '../../data/mockData';
import {
  Sparkles,
  Quote,
  RefreshCw,
  Heart,
  Copy,
  Check,
  BookOpen,
  Volume2,
  BookmarkCheck,
  ChevronRight,
  Smile,
  X,
} from 'lucide-react';
import { ambientSound } from '../../utils/audioSynth';

interface AffirmationQuote {
  id: string;
  mood: MoodType;
  quote: string;
  source: string;
  theme: string;
  gentleTip: string;
}

const AFFIRMATIONS_DATA: AffirmationQuote[] = [
  // GREAT
  {
    id: 'grt-1',
    mood: 'great',
    quote: 'Joy does not need a reason to be held onto. Let yourself soak up every bit of warmth and lightness you are feeling today.',
    source: 'Vyra Sanctuary',
    theme: 'Radiance & Lightness',
    gentleTip: 'Notice where you feel this happiness in your body and take a mental snapshot.',
  },
  {
    id: 'grt-2',
    mood: 'great',
    quote: 'Your positive energy is real, earned, and ripples out in ways you may not even notice. Celebrate this moment of sunlight.',
    source: 'Gentle Reminder',
    theme: 'Grounded Gratitude',
    gentleTip: 'Send a quick warm text to someone you care about or write down 1 good memory.',
  },
  {
    id: 'grt-3',
    mood: 'great',
    quote: 'When good days come, let your shoulders drop completely and just enjoy being alive in this skin.',
    source: 'Daily Whisper',
    theme: 'Unapologetic Ease',
    gentleTip: 'Savor your favorite song or drink without rushing anywhere.',
  },
  {
    id: 'grt-4',
    mood: 'great',
    quote: 'You survived hard storms to get to this open meadow. You are allowed to be happy without waiting for the other shoe to drop.',
    source: 'Inner Compass',
    theme: 'Safe Joy',
    gentleTip: 'Breathe in confidence, breathe out past worries.',
  },

  // GOOD
  {
    id: 'gd-1',
    mood: 'good',
    quote: 'A steady, peaceful day is a quiet masterpiece. You do not need big fireworks to know you are doing just fine.',
    source: 'Quiet Corner',
    theme: 'Steady Rhythm',
    gentleTip: 'Keep this relaxed pace; calm consistency is its own superpower.',
  },
  {
    id: 'gd-2',
    mood: 'good',
    quote: 'Progress is often silent. In the calm moments, your mind and spirit are quietly rebuilding strength.',
    source: 'Vyra Anchor',
    theme: 'Quiet Growth',
    gentleTip: 'Give yourself credit for small things you completed without stress today.',
  },
  {
    id: 'gd-3',
    mood: 'good',
    quote: 'You do not have to be anywhere else or doing anything more. Right here, in your own lane, is plenty.',
    source: 'Gentle Truth',
    theme: 'Contentment',
    gentleTip: 'A 5-minute stretch or walk outside can help hold onto this balance.',
  },
  {
    id: 'gd-4',
    mood: 'good',
    quote: 'Trust the rhythm you are finding. Balance isn’t staying still; it is gently swaying without falling.',
    source: 'Daily Spark',
    theme: 'Balance & Ease',
    gentleTip: 'Notice the quiet comfort around you today.',
  },

  // MEH
  {
    id: 'meh-1',
    mood: 'meh',
    quote: 'Not every day needs to be a mountain peak. Coasting, resting, and simply existing in the neutral zone is completely valid.',
    source: 'Zero Pressure',
    theme: 'Valid Coasting',
    gentleTip: 'Lower the bar today. Warm socks, simple food, and breathing are enough.',
  },
  {
    id: 'meh-2',
    mood: 'meh',
    quote: 'You do not owe the world constant positivity. It is okay to be in-between, quiet, and conserving your energy.',
    source: 'Safe Harbor',
    theme: 'Permission to Just Be',
    gentleTip: 'Take three unhurried breaths and release your jaw.',
  },
  {
    id: 'meh-3',
    mood: 'meh',
    quote: 'Neutral is a resting stop on a long road. You don’t have to force enthusiasm — your battery is just charging quietly.',
    source: 'Gentle Whisper',
    theme: 'Recharging Harbor',
    gentleTip: 'Pick one tiny comfort: a cup of warm tea or 10 minutes of calm sounds.',
  },
  {
    id: 'meh-4',
    mood: 'meh',
    quote: 'You are not behind in life just because today feels plain or blurry. Let today be a cozy transition chapter.',
    source: 'Vyra Space',
    theme: 'Gentle Pacing',
    gentleTip: 'Do not judge today by productivity. You are enough as you are.',
  },

  // LOW
  {
    id: 'low-1',
    mood: 'low',
    quote: 'Treat yourself with the same tenderness you would give a tired friend. Soft steps and slow breaths still count as moving forward.',
    source: 'Tender Care',
    theme: 'Compassionate Steps',
    gentleTip: 'Wrap yourself in a blanket and drink a glass of water without rushing.',
  },
  {
    id: 'low-2',
    mood: 'low',
    quote: 'It is okay if today felt heavy or slow. Rest is not giving up — it is gathering the pieces you need for tomorrow.',
    source: 'Safe Harbor',
    theme: 'Permission to Rest',
    gentleTip: 'Turn down bright screens and let your eyes rest for a little while.',
  },
  {
    id: 'low-3',
    mood: 'low',
    quote: 'You do not have to carry the whole weight of the world at once. Just this hour, just this breath.',
    source: 'Grounded Note',
    theme: 'One Breath at a Time',
    gentleTip: 'Put a hand over your heart and remind yourself: "I am safe right now."',
  },
  {
    id: 'low-4',
    mood: 'low',
    quote: 'Heavy clouds pass across the sky, but they are not the sky itself. You are much bigger than this cloudy afternoon.',
    source: 'Mindful Whisper',
    theme: 'Weathering the Day',
    gentleTip: 'Listen to gentle ambient rain sounds in the Calm Space.',
  },

  // STRUGGLING
  {
    id: 'str-1',
    mood: 'struggling',
    quote: 'Heavy feelings do not mean you are broken. You are brave for feeling this deeply, and you do not have to be alone in it.',
    source: 'Safe Harbor',
    theme: 'You Are Not Broken',
    gentleTip: 'You can reach out to a trusted friend or provider with zero judgment.',
  },
  {
    id: 'str-2',
    mood: 'struggling',
    quote: 'You have survived 100% of your hardest days before this one. Give yourself permission to just stay soft and safe right now.',
    source: 'Vyra Anchor',
    theme: 'Resilient Softness',
    gentleTip: 'Focus only on the physical ground beneath your feet. You are held.',
  },
  {
    id: 'str-3',
    mood: 'struggling',
    quote: 'There is no rush to fix anything this second. Take a sip of water, exhale all the way out, and know you are cared for.',
    source: 'Gentle Truth',
    theme: 'Patient Holding',
    gentleTip: 'Reach out to your support circle or tap the Need Help button if you need an anchor.',
  },
  {
    id: 'str-4',
    mood: 'struggling',
    quote: 'Your worth is not tied to how well you are coping right now. You are worthy of love, care, and peace simply because you exist.',
    source: 'Compassionate Circle',
    theme: 'Unconditional Worth',
    gentleTip: 'Let someone who cares help carry a piece of the load today.',
  },
];

interface DailyAffirmationCardProps {
  currentMood: MoodType | null;
  userName?: string;
  onSelectMood?: (mood: MoodType) => void;
  onOpenJournalWithAffirmation?: (quoteText: string, theme: string) => void;
}

export const DailyAffirmationCard: React.FC<DailyAffirmationCardProps> = ({
  currentMood,
  userName = 'Friend',
  onSelectMood,
  onOpenJournalWithAffirmation,
}) => {
  // Fallback to 'meh' if no mood is selected yet
  const effectiveMood: MoodType = currentMood || 'meh';

  // Quotes filtered for this mood
  const availableQuotes = AFFIRMATIONS_DATA.filter((q) => q.mood === effectiveMood);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteList, setFavoriteList] = useState<AffirmationQuote[]>(() => {
    try {
      const saved = localStorage.getItem('vyra_favorite_affirmations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync index when mood changes
  useEffect(() => {
    setQuoteIndex(0);
  }, [effectiveMood]);

  const currentAffirmation = availableQuotes[quoteIndex] || availableQuotes[0] || AFFIRMATIONS_DATA[0];

  // Check if current is in favorites
  useEffect(() => {
    const isFav = favoriteList.some((f) => f.id === currentAffirmation.id);
    setIsFavorited(isFav);
  }, [currentAffirmation.id, favoriteList]);

  const handleShuffle = () => {
    setIsAnimating(true);
    ambientSound.playChime();
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % availableQuotes.length);
      setIsAnimating(false);
    }, 180);
  };

  const handleToggleFavorite = () => {
    ambientSound.playChime();
    let updated: AffirmationQuote[];
    if (isFavorited) {
      updated = favoriteList.filter((f) => f.id !== currentAffirmation.id);
      setIsFavorited(false);
    } else {
      updated = [currentAffirmation, ...favoriteList.filter((f) => f.id !== currentAffirmation.id)];
      setIsFavorited(true);
    }
    setFavoriteList(updated);
    try {
      localStorage.setItem('vyra_favorite_affirmations', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopyQuote = async () => {
    const textToCopy = `"${currentAffirmation.quote}" — ${currentAffirmation.source} (via VYRA Youth Space)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const currentMoodObj = MOOD_OPTIONS.find((m) => m.id === effectiveMood);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-sm hover:shadow-md transition-all duration-300">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#EFF9FD] to-[#B2CBD8]/30 dark:from-[#16354D]/40 dark:to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-[#B2CBD8]/20 to-transparent dark:from-[#0F283C]/30 dark:to-transparent rounded-full blur-xl pointer-events-none" />

      <div className="p-5 sm:p-6 relative z-10 space-y-4">
        {/* Header Bar: Badge, Mood Pill & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-[#B2CBD8]/30 dark:border-[#1E3A52]/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EFF9FD] dark:bg-[#163045] flex items-center justify-center text-[#0F3A57] dark:text-[#7DD3FC]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F3A57] dark:text-[#E2F1F8]">
                  Daily Affirmation
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#EFF9FD] dark:bg-[#163045] text-[10px] font-bold text-[#234C68] dark:text-[#93C5FD]">
                  Non-clinical
                </span>
              </div>
              <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                Friendly, encouraging words tailored to your mood
              </p>
            </div>
          </div>

          {/* Vibe Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EFF9FD] dark:bg-[#132A3E] border border-[#B2CBD8]/40 dark:border-[#1E3A52] text-xs font-semibold text-[#0F3A57] dark:text-[#E2F1F8]">
              <span>{currentMoodObj?.emoji || '🌱'}</span>
              <span>For: {currentMoodObj?.label || 'Today'}</span>
            </div>

            {favoriteList.length > 0 && (
              <button
                onClick={() => setShowFavoritesModal(true)}
                className="px-2 py-1 rounded-xl bg-[#EFF9FD] dark:bg-[#132A3E] hover:bg-[#B2CBD8]/30 dark:hover:bg-[#1C3B54] border border-[#B2CBD8]/40 dark:border-[#1E3A52] text-[11px] font-bold text-[#234C68] dark:text-[#93C5FD] transition-colors flex items-center gap-1"
                title="View your saved affirmation keepsakes"
              >
                <BookmarkCheck className="w-3 h-3 text-rose-500" />
                <span>{favoriteList.length}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Mood Switcher Pills (Allows testing different affirmations seamlessly) */}
        {onSelectMood && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-bold uppercase text-[#547489] dark:text-[#8DAEC2] shrink-0 mr-1">
              Switch vibe:
            </span>
            {MOOD_OPTIONS.map((opt) => {
              const isActive = effectiveMood === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectMood(opt.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] shadow-xs'
                      : 'bg-[#EFF9FD]/60 dark:bg-[#132A3E] text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#E2F1F8] border border-[#B2CBD8]/40 dark:border-[#1E3A52]'
                  }`}
                >
                  <span className="text-sm">{opt.emoji}</span>
                  <span className="text-[11px]">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Affirmation Quote Body */}
        <div
          className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EFF9FD]/70 to-[#EFF9FD]/30 dark:from-[#11273A] dark:to-[#0D1E2D] border border-[#B2CBD8]/40 dark:border-[#1E3A52] relative transition-opacity duration-200 ${
            isAnimating ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          <Quote className="w-8 h-8 text-[#0F3A57]/15 dark:text-[#7DD3FC]/20 absolute top-3 left-3 -scale-x-100 pointer-events-none" />

          <div className="relative pl-3 sm:pl-4 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/80 dark:bg-[#16354D] border border-[#B2CBD8]/30 dark:border-[#224866] text-[10px] font-bold tracking-wide uppercase text-[#234C68] dark:text-[#7DD3FC]">
              <span>✨ {currentAffirmation.theme}</span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-[#0F3A57] dark:text-[#F0F7FB] leading-relaxed italic">
              “{currentAffirmation.quote}”
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs font-medium text-[#547489] dark:text-[#8DAEC2]">
                — {currentAffirmation.source}
              </span>

              <span className="text-[11px] font-medium text-[#234C68] dark:text-[#93C5FD] bg-white/70 dark:bg-[#16354D]/70 px-2 py-0.5 rounded-md">
                Tip: {currentAffirmation.gentleTip}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {/* Shuffle Button */}
            <button
              onClick={handleShuffle}
              className="px-3 py-2 rounded-xl bg-[#EFF9FD] dark:bg-[#142C40] hover:bg-[#B2CBD8]/30 dark:hover:bg-[#1D3E5A] border border-[#B2CBD8]/50 dark:border-[#1E3A52] text-xs font-bold text-[#0F3A57] dark:text-[#E2F1F8] transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              title="Read another encouraging thought for this vibe"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#234C68] dark:text-[#7DD3FC] ${isAnimating ? 'animate-spin' : ''}`} />
              <span>Shuffle quote</span>
              <span className="text-[10px] text-[#547489] dark:text-[#8DAEC2] ml-0.5">
                ({quoteIndex + 1}/{availableQuotes.length})
              </span>
            </button>

            {/* Favorite / Keepsake Toggle */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold ${
                isFavorited
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-[#EFF9FD] dark:bg-[#142C40] border-[#B2CBD8]/50 dark:border-[#1E3A52] text-[#547489] dark:text-[#8DAEC2] hover:text-rose-500'
              }`}
              title={isFavorited ? 'Saved in keepsakes' : 'Save to my favorite quotes'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyQuote}
              className="p-2 rounded-xl bg-[#EFF9FD] dark:bg-[#142C40] hover:bg-[#B2CBD8]/30 dark:hover:bg-[#1D3E5A] border border-[#B2CBD8]/50 dark:border-[#1E3A52] text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#E2F1F8] transition-colors relative"
              title="Copy quote"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            {isCopied && (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 animate-fade-in">
                Copied!
              </span>
            )}
          </div>

          {/* Action: Take to Journal */}
          {onOpenJournalWithAffirmation && (
            <button
              onClick={() => onOpenJournalWithAffirmation(currentAffirmation.quote, currentAffirmation.theme)}
              className="px-3.5 py-2 rounded-xl bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] text-xs font-bold hover:bg-[#234C68] dark:hover:bg-[#7DD3FC] transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reflect in journal</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Keepsakes Modal */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#B2CBD8]/40 dark:border-[#1E3A52] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-base font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                    My Saved Affirmation Keepsakes
                  </h3>
                  <p className="text-xs text-[#547489] dark:text-[#8DAEC2]">
                    Encouraging words you've bookmarked for tough days
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="p-1.5 rounded-xl text-[#547489] dark:text-[#8DAEC2] hover:bg-[#EFF9FD] dark:hover:bg-[#163045]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {favoriteList.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#547489] dark:text-[#8DAEC2]">
                  No affirmations saved yet. Tap the heart icon on any quote to keep it here!
                </div>
              ) : (
                favoriteList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#EFF9FD]/60 dark:bg-[#132A3E] border border-[#B2CBD8]/40 dark:border-[#1E3A52] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#234C68] dark:text-[#7DD3FC]">
                        {item.theme}
                      </span>
                      <button
                        onClick={() => {
                          const updated = favoriteList.filter((f) => f.id !== item.id);
                          setFavoriteList(updated);
                          localStorage.setItem('vyra_favorite_affirmations', JSON.stringify(updated));
                        }}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] italic">
                      “{item.quote}”
                    </p>
                    <span className="text-[11px] text-[#547489] dark:text-[#8DAEC2] block">
                      — {item.source}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#B2CBD8]/40 dark:border-[#1E3A52] bg-[#EFF9FD]/30 dark:bg-[#102436] flex justify-end">
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] text-xs font-bold"
              >
                Close Keepsakes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
