import React, { useState } from 'react';
import { ProviderAlert, PriorityLevel, ProviderCase } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Filter,
  Info,
} from 'lucide-react';

interface AlertCenterViewProps {
  alerts: ProviderAlert[];
  cases: ProviderCase[];
  onOpenCase: (caseData: ProviderCase) => void;
  onDismissAlert: (alertId: string) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  cases,
  onOpenCase,
  onDismissAlert,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | PriorityLevel>('All');

  const filtered = alerts.filter(
    (a) => selectedFilter === 'All' || a.level === selectedFilter
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F3A57]">Clinical Alert Center</h2>
          <p className="text-xs text-[#547489] mt-0.5">
            Real-time multi-modal shift detections and early non-clinical outreach recommendations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#EFF9FD] p-1 rounded-2xl border border-[#B2CBD8]/50 self-start sm:self-auto">
          {(['All', 'High priority', 'Elevated', 'Needs attention'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedFilter === lvl
                  ? 'bg-white text-[#0F3A57] shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 flex items-start gap-2.5 text-xs text-[#0F3A57]">
        <Info className="w-4 h-4 text-[#0F3A57] shrink-0 mt-0.5" />
        <span>
          <strong>Ethical AI Guardrail:</strong> Alerts describe observable acoustic, temporal, and self-report shifts. The AI never autonomously makes treatment decisions or formulates psychiatric diagnoses.
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((alert) => {
          const associatedCase = cases.find((c) => c.id === alert.caseId);
          return (
            <div
              key={alert.id}
              className={`p-6 rounded-3xl border transition-all shadow-xs space-y-4 ${
                alert.level === 'High priority'
                  ? 'bg-white border-rose-200 hover:border-rose-400'
                  : alert.level === 'Elevated'
                  ? 'bg-white border-amber-200 hover:border-amber-400'
                  : 'bg-white border-[#B2CBD8]/60 hover:border-[#547489]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      alert.level === 'High priority'
                        ? 'bg-rose-100 text-rose-800'
                        : alert.level === 'Elevated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#EFF9FD] text-[#0F3A57]'
                    }`}
                  >
                    {alert.level}
                  </span>
                  <h3 className="text-base font-bold text-[#0F3A57]">
                    {alert.patientName}
                  </h3>
                  <span className="text-xs font-mono text-[#547489]">{alert.caseId}</span>
                </div>
                <span className="text-xs text-[#547489] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {alert.timestamp}
                </span>
              </div>

              {/* Explanatory 4-part breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40">
                  <span className="text-[10px] font-bold text-[#547489] uppercase block mb-1">
                    What Changed
                  </span>
                  <p className="text-[#0F3A57] leading-relaxed">{alert.whatChanged}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40">
                  <span className="text-[10px] font-bold text-[#547489] uppercase block mb-1">
                    When It Changed
                  </span>
                  <p className="text-[#0F3A57] leading-relaxed">{alert.whenItChanged}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40">
                  <span className="text-[10px] font-bold text-[#547489] uppercase block mb-1">
                    Why It Matters
                  </span>
                  <p className="text-[#0F3A57] leading-relaxed">{alert.whyItMatters}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40">
                  <span className="text-[10px] font-bold text-[#547489] uppercase block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-[#0F3A57] font-semibold leading-relaxed">{alert.recommendedAction}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#B2CBD8]/30">
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="px-4 py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
                >
                  Acknowledge & Dismiss
                </button>

                {associatedCase && (
                  <button
                    onClick={() => onOpenCase(associatedCase)}
                    className="px-5 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open Case Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
