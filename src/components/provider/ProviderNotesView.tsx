import React, { useState } from 'react';
import { ProviderCase } from '../../types';
import { FileText, Plus, Search, Calendar, User, Check } from 'lucide-react';

interface ProviderNotesViewProps {
  cases: ProviderCase[];
  onAddNote: (caseId: string, noteText: string) => void;
}

export const ProviderNotesView: React.FC<ProviderNotesViewProps> = ({
  cases,
  onAddNote,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'VYRA-0921');
  const [noteContent, setNoteContent] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onAddNote(selectedCaseId, noteContent);
    setNoteContent('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[#0F3A57]">Clinical Notes & Observations</h2>
        <p className="text-xs text-[#547489] mt-0.5">
          Confidential clinician observations, intervention logs, and care coordination entries.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Clinical note saved to patient electronic case history.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Case Selector */}
        <div className="bg-white rounded-3xl p-5 border border-[#B2CBD8]/60 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#547489] uppercase tracking-wider">
            Select Patient Case
          </h3>
          <div className="space-y-2">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all ${
                  selectedCaseId === c.id
                    ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                    : 'bg-[#EFF9FD]/40 text-[#0F3A57] border-[#B2CBD8]/50 hover:bg-[#EFF9FD]'
                }`}
              >
                <div className="text-xs font-bold truncate">
                  {c.patientName} ({c.preferredName})
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedCaseId === c.id ? 'text-[#EFF9FD]/80' : 'text-[#547489]'
                  }`}
                >
                  {c.id} • Score: {c.currentScore}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Notes History & New Note */}
        <div className="md:col-span-2 space-y-4">
          {selectedCase && (
            <div className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#B2CBD8]/40 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F3A57]">
                    {selectedCase.patientName} ({selectedCase.preferredName})
                  </h3>
                  <span className="text-xs text-[#547489]">
                    Case {selectedCase.id} • Assigned to {selectedCase.assignedProfessional}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/50">
                  {selectedCase.priority}
                </span>
              </div>

              {/* Existing Observations */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#547489] uppercase">Logged Observations</h4>
                {selectedCase.clinicalObservations.length === 0 ? (
                  <p className="text-xs text-[#547489] italic">
                    No notes recorded yet for this case.
                  </p>
                ) : (
                  selectedCase.clinicalObservations.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3.5 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#0F3A57]">
                        <span>{obs.author}</span>
                        <span className="text-[10px] text-[#547489]">{obs.date}</span>
                      </div>
                      <p className="text-[#234C68] leading-relaxed">{obs.note}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleSubmit} className="pt-3 border-t border-[#B2CBD8]/40 space-y-3">
                <h4 className="text-xs font-bold text-[#0F3A57]">Add New Observation</h4>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record treatment observation, behavioral changes, or follow-up insights..."
                  required
                  className="w-full p-3 rounded-2xl bg-[#EFF9FD]/30 border border-[#B2CBD8] text-xs text-[#0F3A57] focus:border-[#0F3A57] outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors"
                  >
                    Save to patient chart
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
