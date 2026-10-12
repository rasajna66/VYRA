import React from 'react';
import { X, CheckCircle, Bell } from 'lucide-react';

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#B2CBD8]/50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#B2CBD8]/40">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0F3A57]" />
            <h2 className="text-lg font-bold text-[#0F3A57]">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#547489] hover:bg-[#EFF9FD] transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-xs text-[#547489]">Gentle updates and check-in reminders</span>
          <button
            onClick={onMarkAllRead}
            className="text-xs text-[#234C68] font-semibold hover:underline flex items-center gap-1"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Mark all as read
          </button>
        </div>

        <div className="space-y-3 mt-2 flex-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.unread
                  ? 'bg-[#EFF9FD]/70 border-[#B2CBD8] shadow-xs'
                  : 'bg-white border-[#B2CBD8]/40 text-[#547489]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#0F3A57] truncate">{item.title}</h3>
                    <span className="text-[11px] text-[#547489] whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#547489] mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#B2CBD8]/40 text-center">
          <p className="text-xs text-[#6E8C9F]">
            VYRA notifications are supportive and never use guilt or pressure.
          </p>
        </div>
      </div>
    </div>
  );
};
