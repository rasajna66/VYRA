import { jsPDF } from 'jspdf';
import { JournalEntry, MoodType } from '../types';

export interface ExportOptions {
  includeMood?: boolean;
  includePrivacyStatus?: boolean;
  includeDates?: boolean;
  title?: string;
  authorName?: string;
}

const MOOD_LABELS: Record<MoodType, { label: string; emoji: string }> = {
  great: { label: 'Great & Uplifted', emoji: '😊' },
  good: { label: 'Good & Calm', emoji: '🙂' },
  meh: { label: 'Neutral & Balanced', emoji: '😐' },
  low: { label: 'Low & Exhausted', emoji: '😕' },
  struggling: { label: 'Struggling & Overwhelmed', emoji: '😔' },
};

/**
 * Format entries into clean, structured UTF-8 Plain Text
 */
export function generateJournalText(
  entries: JournalEntry[],
  options: ExportOptions = {}
): string {
  const {
    includeMood = true,
    includePrivacyStatus = true,
    includeDates = true,
    title = 'VYRA Wellbeing Journal - Personal Record',
    authorName = 'Personal Reflection Archive',
  } = options;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const divider = '='.repeat(78);
  const subDivider = '-'.repeat(78);

  const lines: string[] = [];

  lines.push(divider);
  lines.push(`VYRA • ${title.toUpperCase()}`);
  lines.push(`Author: ${authorName}`);
  lines.push(`Exported on: ${dateFormatted} at ${timeFormatted}`);
  lines.push(`Total Entries: ${entries.length}`);
  lines.push(
    'Privacy Notice: Personal wellbeing record. All entries were authored by the user.'
  );
  lines.push(divider);
  lines.push('');

  if (entries.length === 0) {
    lines.push('No entries found to export.');
    lines.push('');
  } else {
    entries.forEach((entry, idx) => {
      lines.push(`[ENTRY ${idx + 1} OF ${entries.length}]`);
      if (entry.title) {
        lines.push(`Prompt / Title: ${entry.title}`);
      }
      if (includeDates) {
        lines.push(`Date: ${entry.date}`);
      }
      if (includeMood) {
        const moodInfo = MOOD_LABELS[entry.mood] || {
          label: entry.mood,
          emoji: '•',
        };
        lines.push(`Mood: ${moodInfo.emoji} ${moodInfo.label}`);
      }
      if (includePrivacyStatus) {
        const statusText = entry.sharedWithProfessional
          ? 'Shared with Care Team (Dr. Sarah Jenkins)'
          : 'Strictly Private (Personal only)';
        lines.push(`Privacy: ${statusText}`);
      }
      lines.push(subDivider);
      lines.push(entry.content);
      lines.push('');
      lines.push(divider);
      lines.push('');
    });
  }

  lines.push('--- End of VYRA Journal Export ---');
  lines.push('Keep this file in a safe, private place on your device.');
  lines.push('For support or crisis resources, visit VYRA Safety Center.');

  return lines.join('\n');
}

/**
 * Triggers a download of entries as a .txt file
 */
export function exportToTextFile(
  entries: JournalEntry[],
  filenamePrefix = 'vyra-journal-export',
  options: ExportOptions = {}
): void {
  const content = generateJournalText(entries, options);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `${filenamePrefix}-${dateStr}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a formatted PDF document using jsPDF
 */
export function exportToPdf(
  entries: JournalEntry[],
  filenamePrefix = 'vyra-journal-export',
  options: ExportOptions = {}
): void {
  const {
    includeMood = true,
    includePrivacyStatus = true,
    includeDates = true,
    title = 'VYRA Journal - Personal Wellbeing Record',
    authorName = 'Personal Reflection Archive',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeader = (isFirstPage: boolean) => {
    // Header Bar
    doc.setFillColor(15, 58, 87); // #0F3A57 (VYRA Dark Navy)
    doc.rect(0, 0, pageWidth, isFirstPage ? 65 : 40, 'F');

    // Accent line
    doc.setFillColor(178, 203, 216); // #B2CBD8
    doc.rect(0, isFirstPage ? 65 : 40, pageWidth, 3, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isFirstPage ? 16 : 11);
    doc.text('VYRA', margin, isFirstPage ? 32 : 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isFirstPage ? 9 : 8);
    doc.setTextColor(210, 230, 240);
    const subheader = isFirstPage
      ? 'Youth Wellbeing & Connected Care • Private Reflections'
      : 'Personal Wellbeing Journal Export';
    doc.text(subheader, margin + (isFirstPage ? 55 : 40), isFirstPage ? 32 : 25);

    if (isFirstPage) {
      doc.setFontSize(8);
      doc.setTextColor(178, 203, 216);
      doc.text(
        `Generated: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}`,
        margin,
        50
      );
    }
  };

  const addFooter = (currentPage: number, totalPages: number) => {
    doc.setDrawColor(210, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 140, 159); // #6E8C9F
    doc.text(
      'Confidential personal wellbeing record • Created via VYRA Wellbeing Platform',
      margin,
      pageHeight - 18
    );
    doc.text(
      `Page ${currentPage} of ${totalPages}`,
      pageWidth - margin - 50,
      pageHeight - 18
    );
  };

  // First page banner
  addHeader(true);
  y = 85;

  // Metadata block
  doc.setFillColor(239, 249, 253); // #EFF9FD
  doc.roundedRect(margin, y, contentWidth, 54, 6, 6, 'F');
  doc.setDrawColor(178, 203, 216);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, 54, 6, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 58, 87);
  doc.text(title, margin + 12, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(84, 116, 137);
  doc.text(`Record for: ${authorName}`, margin + 12, y + 33);
  doc.text(
    `Total Entries: ${entries.length}   |   Privacy: 100% Encrypted & Local Export`,
    margin + 12,
    y + 46
  );

  y += 70;

  if (entries.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(84, 116, 137);
    doc.text('No journal entries currently recorded.', margin, y + 20);
  } else {
    entries.forEach((entry, index) => {
      const moodInfo = MOOD_LABELS[entry.mood] || {
        label: entry.mood,
        emoji: '',
      };
      const moodText = moodInfo.label;
      const privacyText = entry.sharedWithProfessional
        ? 'Shared with Dr. Sarah Jenkins'
        : 'Private Reflection';

      // Calculate height needed for content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const splitContent = doc.splitTextToSize(entry.content, contentWidth - 24);
      const contentHeight = splitContent.length * 13;

      // Base card height: header (38) + content height + padding (24)
      const cardHeight = 44 + contentHeight + 16;

      // Check if card fits on current page (leave room for footer)
      if (y + cardHeight > pageHeight - 45) {
        doc.addPage();
        addHeader(false);
        y = 55;
      }

      // Draw Entry Container Card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(178, 203, 216);
      doc.setLineWidth(0.75);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 6, 6, 'FD');

      // Top Header inside card
      doc.setFillColor(245, 250, 253);
      doc.rect(margin + 0.5, y + 0.5, contentWidth - 1, 26, 'F');
      doc.setDrawColor(220, 235, 245);
      doc.line(margin, y + 26, margin + contentWidth, y + 26);

      // Entry Index / Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 58, 87);
      const entryTitle = entry.title || `Journal Entry #${index + 1}`;
      const truncatedTitle =
        entryTitle.length > 55 ? entryTitle.slice(0, 52) + '...' : entryTitle;
      doc.text(truncatedTitle, margin + 12, y + 17);

      // Date on right of header
      if (includeDates) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(110, 140, 159);
        const dateWidth = doc.getTextWidth(entry.date);
        doc.text(entry.date, margin + contentWidth - 12 - dateWidth, y + 17);
      }

      // Metadata line (Mood & Sharing Status)
      let metaY = y + 38;
      if (includeMood || includePrivacyStatus) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        if (includeMood) {
          doc.setTextColor(35, 76, 104);
          doc.setFont('helvetica', 'bold');
          doc.text(`Mood: `, margin + 12, metaY);
          const moodPrefixWidth = doc.getTextWidth('Mood: ');
          doc.setFont('helvetica', 'normal');
          doc.text(moodText, margin + 12 + moodPrefixWidth, metaY);
        }

        if (includePrivacyStatus) {
          const statusX = margin + (includeMood ? 180 : 12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(
            entry.sharedWithProfessional ? 180 : 35,
            entry.sharedWithProfessional ? 100 : 76,
            entry.sharedWithProfessional ? 20 : 104
          );
          doc.text(`Status: `, statusX, metaY);
          const statusPrefixWidth = doc.getTextWidth('Status: ');
          doc.setFont('helvetica', 'normal');
          doc.text(privacyText, statusX + statusPrefixWidth, metaY);
        }

        metaY += 12;
      }

      // Entry Content
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(35, 76, 104); // #234C68
      doc.text(splitContent, margin + 12, metaY + 6);

      y += cardHeight + 14;
    });
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save PDF file
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`${filenamePrefix}-${dateStr}.pdf`);
}
