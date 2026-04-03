import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HabitProvider } from './contexts/HabitContext';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { Stats } from './pages/Stats';
import { CalendarView } from './pages/CalendarView';
import { Landing } from './pages/Landing';
import { AddHabitModal } from './components/habits/AddHabitModal';
import { Plus } from 'lucide-react';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
    <h2>{title} (Coming Soon)</h2>
  </div>
);

function AppLayout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="responsive-app-layout">
      <BottomNav />
      
      <div className="app-content-area">
        <Outlet />
        
        <button className="fab" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={28} color="white" />
        </button>
        
        <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
      <style>{`
        .fab {
          position: absolute;
          bottom: 100px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background: var(--brand-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(255, 59, 48, 0.4);
          z-index: 90;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .fab:hover {
          transform: scale(1.05);
        }
        .fab:active {
          transform: scale(0.95);
        }

        @media (min-width: 768px) {
          .fab {
            bottom: 40px;
            right: 40px;
            width: 72px;
            height: 72px;
            border-radius: 36px;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <HabitProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="stats" element={<Stats />} />
            <Route path="profile" element={<PlaceholderPage title="Profile" />} />
          </Route>
        </Routes>
      </Router>
    </HabitProvider>
  );
}

export default App;
