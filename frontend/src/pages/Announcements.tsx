import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Announcements.module.css';
import { announcementsData } from '../data/announcements';

const Announcements = () => {
  const announcements = [...announcementsData].sort((a, b) => {
    if (a.tag === 'Urgent' && b.tag !== 'Urgent') return -1;
    if (b.tag === 'Urgent' && a.tag !== 'Urgent') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' 
    ? announcements 
    : announcements.filter(a => a.tag === filter);

  const getMonth = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' });
  };

  const getDay = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <motion.h1 
        className={styles.pageTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Announcements
      </motion.h1>

      <div className={styles.filterContainer}>
        {['All', 'Academic', 'Event', 'Urgent'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className={styles.list}>
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.card}
            >
              <div className={styles.dateBox}>
                <span className={styles.day}>{getDay(item.date)}</span>
                <span className={styles.month}>{getMonth(item.date)}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <span className={`${styles.tag} ${styles[`tag${item.tag}`]}`}>
                    {item.tag}
                  </span>
                </div>
                <div className={styles.description}>
                  {item.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                    part.match(/^https?:\/\//) ? (
                      <a 
                        key={i} 
                        href={part} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                      >
                        {part}
                      </a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>
            No announcements found.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Announcements;
