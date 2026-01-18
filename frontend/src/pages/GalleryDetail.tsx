import { useEffect, useState } from 'react';
import sportsBanner from '../assets/gallery/Sports.jpeg';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { GalleryImage } from '../types';
import styles from './Gallery.module.css';

const GalleryDetail = () => {
  const { eventId } = useParams();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId === 'sports') {
      setImages([
        {
          id: '1',
          eventId: 'sports',
          url: sportsBanner,
          caption: 'Sports Event'
        }
      ]);
      setLoading(false);
    } else {
      setImages([]);
      setLoading(false);
    }
  }, [eventId]);

  if (loading) return <div className="loader">Loading Photos...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
        <ArrowLeft size={20} /> Back to Gallery
      </Link>

      <motion.div 
        className={styles.masonry}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((img, index) => (
          <motion.div 
            key={img.id}
            className={styles.imageItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className={styles.detailImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${img.id}/400/${index % 2 === 0 ? 600 : 300}`;
              }}
            />
            <div className={styles.caption}>{img.caption}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GalleryDetail;
