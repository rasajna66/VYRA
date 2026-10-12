import React, { useState } from 'react';
import { INITIAL_SUPPORT_CIRCLE } from '../../data/mockData';
import {
  Heart,
  MessageSquare,
  PhoneCall,
  Info,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export const SupportCircleView: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<typeof INITIAL_SUPPORT_CIRCLE[0] | null>(null);
  const [messageSentTo, setMessageSentTo] = useState<string | null>(null);
  const [callRequestedFor, setCallRequestedFor] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    setMessageSentTo(selectedContact.name);
    setTimeout(() => {
      setSelectedContact(null);
      setDraftMessage('');
    }, 1500);
  };

  const handleRequestCall = (name: string) => {
    setCallRequestedFor(name);
    setTimeout(() => {
      setCallRequestedFor(null);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🤝</span>
          <h1 className="text-2xl font-bold text-[#0F3A57]">My Support Circle</h1>
        </div>
        <p className="text-xs text-[#547489] mt-0.5">
          Your trusted network of licensed professionals, school counsellors, and designated allies.
        </p>
      </div>

      {callRequestedFor && (
        <div className="p-4 rounded-2xl bg-[#EFF9FD] border border-[#B2CBD8] text-xs text-[#0F3A57] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#0F3A57]" />
          <span>
            Call request sent to <strong>{callRequestedFor}</strong>. They will reach out via your preferred secure channel.
          </span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_SUPPORT_CIRCLE.map((contact) => (
          <div
            key={contact.id}
            className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/50 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#547489] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{contact.avatar}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#547489] bg-[#EFF9FD] px-2 py-0.5 rounded-md border border-[#B2CBD8]/40">
                      {contact.role}
                    </span>
                    <h3 className="text-base font-bold text-[#0F3A57] mt-1">{contact.name}</h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#547489]">{contact.title}</p>
              <p className="text-xs text-[#6E8C9F] mt-0.5">{contact.organization}</p>

              <div className="mt-3 p-2.5 rounded-xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 text-[11px] text-[#234C68] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F3A57] shrink-0" />
                <span>Consent: {contact.authorizedSharing}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[#B2CBD8]/30 flex items-center gap-2">
              <button
                onClick={() => setSelectedContact(contact)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>

              <button
                onClick={() => handleRequestCall(contact.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#EFF9FD] border border-[#B2CBD8] text-[#0F3A57] text-xs font-bold hover:bg-[#B2CBD8]/30 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Request call</span>
              </button>

              <button
                onClick={() => setSelectedContact(contact)}
                className="p-2 rounded-xl text-[#547489] hover:bg-[#EFF9FD] hover:text-[#0F3A57] transition-colors"
                title="View details"
                aria-label="View details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Message Modal Drawer */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#B2CBD8]/50 space-y-4 relative">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#547489] hover:bg-[#EFF9FD]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedContact.avatar}</span>
              <div>
                <h3 className="text-base font-bold text-[#0F3A57]">Message {selectedContact.name}</h3>
                <p className="text-xs text-[#547489]">{selectedContact.title}</p>
              </div>
            </div>

            {messageSentTo ? (
              <div className="p-6 text-center space-y-2">
                <Check className="w-8 h-8 text-[#0F3A57] mx-auto" />
                <h4 className="text-sm font-bold text-[#0F3A57]">Message Delivered</h4>
                <p className="text-xs text-[#547489]">
                  Dr. Jenkins / {selectedContact.name} typically responds during office hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  rows={4}
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  placeholder={`Hi ${selectedContact.name.split(' ')[0]}, I wanted to check in about...`}
                  required
                  className="w-full p-3.5 rounded-2xl bg-[#EFF9FD]/40 border border-[#B2CBD8] text-xs text-[#0F3A57] focus:border-[#0F3A57] outline-none"
                />

                <div className="p-2.5 rounded-xl bg-[#EFF9FD] text-[11px] text-[#547489]">
                  Protected under healthcare privacy standards. Only authorized personnel have access.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#547489]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-colors"
                  >
                    Send message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
