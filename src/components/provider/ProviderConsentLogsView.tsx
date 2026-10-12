import React from 'react';
import { ProviderCase } from '../../types';
import { ShieldCheck, Lock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ProviderConsentLogsViewProps {
  cases: ProviderCase[];
}

export const ProviderConsentLogsView: React.FC<ProviderConsentLogsViewProps> = ({ cases }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[#0F3A57]">Patient Consent & Privacy Governance</h2>
        <p className="text-xs text-[#547489] mt-0.5">
          Real-time compliance audit trail of active student permissions, revocations, and data boundaries.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8]/60 flex items-center gap-2.5 text-xs text-[#0F3A57]">
        <ShieldCheck className="w-4 h-4 text-[#0F3A57] shrink-0" />
        <span>
          Clinicians may only review multi-modal signals (voice/text) for patients with explicit active consent. Any student may withdraw consent in real-time from their youth profile.
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-[#B2CBD8]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#EFF9FD] text-[#0F3A57] font-bold border-b border-[#B2CBD8]/50">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Case ID</th>
                <th className="p-4">Text Analysis</th>
                <th className="p-4">Voice Telemetry</th>
                <th className="p-4">Clinician Sharing</th>
                <th className="p-4">Research Cohort</th>
                <th className="p-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B2CBD8]/30">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-[#EFF9FD]/30 transition-colors">
                  <td className="p-4 font-bold text-[#0F3A57]">{c.patientName}</td>
                  <td className="p-4 font-mono text-[#547489]">{c.id}</td>
                  <td className="p-4">
                    {c.consent.textAnalysis ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Consented
                      </span>
                    ) : (
                      <span className="text-[#547489] flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Opted Out
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {c.consent.voiceAnalysis ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Consented
                      </span>
                    ) : (
                      <span className="text-[#547489] flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Opted Out
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {c.consent.professionalSharing ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
                      </span>
                    ) : (
                      <span className="text-rose-700 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Withdrawn
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {c.consent.researchSharing ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Opt-In
                      </span>
                    ) : (
                      <span className="text-[#547489]">Standard Off</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="bg-[#EFF9FD] text-[#0F3A57] px-2.5 py-0.5 rounded-md font-medium text-[11px] border border-[#B2CBD8]/50">
                      Verified Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
