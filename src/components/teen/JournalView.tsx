import React, { useState } from 'react';
import { JournalEntry, MoodType } from '../../types';
import { MOOD_OPTIONS } from '../../data/mockData';
import {
  BookOpen,
  Lock,
  Plus,
  Mic,
  MicOff,
  Check,
  Calendar,
  ShieldCheck,
  Search,
  Sparkles,
  Download,
  FileText,
  FileCode,
} from 'lucide-react';
import { JournalExportModal } from './JournalExportModal';
import { exportToPdf, exportToTextFile } from '../../utils/journalExporter';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, onAddEntry }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    'What has been on your mind today?'
  );
  const [entryText, setEntryText] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('meh');
  const [shareWithPro, setShareWithPro] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const promptOptions = [
    'What has been on your mind today?',
    'What made today a little easier?',
    'What is something you wish someone understood?',
    'What is one tiny win you can celebrate?',
  ];

  const handleSimulateVoiceToText = () => {
    if (!isDictating) {
      setIsDictating(true);
      setTimeout(() => {
        setEntryText(
          (prev) =>
            prev +
            (prev ? ' ' : '') +
            'I tried taking a ten minute walk outside after school. Even though I felt weighed down by assignments, the fresh air helped clear my thoughts.'
        );
        setIsDictating(false);
      }, 1500);
    } else {
      setIsDictating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;

    onAddEntry({
      title: selectedPrompt,
      content: entryText,
      mood: selectedMood,
      date: 'Just now',
      isPrivate: !shareWithPro,
      sharedWithProfessional: shareWithPro,
    });

    setSavedFeedback('✨ Reflection gently saved! "Ink & Calm" milestone badge honored on your profile.');
    setTimeout(() => setSavedFeedback(null), 6000);
    setEntryText('');
    setIsWriting(false);
  };

  const handleExportSingleEntry = (entry: JournalEntry, format: 'pdf' | 'txt') => {
    const safeTitle = (entry.title || 'reflection')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const filenamePrefix = `vyra-${safeTitle}`;

    if (format === 'pdf') {
      exportToPdf([entry], filenamePrefix, {
        title: entry.title || 'Personal Journal Reflection',
        authorName: 'Ram Sharma',
      });
    } else {
      exportToTextFile([entry], filenamePrefix, {
        title: entry.title || 'Personal Journal Reflection',
        authorName: 'Ram Sharma',
      });
    }

    setSavedFeedback(
      `📥 Saved "${entry.title || 'Reflection'}" as .${format.toUpperCase()} to your downloads.`
    );
    setTimeout(() => setSavedFeedback(null), 4000);
  };

  const filteredEntries = entries.filter((e) =>
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Header & Privacy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <h1 className="text-2xl font-bold text-[#0F3A57]">My Journal</h1>
          </div>
          <p className="text-xs text-[#547489] mt-0.5">
            Your private space for uncensored thoughts and personal reflections.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#102436] border border-[#B2CBD8] dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] text-xs font-bold hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-all flex items-center gap-2 shadow-xs active:scale-95"
            title="Export entries as PDF or text file"
          >
            <Download className="w-4 h-4 text-[#547489] dark:text-[#8DAEC2]" />
            <span>Export records</span>
          </button>

          <button
            onClick={() => setIsWriting(!isWriting)}
            className="px-4 py-2.5 rounded-2xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-2 shadow-xs active:scale-95"
          >
            {isWriting ? 'Close editor' : (
              <>
                <Plus className="w-4 h-4" /> New reflection
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Milestone Feedback / Export Alert */}
      {savedFeedback && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-300 shadow-xs flex items-center justify-between text-xs text-[#0F3A57] font-bold animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span>{savedFeedback}</span>
          </div>
          <button
            onClick={() => setSavedFeedback(null)}
            className="text-xs text-[#547489] hover:text-[#0F3A57]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Transparent Privacy Banner */}
      <div className="p-4 rounded-2xl bg-white border border-[#B2CBD8]/60 shadow-xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57] shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#234C68] leading-relaxed">
          <span className="font-bold text-[#0F3A57] block mb-0.5">
            100% Private by Default & Exportable
          </span>
          Journal entries are never analyzed by AI and are never shared with anyone unless you explicitly check the box to share with your connected counsellor. You can safely export them as PDF or TXT anytime for your own records.
        </div>
      </div>

      {/* Writing Box */}
      {isWriting && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 border border-[#B2CBD8]/70 shadow-md space-y-4 animate-fade-in"
        >
          <div>
            <label className="block text-xs font-bold text-[#0F3A57] mb-2">
              Choose a prompt or write freely:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {promptOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPrompt(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedPrompt === p
                      ? 'bg-[#0F3A57] text-white shadow-xs'
                      : 'bg-[#EFF9FD] text-[#0F3A57] hover:bg-[#B2CBD8]/40 border border-[#B2CBD8]/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows={5}
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Start typing your thoughts here..."
              required
              className="w-full p-4 rounded-2xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] focus:border-[#0F3A57] outline-none leading-relaxed"
            />
          </div>

          {/* Mood Selection & Voice to text */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#547489]">Mood tag:</span>
              <div className="flex gap-1.5">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${
                      selectedMood === m.id
                        ? 'bg-[#0F3A57] text-white shadow-xs scale-105'
                        : 'bg-[#EFF9FD] hover:bg-[#B2CBD8]/40 border border-[#B2CBD8]/40'
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateVoiceToText}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto ${
                isDictating
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                  : 'bg-[#EFF9FD] text-[#0F3A57] hover:bg-[#B2CBD8]/40 border border-[#B2CBD8]/50'
              }`}
            >
              {isDictating ? (
                <>
                  <Mic className="w-3.5 h-3.5" /> Listening & Transcribing...
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#547489]" /> Voice-to-Text
                </>
              )}
            </button>
          </div>

          {/* Explicit Share Toggle */}
          <div className="pt-2 border-t border-[#B2CBD8]/30">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#547489]">
              <input
                type="checkbox"
                checked={shareWithPro}
                onChange={(e) => setShareWithPro(e.target.checked)}
                className="w-4 h-4 rounded text-[#0F3A57] focus:ring-[#0F3A57] border-[#B2CBD8] mt-0.5"
              />
              <span>
                Share this entry with Dr. Sarah Jenkins (Default is OFF / strictly private)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-xs font-semibold text-[#547489] hover:text-[#0F3A57]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all shadow-xs"
            >
              Save entry
            </button>
          </div>
        </form>
      )}

      {/* History Search & List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#0F3A57]">Previous Entries</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFF9FD] text-[#547489] font-medium border border-[#B2CBD8]/40">
              {entries.length} reflections
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#547489] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#B2CBD8]/60 text-xs text-[#0F3A57] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0A1722] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#1C3549] transition-colors flex items-center gap-1.5 shrink-0"
              title="Export all or filtered entries as PDF/TXT"
            >
              <Download className="w-3.5 h-3.5 text-[#547489] dark:text-[#8DAEC2]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#B2CBD8]/50 text-xs text-[#547489]">
            No reflections found. Start with a fresh prompt above!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="group p-5 rounded-3xl bg-white border border-[#B2CBD8]/50 hover:border-[#547489] transition-all shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {entry.mood === 'great'
                        ? '😊'
                        : entry.mood === 'good'
                        ? '🙂'
                        : entry.mood === 'meh'
                        ? '😐'
                        : entry.mood === 'low'
                        ? '😕'
                        : '😔'}
                    </span>
                    <h3 className="text-xs font-bold text-[#0F3A57]">
                      {entry.title || 'Private Reflection'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#547489]">{entry.date}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        entry.sharedWithProfessional
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/40'
                      }`}
                    >
                      {entry.sharedWithProfessional ? 'Shared with Dr. Sarah' : 'Private'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#234C68] leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>

                {/* Individual Entry Export Actions */}
                <div className="pt-2 border-t border-[#B2CBD8]/20 dark:border-[#1E3A52]/50 flex items-center justify-between text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#93A8B4] dark:text-[#547489]" />
                    <span>Personal Record</span>
                  </span>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[#547489] dark:text-[#8DAEC2] mr-1 hidden sm:inline">
                      Export this entry:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExportSingleEntry(entry, 'pdf')}
                      className="px-2 py-1 rounded-lg bg-[#EFF9FD] dark:bg-[#1C3549] hover:bg-[#B2CBD8]/50 dark:hover:bg-[#234C68] text-[#0F3A57] dark:text-[#F0F7FB] text-[10px] font-bold border border-[#B2CBD8]/40 dark:border-[#1E3A52] flex items-center gap-1 transition-all active:scale-95"
                      title="Download this entry as PDF"
                    >
                      <FileText className="w-3 h-3 text-[#547489] dark:text-[#8DAEC2]" />
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportSingleEntry(entry, 'txt')}
                      className="px-2 py-1 rounded-lg bg-[#EFF9FD] dark:bg-[#1C3549] hover:bg-[#B2CBD8]/50 dark:hover:bg-[#234C68] text-[#0F3A57] dark:text-[#F0F7FB] text-[10px] font-bold border border-[#B2CBD8]/40 dark:border-[#1E3A52] flex items-center gap-1 transition-all active:scale-95"
                      title="Download this entry as Plain Text (.txt)"
                    >
                      <FileCode className="w-3 h-3 text-[#547489] dark:text-[#8DAEC2]" />
                      TXT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Modal */}
      <JournalExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        entries={entries}
        filteredEntries={filteredEntries}
        searchQuery={searchQuery}
      />
    </div>
  );
};
