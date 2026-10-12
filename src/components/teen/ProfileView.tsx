import React, { useState } from 'react';
import { INITIAL_USER, INITIAL_ACHIEVEMENT_BADGES } from '../../data/mockData';
import { AchievementBadge } from '../../types';
import { MilestoneBadges } from './MilestoneBadges';
import { VyraLogo } from '../common/VyraLogo';
import {
  User,
  Heart,
  Shield,
  Bell,
  Globe,
  Eye,
  LogOut,
  ChevronRight,
  Sparkles,
  Edit3,
  Check,
  Award,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenPrivacyCenter: () => void;
  onOpenMilestones: () => void;
  onOpenLogin: () => void;
  onOpenSignup?: () => void;
  onLogout: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
  preferredName: string;
  onUpdatePreferredName: (name: string) => void;
  achievementBadges?: AchievementBadge[];
  onTriggerCelebration?: (badge: AchievementBadge) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenPrivacyCenter,
  onOpenMilestones,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
  preferredName,
  onUpdatePreferredName,
  achievementBadges = INITIAL_ACHIEVEMENT_BADGES,
  onTriggerCelebration,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(preferredName);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdatePreferredName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const unlockedCount = achievementBadges.filter((b) => b.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0F3A57]">My Profile</h1>
        <p className="text-xs text-[#547489] mt-0.5">
          Your account, milestone achievement badges, accessibility, and connected care.
        </p>
      </div>

      {/* Profile Card Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-[#0F3A57] bg-[#EFF9FD]">
            <img
              src="/src/assets/images/vyra_calm_illustration_1791362080759.jpg"
              alt="Profile avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0F3A57] text-white flex items-center justify-center text-[11px] font-bold">
            🌱
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2.5 py-1 text-base font-bold text-[#0F3A57] border border-[#0F3A57] rounded-xl outline-none"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-[#0F3A57] text-white hover:bg-[#234C68]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#0F3A57]">{preferredName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-[#547489] hover:text-[#0F3A57]"
                  aria-label="Edit preferred name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          <p className="text-xs text-[#547489] mt-0.5">
            Age: 17 • Westwood Academy Student • Connected to Metro Youth Health
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-[11px] font-medium text-[#234C68] bg-[#EFF9FD] px-2.5 py-0.5 rounded-full border border-[#B2CBD8]/40">
              3-Day Check-in Streak 🔥
            </span>
            <span className="text-[11px] font-semibold text-[#0F3A57] bg-[#B2CBD8]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3 text-[#0F3A57]" />
              <span>{unlockedCount} Badges Honored</span>
            </span>
            <span className="text-[11px] font-medium text-[#0F3A57] bg-[#B2CBD8]/30 px-2.5 py-0.5 rounded-full">
              Full Privacy Active 🔐
            </span>
          </div>
        </div>
      </div>

      {/* MILESTONE ACHIEVEMENT BADGES & ENGAGEMENT TIERS (Directly on Profile) */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0F3A57] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#234C68]" />
              <span>My Milestone Badges & Engagement Tiers 🏆</span>
            </h3>
            <p className="text-xs text-[#547489] mt-0.5">
              Small, friendly achievements honoring your journal reflections and mindful engagement tiers.
            </p>
          </div>
          <button
            onClick={onOpenMilestones}
            className="text-xs font-bold text-[#0F3A57] hover:underline flex items-center gap-1 self-start sm:self-auto bg-[#EFF9FD] px-3 py-1.5 rounded-xl border border-[#B2CBD8]/50"
          >
            <span>View All Milestones</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Small Friendly Badges Grid & Tier Showcase */}
        <MilestoneBadges
          badges={achievementBadges}
          compact={false}
          showHeaderBanner={true}
          onTriggerCelebration={onTriggerCelebration}
        />
      </div>

      {/* VYRA Official Logo & Authentication Access Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#EFF9FD] to-white border border-[#B2CBD8]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <VyraLogo variant="badge" size="lg" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#547489] block">
              Official Platform Logo
            </span>
            <h4 className="text-sm font-bold text-[#0F3A57]">
              VYRA — Mental Health + Technology
            </h4>
            <p className="text-xs text-[#547489] mt-0.5 max-w-sm">
              “You don't have to figure it all out alone.”
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Open Login Screen</span>
          </button>
          {onOpenSignup && (
            <button
              onClick={onOpenSignup}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#0F3A57] text-[#0F3A57] text-xs font-bold hover:bg-[#EFF9FD] transition-all flex items-center gap-1.5 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Open Sign-up Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Wellbeing Goals */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#0F3A57] flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#0F3A57]" />
          <span>My Wellbeing Goals</span>
        </h3>
        <div className="space-y-2">
          {INITIAL_USER.goals.map((g, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/40 text-xs text-[#0F3A57] flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#0F3A57]" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Professionals */}
      <div className="p-6 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#0F3A57] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0F3A57]" />
          <span>Connected Care Team</span>
        </h3>
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">
                {INITIAL_USER.connectedProfessional}
              </div>
              <div className="text-[11px] text-[#547489]">Primary Youth Psychologist</div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Active Link
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EFF9FD]/60 border border-[#B2CBD8]/50 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">
                {INITIAL_USER.connectedCounsellor}
              </div>
              <div className="text-[11px] text-[#547489]">School Wellbeing Lead</div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Active Link
            </span>
          </div>
        </div>
      </div>

      {/* Dark and Light Mode Settings Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] dark:bg-[#163045] flex items-center justify-center text-[#0F3A57] dark:text-[#7DD3FC]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                Appearance & Theme Settings
              </h3>
              <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                Choose how VYRA looks. Light mode preserves original sky blues; dark mode brings deep midnight blues and velvety blacks.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFF9FD] dark:bg-[#132A3E] text-[#0F3A57] dark:text-[#7DD3FC] border border-[#B2CBD8]/50 dark:border-[#1E3A52]">
            Active: {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Light Mode Option */}
          <button
            type="button"
            onClick={() => {
              if (isDarkMode && onToggleDarkMode) onToggleDarkMode();
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 ${
              !isDarkMode
                ? 'border-[#0F3A57] bg-[#EFF9FD]/60 shadow-sm'
                : 'border-[#B2CBD8]/40 dark:border-[#1E3A52] bg-white dark:bg-[#102436] hover:border-[#547489]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">Light Mode</span>
              </div>
              {!isDarkMode && (
                <span className="w-5 h-5 rounded-full bg-[#0F3A57] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] leading-relaxed">
              Same classic palette with gentle ice-white, soft sky blue accents, and dark navy readability.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-4 h-4 rounded-full bg-[#EFF9FD] border border-[#B2CBD8]" />
              <span className="w-4 h-4 rounded-full bg-white border border-[#B2CBD8]" />
              <span className="w-4 h-4 rounded-full bg-[#B2CBD8]" />
              <span className="w-4 h-4 rounded-full bg-[#0F3A57]" />
            </div>
          </button>

          {/* Dark Mode Option */}
          <button
            type="button"
            onClick={() => {
              if (!isDarkMode && onToggleDarkMode) onToggleDarkMode();
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 ${
              isDarkMode
                ? 'border-[#38BDF8] bg-[#0A1722] shadow-sm'
                : 'border-[#B2CBD8]/40 bg-white hover:border-[#547489]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">Dark Mode</span>
              </div>
              {isDarkMode && (
                <span className="w-5 h-5 rounded-full bg-[#38BDF8] text-[#08121A] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#547489] dark:text-[#8DAEC2] leading-relaxed">
              Deeper midnight blues, velvety blacks, and dark charcoal grey — easy on the eyes for evening check-ins.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-4 h-4 rounded-full bg-[#08121A] border border-[#1E3A52]" />
              <span className="w-4 h-4 rounded-full bg-[#0D1E2D] border border-[#1E3A52]" />
              <span className="w-4 h-4 rounded-full bg-[#163650]" />
              <span className="w-4 h-4 rounded-full bg-[#38BDF8]" />
            </div>
          </button>
        </div>
      </div>

      {/* Settings & Accessibility List */}
      <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-xs overflow-hidden divide-y divide-[#B2CBD8]/30 dark:divide-[#1E3A52]">
        {/* Quick Dark Mode Row in Settings */}
        {onToggleDarkMode && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] dark:bg-[#163045] flex items-center justify-center text-[#0F3A57] dark:text-[#7DD3FC]">
                {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB]">Dark Mode Toggle</div>
                <div className="text-[11px] text-[#547489] dark:text-[#8DAEC2]">
                  {isDarkMode ? 'Nighttime deep blues and blacks active' : 'Daytime sky and ice-white active'}
                </div>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isDarkMode
                  ? 'bg-[#38BDF8] text-[#08121A]'
                  : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
              }`}
            >
              {isDarkMode ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
        {/* Gentle Milestones View */}
        <button
          onClick={onOpenMilestones}
          className="w-full p-4 flex items-center justify-between hover:bg-[#EFF9FD]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Sparkles className="w-4 h-4 text-[#234C68]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Gentle Milestones & Streaks ✨</div>
              <div className="text-[11px] text-[#547489]">Detailed milestone cards and anti-pressure philosophy</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#547489]" />
        </button>

        {/* Privacy Settings */}
        <button
          onClick={onOpenPrivacyCenter}
          className="w-full p-4 flex items-center justify-between hover:bg-[#EFF9FD]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Privacy Settings</div>
              <div className="text-[11px] text-[#547489]">Manage telemetry, voice, and data sharing</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#547489]" />
        </button>

        {/* Notification Settings */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Notification Settings</div>
              <div className="text-[11px] text-[#547489]">Gentle check-in pings & trend summaries</div>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              notificationsEnabled
                ? 'bg-[#0F3A57] text-white'
                : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
            }`}
          >
            {notificationsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Language */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Language</div>
              <div className="text-[11px] text-[#547489]">App language and locale</div>
            </div>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-xs font-bold text-[#0F3A57] bg-[#EFF9FD] px-2.5 py-1 rounded-xl border border-[#B2CBD8] outline-none"
          >
            <option>English (US)</option>
            <option>Spanish (Español)</option>
            <option>Hindi (हिन्दी)</option>
            <option>French (Français)</option>
          </select>
        </div>

        {/* Accessibility: Large Text */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Large Text Mode</div>
              <div className="text-[11px] text-[#547489]">Scale typography for easier reading</div>
            </div>
          </div>
          <button
            onClick={onToggleLargeText}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isLargeText
                ? 'bg-[#0F3A57] text-white'
                : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
            }`}
          >
            {isLargeText ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Accessibility: High Contrast */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">High Contrast Mode</div>
              <div className="text-[11px] text-[#547489]">Sharper contrast and bold edges</div>
            </div>
          </div>
          <button
            onClick={onToggleHighContrast}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isHighContrast
                ? 'bg-[#0F3A57] text-white'
                : 'bg-[#EFF9FD] text-[#547489] border border-[#B2CBD8]'
            }`}
          >
            {isHighContrast ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* View Login Pages */}
        <button
          onClick={onOpenLogin}
          className="w-full p-4 flex items-center justify-between hover:bg-[#EFF9FD]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF9FD] flex items-center justify-center text-[#0F3A57]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F3A57]">Login & Sign-up Pages</div>
              <div className="text-[11px] text-[#547489]">View the onboarding and authentication screens</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#547489]" />
        </button>

        {/* Log Out */}
        <button
          onClick={onLogout}
          className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-700">Log out</div>
              <div className="text-[11px] text-[#547489]">Securely exit your VYRA session</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#547489]" />
        </button>
      </div>
    </div>
  );
};
