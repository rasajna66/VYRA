import React, { useState } from 'react';
import { UserRole, GameProgress } from '../../types';
import { Bell, ShieldAlert, Sparkles, Eye, LogIn, Award, Sun, Moon, Gamepad2 } from 'lucide-react';
import { VyraLogo } from './VyraLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onOpenDemoGuide: () => void;
  onOpenMilestones: () => void;
  onOpenArcade?: () => void;
  gameProgress?: GameProgress;
  onNavigateToLogin: () => void;
  unreadCount: number;
  userName: string;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenEmergency,
  onOpenNotifications,
  onOpenDemoGuide,
  onOpenMilestones,
  onOpenArcade,
  gameProgress,
  onNavigateToLogin,
  unreadCount,
  userName,
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#B2CBD8]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Official Brand Logo Lockup */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onRoleChange('teen')}
            className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3A57] rounded-xl"
            aria-label="VYRA Home"
          >
            <VyraLogo variant="horizontal" size="sm" showSubtitle={true} />
          </button>
        </div>

        {/* Zone 2: Role Switcher & Feature Links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center p-1 bg-[#EFF9FD] rounded-xl border border-[#B2CBD8]/40">
            <button
              onClick={() => onRoleChange('teen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                currentRole === 'teen'
                  ? 'bg-white text-[#0F3A57] shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57]'
              }`}
            >
              🌱 Youth Space
            </button>
            <button
              onClick={() => onRoleChange('provider')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                currentRole === 'provider'
                  ? 'bg-white text-[#0F3A57] shadow-xs'
                  : 'text-[#547489] hover:text-[#0F3A57]'
              }`}
            >
              👩‍⚕️ Provider Dashboard
            </button>
          </div>

          {/* Arcade Mini-Games Button */}
          {onOpenArcade && (
            <button
              onClick={onOpenArcade}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/40 hover:bg-amber-200 border border-amber-300 dark:border-amber-800 transition-colors whitespace-nowrap shadow-2xs active:scale-95"
              title="Open Wellbeing Arcade"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Arcade 🎮</span>
              {gameProgress && (
                <span className="hidden sm:inline text-[10px] bg-amber-200 dark:bg-amber-900 px-1.5 py-0.2 rounded-md font-extrabold">
                  Lvl {gameProgress.level}
                </span>
              )}
            </button>
          )}

          {/* Gentle Milestones Shortcut */}
          <button
            onClick={onOpenMilestones}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F3A57] bg-[#EFF9FD] hover:bg-[#B2CBD8]/40 border border-[#B2CBD8]/60 transition-colors whitespace-nowrap"
            title="View Gentle Milestones"
          >
            <Award className="w-3.5 h-3.5 text-[#234C68]" />
            <span>Milestones ✨</span>
          </button>

          {/* Hackathon Demo Flow Quick Trigger */}
          <button
            onClick={onOpenDemoGuide}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F3A57] bg-[#B2CBD8]/30 hover:bg-[#B2CBD8]/50 border border-[#B2CBD8]/60 transition-colors whitespace-nowrap"
            title="Open Wadhwani Demo Guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#234C68]" />
            <span>Demo Flow</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Login Screen Access & Accessibility */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Access to Login Screen */}
          <button
            onClick={onNavigateToLogin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F3A57] hover:bg-[#EFF9FD] border border-[#B2CBD8]/60 transition-colors whitespace-nowrap"
            title="Open Login & Account Portal"
          >
            <LogIn className="w-3.5 h-3.5 text-[#547489]" />
            <span>Login Page</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-[#547489] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] hover:text-[#0F3A57] dark:hover:text-[#E2F1F8] transition-colors relative"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDarkMode ? 'Switch to Light Mode (Daytime Calm)' : 'Switch to Dark Mode (Midnight Navy & Blacks)'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#234C68]" />
              )}
            </button>
          )}

          {/* Accessibility toggle dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className="p-2 rounded-xl text-[#547489] hover:bg-[#EFF9FD] hover:text-[#0F3A57] transition-colors"
              aria-label="Accessibility options"
              title="Accessibility options (Theme, Large text, High contrast)"
            >
              <Eye className="w-4 h-4" />
            </button>

            {showAccessMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0D1E2D] rounded-2xl shadow-xl border border-[#B2CBD8]/50 dark:border-[#1E3A52] p-3 z-50 animate-fade-in">
                <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] px-2 py-1 mb-1">Display & Theme</div>
                {onToggleDarkMode && (
                  <button
                    onClick={() => {
                      onToggleDarkMode();
                      setShowAccessMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#234C68]" />}
                      <span>Dark Mode</span>
                    </span>
                    <span className="text-[11px] font-medium text-[#547489] dark:text-[#8DAEC2]">
                      {isDarkMode ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onToggleLargeText();
                    setShowAccessMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] rounded-xl transition-colors"
                >
                  <span>Large Text</span>
                  <span className="text-[11px] font-medium text-[#547489] dark:text-[#8DAEC2]">
                    {isLargeText ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onToggleHighContrast();
                    setShowAccessMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] rounded-xl transition-colors"
                >
                  <span>High Contrast</span>
                  <span className="text-[11px] font-medium text-[#547489] dark:text-[#8DAEC2]">
                    {isHighContrast ? 'ON' : 'OFF'}
                  </span>
                </button>
                <div className="border-t border-[#B2CBD8]/40 dark:border-[#1E3A52] my-1 pt-1">
                  <button
                    onClick={() => {
                      onNavigateToLogin();
                      setShowAccessMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#EFF9FD] dark:hover:bg-[#132A3E] rounded-xl transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#547489] dark:text-[#8DAEC2]" />
                    <span>Switch to Login Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#547489] hover:bg-[#EFF9FD] hover:text-[#0F3A57] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0F3A57] ring-2 ring-white" />
            )}
          </button>

          {/* Non-alarming crisis trigger */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#0F3A57] text-[#0F3A57] text-xs font-semibold hover:bg-[#EFF9FD] transition-all whitespace-nowrap active:scale-95"
            aria-label="Emergency and crisis assistance"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#0F3A57]" />
            <span className="hidden sm:inline">Need Help?</span>
            <span className="sm:hidden">Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
