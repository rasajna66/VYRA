export type UserRole = 'teen' | 'provider';

export type MoodType = 'great' | 'good' | 'meh' | 'low' | 'struggling';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  subtext: string;
}

export interface CheckInRecord {
  id: string;
  date: string;
  dayLabel: string;
  mood: MoodType;
  score: number;
  energyLevel: number; // 1-5
  sleepHours: number;
  noteText?: string;
  voiceNoteUrl?: string;
  voiceAnalysis?: {
    pitchVariance: string;
    speechPacing: string;
    fatigueDetected: boolean;
  };
  tags: string[];
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: MoodType;
  date: string;
  createdAt: string;
  isPrivate: boolean;
  sharedWithProfessional: boolean;
}

export type PriorityLevel = 'Needs attention' | 'Elevated' | 'High priority';

export interface ProviderCase {
  id: string;
  patientName: string;
  preferredName: string;
  age: number;
  currentScore: number;
  previousScore: number;
  change: number; // e.g. +19
  trend: 'up' | 'down' | 'stable';
  priority: PriorityLevel;
  lastCheckIn: string;
  consent: {
    voiceAnalysis: boolean;
    textAnalysis: boolean;
    professionalSharing: boolean;
    researchSharing: boolean;
  };
  assignedProfessional: string;
  reviewedToday: boolean;
  signals: {
    textPatterns: string[];
    voicePatterns: string[];
    checkInResponses: string[];
    longitudinalChanges: string[];
  };
  aiExplanation: string;
  timeline: { day: string; score: number; mood: MoodType }[];
  clinicalObservations: { id: string; author: string; date: string; note: string }[];
  scheduledFollowUp?: string;
  followUpReason?: string;
}

export interface ProviderAlert {
  id: string;
  caseId: string;
  patientName: string;
  level: PriorityLevel;
  timestamp: string;
  whatChanged: string;
  whenItChanged: string;
  whyItMatters: string;
  recommendedAction: string;
  isDismissed?: boolean;
}

export interface FollowUpTask {
  id: string;
  caseId: string;
  patientName: string;
  reason: string;
  dueDate: string;
  status: 'Due today' | 'Upcoming' | 'Overdue' | 'Completed';
  assignedProfessional: string;
}

export type MilestoneCategory = 'streak' | 'reflection' | 'calm' | 'connection' | 'privacy';

export interface Milestone {
  id: string;
  title: string;
  gentlePraise: string;
  description: string;
  icon: string;
  category: MilestoneCategory;
  progress: number;
  target: number;
  unit: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  gentleReminder: string;
  celebrationQuote: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Special';
  tierLevel: number;
  icon: string;
  category: 'journal' | 'streak' | 'calm' | 'support' | 'privacy';
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressText?: string;
  perk: string;
  color: string;
  borderColor: string;
}

export type CompanionId = 'vyra' | 'pebble' | 'sunny' | 'bloom';

export type CompanionAccessoryId = 'none' | 'crown' | 'scarf' | 'glasses' | 'flower' | 'wings';

export interface CompanionData {
  id: CompanionId;
  name: string;
  species: string;
  description: string;
  mood: 'happy' | 'peaceful' | 'sleepy' | 'cheering' | 'curious';
  accessory: CompanionAccessoryId;
  favoriteVibe: string;
  colorTheme: {
    bg: string;
    border: string;
    primary: string;
    accent: string;
  };
}

export interface WellbeingQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'checkin' | 'arcade' | 'calm' | 'journal' | 'pet';
  progress: number;
  target: number;
  unit: string;
  isCompleted: boolean;
  icon: string;
}

export interface GameProgress {
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  cloudsPoppedTotal: number;
  flowersBloomedTotal: number;
  memoryPairsFoundTotal: number;
  unlockedAccessories: CompanionAccessoryId[];
}

export interface DailyHabit {
  id: string;
  title: string;
  description: string;
  category: 'hydration' | 'sunlight' | 'movement' | 'mindfulness' | 'rest' | 'nutrition';
  icon: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  completed: boolean;
  xpReward: number;
  timeOfDay?: 'morning' | 'anytime' | 'evening';
}


