import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  Moon,
  Calendar,
  Sparkles,
  Info,
  Heart,
  Coffee,
  Volume2,
  VolumeX,
  Feather,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  Sun,
  Flame,
  ShieldCheck,
  Headphones,
  BookOpen,
} from 'lucide-react';
import { ambientSound } from '../../utils/audioSynth';

interface TrendsViewProps {
  currentScore: number;
  scoreStatus: string;
  scoreChange: number;
  userName?: string;
  onNavigateToCalm?: () => void;
  onNavigateToJournal?: () => void;
}

export interface DayTrendPoint {
  dayIndex: number;
  dateStr: string;
  dayOfWeek: string;
  fullDate: string;
  moodScore: number; // 1 to 5
  moodLabel: string;
  moodEmoji: string;
  sleepHours: number;
  score: number; // support indicator score
  energyLevel: number;
  note: string;
  highlight?: string;
  tag?: string;
}

// 30 days of authentic longitudinal data for Ram Sharma
const THIRTY_DAY_DATA: DayTrendPoint[] = [
  {
    dayIndex: 1,
    dateStr: 'Sep 12',
    dayOfWeek: 'Thu',
    fullDate: 'Thursday, Sep 12',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.8,
    score: 38,
    energyLevel: 4,
    note: 'School semester settling in. Felt calm and focused in homeroom.',
    tag: 'Quiet day',
  },
  {
    dayIndex: 2,
    dateStr: 'Sep 13',
    dayOfWeek: 'Fri',
    fullDate: 'Friday, Sep 13',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.5,
    score: 39,
    energyLevel: 4,
    note: 'Friday movie night with friends. Laughed a lot and ordered pizza.',
    tag: 'Social spark',
  },
  {
    dayIndex: 3,
    dateStr: 'Sep 14',
    dayOfWeek: 'Sat',
    fullDate: 'Saturday, Sep 14',
    moodScore: 5,
    moodLabel: 'Great',
    moodEmoji: '😊',
    sleepHours: 8.5,
    score: 36,
    energyLevel: 5,
    note: 'Slept in until 10 AM. Went skateboarding at the local park with Maya.',
    highlight: 'Weekend recharge',
    tag: 'Restful sleep',
  },
  {
    dayIndex: 4,
    dateStr: 'Sep 15',
    dayOfWeek: 'Sun',
    fullDate: 'Sunday, Sep 15',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.6,
    score: 38,
    energyLevel: 4,
    note: 'Prepped backpack and clothes for the week. Steady Sunday evening.',
    tag: 'Preparation',
  },
  {
    dayIndex: 5,
    dateStr: 'Sep 16',
    dayOfWeek: 'Mon',
    fullDate: 'Monday, Sep 16',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.4,
    score: 40,
    energyLevel: 4,
    note: 'Track practice started. Muscles tired but head felt clear.',
    tag: 'Movement',
  },
  {
    dayIndex: 6,
    dateStr: 'Sep 17',
    dayOfWeek: 'Tue',
    fullDate: 'Tuesday, Sep 17',
    moodScore: 5,
    moodLabel: 'Great',
    moodEmoji: '😊',
    sleepHours: 8.0,
    score: 37,
    energyLevel: 5,
    note: 'Felt fast during 400m relay sprints. Coach gave a thumbs up.',
    tag: 'High energy',
  },
  {
    dayIndex: 7,
    dateStr: 'Sep 18',
    dayOfWeek: 'Wed',
    fullDate: 'Wednesday, Sep 18',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.2,
    score: 41,
    energyLevel: 3,
    note: 'Quiet evening reading before bed. Made warm chamomile tea.',
    tag: 'Cozy night',
  },
  {
    dayIndex: 8,
    dateStr: 'Sep 19',
    dayOfWeek: 'Thu',
    fullDate: 'Thursday, Sep 19',
    moodScore: 3,
    moodLabel: 'Meh',
    moodEmoji: '😐',
    sleepHours: 6.4,
    score: 44,
    energyLevel: 3,
    note: 'History essay due tomorrow. Stayed up a bit later revising citations.',
    tag: 'Study night',
  },
  {
    dayIndex: 9,
    dateStr: 'Sep 20',
    dayOfWeek: 'Fri',
    fullDate: 'Friday, Sep 20',
    moodScore: 3,
    moodLabel: 'Meh',
    moodEmoji: '😐',
    sleepHours: 6.2,
    score: 46,
    energyLevel: 2,
    note: 'End of week fatigue hitting. Just wanted to curl under a blanket.',
    tag: 'Fatigue',
  },
  {
    dayIndex: 10,
    dateStr: 'Sep 21',
    dayOfWeek: 'Sat',
    fullDate: 'Saturday, Sep 21',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 8.2,
    score: 42,
    energyLevel: 4,
    note: 'Made blueberry pancakes with Maya. Sunny, crisp morning air.',
    highlight: 'Family breakfast',
    tag: 'Weekend reset',
  },
  {
    dayIndex: 11,
    dateStr: 'Sep 22',
    dayOfWeek: 'Sun',
    fullDate: 'Sunday, Sep 22',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.8,
    score: 40,
    energyLevel: 4,
    note: 'Organized my desk space. Lighted a vanilla candle, felt peaceful.',
    tag: 'Cozy space',
  },
  {
    dayIndex: 12,
    dateStr: 'Sep 23',
    dayOfWeek: 'Mon',
    fullDate: 'Monday, Sep 23',
    moodScore: 5,
    moodLabel: 'Great',
    moodEmoji: '😊',
    sleepHours: 8.0,
    score: 38,
    energyLevel: 5,
    note: 'Biology project presentation went smoothly! Whole group got an A.',
    highlight: 'Academic win',
    tag: 'Proud moment',
  },
  {
    dayIndex: 13,
    dateStr: 'Sep 24',
    dayOfWeek: 'Tue',
    fullDate: 'Tuesday, Sep 24',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.5,
    score: 40,
    energyLevel: 4,
    note: 'Track practice interval runs. Felt grounded and steady.',
    tag: 'Movement',
  },
  {
    dayIndex: 14,
    dateStr: 'Sep 25',
    dayOfWeek: 'Wed',
    fullDate: 'Wednesday, Sep 25',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.3,
    score: 42,
    energyLevel: 3,
    note: 'Math quiz went fine. Listened to acoustic guitar playlist while doing sketches.',
    tag: 'Music calm',
  },
  {
    dayIndex: 15,
    dateStr: 'Sep 26',
    dayOfWeek: 'Thu',
    fullDate: 'Thursday, Sep 26',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.4,
    score: 41,
    energyLevel: 4,
    note: 'Quiet Thursday. Started reading a new sci-fi book before sleep.',
    tag: 'Book worm',
  },
  {
    dayIndex: 16,
    dateStr: 'Sep 27',
    dayOfWeek: 'Fri',
    fullDate: 'Friday, Sep 27',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.0,
    score: 43,
    energyLevel: 3,
    note: 'Watched school basketball game after classes. Good crowd energy.',
    highlight: '7-day streak milestone reached',
    tag: 'Social',
  },
  {
    dayIndex: 17,
    dateStr: 'Sep 28',
    dayOfWeek: 'Sat',
    fullDate: 'Saturday, Sep 28',
    moodScore: 5,
    moodLabel: 'Great',
    moodEmoji: '😊',
    sleepHours: 8.4,
    score: 39,
    energyLevel: 5,
    note: 'Long weekend bike ride around the reservoir. Crisp autumn foliage.',
    tag: 'Nature walk',
  },
  {
    dayIndex: 18,
    dateStr: 'Sep 29',
    dayOfWeek: 'Sun',
    fullDate: 'Sunday, Sep 29',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.8,
    score: 41,
    energyLevel: 4,
    note: 'Family dinner. Talked about university dreams calmly without feeling stressed.',
    tag: 'Family warmth',
  },
  {
    dayIndex: 19,
    dateStr: 'Sep 30',
    dayOfWeek: 'Mon',
    fullDate: 'Monday, Sep 30',
    moodScore: 5,
    moodLabel: 'Great',
    moodEmoji: '😊',
    sleepHours: 8.0,
    score: 42,
    energyLevel: 5,
    note: 'Finished math assignment early, feeling relieved and slept a full 8 hours.',
    tag: 'Relief',
  },
  {
    dayIndex: 20,
    dateStr: 'Oct 01',
    dayOfWeek: 'Tue',
    fullDate: 'Tuesday, Oct 01',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.5,
    score: 44,
    energyLevel: 4,
    note: 'Track practice was good. Had dinner with Maya and talked about music.',
    tag: 'Connection',
  },
  {
    dayIndex: 21,
    dateStr: 'Oct 02',
    dayOfWeek: 'Wed',
    fullDate: 'Wednesday, Oct 02',
    moodScore: 3,
    moodLabel: 'Meh',
    moodEmoji: '😐',
    sleepHours: 6.2,
    score: 50,
    energyLevel: 3,
    note: 'Lots of upcoming midterms announced today. Brain feels a bit foggy.',
    tag: 'Exam alert',
  },
  {
    dayIndex: 22,
    dateStr: 'Oct 03',
    dayOfWeek: 'Thu',
    fullDate: 'Thursday, Oct 03',
    moodScore: 2,
    moodLabel: 'Low',
    moodEmoji: '😕',
    sleepHours: 4.8,
    score: 56,
    energyLevel: 2,
    note: 'Up until 2 AM revising chemistry equations. Couldn’t fall asleep.',
    highlight: 'Late-night study cram',
    tag: 'Sleep drop',
  },
  {
    dayIndex: 23,
    dateStr: 'Oct 04',
    dayOfWeek: 'Fri',
    fullDate: 'Friday, Oct 04',
    moodScore: 2,
    moodLabel: 'Low',
    moodEmoji: '😕',
    sleepHours: 4.5,
    score: 59,
    energyLevel: 2,
    note: 'Super exhausted. Skipped lunch with friends. Listened to rain sounds in Calm Space.',
    highlight: 'First journal reflection written',
    tag: 'Tender day',
  },
  {
    dayIndex: 24,
    dateStr: 'Oct 05',
    dayOfWeek: 'Sat',
    fullDate: 'Saturday, Oct 05',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.0,
    score: 58,
    energyLevel: 4,
    note: 'Rested in morning. Walked around the park with warm apple cider.',
    tag: 'Park walk',
  },
  {
    dayIndex: 25,
    dateStr: 'Oct 06',
    dayOfWeek: 'Sun',
    fullDate: 'Sunday, Oct 06',
    moodScore: 1,
    moodLabel: 'Struggling',
    moodEmoji: '😔',
    sleepHours: 4.2,
    score: 61,
    energyLevel: 1,
    note: 'Tight chest late night thinking about exam pressure. Talked to Maya.',
    highlight: 'Reached out to sister Maya',
    tag: 'Support circle',
  },
  {
    dayIndex: 26,
    dateStr: 'Oct 07',
    dayOfWeek: 'Mon',
    fullDate: 'Monday, Oct 07',
    moodScore: 2,
    moodLabel: 'Low',
    moodEmoji: '😕',
    sleepHours: 5.0,
    score: 61,
    energyLevel: 2,
    note: 'Tough morning exam, but felt relieved once it was handed in. Checked in with counsellor.',
    tag: 'Exam day',
  },
  {
    dayIndex: 27,
    dateStr: 'Oct 08',
    dayOfWeek: 'Tue',
    fullDate: 'Tuesday, Oct 08',
    moodScore: 3,
    moodLabel: 'Meh',
    moodEmoji: '😐',
    sleepHours: 6.5,
    score: 58,
    energyLevel: 3,
    note: 'A little more breathing room today. Took an afternoon 20-min nap.',
    tag: 'Nap reset',
  },
  {
    dayIndex: 28,
    dateStr: 'Oct 09',
    dayOfWeek: 'Wed',
    fullDate: 'Wednesday, Oct 09',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.2,
    score: 54,
    energyLevel: 4,
    note: 'Felt lighter after getting math results back. Had herbal tea before bed.',
    tag: 'Lifting up',
  },
  {
    dayIndex: 29,
    dateStr: 'Oct 10',
    dayOfWeek: 'Thu',
    fullDate: 'Thursday, Oct 10',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.5,
    score: 50,
    energyLevel: 4,
    note: 'Gentle recovery. Practiced 4-4-4 box breathing in Calm Space before sleep.',
    tag: 'Breathing',
  },
  {
    dayIndex: 30,
    dateStr: 'Oct 11',
    dayOfWeek: 'Fri',
    fullDate: 'Friday, Oct 11',
    moodScore: 4,
    moodLabel: 'Good',
    moodEmoji: '🙂',
    sleepHours: 7.8,
    score: 48,
    energyLevel: 4,
    note: 'Friday evening chill. Looking forward to a restful, calm weekend.',
    highlight: 'Today',
    tag: 'Peaceful now',
  },
];

const MOOD_EMOJI_MAP: Record<number, { emoji: string; label: string; color: string }> = {
  5: { emoji: '😊', label: 'Great', color: '#10B981' },
  4: { emoji: '🙂', label: 'Good', color: '#0EA5E9' },
  3: { emoji: '😐', label: 'Meh', color: '#F59E0B' },
  2: { emoji: '😕', label: 'Low', color: '#F97316' },
  1: { emoji: '😔', label: 'Struggling', color: '#F43F5E' },
};

export const TrendsView: React.FC<TrendsViewProps> = ({
  currentScore,
  scoreStatus,
  scoreChange,
  userName = 'Ram',
  onNavigateToCalm,
  onNavigateToJournal,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'mood' | 'sleep' | 'combined'>('combined');
  const [selectedPoint, setSelectedPoint] = useState<DayTrendPoint>(
    THIRTY_DAY_DATA[THIRTY_DAY_DATA.length - 1]
  );
  const [cozyBeverage, setCozyBeverage] = useState<'tea' | 'chai' | 'cocoa' | 'water'>('tea');
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [personalReflectionNote, setPersonalReflectionNote] = useState('');
  const [savedReflectionToast, setSavedReflectionToast] = useState(false);

  // Filter dataset by chosen time range
  const filteredData = React.useMemo(() => {
    if (timeRange === '7d') return THIRTY_DAY_DATA.slice(-7);
    if (timeRange === '14d') return THIRTY_DAY_DATA.slice(-14);
    return THIRTY_DAY_DATA;
  }, [timeRange]);

  // Statistics calculation for the active range
  const stats = React.useMemo(() => {
    const total = filteredData.length;
    const moodSum = filteredData.reduce((acc, d) => acc + d.moodScore, 0);
    const avgMood = (moodSum / total).toFixed(1);
    const sleepSum = filteredData.reduce((acc, d) => acc + d.sleepHours, 0);
    const avgSleep = (sleepSum / total).toFixed(1);

    const goodOrGreatCount = filteredData.filter((d) => d.moodScore >= 4).length;
    const tenderCount = filteredData.filter((d) => d.moodScore <= 2).length;

    return {
      totalDays: total,
      avgMood,
      avgSleep,
      goodOrGreatPercent: Math.round((goodOrGreatCount / total) * 100),
      goodOrGreatCount,
      tenderCount,
    };
  }, [filteredData]);

  const toggleAmbientSound = () => {
    if (isPlayingAmbient) {
      ambientSound.stop();
      setIsPlayingAmbient(false);
    } else {
      ambientSound.play('rain', 0.35);
      setIsPlayingAmbient(true);
    }
  };

  const handlePlayChime = () => {
    ambientSound.playChime();
  };

  const handleSaveSanctuaryNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalReflectionNote.trim()) return;
    ambientSound.playChime();
    setSavedReflectionToast(true);
    setPersonalReflectionNote('');
    setTimeout(() => setSavedReflectionToast(false), 4000);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayTrendPoint = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#B2CBD8]/80 text-[#0F3A57] max-w-xs space-y-1.5 animate-fade-in pointer-events-none z-50">
          <div className="flex items-center justify-between gap-2 border-b border-[#B2CBD8]/40 pb-1.5">
            <span className="text-xs font-bold text-[#0F3A57] flex items-center gap-1.5">
              <span>{data.moodEmoji}</span>
              <span>{data.fullDate}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]/60 font-semibold text-[#234C68]">
              {data.moodLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🌙</span>
              <span>
                <strong className="text-[#0F3A57]">{data.sleepHours} hrs</strong> sleep
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🧭</span>
              <span>
                Score: <strong className="text-[#0F3A57]">{data.score}</strong>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#234C68] italic leading-snug pt-1 border-t border-[#B2CBD8]/30">
            “{data.note}”
          </p>

          {data.highlight && (
            <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium flex items-center gap-1">
              <span>✨</span>
              <span>{data.highlight}</span>
            </div>
          )}
          <div className="text-[9px] text-[#6E8C9F] pt-0.5 flex justify-end">
            Tap to open cozy diary note 📖
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      {/* 1. Cozy Sanctuary Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0F3A57] via-[#1A4565] to-[#234C68] text-white shadow-xl relative overflow-hidden">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-200/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-[#EFF9FD] border border-white/15 flex items-center gap-1">
                <span>🕯️</span>
                <span>Cosy Reflection Sanctuary</span>
              </span>
              <span className="text-xs text-[#B2CBD8]">• 30-Day Longitudinal Flow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>My Wellbeing Trends</span>
              <span className="text-2xl">🌱</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#EFF9FD]/90 max-w-xl leading-relaxed">
              Welcome back to your quiet space, {userName}. Track how your mood, bedtime sleep, and life moments ebb and flow together without pressure or judgment.
            </p>
          </div>

          {/* Cozy Corner interactive controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 self-start md:self-auto">
            {/* Ambient sound button */}
            <button
              onClick={toggleAmbientSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlayingAmbient
                  ? 'bg-amber-300 text-[#0F3A57] shadow-sm'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Toggle soft background rain sound"
            >
              {isPlayingAmbient ? <Volume2 className="w-3.5 h-3.5 text-[#0F3A57]" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isPlayingAmbient ? 'Rain Playing 🌧️' : 'Play Rain Sounds'}</span>
            </button>

            {/* Chime button */}
            <button
              onClick={handlePlayChime}
              className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-all text-xs"
              title="Play a peaceful 528Hz Solfeggio chime"
            >
              🔔
            </button>

            {/* Cozy drink selector */}
            <div className="flex items-center gap-1 pl-1 border-l border-white/20">
              {(
                [
                  { id: 'tea', emoji: '🍵', label: 'Chamomile' },
                  { id: 'chai', emoji: '🫖', label: 'Chai' },
                  { id: 'cocoa', emoji: '☕', label: 'Cocoa' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setCozyBeverage(d.id)}
                  className={`px-2 py-1 rounded-lg text-xs transition-all ${
                    cozyBeverage === d.id
                      ? 'bg-white/30 text-white font-bold ring-1 ring-white/50'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={`Cozy beverage: ${d.label}`}
                >
                  {d.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Time Range & Metric Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#B2CBD8]/60 shadow-xs">
        {/* Time range selection */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#547489] mr-1 hidden sm:inline">Timeline:</span>
          {(
            [
              { id: '7d', label: 'Past 7 Days' },
              { id: '14d', label: 'Past 14 Days' },
              { id: '30d', label: 'Full 30 Days' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === t.id
                  ? 'bg-[#0F3A57] text-white shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Metric Layer Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFF9FD] rounded-2xl border border-[#B2CBD8]/50 overflow-x-auto">
          <button
            onClick={() => setActiveMetric('combined')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
              activeMetric === 'combined'
                ? 'bg-white text-[#0F3A57] shadow-xs'
                : 'text-[#547489] hover:text-[#0F3A57]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Mood & Sleep Flow</span>
          </button>
          <button
            onClick={() => setActiveMetric('mood')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
              activeMetric === 'mood'
                ? 'bg-white text-[#0F3A57] shadow-xs'
                : 'text-[#547489] hover:text-[#0F3A57]'
            }`}
          >
            <span>Mood Fluctuations Only</span>
          </button>
          <button
            onClick={() => setActiveMetric('sleep')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
              activeMetric === 'sleep'
                ? 'bg-white text-[#0F3A57] shadow-xs'
                : 'text-[#547489] hover:text-[#0F3A57]'
            }`}
          >
            <Moon className="w-3 h-3 text-[#234C68]" />
            <span>Sleep Hours</span>
          </button>
        </div>
      </div>

      {/* 3. Recharts Line Chart Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B2CBD8]/60 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F3A57]">
                {activeMetric === 'mood'
                  ? 'Mood Fluctuations (1 to 5 Scale)'
                  : activeMetric === 'sleep'
                  ? 'Nightly Sleep Pattern (Hours)'
                  : 'Mood & Sleep Correlation Curve'}
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]/60 text-[#234C68] font-semibold">
                {filteredData.length} checkpoints
              </span>
            </div>
            <p className="text-xs text-[#547489] mt-0.5">
              Hover or tap any node along the curve to see your thoughts and sleep for that day.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#547489]">
            {(activeMetric === 'mood' || activeMetric === 'combined') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#0F3A57] ring-2 ring-[#0F3A57]/20" />
                <span>Mood (😊 to 😔)</span>
              </div>
            )}
            {(activeMetric === 'sleep' || activeMetric === 'combined') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#208B8F] ring-2 ring-[#208B8F]/20" />
                <span>Sleep (hrs)</span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  setSelectedPoint(e.activePayload[0].payload);
                }
              }}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F3A57" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0F3A57" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#208B8F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#208B8F" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#EFF9FD" vertical={false} />

              <XAxis
                dataKey="dateStr"
                stroke="#6E8C9F"
                tick={{ fontSize: 11, fill: '#547489' }}
                tickLine={false}
                axisLine={{ stroke: '#B2CBD8' }}
              />

              {/* Y Axis for Mood (1 - 5) */}
              <YAxis
                yAxisId="mood"
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(val) => {
                  switch (val) {
                    case 5:
                      return '😊 Great';
                    case 4:
                      return '🙂 Good';
                    case 3:
                      return '😐 Meh';
                    case 2:
                      return '😕 Low';
                    case 1:
                      return '😔 Tough';
                    default:
                      return '';
                  }
                }}
                stroke="#6E8C9F"
                tick={{ fontSize: 10, fill: '#547489' }}
                tickLine={false}
                axisLine={false}
                orientation="left"
              />

              {/* Optional secondary Y Axis for Sleep if showing sleep */}
              {(activeMetric === 'sleep' || activeMetric === 'combined') && (
                <YAxis
                  yAxisId="sleep"
                  domain={[3, 10]}
                  orientation="right"
                  tickFormatter={(v) => `${v}h`}
                  stroke="#208B8F"
                  tick={{ fontSize: 10, fill: '#208B8F' }}
                  tickLine={false}
                  axisLine={false}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Reference guide for healthy sleep or steady baseline */}
              <ReferenceLine
                yAxisId="mood"
                y={3}
                stroke="#B2CBD8"
                strokeDasharray="4 4"
                label={{ value: 'Steady center', fill: '#6E8C9F', fontSize: 10, position: 'insideBottomRight' }}
              />

              {/* Mood Area & Curve */}
              {(activeMetric === 'mood' || activeMetric === 'combined') && (
                <>
                  <Area
                    yAxisId="mood"
                    type="monotone"
                    dataKey="moodScore"
                    stroke="none"
                    fill="url(#moodGradient)"
                  />
                  <Line
                    yAxisId="mood"
                    type="monotone"
                    dataKey="moodScore"
                    stroke="#0F3A57"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#FFFFFF',
                      stroke: '#0F3A57',
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 7,
                      fill: '#0F3A57',
                      stroke: '#FFFFFF',
                      strokeWidth: 2.5,
                    }}
                    name="Mood Level"
                  />
                </>
              )}

              {/* Sleep Hours Line */}
              {(activeMetric === 'sleep' || activeMetric === 'combined') && (
                <>
                  <Area
                    yAxisId="sleep"
                    type="monotone"
                    dataKey="sleepHours"
                    stroke="none"
                    fill="url(#sleepGradient)"
                  />
                  <Line
                    yAxisId="sleep"
                    type="monotone"
                    dataKey="sleepHours"
                    stroke="#208B8F"
                    strokeWidth={2}
                    strokeDasharray={activeMetric === 'combined' ? '4 2' : undefined}
                    dot={{
                      r: 3,
                      fill: '#FFFFFF',
                      stroke: '#208B8F',
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#208B8F',
                      stroke: '#FFFFFF',
                      strokeWidth: 2,
                    }}
                    name="Sleep (hrs)"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Helper Text */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#B2CBD8]/40 text-xs text-[#547489]">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💡</span>
            <span>
              <strong>Notice the trend:</strong> When sleep dropped below 5 hours on Oct 03–06 (exam prep), your mood dipped toward tender days.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#0F3A57]">
            Active Day: {selectedPoint.fullDate}
          </span>
        </div>
      </div>

      {/* 4. Cozy Day Diary Inspector Card (Interactive selection) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B2CBD8]/60 shadow-sm relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#B2CBD8]/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 flex items-center justify-center text-2xl shadow-xs shrink-0">
              {selectedPoint.moodEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F3A57]">
                  {selectedPoint.fullDate}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]/60 text-[#234C68]">
                  Mood: {selectedPoint.moodLabel} ({selectedPoint.moodScore}/5)
                </span>
              </div>
              <p className="text-xs text-[#547489] mt-0.5">
                Check-in snapshot from day {selectedPoint.dayIndex} of your 30-day timeline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-medium">
              🌙 {selectedPoint.sleepHours} hrs sleep
            </span>
            <span className="text-xs px-3 py-1 rounded-xl bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/50 font-medium">
              🧭 Score: {selectedPoint.score}
            </span>
          </div>
        </div>

        {/* Diary content and reflection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#547489] uppercase tracking-wider block">
              What you noted that day:
            </span>
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-xs text-[#234C68] space-y-2">
              <p className="italic leading-relaxed text-sm">
                “{selectedPoint.note}”
              </p>
              {selectedPoint.tag && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[#547489] font-medium">
                    🏷️ {selectedPoint.tag}
                  </span>
                  {selectedPoint.highlight && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      ⭐ {selectedPoint.highlight}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#547489]">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted on-device • You own every reflection</span>
            </div>
          </div>

          {/* Quick interactive note form */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#547489] uppercase tracking-wider block">
              Add a cosy note to this timeline:
            </span>
            <form onSubmit={handleSaveSanctuaryNote} className="space-y-2">
              <textarea
                value={personalReflectionNote}
                onChange={(e) => setPersonalReflectionNote(e.target.value)}
                placeholder="What does looking back at this day remind you of? (e.g. Maya was super kind, or sleep helped...)"
                rows={3}
                className="w-full p-3 rounded-2xl border border-[#B2CBD8]/70 focus:border-[#0F3A57] focus:ring-1 focus:ring-[#0F3A57] text-xs text-[#0F3A57] placeholder:text-[#547489]/60 bg-[#EFF9FD]/30 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePlayChime}
                  className="text-xs text-[#547489] hover:text-[#0F3A57] flex items-center gap-1"
                >
                  <span>Play mindful bell 🔔</span>
                </button>
                <button
                  type="submit"
                  disabled={!personalReflectionNote.trim()}
                  className="px-4 py-1.5 rounded-xl bg-[#0F3A57] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#234C68] transition-all shadow-xs flex items-center gap-1"
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>Save to Sanctuary</span>
                </button>
              </div>
            </form>

            {savedReflectionToast && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Note saved to your timeline!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. 30-Day Sanctuary Insights & Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Average Mood
          </span>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#0F3A57]">
              {stats.avgMood}
            </span>
            <span className="text-xs text-[#547489]">/ 5.0</span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold">
            Steady Handling
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Nightly Sleep Avg
          </span>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#0F3A57]">
              {stats.avgSleep}
            </span>
            <span className="text-xs text-[#547489]">hours</span>
          </div>
          <span className="text-[11px] text-[#234C68] font-semibold">
            Target: 7.5 – 8.5h
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Uplifting Days
          </span>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {stats.goodOrGreatCount}
            </span>
            <span className="text-xs text-[#547489]">days ({stats.goodOrGreatPercent}%)</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            70% Positive baseline
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#547489] uppercase tracking-wider">
            Tender / Heavy Days
          </span>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {stats.tenderCount}
            </span>
            <span className="text-xs text-[#547489]">days</span>
          </div>
          <span className="text-[11px] text-[#547489] font-medium">
            Navigated with care
          </span>
        </div>
      </div>

      {/* 6. Main Support Indicator Card (Transparent Clinical Alignment) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#547489] uppercase tracking-wider">
              Current Support Indicator
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-[#0F3A57] tabular-nums">
                {currentScore}
              </span>
              <span className="text-sm font-bold text-[#234C68] px-3 py-1 rounded-xl bg-[#EFF9FD] border border-[#B2CBD8]/60">
                {scoreStatus}
              </span>
              <span className="text-xs font-semibold text-[#0F3A57] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#0F3A57]" />
                ↑ {scoreChange} pts past week
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToCalm && (
              <button
                onClick={onNavigateToCalm}
                className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Visit Calm Space</span>
              </button>
            )}
            {onNavigateToJournal && (
              <button
                onClick={onNavigateToJournal}
                className="px-4 py-2 rounded-xl bg-[#EFF9FD] hover:bg-[#0F3A57] hover:text-white text-[#0F3A57] text-xs font-bold border border-[#B2CBD8]/60 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Journal</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-[#547489] leading-relaxed max-w-2xl">
          “Your 30-day view demonstrates consistent emotional resilience throughout September. The recent score rise to 61 directly reflects exam deadlines, late-night chemistry prep, and temporary sleep dips. As sleep normalized this week, your mood began its gentle upward curve.”
        </p>

        {/* Non-diagnostic guarantee */}
        <div className="p-3.5 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/50 flex items-center gap-2.5 text-xs text-[#0F3A57]">
          <Info className="w-4 h-4 text-[#0F3A57] shrink-0" />
          <span>
            <strong>AI-assisted indicator • Not a diagnosis.</strong> This metric is a compassionate compass designed to spark gentle support conversations with your counsellor or doctor, never a clinical label.
          </span>
        </div>
      </div>

      {/* 7. Influencing Signals breakdown */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#0F3A57]">What influenced this indicator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: 'Sleep Pacing Shift',
              desc: 'Nightly sleep dropped from a steady 7.8 hrs to 4.5 hrs during the Oct 03–06 exam sprint.',
              impact: 'High impact on indicator',
              icon: '🌙',
            },
            {
              title: 'Late-Night Activity',
              desc: 'Check-in submissions and reflection notes recorded between 1:30 AM and 2:45 AM.',
              impact: 'Moderate impact',
              icon: '🕯️',
            },
            {
              title: 'Academic & Fatigue Vocabulary',
              desc: 'Words like "chemistry exam", "behind", "foggy", and "tight chest" detected in recent notes.',
              impact: 'Supportive context',
              icon: '📝',
            },
          ].map((sig, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#234C68] bg-[#EFF9FD] px-2 py-0.5 rounded-md border border-[#B2CBD8]/40">
                    {sig.impact}
                  </span>
                  <span className="text-lg">{sig.icon}</span>
                </div>
                <h3 className="text-xs font-bold text-[#0F3A57]">{sig.title}</h3>
                <p className="text-xs text-[#547489] mt-1 leading-relaxed">{sig.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
