import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, Linkedin, Quote, Trophy, Search } from 'lucide-react';
import type { TeamMember } from '../types';
import styles from './Team.module.css';

const RADIUS = 1500; // Larger radius for flatter arc
const ANGLE_STEP = 12; // Degrees per item (14 * 12 = 168 degrees semi-circle)

import { teamData } from '../data/team';

const Team = () => {
  const members: TeamMember[] = [...teamData].sort((a, b) => a.name.localeCompare(b.name));
  const [loading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSelect = (index: number) => {
    setActiveIndex(index);
    setSearchTerm('');
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, members.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const [dragOffset, setDragOffset] = useState(0);

  const handlePan = (_: any, info: any) => {
    // Sensitivity factor: how many pixels drag = 1 degree rotation
    const sensitivity = 0.05;
    setDragOffset(info.offset.x * sensitivity);
  };

  const handlePanEnd = (_: any, info: any) => {
    const sensitivity = 0.05;
    const totalDragRotation = info.offset.x * sensitivity;
    
    // Calculate how many "steps" we dragged
    // Negative because dragging left (negative x) should rotate right (positive angle) to show next items? 
    // Wait, dragging Left (negative x) moves the container Left.
    // If I drag Left, I want to see Right items.
    // Index increases -> rotation decreases (becomes more negative).
    // So dragging Left (negative) should decrease rotation?
    
    // Let's test the natural feel.
    // If rotation is -100 deg, and I drag left (-10 px), rotation should become -110 deg.
    // So currentRotation + dragOffset.
    
    const stepsDragged = Math.round(-totalDragRotation / ANGLE_STEP);
    
    const newIndex = Math.min(
      Math.max(activeIndex + stepsDragged, 0),
      members.length - 1
    );

    setActiveIndex(newIndex);
    setDragOffset(0);
  };

  if (loading) return <div className="loader">Loading People...</div>;
  
  if (members.length === 0) return <div>No members found.</div>;

  const activeMember = members[activeIndex];
  const orbitRotation = -activeIndex * ANGLE_STEP + dragOffset;

  return (
    <div className={styles.container} ref={containerRef}>
      
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
          <input 
            type="text" 
            placeholder="Search team..." 
            className={styles.searchInput}
            value={searchTerm}
            style={{ paddingLeft: '45px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {searchTerm && (
          <div className={styles.searchResults}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => {
                const originalIndex = members.findIndex(m => m.id === member.id);
                return (
                  <div 
                    key={member.id} 
                    className={styles.searchResultItem}
                    onClick={() => handleSearchSelect(originalIndex)}
                  >
                    <img 
                      src={member.photo || 'https://via.placeholder.com/30'} 
                      alt={member.name} 
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span>{member.name}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons for convenience */}
      {activeIndex > 0 && (
        <button className={`${styles.navButton} ${styles.prev}`} onClick={handlePrev}>
          <ChevronLeft />
        </button>
      )}
      
      {activeIndex < members.length - 1 && (
        <button className={`${styles.navButton} ${styles.next}`} onClick={handleNext}>
          <ChevronRight />
        </button>
      )}

      {/* ARC CONTAINER */}
      <div className={styles.arcContainer}>
        <motion.div 
          className={styles.orbit}
          animate={{ rotate: orbitRotation }}
          transition={dragOffset !== 0 ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 50, damping: 20 }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          style={{ touchAction: "none", cursor: 'grab' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {members.map((member, index) => {
             const itemAngle = index * ANGLE_STEP;
             const isActive = index === activeIndex;
             
             return (
               <div 
                 key={member.id}
                 className={`${styles.memberItem} ${isActive ? styles.activeItem : ''}`}
                 style={{
                    // Origin = center of circle (60px) + Radius (1500px) = 1560px
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
                      draggable={false}
                    />
                 </div>
                 <motion.div 
                    className={styles.memberName}
                    animate={{ 
                      rotate: -(itemAngle + orbitRotation),
                      x: "-50%",
                      y: isActive ? 120 : 90
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
            <div className={styles.bioText}>
              {activeMember.bio ? activeMember.bio.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              )) : <p>A valued member of Section A4.</p>}
            </div>

            {activeMember.hobbies && activeMember.hobbies.length > 0 && (
              <div className={styles.hobbiesSection}>
                <h4 className={styles.hobbiesTitle}>
                  <Trophy size={18} /> Hobbies & Interests
                </h4>
                <ul className={styles.hobbiesList}>
                  {activeMember.hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                  ))}
                </ul>
              </div>
            )}
            
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
