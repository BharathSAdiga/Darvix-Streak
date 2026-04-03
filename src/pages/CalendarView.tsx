import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { format, startOfWeek, addDays, getWeeksInMonth, startOfMonth, subMonths, addMonths, isSameDay } from 'date-fns';
import './CalendarView.css';
import { motion } from 'framer-motion';

export const CalendarView: React.FC = () => {
  const { habits } = useHabits();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Determine intensity for a day based on how many habits were done
  const getIntensityClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const doneCount = habits.filter(h => h.completedDays.includes(dateStr)).length;
    
    if (doneCount === 0) return 'level-0';
    if (doneCount <= 2) return 'level-1';
    if (doneCount <= 4) return 'level-2';
    return 'level-3'; // max intensity
  };

  const renderCells = () => {
    const rows = [];
    const weeks = Math.max(5, getWeeksInMonth(currentDate)); // ensure 5 or 6 rows
    let day = startDate;

    for (let i = 0; i < weeks; i++) {
      const days = [];
      for (let j = 0; j < 7; j++) {
        const cloneDay = day;
        const isCurrentMonth = format(cloneDay, 'M') === format(monthStart, 'M');
        const isToday = isSameDay(cloneDay, new Date());
        
        days.push(
          <div 
            className={`col cell ${!isCurrentMonth ? 'disabled' : ''} ${isToday ? 'today' : ''}`}
            key={cloneDay.toISOString()}
          >
            <span className="number">{format(cloneDay, 'd')}</span>
            {isCurrentMonth && <div className={`heatmap-dot ${getIntensityClass(cloneDay)}`}></div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="row" key={day.toISOString()}>{days}</div>);
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h1>Consistency <span className="text-gradient">Map</span></h1>
      </header>

      <motion.div 
        className="glass-panel calendar-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="header row flex-middle">
          <div className="col col-start" onClick={prevMonth}>
            <div className="icon">{'<'}</div>
          </div>
          <div className="col col-center">
            <span>{format(currentDate, 'MMMM yyyy')}</span>
          </div>
          <div className="col col-end" onClick={nextMonth}>
            <div className="icon">{'>'}</div>
          </div>
        </div>
        
        <div className="days row">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div className="col col-center week-name" key={d}>{d}</div>
          ))}
        </div>
        
        {renderCells()}
      </motion.div>

      <div className="intensity-legend">
        <span>Less</span>
        <div className="heatmap-dot level-0"></div>
        <div className="heatmap-dot level-1"></div>
        <div className="heatmap-dot level-2"></div>
        <div className="heatmap-dot level-3"></div>
        <span>More</span>
      </div>
    </div>
  );
};
