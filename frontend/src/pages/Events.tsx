import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Event } from '../types';
import EventCard from '../components/EventCard';
import styles from './Events.module.css';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        // Sort by date descending
        const sorted = data.sort((a: Event, b: Event) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEvents(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading Events...</div>;

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <motion.h1 
        className={styles.pageTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Our Journey & Events
      </motion.h1>

      <div className={styles.grid}>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Events;
