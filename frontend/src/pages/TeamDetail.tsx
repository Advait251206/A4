import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TeamMember } from '../types';
import styles from './Team.module.css';
import { teamData } from '../data/team';

const TeamDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const found = teamData.find(m => m.id === id);
    if (found) {
      setMember(found);
      setLoading(false);
    } else {
      setLoading(false); // Member remains null, triggers not found
    }
  }, [id]);

  if (loading) return <div className="loader">Loading Profile...</div>;
  if (!member) return <div className="container">Member not found</div>;

  return (
    <motion.div 
      className={styles.detailContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link to="/team" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
        <ArrowLeft size={20} /> Back to Team
      </Link>

      <div className={styles.detailHeader}>
        <img 
          src={member.photo} 
          alt={member.name} 
          className={styles.detailImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=256`;
          }}
        />
        <div className={styles.detailInfo}>
          <h1>{member.name}</h1>
          <div className={styles.detailRole}>{member.role}</div>
          <div className={styles.socials} style={{ justifyContent: 'flex-start' }}>
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Github size={24} />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                <Linkedin size={24} />
              </a>
            )}
            <a href={`mailto:${member.id}@example.com`} className={styles.socialIcon}>
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.quote}>
        "{member.quote}"
      </div>

      <div className={styles.section}>
        <h2>About</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
          {member.bio}
        </p>
      </div>

      <div className={styles.section}>
        <h2>Skills & Interests</h2>
        <div className={styles.skillsTags}>
          {member.skills.map(skill => (
            <span key={skill} className={styles.skillTag}>{skill}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDetail;
