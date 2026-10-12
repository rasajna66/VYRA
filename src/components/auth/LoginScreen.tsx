import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Mail,
  Smartphone,
  Sparkles,
  Eye,
  EyeOff,
  Sun,
  Moon,
  CheckCircle2,
  ShieldCheck,
  User,
  Heart,
  HelpCircle,
  X,
} from 'lucide-react';
import { VyraLogo } from '../common/VyraLogo';

interface LoginScreenProps {
  onLoginSuccess: (email: string, role?: 'teen' | 'provider') => void;
  onNavigateToSignup: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onExploreAsGuest?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  isDarkMode = false,
  onToggleDarkMode,
  onExploreAsGuest,
}) => {
  const [identifier, setIdentifier] = useState('ram.sharma@youthmail.org');
  const [password, setPassword] = useState('SecretKey123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'teen' | 'provider'>('teen');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(identifier, selectedRole);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
    }, 2400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#EFF9FD] dark:bg-[#08121A] transition-colors duration-200">
      {/* Top utility row: Theme switch & Guest link */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <span className="text-[11px] font-semibold text-[#547489] dark:text-[#8DAEC2] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Private, encrypted sanctuary</span>
        </span>

        <div className="flex items-center gap-2">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-white dark:bg-[#0D1E2D] border border-[#B2CBD8]/60 dark:border-[#1E3A52] text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#E2F1F8] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#234C68]" />
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>
          )}

          {onExploreAsGuest && (
            <button
              onClick={onExploreAsGuest}
              className="text-xs font-bold text-[#0F3A57] dark:text-[#7DD3FC] hover:underline"
            >
              Guest preview →
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Official VYRA Logo Emblem (Matching uploaded vyra.jpeg) */}
        <div className="text-center flex flex-col items-center">
          <VyraLogo variant="full" size="md" showSubtitle={true} className="mb-2" />
          <p className="text-xs sm:text-sm text-[#547489] dark:text-[#8DAEC2] mt-1 font-medium italic">
            “You don't have to figure it all out alone.”
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] transition-colors">
          {/* Segmented Auth Switcher: Sign In vs Sign Up */}
          <div className="flex items-center p-1 bg-[#EFF9FD] dark:bg-[#132A3E] rounded-2xl border border-[#B2CBD8]/40 dark:border-[#1E3A52] mb-6">
            <button
              type="button"
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-white dark:bg-[#0D1E2D] text-[#0F3A57] dark:text-[#F0F7FB] shadow-xs transition-all text-center"
            >
              👋 Sign In
            </button>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] transition-all text-center"
            >
              ✨ Create Account
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
              Welcome back 👋
            </h2>
            <p className="text-xs text-[#547489] dark:text-[#8DAEC2] mt-0.5">
              Let's check in with you. Enter your details to continue.
            </p>
          </div>

          {/* Role selector pill */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#547489] dark:text-[#8DAEC2] mb-1.5">
              I am signing in as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('teen');
                  setIdentifier('ram.sharma@youthmail.org');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'teen'
                    ? 'bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] border-[#0F3A57] dark:border-[#38BDF8] shadow-xs'
                    : 'bg-[#EFF9FD]/50 dark:bg-[#132A3E] text-[#547489] dark:text-[#8DAEC2] border-[#B2CBD8]/40 dark:border-[#1E3A52]'
                }`}
              >
                <span>🌱 Youth Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('provider');
                  setIdentifier('dr.jenkins@metroyouth.org');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'provider'
                    ? 'bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] border-[#0F3A57] dark:border-[#38BDF8] shadow-xs'
                    : 'bg-[#EFF9FD]/50 dark:bg-[#132A3E] text-[#547489] dark:text-[#8DAEC2] border-[#B2CBD8]/40 dark:border-[#1E3A52]'
                }`}
              >
                <span>👩‍⚕️ Provider Portal</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1.5" htmlFor="email-input">
                Email / Username / Phone
              </label>
              <div className="relative">
                <input
                  id="email-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ram.sharma@youthmail.org"
                  required
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0F3A57]/10 dark:focus:ring-[#38BDF8]/20 outline-none transition-all text-[#0F3A57] dark:text-[#F0F7FB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1.5" htmlFor="password-input">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secure password"
                  required
                  className="w-full px-4 py-3 pr-11 text-sm rounded-2xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0F3A57]/10 dark:focus:ring-[#38BDF8]/20 outline-none transition-all text-[#0F3A57] dark:text-[#F0F7FB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#547489] dark:text-[#8DAEC2]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F3A57] focus:ring-[#0F3A57] border-[#B2CBD8] dark:border-[#1E3A52]"
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-[#234C68] dark:text-[#7DD3FC] hover:underline"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] font-bold text-sm hover:bg-[#234C68] dark:hover:bg-[#7DD3FC] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0F3A57]/15 active:scale-[0.99]"
            >
              <span>Sign In to VYRA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="mt-5 pt-4 border-t border-[#B2CBD8]/30 dark:border-[#1E3A52]">
            <span className="text-[11px] font-bold text-[#547489] dark:text-[#8DAEC2] uppercase tracking-wider block mb-2 text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLoginSuccess('ram.sharma@youthmail.org', 'teen')}
                className="py-2.5 px-3 rounded-xl bg-[#EFF9FD] dark:bg-[#132A3E] border border-[#B2CBD8] dark:border-[#1E3A52] text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#B2CBD8]/30 dark:hover:bg-[#1C3B54] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <span>🌱 Enter as Ram</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess('dr.jenkins@metroyouth.org', 'provider')}
                className="py-2.5 px-3 rounded-xl bg-[#EFF9FD] dark:bg-[#132A3E] border border-[#B2CBD8] dark:border-[#1E3A52] text-xs font-bold text-[#0F3A57] dark:text-[#F0F7FB] hover:bg-[#B2CBD8]/30 dark:hover:bg-[#1C3B54] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <span>👩‍⚕️ Enter as Dr. Sarah</span>
              </button>
            </div>
          </div>

          {/* Social Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#B2CBD8]/40 dark:border-[#1E3A52]" />
            </div>
            <span className="relative bg-white dark:bg-[#0D1E2D] px-3 text-xs text-[#547489] dark:text-[#8DAEC2]">
              or connect with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onLoginSuccess('ram.google@youthmail.org', 'teen')}
              className="min-h-[44px] py-2.5 px-3 rounded-2xl border border-[#B2CBD8] dark:border-[#1E3A52] bg-white dark:bg-[#102436] hover:bg-[#EFF9FD]/60 dark:hover:bg-[#163045] text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess('+1 (555) 019-2834', 'teen')}
              className="min-h-[44px] py-2.5 px-3 rounded-2xl border border-[#B2CBD8] dark:border-[#1E3A52] bg-white dark:bg-[#102436] hover:bg-[#EFF9FD]/60 dark:hover:bg-[#163045] text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#547489] dark:text-[#8DAEC2]" />
              <span>Phone SMS</span>
            </button>
          </div>

          {/* Reassurance Footer */}
          <div className="mt-6 pt-4 border-t border-[#B2CBD8]/30 dark:border-[#1E3A52] text-center space-y-2">
            <p className="text-xs text-[#547489] dark:text-[#8DAEC2]">
              New to VYRA?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="font-bold text-[#0F3A57] dark:text-[#7DD3FC] hover:underline"
              >
                Create a youth space
              </button>
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#547489] dark:text-[#8DAEC2]">
              <span>🔒 Zero Ad-tracking</span>
              <span>•</span>
              <span>🌱 Non-clinical</span>
              <span>•</span>
              <span>🤝 You stay in control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl max-w-sm w-full p-6 border border-[#B2CBD8]/60 dark:border-[#1E3A52] shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#547489] dark:text-[#8DAEC2] hover:bg-[#EFF9FD] dark:hover:bg-[#163045]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold text-[#0F3A57] dark:text-[#F0F7FB]">
                Reset your password
              </h3>
              <p className="text-xs text-[#547489] dark:text-[#8DAEC2] mt-1">
                Enter your email or phone number. We'll send a gentle recovery link.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Reset link sent! Check your inbox or phone.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="ram.sharma@youthmail.org"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] text-[#0F3A57] dark:text-[#F0F7FB] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] text-xs font-bold hover:bg-[#234C68] dark:hover:bg-[#7DD3FC] transition-all"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
