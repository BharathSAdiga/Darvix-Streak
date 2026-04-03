import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';
import type { HabitCategory } from '../../types';
import './AddHabitModal.css';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: HabitCategory; color: string }[] = [
  { label: 'Fitness', color: 'var(--accent-red)' },
  { label: 'Study', color: '#9d4edd' },
  { label: 'Coding', color: 'var(--accent-blue)' },
  { label: 'Reading', color: 'var(--accent-orange)' },
  { label: 'Mindfulness', color: 'var(--accent-green)' },
  { label: 'Other', color: '#00b4d8' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Other');
  
  const selectedCategory = CATEGORIES.find(c => c.label === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      category: category,
      color: selectedCategory?.color || '#ffffff',
      icon: 'Circle' // Simplified for demo, ideally user selects an icon
    });
    
    setTitle('');
    setCategory('Other');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="modal-content glass-panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="modal-header">
              <h3>Create New Streak</h3>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-habit-form">
              <div className="form-group">
                <label>What do you want to achieve?</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100 Pushups"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <div className="category-selector">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      className={`category-pill ${category === c.label ? 'selected' : ''}`}
                      style={{ 
                        borderColor: category === c.label ? c.color : 'transparent',
                        color: category === c.label ? c.color : 'var(--text-secondary)'
                      }}
                      onClick={() => setCategory(c.label)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                style={{ background: selectedCategory?.color }}
                disabled={!title.trim()}
              >
                Start Streak
              </button>
            </form>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
