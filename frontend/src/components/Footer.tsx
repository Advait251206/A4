import { Github, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.copyright}>
          © 2026 Section A4. All rights reserved.
        </div>
        
        <div className={styles.socials}>
          <a href="#" className={styles.icon} aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="#" className={styles.icon} aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="#" className={styles.icon} aria-label="Instagram">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
