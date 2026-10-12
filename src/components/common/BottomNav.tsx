import React from 'react';
import { Home, MessageSquareQuote, TrendingUp, Sparkles, User } from 'lucide-react';

export type TeenTab = 'home' | 'checkin' | 'trends' | 'calm' | 'profile';

interface BottomNavProps {
  currentTab: TeenTab;
  onTabChange: (tab: TeenTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TeenTab, label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'checkin' as TeenTab, label: 'Check-in', icon: MessageSquareQuote, emoji: '💭' },
    { id: 'trends' as TeenTab, label: 'Trends', icon: TrendingUp, emoji: '📊' },
    { id: 'calm' as TeenTab, label: 'Calm', icon: Sparkles, emoji: '🌿' },
    { id: 'profile' as TeenTab, label: 'Profile', icon: User, emoji: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#B2CBD8]/50 transition-colors md:hidden">
      <nav className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center relative group"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#0F3A57] scale-110 font-bold'
                    : 'text-[#6E8C9F] group-hover:text-[#0F3A57]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight transition-colors ${
                  isActive
                    ? 'font-bold text-[#0F3A57]'
                    : 'font-medium text-[#6E8C9F]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#0F3A57] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
