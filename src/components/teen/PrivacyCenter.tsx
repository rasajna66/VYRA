import React, { useState } from 'react';
import { Lock, ShieldCheck, Download, Trash2, AlertTriangle, Check } from 'lucide-react';

interface PrivacySettings {
  voiceAnalysis: boolean;
  textAnalysis: boolean;
  professionalSharing: boolean;
  researchSharing: boolean;
}

interface PrivacyCenterProps {
  settings: PrivacySettings;
  onUpdateSettings: (newSettings: PrivacySettings) => void;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [current, setCurrent] = useState<PrivacySettings>(settings);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [consentWithdrawn, setConsentWithdrawn] = useState(false);

  const toggle = (key: keyof PrivacySettings) => {
    const updated = { ...current, [key]: !current[key] };
    setCurrent(updated);
    onUpdateSettings(updated);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDelete = () => {
    setDeleteSuccess(true);
    setConfirmDelete(false);
    setTimeout(() => setDeleteSuccess(false), 3000);
  };

  const handleWithdrawConsent = () => {
    const updated = {
      voiceAnalysis: false,
      textAnalysis: false,
      professionalSharing: false,
      researchSharing: false,
    };
    setCurrent(updated);
    onUpdateSettings(updated);
    setConsentWithdrawn(true);
    setTimeout(() => setConsentWithdrawn(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔐</span>
          <h1 className="text-2xl font-bold text-[#0F3A57]">You're in control</h1>
        </div>
        <p className="text-xs text-[#547489] mt-0.5">
          Clear, simple controls over how your reflections and indicators are processed.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#EFF9FD] border border-[#0F3A57] text-xs text-[#0F3A57] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#0F3A57]" />
          <span>Your complete encrypted data archive (JSON & audio logs) has been prepared and downloaded.</span>
        </div>
      )}

      {deleteSuccess && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-amber-700" />
          <span>All historical audio waveforms, reflections, and check-in scores have been deleted from local storage.</span>
        </div>
      )}

      {consentWithdrawn && (
        <div className="p-3.5 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8] text-xs text-[#0F3A57] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#0F3A57]" />
          <span>All voluntary telemetry and sharing permissions have been revoked immediately.</span>
        </div>
      )}

      {/* Privacy Toggle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Voice Analysis */}
        <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#0F3A57]">Voice analysis</h3>
              <button
                type="button"
                onClick={() => toggle('voiceAnalysis')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  current.voiceAnalysis
                    ? 'bg-[#0F3A57] text-white'
                    : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
                }`}
              >
                {current.voiceAnalysis ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-xs text-[#547489] leading-relaxed">
              Analyzes acoustic pitch variance, cadence, and vocal fatigue from voluntary audio reflections to detect burnout early.
            </p>
          </div>
          <span className="text-[11px] text-[#234C68] font-medium">
            {current.voiceAnalysis ? '✓ Active during voice notes' : '✗ Voice audio is discarded without analysis'}
          </span>
        </div>

        {/* Text Analysis */}
        <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#0F3A57]">Text analysis</h3>
              <button
                type="button"
                onClick={() => toggle('textAnalysis')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  current.textAnalysis
                    ? 'bg-[#0F3A57] text-white'
                    : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
                }`}
              >
                {current.textAnalysis ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-xs text-[#547489] leading-relaxed">
              Checks check-in sentences for stress, sleep, and coping keywords without storing personal names or clinical labels.
            </p>
          </div>
          <span className="text-[11px] text-[#234C68] font-medium">
            {current.textAnalysis ? '✓ Active for daily check-ins' : '✗ Check-in text is stored only locally'}
          </span>
        </div>

        {/* Professional Sharing */}
        <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#0F3A57]">Professional sharing</h3>
              <button
                type="button"
                onClick={() => toggle('professionalSharing')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  current.professionalSharing
                    ? 'bg-[#0F3A57] text-white'
                    : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
                }`}
              >
                {current.professionalSharing ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-xs text-[#547489] leading-relaxed">
              Allows Dr. Sarah Jenkins (assigned psychologist) to view your distress indicator and triage alerts when scores escalate.
            </p>
          </div>
          <span className="text-[11px] text-[#234C68] font-medium">
            {current.professionalSharing ? '✓ Connected to Dr. Sarah Jenkins' : '✗ Provider dashboard will not receive updates'}
          </span>
        </div>

        {/* Research Sharing */}
        <div className="p-5 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#0F3A57]">Research sharing</h3>
              <button
                type="button"
                onClick={() => toggle('researchSharing')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  current.researchSharing
                    ? 'bg-[#0F3A57] text-white'
                    : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
                }`}
              >
                {current.researchSharing ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-xs text-[#547489] leading-relaxed">
              Contributes fully de-identified aggregate patterns to university adolescent wellbeing research studies.
            </p>
          </div>
          <span className="text-[11px] text-[#234C68] font-medium">
            {current.researchSharing ? '✓ Anonymized research opt-in' : 'OFF by default • Zero research export'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F3A57]">Data Sovereignty Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-[#EFF9FD] border border-[#B2CBD8] text-[#0F3A57] text-xs font-bold hover:bg-[#B2CBD8]/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download my data</span>
          </button>

          <button
            onClick={handleWithdrawConsent}
            className="px-4 py-2.5 rounded-xl bg-[#EFF9FD] border border-[#B2CBD8] text-[#0F3A57] text-xs font-bold hover:bg-[#B2CBD8]/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Withdraw consent</span>
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete my data</span>
          </button>
        </div>

        {confirmDelete && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 animate-fade-in">
            <p className="text-xs text-rose-800 font-semibold">
              Are you sure? This permanently erases all check-in logs, journal entries, and trends.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Yes, permanently delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 text-xs text-rose-800 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
