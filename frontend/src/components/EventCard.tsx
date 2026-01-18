import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import styles from '../pages/Events.module.css';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/events/${event.id}`} style={{ display: 'block', height: '100%' }}>
      <div className={styles.card}>
        <div className={styles.bannerWrapper}>
          <img 
            src={event.bannerImage} 
            alt={event.name} 
            className={styles.banner}
            onError={(e) => {
              // Fallback based on event name hash to be deterministic but different
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}/400/200`;
            }}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.date}>{formatDate(event.date)}</div>
          <h3 className={styles.title}>{event.name}</h3>
          <p className={styles.description}>{event.shortDescription}</p>
          
          <div className={styles.footer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className={styles.time}>
              <Clock size={14} />
              {event.time}
            </div>
            <div style={{ color: 'var(--color-primary)' }}>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
