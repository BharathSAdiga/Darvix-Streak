import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../contexts/HabitContext';
import { Trophy, Target, Award, Zap } from 'lucide-react';
import './Stats.css';

export const Stats: React.FC = () => {
  const { habits } = useHabits();

  const totalActiveStreaks = habits.filter(h => h.currentStreak > 0).length;
  const highestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const totalCompleted = habits.reduce((acc, h) => acc + h.completedDays.length, 0);
  
  // Fake gamification logic
  const xp = totalCompleted * 10 + totalActiveStreaks * 50;
  const level = Math.floor(xp / 500) + 1;
  const xpForNextLevel = level * 500;
  const progressPercent = (xp % 500) / 500 * 100;

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>Your <span className="text-gradient">Legacy</span></h1>
      </header>

      <motion.div 
        className="glass-panel level-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="level-info">
          <div>
            <span className="level-badge">Level {level}</span>
            <h2>Streak Master</h2>
          </div>
          <div className="xp-counter">
            <span className="current-xp">{xp}</span>
            <span className="total-xp">/ {xpForNextLevel} XP</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </motion.div>

      <div className="stats-grid">
        <motion.div className="glass-panel stat-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <FlameIcon />
          <h3>{totalActiveStreaks}</h3>
          <p>Active Streaks</p>
        </motion.div>
        
        <motion.div className="glass-panel stat-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Trophy className="stat-icon" style={{ color: 'var(--accent-orange)' }} />
          <h3>{highestStreak}</h3>
          <p>Best Streak</p>
        </motion.div>
        
        <motion.div className="glass-panel stat-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Target className="stat-icon" style={{ color: 'var(--accent-green)' }} />
          <h3>{habits.length}</h3>
          <p>Total Habits</p>
        </motion.div>
        
        <motion.div className="glass-panel stat-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Award className="stat-icon" style={{ color: 'var(--accent-blue)' }} />
          <h3>{totalCompleted}</h3>
          <p>Total Check-ins</p>
        </motion.div>
      </div>
    </div>
  );
};

const FlameIcon = () => <Zap className="stat-icon" style={{ color: 'var(--accent-red)' }} />;
