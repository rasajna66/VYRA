import React, { useState } from 'react';
import { FollowUpTask } from '../../types';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Check } from 'lucide-react';

interface FollowUpsViewProps {
  followUps: FollowUpTask[];
  onCompleteFollowUp: (id: string) => void;
  onAddFollowUp: (task: Omit<FollowUpTask, 'id'>) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  onCompleteFollowUp,
  onAddFollowUp,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Due today' | 'Upcoming' | 'Overdue' | 'Completed'>(
    'All'
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('Ram Sharma');
  const [caseId, setCaseId] = useState('VYRA-0921');
  const [reason, setReason] = useState('Check on post-exam recovery and sleep pacing');
  const [dueDate, setDueDate] = useState('Tomorrow • 3:30 PM');
  const [assignedProfessional, setAssignedProfessional] = useState('Dr. Sarah Jenkins');

  const filtered = followUps.filter((f) => activeTab === 'All' || f.status === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFollowUp({
      caseId,
      patientName,
      reason,
      dueDate,
      status: 'Upcoming',
      assignedProfessional,
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F3A57]">Follow-up Management</h2>
          <p className="text-xs text-[#547489] mt-0.5">
            Track scheduled clinician reviews, check-ins, and proactive wellness touchpoints.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-2xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule follow-up</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#B2CBD8]/40 pb-3">
        {(['All', 'Due today', 'Upcoming', 'Overdue', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#0F3A57] text-white shadow-xs'
                : 'bg-[#EFF9FD] text-[#547489] hover:text-[#0F3A57] border border-[#B2CBD8]/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 border border-[#0F3A57] shadow-lg space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-[#0F3A57]">Schedule New Clinical Follow-up</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] mb-1">
                Patient Name & ID
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] mb-1">
                Due Date & Time
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F3A57] mb-1">
              Clinical Objective / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-[#547489]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68]"
            >
              Save follow-up
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#547489] transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F3A57]">{item.patientName}</h3>
                <span className="text-[11px] font-mono text-[#547489] bg-[#EFF9FD] px-2 py-0.5 rounded-md">
                  {item.caseId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Overdue'
                      ? 'bg-rose-100 text-rose-800'
                      : item.status === 'Due today'
                      ? 'bg-amber-100 text-amber-800'
                      : item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#EFF9FD] text-[#0F3A57]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#234C68]">{item.reason}</p>
              <div className="text-[11px] text-[#547489] flex items-center gap-3 pt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.dueDate}
                </span>
                <span>• Assigned to {item.assignedProfessional}</span>
              </div>
            </div>

            <div>
              {item.status !== 'Completed' ? (
                <button
                  onClick={() => onCompleteFollowUp(item.id)}
                  className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Complete follow-up</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
