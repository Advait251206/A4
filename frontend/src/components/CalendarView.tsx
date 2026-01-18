import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarView.module.css';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarView = ({ selectedDate, onDateSelect }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate days array
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDate(date, today);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={20} /></button>
        <div className={styles.monthTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={20} /></button>
      </div>

      <div className={styles.grid}>
        {weekDays.map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
        
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className={styles.emptySlot} />;
          
          const isSelected = isSameDate(date, selectedDate);
          const today = isToday(date);

          return (
            <motion.button
              key={date.toISOString()}
              className={`${styles.dayCell} ${isSelected ? styles.selected : ''} ${today ? styles.today : ''}`}
              onClick={() => onDateSelect(date)}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              {date.getDate()}
              {today && <span className={styles.todayDot} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
