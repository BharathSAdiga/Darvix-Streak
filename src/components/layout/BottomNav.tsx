import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BarChart2, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/stats', icon: BarChart2, label: 'Stats' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => {
            const Icon = item.icon;
            return (
              <>
                <div className={`icon-container ${isActive ? 'active-icon' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="nav-label">{item.label}</span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
};
