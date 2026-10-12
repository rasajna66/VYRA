import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight, X, Play } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onJumpToStep: (stepNumber: number) => void;
}

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'Polished Login & Sign Up with Dark/Light Mode',
    desc: 'Official VYRA emblem from vyra.jpeg, password show/hide, quick 1-click youth/provider access, and instant Dark Mode (midnight navy & blacks) toggle.',
    badge: 'Auth View ☀️🌙',
  },
  {
    step: 2,
    title: 'Sign Up & Friendly Onboarding',
    desc: 'Create VYRA space with minimal info, password strength meter, preferred name, goals, and simple privacy consent.',
    badge: 'Youth View',
  },
  {
    step: 3,
    title: 'Daily Affirmation Card & Weekly Recap',
    desc: 'Daily Affirmation card delivering encouraging, non-clinical quotes tailored to your selected mood (Great → Struggling) with shuffle, keepsakes, and journal reflection.',
    badge: 'Youth View ✨',
  },
  {
    step: 4,
    title: 'Daily Check-in: Text + Voice Simulation',
    desc: 'Conversational check-in capturing sleep, energy, reflection text, and optional voice note with acoustic feedback.',
    badge: 'Youth View',
  },
  {
    step: 5,
    title: 'Interactive 30-Day Trends & Cosy Sanctuary',
    desc: 'Interactive Recharts line chart tracking 30-day mood fluctuations & sleep, interactive day diary inspector, ambient rain audio, and cosy tea corner.',
    badge: 'Trends View 📊',
  },
  {
    step: 6,
    title: 'Gentle Milestones & 7-Day Streak Celebration ✨',
    desc: 'Soft particle animation, soothing chime, and non-punitive praise celebrating 7-day flow and first journal entry.',
    badge: 'Milestones ✨',
  },
  {
    step: 7,
    title: 'Calm Space & Private Journal',
    desc: 'Interactive 4-4-4 breathing circle, 5-4-3-2-1 grounding, synthesizer ambient sounds (rain/waves), and encrypted reflections.',
    badge: 'Youth View',
  },
  {
    step: 8,
    title: 'Provider Alert Center & Case Triage',
    desc: 'Switch to Dr. Sarah Jenkins\'s dashboard. See Priority Queue, triage Ram Sharma\'s new +19 score alert.',
    badge: 'Provider View',
  },
  {
    step: 9,
    title: 'Explainable AI Signals & Multi-modal Data',
    desc: 'Inspect Ram\'s case: acoustic pitch variance drops, late-night submission patterns, and 30-day wellbeing timeline.',
    badge: 'Provider View',
  },
  {
    step: 10,
    title: 'Intervention, Follow-up & Mark Reviewed',
    desc: 'Provider adds supportive observation, schedules sleep hygiene follow-up, and marks case reviewed.',
    badge: 'Provider View',
  },
];

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onJumpToStep,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#B2CBD8]/50 max-h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
          aria-label="Close demo walkthrough"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#0F3A57] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 text-[#EFF9FD]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F3A57]">Wadhwani Hackathon Demo Flow</h2>
            <p className="text-xs text-[#547489]">End-to-end interactive survivor-to-provider journey</p>
          </div>
        </div>

        <p className="text-xs text-[#547489] mb-4">
          Click any step below to instantly jump to that part of the application flow, or follow the live journey interactively.
        </p>

        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {DEMO_STEPS.map((s) => {
            const isCurrent = currentStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => {
                  onJumpToStep(s.step);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#EFF9FD] border-[#0F3A57] shadow-xs ring-1 ring-[#0F3A57]'
                    : 'bg-white border-[#B2CBD8]/50 hover:border-[#547489] hover:bg-[#EFF9FD]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-[#0F3A57] text-white'
                        : 'bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]'
                    }`}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F3A57]">{s.title}</span>
                      <span className="text-[10px] text-[#234C68] font-medium bg-[#B2CBD8]/30 px-2 py-0.5 rounded-md">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#547489] mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center text-[#0F3A57]">
                  <ChevronRight className="w-4 h-4 text-[#547489]" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 mt-4 border-t border-[#B2CBD8]/40 flex items-center justify-between">
          <span className="text-xs text-[#547489]">Full demo state updates dynamically across both roles</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-semibold hover:bg-[#234C68] transition-colors"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  );
};
