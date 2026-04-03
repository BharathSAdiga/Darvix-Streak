import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Habit } from '../types';
import { format } from 'date-fns';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'lastCompletedDate' | 'hasFrozenToday' | 'freezesAvailable' | 'completedDays'>) => void;
  markHabitDone: (id: string) => void;
  freezeHabit: (id: string) => void;
  todayDateStr: string;
  totalXP: number;
  level: number;
  levelProgress: number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const initialHabits: Habit[] = [
  { id: '1', title: 'Daily Workout', category: 'Fitness', color: 'var(--accent-red)', icon: 'Dumbbell', createdAt: Date.now(), currentStreak: 5, longestStreak: 12, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 1, completedDays: [] },
  { id: '2', title: 'Read 20 pages', category: 'Reading', color: 'var(--accent-orange)', icon: 'BookOpen', createdAt: Date.now(), currentStreak: 3, longestStreak: 3, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 1, completedDays: [] },
  { id: '3', title: 'LeetCode Problem', category: 'Coding', color: 'var(--accent-blue)', icon: 'Code', createdAt: Date.now(), currentStreak: 14, longestStreak: 21, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 0, completedDays: [] },
  { id: '4', title: 'Meditation 10m', category: 'Mindfulness', color: 'var(--accent-green)', icon: 'Cloud', createdAt: Date.now(), currentStreak: 0, longestStreak: 5, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 1, completedDays: [] },
  { id: '5', title: 'Review Flashcards', category: 'Study', color: '#9d4edd', icon: 'Brain', createdAt: Date.now(), currentStreak: 2, longestStreak: 10, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 1, completedDays: [] },
  { id: '6', title: 'Drink Tracker', category: 'Other', color: '#00b4d8', icon: 'Droplet', createdAt: Date.now(), currentStreak: 8, longestStreak: 8, lastCompletedDate: null, hasFrozenToday: false, freezesAvailable: 1, completedDays: [] },
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('dravix_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const todayDateStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    localStorage.setItem('dravix_habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'lastCompletedDate' | 'hasFrozenToday' | 'freezesAvailable' | 'completedDays'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      hasFrozenToday: false,
      freezesAvailable: 1, // 1 allowed freeze per habit
      completedDays: [],
    };
    setHabits([...habits, habit]);
  };

  const markHabitDone = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        if (h.lastCompletedDate === todayDateStr) return h; // already done

        const newCurrent = h.lastCompletedDate === null ? 1 : h.currentStreak + 1; // Simplify streak logic for demo

        return {
          ...h,
          currentStreak: newCurrent,
          longestStreak: Math.max(h.longestStreak, newCurrent),
          lastCompletedDate: todayDateStr,
          completedDays: [...h.completedDays, todayDateStr]
        };
      }
      return h;
    }));
  };

  const freezeHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && h.freezesAvailable > 0 && h.lastCompletedDate !== todayDateStr && !h.hasFrozenToday) {
        return {
          ...h,
          freezesAvailable: h.freezesAvailable - 1,
          hasFrozenToday: true,
          lastCompletedDate: todayDateStr // pretend it's done so we don't break streak tomorrow
        };
      }
      return h;
    }));
  };

  // Gamification Computations
  const totalXP = habits.reduce((acc, habit) => acc + (habit.completedDays.length * 10), 0);
  const XP_PER_LEVEL = 100;
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const levelProgress = (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  return (
    <HabitContext.Provider value={{ habits, addHabit, markHabitDone, freezeHabit, todayDateStr, totalXP, level, levelProgress }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
