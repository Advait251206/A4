import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { HomeData } from '../types';
import { homeData } from '../data/home';
import ScrollFloat from '../components/ScrollFloat';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import FeatureCard from '../components/FeatureCard';
import styles from './Home.module.css';

const Home = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setData(homeData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className={styles.loader}>Loading Section Experience...</div>;
  if (!data) return <div className={styles.loader}>Failed to load content</div>;

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.sectionName}>{data.sectionName}</h1>
        <p className={styles.tagline}>{data.tagline}</p>
      </motion.section>



      {/* Features/Definitions Section */}
      <section className={styles.section}>
        <ScrollFloat 
          animationDuration={1} 
          ease='back.inOut(2)' 
          scrollStart='top bottom' 
          scrollEnd='center center' 
          stagger={0.03}
        >
          What Defines Us
        </ScrollFloat>

        <div style={{ marginTop: '5rem' }}>
          <ScrollStack 
            itemDistance={50} 
            itemScale={0.05} 
            itemStackDistance={20} 
            stackPosition="25%"
            useWindowScroll={true}
          >
            {data.definitions.map((def) => (
              <ScrollStackItem key={def.title}>
                 <FeatureCard
                  title={def.title}
                  description={def.description}
                  icon={def.icon}
                  delay={0}
                />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

    </div>
  );
};

export default Home;
