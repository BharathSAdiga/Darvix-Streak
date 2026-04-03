import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import './Landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="glass-navbar">
        <div className="nav-logo">
          <Flame color="var(--accent-orange)" size={24} />
          <span>Dravix</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        <button className="nav-cta" onClick={() => navigate('/app')}>
          Get Started
        </button>
      </nav>

      <main className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">
            Build Discipline.<br />
            Track Your <span className="text-gradient">Streak.</span>
          </h1>
          <p className="hero-subtitle">
            Gamify your life with a dopamine-driven productivity system. Build habits that stick forever.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/app')}>
              Start Tracking Free
            </button>
            <button className="secondary-btn">
              How it works
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div 
            className="floating-mock-ui"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="mock-ui-header">
              <h3>Dravix Pro</h3>
              <Star color="var(--accent-orange)" size={20} fill="var(--accent-orange)"/>
            </div>
            
            <div className="mock-stat-box">
              <span className="mock-stat-label">Current Streak</span>
              <div className="mock-stat-value text-gradient">
                <Flame size={32} /> 12 Days
              </div>
            </div>

            <div className="mock-stats-row">
              <div className="mock-mini-stat">
                <span>XP</span>
                <strong>240</strong>
              </div>
              <div className="mock-mini-stat">
                <span>Level</span>
                <strong>3</strong>
              </div>
            </div>
            
            <div className="mock-progress-bar">
              <div className="mock-progress-fill" style={{ width: '60%' }}></div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
