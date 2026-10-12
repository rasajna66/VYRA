import React, { useState, useEffect } from 'react';
import { MoodType, CheckInRecord } from '../../types';
import { MOOD_OPTIONS } from '../../data/mockData';
import {
  X,
  ArrowRight,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Volume2,
  Clock,
  Moon,
  Zap,
} from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCheckIn: (data: Partial<CheckInRecord>) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmitCheckIn,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMood, setSelectedMood] = useState<MoodType>('low');
  const [energyLevel, setEnergyLevel] = useState<number>(2);
  const [sleepHours, setSleepHours] = useState<number>(4.5);
  const [reflectionText, setReflectionText] = useState(
    "I was up until 2:30 AM studying for chemistry and felt super drained when I woke up. It feels hard to keep up with everything right now."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Timer for voice note simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setHasVoiceNote(true);
    } else {
      setIsRecording(false);
    }
  };

  const handleFinish = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCompleted(true);
      onSubmitCheckIn({
        mood: selectedMood,
        energyLevel,
        sleepHours,
        noteText: reflectionText,
        score: 61, // elevated distress score
        voiceNoteUrl: hasVoiceNote ? 'simulated_voice_note.wav' : undefined,
        voiceAnalysis: hasVoiceNote
          ? {
              pitchVariance: 'Reduced by 14% (acoustic fatigue marker)',
              speechPacing: 'Slower tempo with extended pauses (18% latency)',
              fatigueDetected: true,
            }
          : undefined,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#B2CBD8]/50 max-h-[92vh] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
          aria-label="Close check-in"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        {!completed && (
          <div className="flex items-center gap-1.5 mb-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-7 bg-[#0F3A57]'
                    : s < step
                    ? 'w-3.5 bg-[#547489]'
                    : 'w-3.5 bg-[#B2CBD8]'
                }`}
              />
            ))}
            <span className="text-[11px] font-semibold text-[#547489] ml-2">
              Question {step} of 3
            </span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-1">
          {/* STEP 1: Mood & Energy */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F3A57]">How are you feeling right now?</h2>
                <p className="text-xs text-[#547489] mt-0.5">
                  No right or wrong answers. Just honest reflection.
                </p>
              </div>

              <div className="space-y-2">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left ${
                        isSelected
                          ? 'bg-[#EFF9FD] border-[#0F3A57] ring-1 ring-[#0F3A57] shadow-xs'
                          : 'bg-white border-[#B2CBD8]/60 hover:border-[#547489] hover:bg-[#EFF9FD]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-[#0F3A57]">{m.label}</div>
                          <div className="text-[11px] text-[#547489]">{m.subtext}</div>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#0F3A57] bg-[#0F3A57]'
                            : 'border-[#B2CBD8]'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-[#0F3A57] mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Energy level (1 = completely drained, 5 = fully charged)</span>
                </label>
                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setEnergyLevel(lvl)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        energyLevel === lvl
                          ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                          : 'bg-[#EFF9FD]/50 border-[#B2CBD8]/60 text-[#0F3A57] hover:bg-[#EFF9FD]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Sleep & Rhythm */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F3A57]">How did your sleep go last night?</h2>
                <p className="text-xs text-[#547489] mt-0.5">
                  Sleep is one of our biggest indicators of headspace and stamina.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#EFF9FD] border border-[#B2CBD8]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F3A57] flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-[#234C68]" />
                    <span>Logged sleep duration</span>
                  </span>
                  <span className="text-lg font-black text-[#0F3A57] tabular-nums">
                    {sleepHours} hrs
                  </span>
                </div>

                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-[#0F3A57] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-[#547489]">
                  <span>2h (Restless)</span>
                  <span>6h</span>
                  <span>8h+ (Deep rest)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#B2CBD8]/60 text-xs text-[#234C68]">
                <div className="font-semibold text-[#0F3A57] mb-1">Noticeable shift:</div>
                Your average over the last 14 days was 7.4 hours. A drop to {sleepHours} hours will be factored gently into your support indicator.
              </div>
            </div>
          )}

          {/* STEP 3: Reflection (Text + Voice) */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-[#0F3A57]">What's on your mind?</h2>
                <p className="text-xs text-[#547489] mt-0.5">
                  You can type a few sentences, talk out loud, or both.
                </p>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Share whatever comes up..."
                  className="w-full p-3.5 rounded-2xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] focus:border-[#0F3A57] outline-none leading-relaxed"
                />
              </div>

              {/* Optional Voice Note */}
              <div className="p-4 rounded-2xl border border-[#B2CBD8]/60 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#0F3A57]" />
                    <span className="text-xs font-bold text-[#0F3A57]">Voice Reflection (Optional)</span>
                  </div>
                  {isRecording && (
                    <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      00:0{recordingSeconds}s
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                      isRecording
                        ? 'bg-rose-600 text-white shadow-sm'
                        : hasVoiceNote
                        ? 'bg-[#EFF9FD] text-[#0F3A57] border border-[#0F3A57]'
                        : 'bg-[#0F3A57] text-white hover:bg-[#234C68]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" /> Stop Recording
                      </>
                    ) : hasVoiceNote ? (
                      <>
                        <Mic className="w-3.5 h-3.5" /> Re-record Voice
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" /> Record Voice Note
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-[#547489]">
                    {hasVoiceNote
                      ? '✓ Voice note attached (analyzes acoustic fatigue markers)'
                      : 'Speak freely for 10-30 seconds'}
                  </span>
                </div>

                {/* Animated Waveform Visualization */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1 py-2">
                    {[16, 24, 40, 20, 32, 48, 28, 14, 36, 44, 22, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-[#0F3A57] rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(10, (h * (recordingSeconds % 3 + 1)) / 2)}px`,
                          animationDelay: `${i * 70}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Success & AI Analysis Result */}
          {completed && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-[#EFF9FD] border border-[#B2CBD8] flex items-center justify-center mx-auto text-3xl">
                🌱
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0F3A57]">Check-in complete 🌱</h2>
                <p className="text-xs text-[#547489] mt-1 max-w-sm mx-auto">
                  Thanks for checking in with yourself today.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F3A57]">Updated Support Indicator</span>
                  <span className="text-xs font-bold text-[#234C68] bg-white px-2 py-0.5 rounded-md border border-[#B2CBD8]/50">
                    61 • Elevated
                  </span>
                </div>
                <p className="text-[11px] text-[#234C68] leading-relaxed">
                  We noticed cues of late-night strain and sleep disruption ({sleepHours}h). Your score adjusted from 42 to 61. Your assigned support counsellor Dr. Sarah Jenkins has received a non-urgent alert to review your pacing.
                </p>
                <div className="text-[10px] text-[#6E8C9F] pt-1">
                  AI-assisted indicator • Not a diagnosis
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 mt-4 border-t border-[#B2CBD8]/40 flex items-center justify-between">
          {!completed ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="px-4 py-2 text-xs font-bold text-[#547489] hover:text-[#0F3A57]"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F3A57] text-white font-bold text-xs hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-[#0F3A57] text-white font-bold text-xs hover:bg-[#234C68] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete check-in</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#0F3A57] text-white font-bold text-xs hover:bg-[#234C68] transition-all shadow-md"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
