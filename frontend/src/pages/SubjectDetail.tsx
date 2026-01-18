import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ExternalLink, Bookmark } from 'lucide-react';
import type { Subject } from '../types';
import styles from './StudyHub.module.css';
import { subjectsData } from '../data/subjects';

const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundSubject = subjectsData.find(s => s.id === id);
    if (foundSubject) {
      setSubject(foundSubject);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="loader">Loading Subject...</div>;
  if (!subject) return <div className="container">Subject not found</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <Link to="/study-hub" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
        <ArrowLeft size={20} /> Back to Hub
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{subject.name}</h1>
        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
          Faculty: <span style={{ color: 'var(--color-text-primary)' }}>{subject.faculty}</span>
        </div>

        {subject.studyNotes.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FileText /> Study Notes
            </h2>
            <div className={styles.resourceList}>
              {subject.studyNotes.map((note, idx) => (
                <a href={note.url} target="_blank" rel="noreferrer" key={idx} className={styles.resourceItem}>
                  <span>{note.title}</span>
                  <ExternalLink size={16} style={{ color: 'var(--color-text-muted)' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {subject.importantTopics.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Bookmark /> Important Topics
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {subject.importantTopics.map((topic, idx) => (
                <span key={idx} className={styles.tag} style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {subject.externalResources.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ExternalLink /> External Resources
            </h2>
            <div className={styles.resourceList}>
              {subject.externalResources.map((res, idx) => (
                <a href={res.url} target="_blank" rel="noreferrer" key={idx} className={styles.resourceItem}>
                  <span>{res.title}</span>
                  <ExternalLink size={16} style={{ color: 'var(--color-text-muted)' }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SubjectDetail;
