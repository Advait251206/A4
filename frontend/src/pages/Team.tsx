import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, Linkedin, Quote } from 'lucide-react';
import type { TeamMember } from '../types';
import styles from './Team.module.css';

const RADIUS = 700; // Match CSS width/2
const ANGLE_STEP = 15; // Degrees per item

import { teamData } from '../data/team';

const Team = () => {
  const members: TeamMember[] = teamData;
  const [loading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  if (loading) return <div className="loader">Loading People...</div>;
  
  if (members.length === 0) return <div>No members found.</div>;

  const activeMember = members[activeIndex];
  const orbitRotation = -activeIndex * ANGLE_STEP;

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* Navigation Buttons for convenience */}
      <button className={`${styles.navButton} ${styles.prev}`} onClick={handlePrev}>
        <ChevronLeft />
      </button>
      <button className={`${styles.navButton} ${styles.next}`} onClick={handleNext}>
        <ChevronRight />
      </button>

      {/* ARC CONTAINER */}
      <div className={styles.arcContainer}>
        <motion.div 
          className={styles.orbit}
          animate={{ rotate: orbitRotation }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          {members.map((member, index) => {
             const itemAngle = index * ANGLE_STEP;
             const isActive = index === activeIndex;
             
             return (
               <div 
                 key={member.id}
                 className={`${styles.memberItem} ${isActive ? styles.activeItem : ''}`}
                 style={{
                    // Origin = center of circle (60px) + Radius (700px) = 760px
                    transformOrigin: `center ${RADIUS + 60}px`, 
                    transform: `rotate(${itemAngle}deg)`
                 }}
                 onClick={() => setActiveIndex(index)}
               >
                 <div className={styles.imageWrapper}>
                    <motion.img 
                      src={member.photo || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjZmZmIiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'} 
                      alt={member.name}
                      className={styles.imageInner}
                      animate={{ rotate: -(itemAngle + orbitRotation) }}
                      transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                 </div>
                 <motion.div 
                    className={styles.memberName}
                    animate={{ 
                      rotate: -(itemAngle + orbitRotation),
                      opacity: isActive ? 1 : 0
                    }}
                 >
                    {member.name}
                 </motion.div>
               </div>
             );
          })}
        </motion.div>
      </div>

      {/* ABOUT SECTION */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeMember.id}
          className={styles.aboutSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 className={styles.aboutTitle}>About</motion.h2>
          
          <h3 className={styles.aboutRole}>{activeMember.name} — {activeMember.role}</h3>
          
          <div className={styles.aboutBio}>
            {activeMember.quote && (
              <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--color-primary)' }}>
                <Quote size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {activeMember.quote}
              </div>
            )}
            <p>{activeMember.bio || "A valued member of Section A4."}</p>
            
            <div className={styles.socials}>
               {activeMember.github && (
                 <a href={activeMember.github} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                   <Github size={24} />
                 </a>
               )}
               {activeMember.linkedin && (
                 <a href={activeMember.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon}>
                   <Linkedin size={24} />
                 </a>
               )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default Team;
