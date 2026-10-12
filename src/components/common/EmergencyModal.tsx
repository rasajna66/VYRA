import React, { useState } from 'react';
import { Phone, ShieldAlert, HeartHandshake, X, Check, MessageSquare } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustedPersonName: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  trustedPersonName,
}) => {
  const [trustedPingSent, setTrustedPingSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#B2CBD8]/40 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
          aria-label="Close emergency support"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
            <ShieldAlert className="w-6 h-6 text-[#0F3A57]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F3A57]">Need immediate help?</h2>
            <p className="text-sm text-[#547489]">Connect with confidential emergency or crisis support.</p>
          </div>
        </div>

        <div className="bg-[#EFF9FD] border border-[#B2CBD8]/50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-[#0F3A57] leading-relaxed">
            You don't have to carry heavy moments on your own. Free, private support is available right now 24/7.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {/* Urgent Crisis Lines */}
          <div className="p-4 rounded-2xl border border-[#B2CBD8]/50 hover:border-[#547489] transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[#0F3A57] flex items-center gap-2">
                <span>988 Suicide & Crisis Lifeline</span>
                <span className="text-xs text-[#234C68] font-medium bg-[#EFF9FD] px-2 py-0.5 rounded-md">24/7 • Free</span>
              </div>
              <p className="text-xs text-[#547489] mt-0.5">Call or text anytime from any phone.</p>
            </div>
            <a
              href="tel:988"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-semibold hover:bg-[#234C68] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" /> Call 988
            </a>
          </div>

          <div className="p-4 rounded-2xl border border-[#B2CBD8]/50 hover:border-[#547489] transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[#0F3A57] flex items-center gap-2">
                <span>Crisis Text Line</span>
                <span className="text-xs text-[#234C68] font-medium bg-[#EFF9FD] px-2 py-0.5 rounded-md">Text HOME to 741741</span>
              </div>
              <p className="text-xs text-[#547489] mt-0.5">Free, 24/7 crisis support via confidential text message.</p>
            </div>
            <a
              href="sms:741741"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#234C68] text-white text-xs font-semibold hover:bg-[#0F3A57] transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Text 741741
            </a>
          </div>

          {/* Contact Trusted Person */}
          <div className="p-4 rounded-2xl border border-[#B2CBD8]/50 hover:border-[#547489] transition-all bg-[#EFF9FD]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[#0F3A57] flex items-center gap-2">
                <span>Contact {trustedPersonName}</span>
                <span className="text-xs text-[#547489]">Your Trusted Person</span>
              </div>
              <p className="text-xs text-[#547489] mt-0.5">Sends a gentle notification letting them know you want to talk.</p>
            </div>
            <button
              onClick={() => setTrustedPingSent(true)}
              disabled={trustedPingSent}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                trustedPingSent
                  ? 'bg-[#547489] text-white'
                  : 'bg-white border border-[#234C68] text-[#0F3A57] hover:bg-[#B2CBD8]/30'
              }`}
            >
              {trustedPingSent ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Message Sent
                </>
              ) : (
                <>
                  <HeartHandshake className="w-3.5 h-3.5" /> Reach Out
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-[#B2CBD8]/30">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#547489] hover:text-[#0F3A57] transition-colors"
          >
            I'm safe right now, close this
          </button>
        </div>
      </div>
    </div>
  );
};
