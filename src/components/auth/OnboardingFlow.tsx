import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import { VyraLogo } from '../common/VyraLogo';

interface OnboardingFlowProps {
  initialName: string;
  onComplete: (preferences: {
    preferredName: string;
    goals: string[];
    privacyAccepted: boolean;
  }) => void;
}

const GOAL_OPTIONS = [
  { id: 'feelings', emoji: '🧠', title: 'Understanding my feelings', desc: 'Notice patterns in how you feel without judgement' },
  { id: 'habits', emoji: '🌱', title: 'Building healthier habits', desc: 'Small daily steps that support your headspace' },
  { id: 'sleep', emoji: '😴', title: 'Improving sleep', desc: 'Unwind better and quiet late-night racing thoughts' },
  { id: 'talk', emoji: '💬', title: 'Having someone to talk to', desc: 'Easy connection to your counsellor or trusted person' },
  { id: 'patterns', emoji: '📈', title: 'Understanding my wellbeing patterns', desc: 'Visual trends to spot stress before it builds up' },
  { id: 'support', emoji: '🤝', title: 'Staying connected to support', desc: 'Safe backup circle when life gets heavy' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialName,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState(initialName || 'Ram Sharma');
  const [preferredName, setPreferredName] = useState(initialName || 'Ram');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'feelings',
    'habits',
    'sleep',
  ]);

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#EFF9FD]">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="flex items-center justify-center mb-5">
          <VyraLogo variant="horizontal" size="sm" showSubtitle={true} />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-[#0F3A57]'
                    : s < step
                    ? 'w-4 bg-[#547489]'
                    : 'w-4 bg-[#B2CBD8]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#547489]">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: What should we call you? */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B2CBD8]/50 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF9FD] flex items-center justify-center text-2xl mb-4">
              👋
            </div>
            <h2 className="text-2xl font-bold text-[#0F3A57]">What should we call you?</h2>
            <p className="text-sm text-[#547489] mt-1 mb-6">
              Pick the name that feels most comfortable and genuine to you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F3A57] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8] text-sm text-[#0F3A57] outline-none focus:border-[#0F3A57]"
                  placeholder="Ram Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F3A57] mb-1.5">
                  Nickname / Preferred name
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8] text-sm text-[#0F3A57] outline-none focus:border-[#0F3A57]"
                  placeholder="Ram"
                />
                <p className="text-[11px] text-[#547489] mt-1">
                  This is how VYRA will greet you on your home screen.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!preferredName.trim()}
                className="px-6 py-3 rounded-2xl bg-[#0F3A57] text-white font-bold text-sm hover:bg-[#234C68] transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What would you like VYRA to help with? */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B2CBD8]/50 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF9FD] flex items-center justify-center text-2xl mb-4">
              🌱
            </div>
            <h2 className="text-2xl font-bold text-[#0F3A57]">
              What would you like VYRA to help with?
            </h2>
            <p className="text-sm text-[#547489] mt-1 mb-6">
              Select all that resonate with you today. You can always change this later.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {GOAL_OPTIONS.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EFF9FD] border-[#0F3A57] shadow-xs ring-1 ring-[#0F3A57]'
                        : 'bg-white border-[#B2CBD8]/60 hover:border-[#547489] hover:bg-[#EFF9FD]/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{g.emoji}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isSelected
                              ? 'bg-[#0F3A57] text-white'
                              : 'border border-[#B2CBD8]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F3A57]">{g.title}</h3>
                      <p className="text-xs text-[#547489] mt-1 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-[#0F3A57] text-white font-bold text-sm hover:bg-[#234C68] transition-all flex items-center gap-2 shadow-md"
              >
                <span>Looks good</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: You're in control */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B2CBD8]/50 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF9FD] flex items-center justify-center text-2xl mb-4 text-[#0F3A57]">
              <Lock className="w-6 h-6 text-[#0F3A57]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F3A57]">You're in control 🔐</h2>
            <p className="text-sm text-[#0F3A57] font-medium mt-1 mb-4">
              “VYRA only uses information you choose to share.”
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="p-4 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0F3A57] shrink-0 mt-0.5" />
                <div className="text-xs text-[#234C68] leading-relaxed">
                  <span className="font-bold block text-[#0F3A57] mb-0.5">Private by default</span>
                  Your personal journal entries and reflection words remain private to you unless you explicitly choose to share them with your counsellor.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#0F3A57] shrink-0 mt-0.5" />
                <div className="text-xs text-[#234C68] leading-relaxed">
                  <span className="font-bold block text-[#0F3A57] mb-0.5">Assistance, not diagnosis</span>
                  VYRA indicators highlight wellbeing trends to help you and your supporters. We never label, diagnose, or judge you.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#0F3A57] shrink-0 mt-0.5" />
                <div className="text-xs text-[#234C68] leading-relaxed">
                  <span className="font-bold block text-[#0F3A57] mb-0.5">Full data sovereignty</span>
                  You can download your records, change sharing permissions, or delete your data at any time with one tap.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
              >
                Back
              </button>
              <button
                onClick={() =>
                  onComplete({
                    preferredName: preferredName || 'Ram',
                    goals: selectedGoals,
                    privacyAccepted: true,
                  })
                }
                className="px-6 py-3 rounded-2xl bg-[#0F3A57] text-white font-bold text-sm hover:bg-[#234C68] transition-all flex items-center gap-2 shadow-md active:scale-95"
              >
                <span>Set my privacy →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
