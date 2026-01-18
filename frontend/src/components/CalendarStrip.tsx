import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarStrip.module.css';

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarStrip = ({ selectedDate, onDateSelect }: CalendarStripProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate an array of dates (e.g., next 14 days or surrounding dates)
  // For a timetable, maybe just the current week? Or a continuous scroll.
  // Let's do a 2-week sliding window starting from "today" - 2 days.
  const dates: Date[] = [];
  const startOffset = -2;
  const daysToShow = 14;
  
  const today = new Date();
  // Normalize today to start of day
  today.setHours(0, 0, 0, 0);

  for (let i = startOffset; i < daysToShow + startOffset; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div className={styles.container}>
      <button className={styles.navButton} onClick={() => scroll('left')}>
        <ChevronLeft size={20} />
      </button>
      
      <div className={styles.scrollArea} ref={scrollRef}>
        {dates.map((date) => {
          const isSelected = isSameDate(date, selectedDate);
          const isToday = isSameDate(date, today);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();
          
          return (
            <motion.button
              key={date.toISOString()}
              className={`${styles.dateCard} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => onDateSelect(date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.dayName}>{dayName}</span>
              <span className={styles.dayNum}>{dayNum}</span>
              {isToday && <span className={styles.todayDot} />}
            </motion.button>
          );
        })}
      </div>

      <button className={styles.navButton} onClick={() => scroll('right')}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CalendarStrip;
