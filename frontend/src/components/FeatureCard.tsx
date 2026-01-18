import { motion } from 'framer-motion';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
