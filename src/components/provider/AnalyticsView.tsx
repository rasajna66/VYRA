import React from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Calendar,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const weeklyTrends = [
    { week: 'W1', avgScore: 41, checkIns: 184, reviewQueue: 8 },
    { week: 'W2', avgScore: 43, checkIns: 210, reviewQueue: 6 },
    { week: 'W3', avgScore: 46, checkIns: 245, reviewQueue: 9 },
    { week: 'W4', avgScore: 49, checkIns: 268, reviewQueue: 7 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[#0F3A57]">Organization Insights</h2>
        <p className="text-xs text-[#547489] mt-0.5">
          Aggregated cohort wellbeing patterns across participating secondary & university programs.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 flex items-center gap-2.5 text-xs text-[#0F3A57]">
        <Lock className="w-4 h-4 text-[#0F3A57] shrink-0" />
        <span>
          <strong>Privacy Preserved:</strong> All individual student identifiers are excluded from organization-level reports in compliance with privacy consent requirements.
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-xs font-bold text-[#547489] uppercase">Avg Cohort Score</span>
          <div className="text-3xl font-black text-[#0F3A57] tabular-nums mt-1">47.8</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            ↑ 3.2 pts from baseline
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-xs font-bold text-[#547489] uppercase">Total Check-ins</span>
          <div className="text-3xl font-black text-[#0F3A57] tabular-nums mt-1">1,098</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            92.4% Completion rate
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-xs font-bold text-[#547489] uppercase">Follow-up Rate</span>
          <div className="text-3xl font-black text-[#0F3A57] tabular-nums mt-1">94.1%</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Avg response 2.4 hrs
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
          <span className="text-xs font-bold text-[#547489] uppercase">Active Consent</span>
          <div className="text-3xl font-black text-[#0F3A57] tabular-nums mt-1">98.6%</div>
          <span className="text-[11px] text-[#547489] mt-0.5 block">
            Voice 84% • Text 99%
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Score Trend */}
        <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F3A57]">Average Distress Trajectory (4 Weeks)</h3>
            <span className="text-xs text-[#547489]">Cohort N=24</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 border-b border-[#B2CBD8]/50 pb-2">
            {weeklyTrends.map((w, idx) => {
              const heightPercent = (w.avgScore / 70) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <span className="text-xs font-bold text-[#0F3A57] tabular-nums mb-1">
                    {w.avgScore}
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-[#0F3A57] group-hover:bg-[#234C68] rounded-t-xl transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-[#547489] mt-2">{w.week}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#547489] leading-relaxed">
            Gradual elevation aligns with standard mid-term examination calendars across secondary cohorts.
          </p>
        </div>

        {/* Priority Case Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F3A57]">Active Caseload Priority Breakdown</h3>
            <span className="text-xs text-[#547489]">Live Triage</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-rose-800">High priority (Immediate review)</span>
                <span className="text-rose-800">1 case (4.2%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: '4.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-amber-800">Elevated (Active monitoring)</span>
                <span className="text-amber-800">4 cases (16.7%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '16.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-[#0F3A57]">Needs attention / Stable routine</span>
                <span className="text-[#0F3A57]">19 cases (79.1%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0F3A57] rounded-full" style={{ width: '79.1%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#547489]">
            79% of students maintain steady baseline protective routines with regular check-in habits.
          </div>
        </div>
      </div>
    </div>
  );
};
