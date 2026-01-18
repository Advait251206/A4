import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import type { Subject, TimetableSlot } from '../types';
import styles from './StudyHub.module.css';
import CalendarView from '../components/CalendarView';
import { timetableData } from '../data/timetable';
import { subjectsData } from '../data/subjects';

const StudyHub = () => {
  const [subjects, setSubjects] = useState<Subject[]>(subjectsData); // Initialize with local data
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Removed loading state since we have local data now, or keep it false
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetch('/api/studyhub/subjects')... 
  //   We can keep this if we want to fetch updates, but user asked for specific subjects.
  //   For now, strictly use the local file.
  // }, []);

  const dailySchedule = useMemo(() => {
     const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    return timetableData.filter(slot => slot.day === dayName);
  }, [selectedDate]);

  if (loading) return <div className="loader">Loading Academic Resources...</div>;

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <motion.h1 
        className={styles.pageTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Academic Hub
      </motion.h1>

      {/* Timetable Section */}
      <motion.section 
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={styles.sectionTitle}>
          <Calendar /> Daily Schedule
        </h2>
        
        <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />

        <div className={styles.timetableWrapper}>
          {dailySchedule.length > 0 ? (
            <table className={styles.timetable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {dailySchedule.map((slot, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} /> {slot.time}
                      </div>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{slot.subject}</td>
                    <td>{slot.faculty || '-'}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{slot.room || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className={styles.emptyState}>
               <p>No classes scheduled for this day.</p>
             </div>
          )}
        </div>
      </motion.section>

      {/* Subjects Section */}
      <motion.section 
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>
          <BookOpen /> Subjects & Resources
        </h2>
        <div className={styles.subjectGrid}>
          {subjects.map(subject => (
            <Link to={`/study-hub/${subject.id}`} key={subject.id}>
              <div className={styles.subjectCard}>
                <h3 className={styles.subjectName}>{subject.name}</h3>
                <div className={styles.facultyName}>
                  <User size={16} /> {subject.faculty}
                </div>
                <div className={styles.cardFooter}>
                  <span>{subject.studyNotes.length + subject.externalResources.length} Resources</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default StudyHub;
