import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Snowflake, Crown, Trophy, Zap } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import './Dashboard.css';

const ProgressRing: React.FC<{ isDone: boolean; color: string }> = ({ isDone, color }) => (
  <div className="progress-ring-container">
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      <motion.circle 
        cx="24" cy="24" r="20" fill="none" 
        stroke={color} strokeWidth="3" 
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
    </svg>
    <div className="progress-icon">
      {isDone && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}><Check size={20} color={color} strokeWidth={3} /></motion.div>}
    </div>
  </div>
);

const DailyCircularProgress: React.FC<{ completed: number, total: number }> = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : (completed / total);
  
  return (
    <div className="daily-progress-widget">
      <div className="circular-chart-container">
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path className="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path className="circle"
            strokeDasharray={`${percentage * 100}, 100`}
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${percentage * 100}, 100` }}
            transition={{ duration: 1, ease: "easeOut" }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="chart-center">
          <span className="chart-percentage">{Math.round(percentage * 100)}%</span>
        </div>
      </div>
      <div className="daily-progress-info">
        <h3>Today's Progress</h3>
        <p>{completed} of {total} missions completed</p>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { habits, markHabitDone, freezeHabit, todayDateStr, level, totalXP, levelProgress } = useHabits();
  const [celebrateId, setCelebrateId] = useState<string | null>(null);

  const featuredHabit = habits.reduce((prev, current) => 
    (prev.currentStreak > current.currentStreak) ? prev : current
  , habits[0]);

  const maxOverallStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const doneTodayCount = habits.filter(h => h.lastCompletedDate === todayDateStr).length;

  const handleMarkDone = (id: string) => {
    setCelebrateId(id);
    markHabitDone(id);
    setTimeout(() => setCelebrateId(null), 1500);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="header-top">
          <div>
            <h1 className="greeting">HQ</h1>
            <p className="date-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="player-profile-badge">
            <div className="level-shield">
              <Shield size={24} color="var(--brand-gradient)" />
              <span>{level}</span>
            </div>
            <div className="xp-details">
              <span className="xp-text">{totalXP} XP</span>
              <div className="xp-bar-bg">
                <motion.div 
                  className="xp-bar-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="dashboard-grid-top">
        {featuredHabit && (
          <motion.div 
            className="featured-streak-card glass-panel dopamine-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <motion.div 
              className="featured-bg-glow"
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2>{featuredHabit.title}</h2>
            <div className="streak-big-number">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flame size={56} className="flame-icon" strokeWidth={2} />
              </motion.div>
              <motion.span 
                className="text-gradient"
                key={featuredHabit.currentStreak}
                initial={{ scale: 1.5, filter: "blur(4px)" }}
                animate={{ scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {featuredHabit.currentStreak}
              </motion.span>
              <span className="streak-label">Days</span>
            </div>
            <p className="streak-subtitle fw-bold text-gradient">Don't break the chain.</p>
          </motion.div>
        )}

        <div className="side-widgets">
          <DailyCircularProgress completed={doneTodayCount} total={habits.length} />
          
          <div className="badges-widget glass-panel">
            <h3>Milestone Badges</h3>
            <div className="badges-row">
              <div className={`badge-icon ${maxOverallStreak >= 7 ? 'unlocked' : 'locked'}`}>
                <Zap size={24} />
                <span>7 Days</span>
              </div>
              <div className={`badge-icon ${maxOverallStreak >= 30 ? 'unlocked text-gradient' : 'locked'}`}>
                <Crown size={24} />
                <span>30 Days</span>
              </div>
              <div className={`badge-icon ${level >= 10 ? 'unlocked text-gradient' : 'locked'}`}>
                <Trophy size={24} />
                <span>Lvl 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title-container">
        <h3>Today's Missions</h3>
      </div>

      <div className="habits-list">
        <AnimatePresence>
          {habits.map((habit) => {
            const isDone = habit.lastCompletedDate === todayDateStr;
            const isFrozen = habit.hasFrozenToday && habit.lastCompletedDate === todayDateStr;
            const isCelebrating = celebrateId === habit.id;

            return (
              <motion.div 
                key={habit.id}
                className={`habit-card glass-panel ${isDone ? 'done' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout 
                whileTap={!isDone ? { scale: 0.98 } : {}}
              >
                <div className="habit-info">
                  <motion.div 
                    className="habit-color-indicator" 
                    style={{ backgroundColor: isDone ? 'var(--text-tertiary)' : habit.color }}
                    layout
                  />
                  <div>
                    <h4>{habit.title}</h4>
                    <span className="habit-category">
                      {habit.category} • 
                      <span style={{ color: habit.color, display: 'inline-flex', alignItems: 'center', margin: '0 4px', fontWeight: 600 }}>
                        <Flame size={12} style={{ marginRight: 2 }} /> {habit.currentStreak}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="habit-actions">
                  {!isDone && (
                    <div className="xp-pill text-gradient">+10 XP</div>
                  )}

                  {!isDone && habit.freezesAvailable > 0 && (
                    <motion.button 
                      className="action-btn freeze-btn"
                      onClick={() => freezeHabit(habit.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Snowflake size={20} />
                    </motion.button>
                  )}
                  
                  <div style={{ position: 'relative' }}>
                    <AnimatePresence>
                      {isCelebrating && (
                        <>
                          <motion.div 
                            className="celebration-flame float-up"
                            initial={{ opacity: 1, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -60, scale: 2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                          >
                            🔥
                          </motion.div>
                          <motion.div 
                            className="celebration-xp text-gradient float-up-right"
                            initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -50, x: 30, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                          >
                            +10 XP
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    <motion.button 
                      className={`action-btn check-btn ${isDone ? 'checked' : ''} ${isFrozen ? 'frozen' : ''}`}
                      onClick={() => handleMarkDone(habit.id)}
                      disabled={isDone}
                      whileHover={!isDone ? { scale: 1.05 } : {}}
                      whileTap={!isDone ? { scale: 0.9 } : {}}
                      style={{ padding: 0, background: 'transparent', border: 'none' }}
                    >
                      {isFrozen ? (
                        <div className="frozen-state"><Snowflake size={24} /></div>
                      ) : (
                        <ProgressRing isDone={isDone} color={habit.color} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Shield Icon Definition locally since lucide-react might not export Shield naturally if using an old version, fallback just in case
const Shield = ({ size, color }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
