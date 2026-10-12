import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Lock,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  User,
} from 'lucide-react';
import { VyraLogo } from '../common/VyraLogo';

interface SignupScreenProps {
  onSignupSuccess: (userData: { name: string; age: number; emailOrPhone: string }) => void;
  onNavigateToLogin: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [firstName, setFirstName] = useState('Ram');
  const [age, setAge] = useState<number | string>(17);
  const [emailOrPhone, setEmailOrPhone] = useState('ram.sharma@youthmail.org');
  const [password, setPassword] = useState('SecretKey123!');
  const [confirmPassword, setConfirmPassword] = useState('SecretKey123!');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [error, setError] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: 'bg-gray-300' };
    if (password.length < 6) return { label: 'Too short', score: 1, color: 'bg-rose-400' };
    if (password.length < 8) return { label: 'Fair', score: 2, color: 'bg-amber-400' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { label: 'Strong & Safe', score: 4, color: 'bg-emerald-500' };
    }
    return { label: 'Good', score: 3, color: 'bg-blue-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPrivacy) {
      setError('Please agree to VYRA’s private data policy to continue.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter them carefully.');
      return;
    }
    if (Number(age) < 13 || Number(age) > 26) {
      setError('VYRA is tailored specifically for youth and young adults aged 13–26.');
      return;
    }
    setError('');
    onSignupSuccess({
      name: firstName,
      age: Number(age) || 17,
      emailOrPhone,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#EFF9FD] dark:bg-[#08121A] transition-colors duration-200">
      {/* Top utility row: Theme switch */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <span className="text-[11px] font-semibold text-[#547489] dark:text-[#8DAEC2] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Strict youth data sovereignty</span>
        </span>

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
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* Official VYRA Logo Emblem (Matching uploaded vyra.jpeg) */}
        <div className="text-center flex flex-col items-center">
          <VyraLogo variant="full" size="sm" showSubtitle={true} className="mb-2" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F3A57] dark:text-[#F0F7FB]">
            Create your VYRA space ✨
          </h1>
          <p className="text-xs sm:text-sm text-[#547489] dark:text-[#8DAEC2] mt-0.5 font-medium italic">
            “A private place to check in, reflect, and stay connected.”
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white dark:bg-[#0D1E2D] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#B2CBD8]/60 dark:border-[#1E3A52] transition-colors">
          {/* Segmented Auth Switcher: Sign In vs Sign Up */}
          <div className="flex items-center p-1 bg-[#EFF9FD] dark:bg-[#132A3E] rounded-2xl border border-[#B2CBD8]/40 dark:border-[#1E3A52] mb-5">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] transition-all text-center"
            >
              👋 Sign In
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-white dark:bg-[#0D1E2D] text-[#0F3A57] dark:text-[#F0F7FB] shadow-xs transition-all text-center"
            >
              ✨ Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 animate-fade-in flex items-center gap-2">
              <span className="font-bold">Notice:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ram"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] outline-none text-[#0F3A57] dark:text-[#F0F7FB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1">
                  Age <span className="text-[10px] text-[#547489] dark:text-[#8DAEC2]">(13–26)</span>
                </label>
                <input
                  type="number"
                  min="13"
                  max="26"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] outline-none text-[#0F3A57] dark:text-[#F0F7FB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1">
                Email or Mobile Phone
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="ram.sharma@youthmail.org"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] outline-none text-[#0F3A57] dark:text-[#F0F7FB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1">
                Create a Private Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] outline-none text-[#0F3A57] dark:text-[#F0F7FB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#547489] dark:text-[#8DAEC2] hover:text-[#0F3A57] dark:hover:text-[#F0F7FB] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength visual meter */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                    className={`h-full transition-all duration-300 ${strength.color}`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-[#547489] dark:text-[#8DAEC2]">
                  {strength.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F3A57] dark:text-[#F0F7FB] mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#EFF9FD]/50 dark:bg-[#0A1722] border border-[#B2CBD8] dark:border-[#1E3A52] focus:border-[#0F3A57] dark:focus:border-[#38BDF8] outline-none text-[#0F3A57] dark:text-[#F0F7FB]"
              />
            </div>

            {/* Privacy Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#547489] dark:text-[#8DAEC2] leading-tight select-none">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F3A57] focus:ring-[#0F3A57] border-[#B2CBD8] dark:border-[#1E3A52] mt-0.5"
                />
                <span>
                  I agree to VYRA's zero-ad privacy policy and understand my check-ins remain completely confidential.
                </span>
              </label>
            </div>

            {/* Privacy Guarantee card */}
            <div className="p-3 rounded-2xl bg-[#EFF9FD]/70 dark:bg-[#132A3E] border border-[#B2CBD8]/40 dark:border-[#1E3A52] flex items-center gap-2.5 text-[11px] text-[#234C68] dark:text-[#93C5FD]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero clutter. No unnecessary questions. You hold the encryption key.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0F3A57] dark:bg-[#38BDF8] text-white dark:text-[#08121A] font-bold text-sm hover:bg-[#234C68] dark:hover:bg-[#7DD3FC] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0F3A57]/15 active:scale-[0.99] mt-2"
            >
              <span>Create My Safe Space</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Already have an account link */}
          <div className="mt-5 pt-4 border-t border-[#B2CBD8]/30 dark:border-[#1E3A52] text-center">
            <p className="text-xs text-[#547489] dark:text-[#8DAEC2]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#0F3A57] dark:text-[#7DD3FC] hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
