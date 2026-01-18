import { useEffect, useState } from 'react';
import sportsBanner from '../assets/gallery/Sports.jpeg';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import styles from './Gallery.module.css';

interface GalleryEvent {
  eventId: string;
  eventName: string;
  eventBanner: string;
  imageCount: number;
}

const Gallery = () => {
  const [galleries, setGalleries] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local data override
    const localGalleries: GalleryEvent[] = [
      {
        eventId: 'sports',
        eventName: 'Sports',
        eventBanner: sportsBanner,
        imageCount: 1
      }
    ];
    setGalleries(localGalleries);
    setLoading(false);
  }, []);

  if (loading) return <div className="loader">Loading Gallery...</div>;

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Captured Moments
      </motion.h1>

      <div className={styles.grid}>
        {galleries.map((item, index) => (
          <motion.div
            key={item.eventId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/gallery/${item.eventId}`}>
              <div className={styles.card}>
                <img 
                  src={item.eventBanner} 
                  alt={item.eventName} 
                  className={styles.cardImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.eventId}/400/300`;
                  }}
                />
                <div className={styles.overlay}>
                  <h3 className={styles.eventName}>{item.eventName}</h3>
                  <div className={styles.count}>
                    <ImageIcon size={16} />
                    {item.imageCount} Photos
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
