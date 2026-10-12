import React, { useState, useEffect } from 'react';
import { CalmAudioPlayer } from './CalmAudioPlayer';
import { CompanionId, CompanionAccessoryId } from '../../types';
import { InteractiveCartoonCharacter } from '../cartoon/InteractiveCartoonCharacter';
import {
  Wind,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Clock,
  Check,
  ChevronRight,
  Shield,
  Headphones,
} from 'lucide-react';

interface CalmSpaceProps {
  companionId?: CompanionId;
  accessory?: CompanionAccessoryId;
}

export const CalmSpace: React.FC<CalmSpaceProps> = ({
  companionId = 'vyra',
  accessory = 'crown',
}) => {
  // Breathing state
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breatheTimer, setBreatheTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(0);

  // Break timer state
  const [breakDuration, setBreakDuration] = useState(180); // 3 minutes
  const [remainingBreak, setRemainingBreak] = useState(180);
  const [isBreakRunning, setIsBreakRunning] = useState(false);

  // Breathing loop
  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreatheTimer((prev) => {
        if (prev <= 1) {
          setBreathePhase((phase) => {
            if (phase === 'Inhale') return 'Hold';
            if (phase === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Break timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakRunning && remainingBreak > 0) {
      interval = setInterval(() => {
        setRemainingBreak((prev) => prev - 1);
      }, 1000);
    } else if (remainingBreak === 0) {
      setIsBreakRunning(false);
    }
    return () => clearInterval(interval);
  }, [isBreakRunning, remainingBreak]);

  const groundingPrompts = [
    { title: '5 Things you can SEE', desc: 'Notice colors, shadows, or small details in the room right now.', icon: '👁️' },
    { title: '4 Things you can TOUCH', desc: 'Feel your clothes, the floor under your feet, or the desk surface.', icon: '🖐️' },
    { title: '3 Things you can HEAR', desc: 'Listen for sounds in the distance, a humming appliance, or breathing.', icon: '👂' },
    { title: '2 Things you can SMELL', desc: 'Notice fresh air, a warm cup, or scents in your space.', icon: '👃' },
    { title: '1 Thing you can TASTE', desc: 'A sip of water, or simply a deep reset breath.', icon: '👅' },
  ];

  const positiveReminders = [
    '“You do not have to figure out everything today. Just take this next breath.”',
    '“Rest is not a reward you earn. It is a fundamental need.”',
    '“It is okay to pause, take off the pressure, and regroup.”',
    '“Small steps still move you forward.”',
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-fade-in">
      {/* Banner & Disclaimer */}
      <div className="rounded-3xl overflow-hidden border border-[#B2CBD8]/50 bg-white relative shadow-sm">
        <div className="h-44 relative overflow-hidden">
          <img
            src="/src/assets/images/vyra_nature_calm_1791362098957.jpg"
            alt="Calm rolling blue hills landscape"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3A57]/90 via-[#0F3A57]/40 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌿</span>
              <h1 className="text-2xl font-bold">Calm Space</h1>
            </div>
            <p className="text-xs text-[#EFF9FD]/90 max-w-lg">
              A private grounding sanctuary designed to help ease physical tension, slow racing thoughts, and bring you back to center.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#EFF9FD]/60 border-t border-[#B2CBD8]/40 flex items-center gap-2 text-[11px] text-[#547489]">
          <Shield className="w-3.5 h-3.5 text-[#0F3A57] shrink-0" />
          <span>
            Optional wellness and mindfulness space • Clearly separate from clinical mental health treatment
          </span>
        </div>
      </div>

      {/* Grid: Breathing Exercise & Break Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breathing Exercise */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/50 shadow-xs flex flex-col items-center text-center justify-between min-h-[380px]">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#547489] uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#0F3A57]" />
              <span>Breathing Rhythm (4-4-4)</span>
            </span>
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="text-xs font-semibold text-[#0F3A57] hover:underline"
            >
              {isBreathingActive ? 'Pause' : 'Start'}
            </button>
          </div>

          {/* Visual Breathing Circle with Animated Cartoon Companion */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            {/* Cartoon Mascot breathing buddy */}
            <div className="mb-2">
              <InteractiveCartoonCharacter
                companionId={companionId}
                accessory={accessory}
                mood={breathePhase === 'Hold' ? 'peaceful' : breathePhase === 'Inhale' ? 'happy' : 'sleepy'}
                size="sm"
              />
            </div>

            <div
              className={`w-44 h-44 rounded-full border-4 border-[#B2CBD8] flex items-center justify-center transition-all duration-1000 ${
                breathePhase === 'Inhale'
                  ? 'scale-115 bg-[#EFF9FD] border-[#0F3A57]'
                  : breathePhase === 'Hold'
                  ? 'scale-115 bg-[#B2CBD8]/30 border-[#234C68]'
                  : 'scale-90 bg-white border-[#B2CBD8]'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-extrabold text-[#0F3A57]">
                  {breathePhase === 'Inhale' && 'Breathe in slowly'}
                  {breathePhase === 'Hold' && 'Hold gently'}
                  {breathePhase === 'Exhale' && 'Let it out'}
                </div>
                <div className="text-3xl font-black text-[#234C68] mt-1 tabular-nums">
                  {breatheTimer}s
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#547489] max-w-xs">
            Follow the circle as it expands and contracts. Doing this for just 60 seconds lowers heart rate.
          </p>
        </div>

        {/* 1-Minute Grounding (5-4-3-2-1) */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#547489] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0F3A57]" />
                <span>1-Minute Grounding</span>
              </span>
              <span className="text-xs font-bold text-[#0F3A57]">
                Step {groundingStep + 1} of 5
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#0F3A57] mb-1">
              5-4-3-2-1 Sensory Grounding
            </h3>
            <p className="text-xs text-[#547489] mb-4">
              When thoughts feel overwhelming, reconnect with your immediate physical environment.
            </p>

            <div className="p-5 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{groundingPrompts[groundingStep].icon}</span>
                <h4 className="text-sm font-bold text-[#0F3A57]">
                  {groundingPrompts[groundingStep].title}
                </h4>
              </div>
              <p className="text-xs text-[#234C68] leading-relaxed">
                {groundingPrompts[groundingStep].desc}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
              disabled={groundingStep === 0}
              className="text-xs font-semibold text-[#547489] hover:text-[#0F3A57] disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setGroundingStep((s) => (s + 1) % 5)}
              className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center gap-1"
            >
              <span>{groundingStep === 4 ? 'Restart cycle' : 'Next sense'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Soothing Audio Player with Local Nature & Guided Breathing Assets */}
      <CalmAudioPlayer />

      {/* Grid: "Take a break" timer & Positive Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Take a break timer */}
        <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/50 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#547489] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0F3A57]" />
              <span>“Take a break” Timer</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F3A57] mb-1">Unplug for a few minutes</h3>
          <p className="text-xs text-[#547489] mb-4">
            Give your eyes and brain a break without guilt.
          </p>

          <div className="flex items-center justify-center my-4">
            <span className="text-4xl font-black text-[#0F3A57] tabular-nums">
              {formatTime(remainingBreak)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            {[
              { label: '1m', secs: 60 },
              { label: '3m', secs: 180 },
              { label: '5m', secs: 300 },
              { label: '10m', secs: 600 },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => {
                  setBreakDuration(btn.secs);
                  setRemainingBreak(btn.secs);
                  setIsBreakRunning(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  breakDuration === btn.secs
                    ? 'bg-[#0F3A57] text-white'
                    : 'bg-[#EFF9FD] text-[#0F3A57] hover:bg-[#B2CBD8]/40'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreakRunning(!isBreakRunning)}
              className="px-5 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center gap-2 shadow-xs"
            >
              {isBreakRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Timer
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Start Break
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsBreakRunning(false);
                setRemainingBreak(breakDuration);
              }}
              className="p-2.5 rounded-xl border border-[#B2CBD8] text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD] transition-colors"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Positive Reminders */}
        <div className="bg-[#EFF9FD] rounded-3xl p-6 border border-[#B2CBD8]/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-[#0F3A57]" />
              <span className="text-xs font-bold text-[#0F3A57] uppercase tracking-wider">
                Gentle Reminders
              </span>
            </div>

            <div className="space-y-3">
              {positiveReminders.map((reminder, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#B2CBD8]/50 text-xs text-[#0F3A57] font-medium leading-relaxed shadow-xs"
                >
                  {reminder}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-[#6E8C9F]">
              Be gentle with yourself. You are doing the best you can.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
