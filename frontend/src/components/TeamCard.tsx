import { Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TeamMember } from '../types';
import styles from '../pages/Team.module.css';

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard = ({ member }: TeamCardProps) => {
  return (
    <Link to={`/team/${member.id}`}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img 
            src={member.photo} 
            alt={member.name} 
            className={styles.photo}
            // Fallback for demo since we don't assume images exist yet
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
            }}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{member.name}</h3>
          <div className={styles.role}>{member.role}</div>
          
          <div className={styles.overlay}>
            <span className={styles.interest}>{member.interest}</span>
            <div className={styles.socials}>
              {member.github && (
                <div className={styles.socialIcon} onClick={(e) => e.stopPropagation()}>
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <Github size={18} />
                  </a>
                </div>
              )}
              {member.linkedin && (
                <div className={styles.socialIcon} onClick={(e) => e.stopPropagation()}>
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin size={18} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
