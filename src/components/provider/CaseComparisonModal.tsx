import React from 'react';
import { ProviderCase } from '../../types';
import { X, Check, ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';

interface CaseComparisonModalProps {
  cases: ProviderCase[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCaseForDetail: (caseData: ProviderCase) => void;
}

export const CaseComparisonModal: React.FC<CaseComparisonModalProps> = ({
  cases,
  isOpen,
  onClose,
  onSelectCaseForDetail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#B2CBD8]/50 max-h-[90vh] flex flex-col relative overflow-hidden">
        <div className="flex items-start justify-between pb-4 border-b border-[#B2CBD8]/40">
          <div>
            <h2 className="text-xl font-bold text-[#0F3A57]">Compare Priority Cases</h2>
            <p className="text-xs text-[#547489] mt-0.5">
              Side-by-side triage assessment for up to 3 selected student cases.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto flex-1 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[620px]">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl border border-[#B2CBD8]/60 bg-white flex flex-col justify-between space-y-4 hover:border-[#0F3A57] transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#547489] bg-[#EFF9FD] px-2 py-0.5 rounded-md">
                      {c.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'High priority'
                          ? 'bg-rose-100 text-rose-800'
                          : c.priority === 'Elevated'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#EFF9FD] text-[#0F3A57]'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F3A57] mt-2">
                    {c.patientName} ({c.preferredName})
                  </h3>
                  <p className="text-xs text-[#547489]">Age {c.age} • {c.assignedProfessional}</p>

                  {/* Attributes comparison list */}
                  <div className="mt-4 space-y-3 divide-y divide-[#B2CBD8]/30 text-xs">
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#547489]">Current Score</span>
                      <span className="font-extrabold text-[#0F3A57] text-lg tabular-nums">
                        {c.currentScore}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#547489]">Score Change</span>
                      <span
                        className={`font-bold tabular-nums flex items-center gap-0.5 ${
                          c.change > 0 ? 'text-rose-700' : c.change < 0 ? 'text-emerald-700' : 'text-[#547489]'
                        }`}
                      >
                        {c.change > 0 ? `+${c.change}` : c.change}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#547489]">Trend</span>
                      <span className="font-bold text-[#0F3A57] uppercase text-[11px]">
                        {c.trend}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#547489]">Last Interaction</span>
                      <span className="font-medium text-[#0F3A57] text-[11px]">{c.lastCheckIn}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#547489]">Follow-up Status</span>
                      <span className="font-medium text-[#234C68] text-[11px] truncate max-w-[130px]">
                        {c.scheduledFollowUp || 'None scheduled'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectCaseForDetail(c);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors shadow-xs"
                >
                  Open Full Case Signals
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#B2CBD8]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EFF9FD] text-[#0F3A57] text-xs font-semibold hover:bg-[#B2CBD8]/40"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
