import React, { useState } from 'react';
import { ProviderCase } from '../../types';
import {
  X,
  CheckCircle,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  FileText,
  Plus,
  Send,
  ShieldCheck,
  TrendingUp,
  User,
  Activity,
  Mic,
  MessageSquare,
} from 'lucide-react';

interface CaseDetailModalProps {
  caseData: ProviderCase;
  isOpen: boolean;
  onClose: () => void;
  onMarkReviewed: (caseId: string) => void;
  onAddObservation: (caseId: string, note: string) => void;
  onScheduleFollowUp: (caseId: string, date: string, reason: string) => void;
  onChangePriority: (caseId: string, priority: ProviderCase['priority']) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onMarkReviewed,
  onAddObservation,
  onScheduleFollowUp,
  onChangePriority,
}) => {
  const [timelineRange, setTimelineRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [newNote, setNewNote] = useState('');
  const [newIntervention, setNewIntervention] = useState('');
  const [followUpDate, setFollowUpDate] = useState(caseData.scheduledFollowUp || 'Tomorrow • 4:00 PM');
  const [followUpReason, setFollowUpReason] = useState(caseData.followUpReason || 'Review sleep hygiene and academic coping');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddObservation(caseData.id, newNote);
    setNewNote('');
    setActionSuccess('Clinical observation note saved to patient record.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleFollowUp(caseData.id, followUpDate, followUpReason);
    setShowScheduleForm(false);
    setActionSuccess('Follow-up scheduled and calendar invite synced.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReviewedClick = () => {
    onMarkReviewed(caseData.id);
    setActionSuccess('Case marked as reviewed for today.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#B2CBD8]/50 max-h-[92vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#B2CBD8]/40">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#0F3A57]">
                {caseData.patientName} ({caseData.preferredName})
              </h2>
              <span className="text-xs font-mono text-[#547489] bg-[#EFF9FD] px-2 py-0.5 rounded-md border border-[#B2CBD8]/40">
                {caseData.id}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  caseData.priority === 'High priority'
                    ? 'bg-rose-100 text-rose-800'
                    : caseData.priority === 'Elevated'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/40'
                }`}
              >
                {caseData.priority}
              </span>
              {caseData.reviewedToday && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Reviewed Today
                </span>
              )}
            </div>
            <p className="text-xs text-[#547489] mt-1">
              Age {caseData.age} • Assigned: {caseData.assignedProfessional} • Last check-in: {caseData.lastCheckIn}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
            aria-label="Close case detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {actionSuccess && (
          <div className="my-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 space-y-6 py-4 pr-1">
          {/* Key Metric Overview Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50">
              <span className="text-[11px] font-bold text-[#547489] uppercase">Current Score</span>
              <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-0.5">
                {caseData.currentScore}
              </div>
              <span className="text-[10px] text-[#234C68] font-medium">
                Baseline: {caseData.previousScore}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50">
              <span className="text-[11px] font-bold text-[#547489] uppercase">Weekly Delta</span>
              <div className="text-2xl font-black text-rose-700 tabular-nums mt-0.5">
                +{caseData.change} pts
              </div>
              <span className="text-[10px] text-rose-600 font-medium">Elevated trajectory</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50">
              <span className="text-[11px] font-bold text-[#547489] uppercase">Consent Status</span>
              <div className="text-xs font-bold text-[#0F3A57] mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0F3A57]" />
                <span>Text & Voice Active</span>
              </div>
              <span className="text-[10px] text-[#547489]">Research opt-out</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50">
              <span className="text-[11px] font-bold text-[#547489] uppercase">Follow-up Status</span>
              <div className="text-xs font-bold text-[#0F3A57] mt-1.5 truncate">
                {caseData.scheduledFollowUp || 'None scheduled'}
              </div>
              <span className="text-[10px] text-[#547489]">Dr. Sarah Jenkins</span>
            </div>
          </div>

          {/* AI Explanation Card (Clinical-Assist Only) */}
          <div className="p-5 rounded-3xl bg-[#EFF9FD] border border-[#B2CBD8]/70 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0F3A57]" />
              <h3 className="text-xs font-bold text-[#0F3A57] uppercase tracking-wider">
                Why this case was prioritized (AI Clinical Explanation)
              </h3>
            </div>
            <p className="text-xs text-[#234C68] leading-relaxed">
              {caseData.aiExplanation}
            </p>
            <div className="text-[11px] text-[#6E8C9F] pt-1">
              AI Decision-Support System • Non-autonomous triage assistive output
            </div>
          </div>

          {/* Explainable Multi-Modal Signals */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F3A57] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0F3A57]" />
              <span>Multi-Modal Risk Signals</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Text Patterns */}
              <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F3A57]">
                  <MessageSquare className="w-3.5 h-3.5 text-[#547489]" />
                  <span>Text Pattern Changes</span>
                </div>
                <ul className="space-y-1 text-xs text-[#547489]">
                  {caseData.signals.textPatterns.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#0F3A57] font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Voice Patterns */}
              <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F3A57]">
                  <Mic className="w-3.5 h-3.5 text-[#547489]" />
                  <span>Voice & Acoustic Changes</span>
                </div>
                <ul className="space-y-1 text-xs text-[#547489]">
                  {caseData.signals.voicePatterns.map((v, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#0F3A57] font-bold">•</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Check-In Responses */}
              <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F3A57]">
                  <Clock className="w-3.5 h-3.5 text-[#547489]" />
                  <span>Check-in Responses & Rhythm</span>
                </div>
                <ul className="space-y-1 text-xs text-[#547489]">
                  {caseData.signals.checkInResponses.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#0F3A57] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Longitudinal Changes */}
              <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F3A57]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#547489]" />
                  <span>Longitudinal Trajectory</span>
                </div>
                <ul className="space-y-1 text-xs text-[#547489]">
                  {caseData.signals.longitudinalChanges.map((l, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#0F3A57] font-bold">•</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Wellbeing Timeline Graph */}
          <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F3A57] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#547489]" />
                <span>Wellbeing Timeline Trajectory</span>
              </h3>
              <div className="flex items-center gap-1 bg-[#EFF9FD] p-1 rounded-xl border border-[#B2CBD8]/40">
                {(['7d', '30d', '90d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimelineRange(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      timelineRange === r
                        ? 'bg-white text-[#0F3A57] shadow-xs'
                        : 'text-[#547489] hover:text-[#0F3A57]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-36 flex items-end justify-between gap-3 border-b border-[#B2CBD8]/50 pb-2">
              {caseData.timeline.map((pt, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (pt.score / 80) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="text-[10px] font-bold text-[#547489] tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {pt.score}
                    </span>
                    <div
                      className="w-full max-w-[28px] bg-[#0F3A57] group-hover:bg-[#234C68] rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-semibold text-[#547489] mt-1">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Observations & Interventions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F3A57] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F3A57]" />
              <span>Professional Assessment & Clinical Notes</span>
            </h3>

            {caseData.clinicalObservations.length > 0 && (
              <div className="space-y-2">
                {caseData.clinicalObservations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#0F3A57] mb-1">
                      <span>{obs.author}</span>
                      <span className="text-[11px] text-[#547489]">{obs.date}</span>
                    </div>
                    <p className="text-[#234C68] leading-relaxed">{obs.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add confidential clinical observation or suggested non-clinical intervention..."
                className="w-full p-3 rounded-2xl bg-white border border-[#B2CBD8] text-xs text-[#0F3A57] focus:border-[#0F3A57] outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save observation</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="pt-4 border-t border-[#B2CBD8]/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#547489]">Priority:</span>
            <select
              value={caseData.priority}
              onChange={(e) =>
                onChangePriority(caseData.id, e.target.value as ProviderCase['priority'])
              }
              className="text-xs font-bold text-[#0F3A57] bg-[#EFF9FD] px-2.5 py-1.5 rounded-xl border border-[#B2CBD8] outline-none"
            >
              <option value="Needs attention">Needs attention</option>
              <option value="Elevated">Elevated</option>
              <option value="High priority">High priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScheduleForm(!showScheduleForm)}
              className="px-4 py-2 rounded-xl border border-[#0F3A57] text-[#0F3A57] text-xs font-bold hover:bg-[#EFF9FD] transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule follow-up</span>
            </button>

            <button
              onClick={handleReviewedClick}
              className="px-5 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark reviewed</span>
            </button>
          </div>
        </div>

        {/* Schedule Follow-up Mini Drawer */}
        {showScheduleForm && (
          <div className="absolute inset-x-6 bottom-16 bg-white rounded-3xl p-5 border border-[#0F3A57] shadow-xl animate-fade-in z-20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0F3A57]">Schedule Supportive Follow-up</h4>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="text-[#547489] hover:text-[#0F3A57]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0F3A57] mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#EFF9FD]/50 border border-[#B2CBD8] outline-none"
                    placeholder="Tomorrow • 4:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F3A57] mb-1">
                    Clinical Objective / Reason
                  </label>
                  <input
                    type="text"
                    value={followUpReason}
                    onChange={(e) => setFollowUpReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#EFF9FD]/50 border border-[#B2CBD8] outline-none"
                    placeholder="Sleep pacing & chemistry study coping"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-3 py-1.5 text-xs text-[#547489]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68]"
                >
                  Confirm follow-up
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
