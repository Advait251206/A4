import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, Users, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Event, TeamMember } from '../types';
import styles from './Events.module.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [coordinators, setCoordinators] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await fetch(`/api/events/${id}`);
        const eventData = await eventRes.json();
        
        if (eventData.error) throw new Error(eventData.error);
        setEvent(eventData);

        // Fetch coordinators
        if (eventData.coordinatorIds && eventData.coordinatorIds.length > 0) {
          const coords = await Promise.all(
            eventData.coordinatorIds.map(async (cid: string) => {
              const res = await fetch(`/api/team/${cid}`);
              return res.json();
            })
          );
          setCoordinators(coords);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loader">Loading Event Details...</div>;
  if (!event) return <div className="container">Event not found</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="container"
      style={{ paddingBottom: '4rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ paddingTop: '2rem', marginBottom: '2rem' }}>
        <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <ArrowLeft size={20} /> Back to Events
        </Link>
      </div>

      <div className={styles.detailHeader}>
        <img 
          src={event.bannerImage} 
          alt={event.name} 
          className={styles.headerBanner}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}/1200/400`;
          }}
        />
        <div className={styles.headerOverlay}>
          <h1 className={styles.detailTitle}>{event.name}</h1>
          <div className={styles.detailMeta}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} />
              {formatDate(event.date)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} />
              {event.time}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>About the Event</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
          {event.fullDescription}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <CheckCircle size={24} /> What We Learned
        </h2>
        <div className={styles.learningList}>
          {event.whatWeLearned.map((item, index) => (
            <div key={index} className={styles.learningItem}>
              <CheckCircle size={18} className={styles.checkIcon} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {coordinators.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Users size={24} /> Coordinators
          </h2>
          <div className={styles.coordinatorGrid}>
            {coordinators.map(coord => (
              <Link to={`/team/${coord.id}`} key={coord.id} className={styles.coordinatorCard}>
                <img 
                  src={coord.photo} 
                  alt={coord.name} 
                  className={styles.coordinatorAvatar}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coord.name)}&background=random`;
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{coord.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{coord.role}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {event.galleryPreview && event.galleryPreview.length > 0 && (
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              <ImageIcon size={24} /> Gallery Preview
            </h2>
            <Link to="/gallery" style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
              View Full Gallery →
            </Link>
          </div>
          <div className={styles.galleryGrid}>
            {event.galleryPreview.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Gallery preview ${index + 1}`} 
                className={styles.galleryImage}
                onError={(e) => {
                   (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}-${index}/300/200`;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EventDetail;
