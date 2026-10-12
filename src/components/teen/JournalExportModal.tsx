import React, { useState, useMemo } from 'react';
import { JournalEntry, MoodType } from '../../types';
import {
  FileText,
  Download,
  X,
  Check,
  FileCode,
  ShieldCheck,
  Sliders,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  exportToPdf,
  exportToTextFile,
  generateJournalText,
  ExportOptions,
} from '../../utils/journalExporter';

interface JournalExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  filteredEntries: JournalEntry[];
  searchQuery: string;
}

export const JournalExportModal: React.FC<JournalExportModalProps> = ({
  isOpen,
  onClose,
  entries,
  filteredEntries,
  searchQuery,
}) => {
  const [format, setFormat] = useState<'pdf' | 'txt'>('pdf');
  const [scope, setScope] = useState<'all' | 'filtered' | 'private' | 'shared'>('all');
  const [includeMood, setIncludeMood] = useState(true);
  const [includePrivacyStatus, setIncludePrivacyStatus] = useState(true);
  const [includeDates, setIncludeDates] = useState(true);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle');

  // Filter entries according to chosen scope
  const targetEntries = useMemo(() => {
    switch (scope) {
      case 'filtered':
        return filteredEntries;
      case 'private':
        return entries.filter((e) => !e.sharedWithProfessional);
      case 'shared':
        return entries.filter((e) => e.sharedWithProfessional);
      case 'all':
      default:
        return entries;
    }
  }, [scope, entries, filteredEntries]);

  // Total word count estimate
  const totalWords = useMemo(() => {
    return targetEntries.reduce((acc, curr) => {
      const words = curr.content.trim().split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
  }, [targetEntries]);

  const exportOptions: ExportOptions = {
    includeMood,
    includePrivacyStatus,
    includeDates,
    title: 'VYRA Wellbeing Reflections',
    authorName: 'Ram Sharma (Personal Archive)',
  };

  // Preview snippet
  const previewText = useMemo(() => {
    return generateJournalText(targetEntries.slice(0, 2), exportOptions);
  }, [targetEntries, exportOptions]);

  const handleExport = (overrideFormat?: 'pdf' | 'txt') => {
    const selectedFormat = overrideFormat || format;
    const prefix = `vyra-reflections-${scope}`;

    if (selectedFormat === 'pdf') {
      exportToPdf(targetEntries, prefix, exportOptions);
    } else {
      exportToTextFile(targetEntries, prefix, exportOptions);
    }

    setExportStatus('success');
    setTimeout(() => {
      setExportStatus('idle');
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl w-full max-w-xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#EFF9FD] via-white to-[#EFF9FD] dark:from-[#0D1E2D] dark:via-[#132A3E] dark:to-[#0D1E2D] border-b border-[#B2CBD8]/40 dark:border-[#1E3A52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F3A57] text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                Export Journal Entries
              </h2>
              <p className="text-xs text-[#547489] dark:text-[#8DAEC2]">
                Download your personal reflections as a PDF or text file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#547489] hover:text-[#0F3A57] dark:text-[#8DAEC2] dark:hover:text-white hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-colors"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Privacy Reassurance */}
          <div className="p-3.5 rounded-2xl bg-[#EFF9FD] dark:bg-[#122538] border border-[#B2CBD8]/50 dark:border-[#1E3A52] flex items-center gap-3 text-xs text-[#234C68] dark:text-[#B4D5E8]">
            <ShieldCheck className="w-4 h-4 text-[#0F3A57] dark:text-[#8EAEC2] shrink-0" />
            <span>
              <strong>Private & Local:</strong> Your export file is generated directly inside your browser. No files are transmitted or stored on external servers.
            </span>
          </div>

          {/* Success Banner */}
          {exportStatus === 'success' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Export downloaded successfully! Check your device's download folder.
              </span>
            </div>
          )}

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] mb-2">
              Choose Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  format === 'pdf'
                    ? 'border-[#0F3A57] bg-[#0F3A57]/5 dark:bg-[#163650] dark:border-[#547489] shadow-xs'
                    : 'border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD]/50 dark:hover:bg-[#122538]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    format === 'pdf'
                      ? 'bg-[#0F3A57] text-white'
                      : 'bg-[#EFF9FD] dark:bg-[#1C3549] text-[#0F3A57] dark:text-[#8DAEC2]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-1.5">
                    PDF Document (.pdf)
                    {format === 'pdf' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] mt-0.5 leading-snug">
                    Clean, styled layout with VYRA header, mood badges & page numbering.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  format === 'txt'
                    ? 'border-[#0F3A57] bg-[#0F3A57]/5 dark:bg-[#163650] dark:border-[#547489] shadow-xs'
                    : 'border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD]/50 dark:hover:bg-[#122538]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    format === 'txt'
                      ? 'bg-[#0F3A57] text-white'
                      : 'bg-[#EFF9FD] dark:bg-[#1C3549] text-[#0F3A57] dark:text-[#8DAEC2]'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-1.5">
                    Plain Text (.txt)
                    {format === 'txt' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] mt-0.5 leading-snug">
                    Lightweight, universal plain text with unicode emojis and clear sections.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] mb-2">
              Entries to Include
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  scope === 'all'
                    ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                    : 'bg-white dark:bg-[#0A1722] text-[#0F3A57] dark:text-[#F0F7FB] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549]'
                }`}
              >
                All Entries ({entries.length})
              </button>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setScope('filtered')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    scope === 'filtered'
                      ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                      : 'bg-white dark:bg-[#0A1722] text-[#0F3A57] dark:text-[#F0F7FB] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549]'
                  }`}
                >
                  Searched ({filteredEntries.length})
                </button>
              )}

              <button
                type="button"
                onClick={() => setScope('private')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  scope === 'private'
                    ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                    : 'bg-white dark:bg-[#0A1722] text-[#0F3A57] dark:text-[#F0F7FB] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549]'
                }`}
              >
                Only Private ({entries.filter((e) => !e.sharedWithProfessional).length})
              </button>

              <button
                type="button"
                onClick={() => setScope('shared')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  scope === 'shared'
                    ? 'bg-[#0F3A57] text-white border-[#0F3A57] shadow-xs'
                    : 'bg-white dark:bg-[#0A1722] text-[#0F3A57] dark:text-[#F0F7FB] border-[#B2CBD8]/60 dark:border-[#1E3A52] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549]'
                }`}
              >
                Only Shared ({entries.filter((e) => e.sharedWithProfessional).length})
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div>
            <label className="block text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] mb-2">
              Metadata & Details
            </label>
            <div className="p-3 rounded-2xl bg-[#EFF9FD]/40 dark:bg-[#0A1722] border border-[#B2CBD8]/40 dark:border-[#1E3A52] space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-[#234C68] dark:text-[#B4D5E8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMood}
                  onChange={(e) => setIncludeMood(e.target.checked)}
                  className="rounded text-[#0F3A57] focus:ring-[#0F3A57] w-3.5 h-3.5"
                />
                <span>Include Mood tags & emotional states</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#234C68] dark:text-[#B4D5E8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDates}
                  onChange={(e) => setIncludeDates(e.target.checked)}
                  className="rounded text-[#0F3A57] focus:ring-[#0F3A57] w-3.5 h-3.5"
                />
                <span>Include entry timestamps & dates</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#234C68] dark:text-[#B4D5E8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrivacyStatus}
                  onChange={(e) => setIncludePrivacyStatus(e.target.checked)}
                  className="rounded text-[#0F3A57] focus:ring-[#0F3A57] w-3.5 h-3.5"
                />
                <span>Include privacy & counsellor sharing status</span>
              </label>
            </div>
          </div>

          {/* Quick Summary stats */}
          <div className="flex items-center justify-between text-xs text-[#547489] dark:text-[#8DAEC2] px-1">
            <span>
              Target: <strong className="text-[#0F3A57] dark:text-white">{targetEntries.length} entries</strong>
            </span>
            <span>
              Approx. <strong className="text-[#0F3A57] dark:text-white">{totalWords} words</strong>
            </span>
          </div>

          {/* Live Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#547489]" /> Preview (first 2 entries)
              </span>
              <span className="text-[10px] text-[#547489] dark:text-[#8DAEC2]">
                Format: {format.toUpperCase()}
              </span>
            </div>
            <pre className="p-3.5 rounded-2xl bg-[#08121A] text-slate-300 font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto border border-[#1E3A52] whitespace-pre-wrap selection:bg-[#547489]">
              {previewText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0D1E2D] border-t border-[#B2CBD8]/40 dark:border-[#1E3A52] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57] dark:text-[#8DAEC2] dark:hover:text-white transition-colors text-center"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick action for alternative format */}
            <button
              type="button"
              onClick={() => handleExport(format === 'pdf' ? 'txt' : 'pdf')}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-[#B2CBD8] dark:border-[#1E3A52] text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-all flex items-center justify-center gap-1.5"
              title={`Quick export as ${format === 'pdf' ? 'Text (.txt)' : 'PDF (.pdf)'}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as {format === 'pdf' ? '.TXT' : '.PDF'}</span>
            </button>

            {/* Primary Download button */}
            <button
              type="button"
              onClick={() => handleExport()}
              disabled={targetEntries.length === 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#0F3A57] hover:bg-[#234C68] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download {format.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
