import React, { useState, useEffect } from 'react';
import {
  UserRole,
  CheckInRecord,
  JournalEntry,
  ProviderCase,
  ProviderAlert,
  FollowUpTask,
  PriorityLevel,
  Milestone,
  AchievementBadge,
  CompanionData,
  CompanionAccessoryId,
  WellbeingQuest,
  GameProgress,
  DailyHabit,
} from './types';
import {
  INITIAL_USER,
  INITIAL_TIMELINE,
  INITIAL_JOURNAL,
  INITIAL_CASES,
  INITIAL_ALERTS,
  INITIAL_FOLLOW_UPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MILESTONES,
  INITIAL_ACHIEVEMENT_BADGES,
  INITIAL_COMPANIONS,
  INITIAL_QUESTS,
  INITIAL_GAME_PROGRESS,
  INITIAL_HABITS,
} from './data/mockData';
import { Header } from './components/common/Header';
import { BottomNav, TeenTab } from './components/common/BottomNav';
import { EmergencyModal } from './components/common/EmergencyModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { ConfettiEffect } from './components/common/ConfettiEffect';
import { ArcadeModal } from './components/game/ArcadeModal';
import { ambientSound } from './utils/audioSynth';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignupScreen } from './components/auth/SignupScreen';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { HomeDashboard } from './components/teen/HomeDashboard';
import { CheckInModal } from './components/teen/CheckInModal';
import { CalmSpace } from './components/teen/CalmSpace';
import { JournalView } from './components/teen/JournalView';
import { SupportCircleView } from './components/teen/SupportCircleView';
import { TrendsView } from './components/teen/TrendsView';
import { ProfileView } from './components/teen/ProfileView';
import { PrivacyCenter } from './components/teen/PrivacyCenter';
import { MilestonesView } from './components/teen/MilestonesView';
import { MilestoneCelebrationModal } from './components/teen/MilestoneCelebrationModal';
import { ProviderDashboard } from './components/provider/ProviderDashboard';

export default function App() {
  // Auth & View state
  const [authState, setAuthState] = useState<'app' | 'login' | 'signup' | 'onboarding'>('app');
  const [currentRole, setCurrentRole] = useState<UserRole>('teen');
  const [teenTab, setTeenTab] = useState<TeenTab>('home');
  const [teenSubView, setTeenSubView] = useState<'journal' | 'support' | 'privacy' | 'milestones' | null>(null);

  // User & Wellbeing State
  const [userProfile, setUserProfile] = useState(INITIAL_USER);
  const [weeklyTimeline, setWeeklyTimeline] = useState(INITIAL_TIMELINE);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [achievementBadges, setAchievementBadges] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENT_BADGES);

  // Cartoon Companions & Gamification State
  const [currentCompanion, setCurrentCompanion] = useState<CompanionData>(INITIAL_COMPANIONS[0]);
  const [availableCompanions, setAvailableCompanions] = useState<CompanionData[]>(INITIAL_COMPANIONS);
  const [unlockedAccessories, setUnlockedAccessories] = useState<CompanionAccessoryId[]>(INITIAL_GAME_PROGRESS.unlockedAccessories);
  const [quests, setQuests] = useState<WellbeingQuest[]>(INITIAL_QUESTS);
  const [gameProgress, setGameProgress] = useState<GameProgress>(INITIAL_GAME_PROGRESS);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [arcadeInitialGame, setArcadeInitialGame] = useState<'clouds' | 'garden' | 'match'>('clouds');
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Daily Habit Tracker State
  const [habits, setHabits] = useState<DailyHabit[]>(INITIAL_HABITS);
  const [habitStreakDays, setHabitStreakDays] = useState(5);

  // Provider Data State
  const [cases, setCases] = useState<ProviderCase[]>(INITIAL_CASES);
  const [alerts, setAlerts] = useState<ProviderAlert[]>(INITIAL_ALERTS);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>(INITIAL_FOLLOW_UPS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modals & Overlays
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(3);
  const [celebrationMilestone, setCelebrationMilestone] = useState<Milestone | AchievementBadge | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Accessibility & Theme Modes
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vyra_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vyra_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [isLargeText]);

  // Open milestone celebration modal
  const handleTriggerCelebration = (item: Milestone | AchievementBadge) => {
    setCelebrationMilestone(item);
    setIsCelebrationOpen(true);
  };

  // Handle Check-In Submission
  const handleSubmitCheckIn = (data: Partial<CheckInRecord>) => {
    // 1. Update Ram's distress score dynamically (e.g. shifts to 61 Elevated)
    setUserProfile((prev) => ({
      ...prev,
      score: data.score || 61,
      scoreStatus: 'Elevated',
      scoreChange: 19,
      streakDays: prev.streakDays + 1,
    }));

    // 2. Update Sunday's timeline slot
    setWeeklyTimeline((prev) =>
      prev.map((d) =>
        d.day === 'SUN'
          ? {
              ...d,
              mood: data.mood || 'low',
              note: data.noteText || 'Check-in completed. Reported fatigue and sleep deficit.',
            }
          : d
      )
    );

    // 3. Update Milestones & Achievement Badges (7-day streak & tier badges)
    setMilestones((current) =>
      current.map((m) => {
        if (m.id === 'ms-7-day-streak') {
          return { ...m, progress: 7, isUnlocked: true, unlockedAt: 'Today' };
        }
        if (m.id === 'ms-first-checkin') {
          return { ...m, isUnlocked: true, unlockedAt: 'Completed' };
        }
        return m;
      })
    );

    setAchievementBadges((current) =>
      current.map((b) => {
        if (b.id === 'badge-tier-2') {
          return { ...b, unlocked: true, unlockedAt: 'Today' };
        }
        if (b.id === 'badge-tier-1') {
          return { ...b, unlocked: true, unlockedAt: 'Completed' };
        }
        return b;
      })
    );

    // 4. Update Provider's Case Record for Ram Sharma (VYRA-0921)
    setCases((prev) =>
      prev.map((c) =>
        c.id === 'VYRA-0921'
          ? {
              ...c,
              currentScore: 61,
              change: 19,
              trend: 'up',
              priority: 'Elevated',
              lastCheckIn: 'Just now (New check-in logged)',
              reviewedToday: false,
            }
          : c
      )
    );

    // 5. Ensure Alert is present in Provider Queue
    const alertExists = alerts.some((a) => a.caseId === 'VYRA-0921');
    if (!alertExists) {
      setAlerts((prev) => [
        {
          id: `alt-${Date.now()}`,
          caseId: 'VYRA-0921',
          patientName: 'Ram Sharma',
          level: 'Elevated',
          timestamp: 'Just now',
          whatChanged: 'Wellbeing score increased +19 points (42 → 61); acoustic fatigue detected',
          whenItChanged: 'Recent check-in',
          whyItMatters: 'Sleep deficit and high academic strain recorded',
          recommendedAction: 'Send friendly non-clinical supportive note and review sleep hygiene tomorrow',
        },
        ...prev,
      ]);
    }

    // 6. Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        icon: '🌱',
        title: 'Check-in recorded 🌱',
        description: 'Thanks for taking a moment with yourself today.',
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ]);

    // 7. Complete Daily Vibe Quest and award XP with celebration
    handleAwardXp(35, 'quest-vibe');
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 2500);
  };

  // Gamification & Cartoon Companions Handlers
  const handleOpenArcade = (defaultGame: 'clouds' | 'garden' | 'match' = 'clouds') => {
    setArcadeInitialGame(defaultGame);
    setIsArcadeOpen(true);
  };

  const handleAwardXp = (amount: number, questId?: string) => {
    setGameProgress((prev) => {
      const newXp = prev.xp + amount;
      if (newXp >= prev.xpToNextLevel) {
        // Level up celebration!
        ambientSound.playLevelUp();
        setIsConfettiActive(true);
        setTimeout(() => setIsConfettiActive(false), 3000);
        return {
          ...prev,
          level: prev.level + 1,
          levelTitle: prev.level === 3 ? 'Starlight Guardian' : 'Zen Master Voyager',
          xp: newXp - prev.xpToNextLevel,
          xpToNextLevel: prev.xpToNextLevel + 200,
        };
      }
      return { ...prev, xp: newXp };
    });

    if (questId) {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, isCompleted: true, progress: q.target } : q
        )
      );
    }
  };

  const handleCloudsPopped = (count: number) => {
    setGameProgress((prev) => ({
      ...prev,
      cloudsPoppedTotal: prev.cloudsPoppedTotal + count,
    }));
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest-clouds') {
          const newProg = Math.min(q.target, q.progress + count);
          return {
            ...q,
            progress: newProg,
            isCompleted: newProg >= q.target,
          };
        }
        return q;
      })
    );
  };

  const handlePlantBloomed = () => {
    setGameProgress((prev) => ({
      ...prev,
      flowersBloomedTotal: prev.flowersBloomedTotal + 1,
    }));
    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'quest-bloom'
          ? { ...q, progress: 1, isCompleted: true }
          : q
      )
    );
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 3000);
  };

  const handlePetCompanion = () => {
    handleAwardXp(25, 'quest-pet');
  };

  const handleClaimChestReward = (_prize: string) => {
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 3000);
    setUnlockedAccessories((prev) => {
      if (!prev.includes('wings')) return [...prev, 'wings'];
      return prev;
    });
    handleAwardXp(100);
  };

  const handleSelectCompanion = (comp: CompanionData) => {
    setCurrentCompanion(comp);
    ambientSound.playSparkle();
  };

  const handleSelectAccessory = (acc: CompanionAccessoryId) => {
    setCurrentCompanion((prev) => ({ ...prev, accessory: acc }));
    ambientSound.playSparkle();
  };

  const handleUpdateHabit = (habitId: string, updated: Partial<DailyHabit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, ...updated } : h))
    );
  };

  const handleAddHabit = (newHabit: Omit<DailyHabit, 'id'>) => {
    const created: DailyHabit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
    };
    setHabits((prev) => [created, ...prev]);
  };

  // Provider Actions
  const handleMarkCaseReviewed = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, reviewedToday: true } : c))
    );
  };

  const handleAddObservation = (caseId: string, noteText: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              clinicalObservations: [
                ...c.clinicalObservations,
                {
                  id: `obs-${Date.now()}`,
                  author: 'Dr. Sarah Jenkins',
                  date: 'Today',
                  note: noteText,
                },
              ],
            }
          : c
      )
    );
  };

  const handleScheduleFollowUp = (caseId: string, date: string, reason: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, scheduledFollowUp: date, followUpReason: reason }
          : c
      )
    );
    const targetCase = cases.find((c) => c.id === caseId);
    if (targetCase) {
      setFollowUps((prev) => [
        {
          id: `fu-${Date.now()}`,
          caseId,
          patientName: targetCase.patientName,
          reason,
          dueDate: date,
          status: 'Upcoming',
          assignedProfessional: 'Dr. Sarah Jenkins',
        },
        ...prev,
      ]);
    }
  };

  const handleChangePriority = (caseId: string, priority: PriorityLevel) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, priority } : c))
    );
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleCompleteFollowUp = (followUpId: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === followUpId ? { ...f, status: 'Completed' } : f))
    );
  };

  const handleAddFollowUpTask = (task: Omit<FollowUpTask, 'id'>) => {
    setFollowUps((prev) => [{ id: `fu-${Date.now()}`, ...task }, ...prev]);
  };

  const handleAddReflectionFromRecap = (content: string) => {
    setJournalEntries((prev) => [
      {
        id: `j-${Date.now()}`,
        title: 'Weekly Reflection',
        content,
        mood: 'good',
        date: 'Today, Weekly Recap',
        createdAt: new Date().toISOString(),
        isPrivate: true,
        sharedWithProfessional: false,
      },
      ...prev,
    ]);
    // Unlock first journal badge if not unlocked yet
    setAchievementBadges((currentBadges) =>
      currentBadges.map((b) =>
        b.id === 'badge-first-journal'
          ? { ...b, unlocked: true, unlockedAt: 'Just now' }
          : b
      )
    );
  };

  // Hackathon Demo Flow Jumper (Updated to include Milestones & Login)
  const handleJumpToDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    if (stepNumber === 1) {
      setAuthState('login');
    } else if (stepNumber === 2) {
      setAuthState('signup');
    } else if (stepNumber === 3) {
      setAuthState('app');
      setCurrentRole('teen');
      setTeenTab('home');
      setTeenSubView(null);
    } else if (stepNumber === 4) {
      setAuthState('app');
      setCurrentRole('teen');
      setTeenTab('home');
      setTeenSubView(null);
      setIsCheckInOpen(true);
    } else if (stepNumber === 5) {
      setAuthState('app');
      setCurrentRole('teen');
      setTeenTab('trends');
      setTeenSubView(null);
    } else if (stepNumber === 6) {
      setAuthState('app');
      setCurrentRole('teen');
      setTeenSubView('milestones');
      const streakMs = milestones.find((m) => m.id === 'ms-7-day-streak') || milestones[0];
      handleTriggerCelebration(streakMs);
    } else if (stepNumber === 7) {
      setAuthState('app');
      setCurrentRole('teen');
      setTeenTab('calm');
      setTeenSubView(null);
    } else if (stepNumber === 8) {
      setAuthState('app');
      setCurrentRole('provider');
    } else if (stepNumber === 9) {
      setAuthState('app');
      setCurrentRole('provider');
    } else if (stepNumber === 10) {
      setAuthState('app');
      setCurrentRole('provider');
    }
  };

  const handleOpenQuickAction = (actionId: string) => {
    if (actionId === 'arcade') {
      handleOpenArcade('clouds');
    } else if (actionId === 'milestones') {
      setTeenSubView('milestones');
    } else if (actionId === 'talk') {
      setTeenSubView('support');
    } else if (actionId === 'calm') {
      setTeenTab('calm');
      setTeenSubView(null);
    } else if (actionId === 'journal') {
      setTeenSubView('journal');
    } else if (actionId === 'trends') {
      setTeenTab('trends');
      setTeenSubView(null);
    } else if (actionId === 'support') {
      setTeenSubView('support');
    } else if (actionId === 'privacy') {
      setTeenSubView('privacy');
    }
  };

  // Auth Views
  if (authState === 'login') {
    return (
      <div className="min-h-screen bg-[#EFF9FD] dark:bg-[#08121A] transition-colors">
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
          onOpenMilestones={() => {
            setAuthState('app');
            setTeenSubView('milestones');
          }}
          onNavigateToLogin={() => setAuthState('login')}
          unreadCount={notifications.filter((n) => n.unread).length}
          userName={userProfile.preferredName}
          isHighContrast={isHighContrast}
          onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
          isLargeText={isLargeText}
          onToggleLargeText={() => setIsLargeText(!isLargeText)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <LoginScreen
          onLoginSuccess={(email, role) => {
            if (role) setCurrentRole(role);
            setAuthState('app');
          }}
          onNavigateToSignup={() => setAuthState('signup')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onExploreAsGuest={() => setAuthState('app')}
        />
        <DemoGuideModal
          isOpen={isDemoGuideOpen}
          onClose={() => setIsDemoGuideOpen(false)}
          currentStep={demoStep}
          onJumpToStep={handleJumpToDemoStep}
        />
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          trustedPersonName="Maya Sharma"
        />
      </div>
    );
  }

  if (authState === 'signup') {
    return (
      <div className="min-h-screen bg-[#EFF9FD] dark:bg-[#08121A] transition-colors">
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
          onOpenMilestones={() => {
            setAuthState('app');
            setTeenSubView('milestones');
          }}
          onNavigateToLogin={() => setAuthState('login')}
          unreadCount={notifications.filter((n) => n.unread).length}
          userName={userProfile.preferredName}
          isHighContrast={isHighContrast}
          onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
          isLargeText={isLargeText}
          onToggleLargeText={() => setIsLargeText(!isLargeText)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <SignupScreen
          onSignupSuccess={(data) => {
            setUserProfile((prev) => ({
              ...prev,
              name: data.name,
              preferredName: data.name,
              age: data.age,
              email: data.emailOrPhone,
            }));
            setAuthState('onboarding');
          }}
          onNavigateToLogin={() => setAuthState('login')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <DemoGuideModal
          isOpen={isDemoGuideOpen}
          onClose={() => setIsDemoGuideOpen(false)}
          currentStep={demoStep}
          onJumpToStep={handleJumpToDemoStep}
        />
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          trustedPersonName="Maya Sharma"
        />
      </div>
    );
  }

  if (authState === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#EFF9FD] dark:bg-[#08121A] transition-colors">
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
          onOpenMilestones={() => {
            setAuthState('app');
            setTeenSubView('milestones');
          }}
          onNavigateToLogin={() => setAuthState('login')}
          unreadCount={notifications.filter((n) => n.unread).length}
          userName={userProfile.preferredName}
          isHighContrast={isHighContrast}
          onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
          isLargeText={isLargeText}
          onToggleLargeText={() => setIsLargeText(!isLargeText)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <OnboardingFlow
          initialName={userProfile.preferredName}
          onComplete={(prefs) => {
            setUserProfile((prev) => ({
              ...prev,
              preferredName: prefs.preferredName,
            }));
            setAuthState('app');
            setTeenTab('home');
          }}
        />
        <DemoGuideModal
          isOpen={isDemoGuideOpen}
          onClose={() => setIsDemoGuideOpen(false)}
          currentStep={demoStep}
          onJumpToStep={handleJumpToDemoStep}
        />
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          trustedPersonName="Maya Sharma"
        />
      </div>
    );
  }

  // Main Application Shell
  return (
    <div className="min-h-screen bg-[#EFF9FD]/50 dark:bg-[#08121A] flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setTeenSubView(null);
        }}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onOpenMilestones={() => setTeenSubView('milestones')}
        onOpenArcade={() => handleOpenArcade('clouds')}
        gameProgress={gameProgress}
        onNavigateToLogin={() => setAuthState('login')}
        unreadCount={notifications.filter((n) => n.unread).length}
        userName={userProfile.preferredName}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Body depending on current Role */}
      {currentRole === 'provider' ? (
        <ProviderDashboard
          cases={cases}
          alerts={alerts}
          followUps={followUps}
          onMarkCaseReviewed={handleMarkCaseReviewed}
          onAddObservation={handleAddObservation}
          onScheduleFollowUp={handleScheduleFollowUp}
          onChangePriority={handleChangePriority}
          onDismissAlert={handleDismissAlert}
          onCompleteFollowUp={handleCompleteFollowUp}
          onAddFollowUp={handleAddFollowUpTask}
        />
      ) : (
        /* Teen Space */
        <div className="flex-1">
          {/* Subview handling (Milestones, Journal, Support Circle, Privacy Center) */}
          {teenSubView === 'milestones' ? (
            <div className="pt-2">
              <MilestonesView
                milestones={milestones}
                achievementBadges={achievementBadges}
                onTriggerCelebration={handleTriggerCelebration}
                onBackToHome={() => setTeenSubView(null)}
              />
            </div>
          ) : teenSubView === 'journal' ? (
            <div className="pt-2">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3">
                <button
                  onClick={() => setTeenSubView(null)}
                  className="text-xs font-bold text-[#0F3A57] hover:underline mb-2 flex items-center gap-1"
                >
                  ← Back to Home
                </button>
              </div>
              <JournalView
                entries={journalEntries}
                onAddEntry={(entry) => {
                  setJournalEntries((prev) => [
                    { id: `j-${Date.now()}`, createdAt: new Date().toISOString(), ...entry },
                    ...prev,
                  ]);
                  // Unlock First Journal milestone
                  setMilestones((currentMs) =>
                    currentMs.map((m) =>
                      m.id === 'ms-first-journal'
                        ? { ...m, isUnlocked: true, unlockedAt: 'Just now' }
                        : m
                    )
                  );
                  // Unlock Ink & Calm achievement badge and celebrate
                  setAchievementBadges((currentBadges) =>
                    currentBadges.map((b) =>
                      b.id === 'badge-first-journal'
                        ? { ...b, unlocked: true, unlockedAt: 'Just now' }
                        : b
                    )
                  );
                  const firstJournalBadge = achievementBadges.find((b) => b.id === 'badge-first-journal');
                  if (firstJournalBadge) {
                    handleTriggerCelebration({
                      ...firstJournalBadge,
                      unlocked: true,
                      unlockedAt: 'Just now',
                    });
                  }
                }}
              />
            </div>
          ) : teenSubView === 'support' ? (
            <div className="pt-2">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3">
                <button
                  onClick={() => setTeenSubView(null)}
                  className="text-xs font-bold text-[#0F3A57] hover:underline mb-2 flex items-center gap-1"
                >
                  ← Back to Home
                </button>
              </div>
              <SupportCircleView />
            </div>
          ) : teenSubView === 'privacy' ? (
            <div className="pt-2">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3">
                <button
                  onClick={() => setTeenSubView(null)}
                  className="text-xs font-bold text-[#0F3A57] hover:underline mb-2 flex items-center gap-1"
                >
                  ← Back to Home
                </button>
              </div>
              <PrivacyCenter
                settings={userProfile.privacy}
                onUpdateSettings={(newPrivacy) =>
                  setUserProfile((prev) => ({ ...prev, privacy: newPrivacy }))
                }
              />
            </div>
          ) : teenTab === 'home' ? (
            <HomeDashboard
              userName={userProfile.preferredName}
              currentScore={userProfile.score}
              scoreStatus={userProfile.scoreStatus}
              scoreChange={userProfile.scoreChange}
              streakDays={userProfile.streakDays}
              weeklyTimeline={weeklyTimeline}
              journalEntries={journalEntries}
              milestones={milestones}
              currentCompanion={currentCompanion}
              availableCompanions={availableCompanions}
              unlockedAccessories={unlockedAccessories}
              quests={quests}
              gameProgress={gameProgress}
              habits={habits}
              habitStreakDays={habitStreakDays}
              onUpdateHabit={handleUpdateHabit}
              onAddHabit={handleAddHabit}
              onAwardXp={handleAwardXp}
              onStartCheckIn={() => setIsCheckInOpen(true)}
              onNavigateToTab={(tab) => {
                setTeenTab(tab);
                setTeenSubView(null);
              }}
              onOpenQuickAction={handleOpenQuickAction}
              onOpenMilestones={() => setTeenSubView('milestones')}
              onTriggerCelebration={handleTriggerCelebration}
              onAddReflection={handleAddReflectionFromRecap}
              onSelectCompanion={handleSelectCompanion}
              onSelectAccessory={handleSelectAccessory}
              onOpenArcade={handleOpenArcade}
              onPetCompanion={handlePetCompanion}
              onClaimChestReward={handleClaimChestReward}
            />
          ) : teenTab === 'checkin' ? (
            <div className="max-w-2xl mx-auto p-6 text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#0F3A57] text-white text-3xl flex items-center justify-center mx-auto shadow-md">
                💭
              </div>
              <h2 className="text-2xl font-bold text-[#0F3A57]">Ready for today's check-in?</h2>
              <p className="text-xs text-[#547489] max-w-sm mx-auto">
                Take 60 seconds to reflect on your sleep, energy, and headspace.
              </p>
              <button
                onClick={() => setIsCheckInOpen(true)}
                className="px-6 py-3 rounded-2xl bg-[#0F3A57] text-white font-bold text-xs hover:bg-[#234C68] transition-all shadow-md active:scale-95"
              >
                Launch Check-in
              </button>
            </div>
          ) : teenTab === 'trends' ? (
            <TrendsView
              currentScore={userProfile.score}
              scoreStatus={userProfile.scoreStatus}
              scoreChange={userProfile.scoreChange}
              userName={userProfile.preferredName}
              onNavigateToCalm={() => {
                setTeenTab('calm');
                setTeenSubView(null);
              }}
              onNavigateToJournal={() => {
                setTeenSubView('journal');
              }}
            />
          ) : teenTab === 'calm' ? (
            <CalmSpace
              companionId={currentCompanion.id}
              accessory={currentCompanion.accessory}
            />
          ) : (
            <ProfileView
              onOpenPrivacyCenter={() => setTeenSubView('privacy')}
              onOpenMilestones={() => setTeenSubView('milestones')}
              onOpenLogin={() => setAuthState('login')}
              onOpenSignup={() => setAuthState('signup')}
              onLogout={() => setAuthState('login')}
              isHighContrast={isHighContrast}
              onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
              isLargeText={isLargeText}
              onToggleLargeText={() => setIsLargeText(!isLargeText)}
              preferredName={userProfile.preferredName}
              onUpdatePreferredName={(name) =>
                setUserProfile((prev) => ({ ...prev, preferredName: name }))
              }
              achievementBadges={achievementBadges}
              onTriggerCelebration={handleTriggerCelebration}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          )}

          {/* 27. Bottom Navigation for Teen/Survivor view */}
          <BottomNav
            currentTab={teenTab}
            onTabChange={(tab) => {
              setTeenTab(tab);
              setTeenSubView(null);
            }}
          />
        </div>
      )}

      {/* Global Interactive Modals */}
      <ArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        currentCompanion={currentCompanion}
        gameProgress={gameProgress}
        onAwardXp={handleAwardXp}
        onCloudsPopped={handleCloudsPopped}
        onPlantBloomed={handlePlantBloomed}
        initialGame={arcadeInitialGame}
      />

      <ConfettiEffect
        active={isConfettiActive}
        onComplete={() => setIsConfettiActive(false)}
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmitCheckIn={handleSubmitCheckIn}
      />

      <MilestoneCelebrationModal
        milestone={celebrationMilestone}
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        trustedPersonName="Maya Sharma"
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
        }
      />

      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        currentStep={demoStep}
        onJumpToStep={handleJumpToDemoStep}
      />
    </div>
  );
}
