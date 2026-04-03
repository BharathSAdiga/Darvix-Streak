export type HabitCategory = 'Fitness' | 'Study' | 'Coding' | 'Reading' | 'Mindfulness' | 'Other';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  color: string;
  icon: string;
  createdAt: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // ISO Date "YYYY-MM-DD"
  hasFrozenToday: boolean;
  freezesAvailable: number;
  completedDays: string[]; // Set of "YYYY-MM-DD"
}

export interface UserStats {
  level: number;
  xp: number;
  totalCompletedHabits: number;
  activeStreaks: number;
}
