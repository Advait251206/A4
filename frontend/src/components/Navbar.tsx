import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Rocket, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import AdminLogin from './AdminLogin';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'People', path: '/people' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Study Hub', path: '/study-hub' },
    { name: 'Announcements', path: '/announcements' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <NavLink to="/" className={styles.logo}>
          <Rocket size={24} color="var(--color-primary)" />
          <span>Section A4</span>
        </NavLink>

        {/* Desktop Links */}
        <div className={styles.links}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              {link.name}
            </NavLink>
          ))}
          {isAdmin ? (
            <button 
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAdmin(false);
              }}
              title="Logout"
            >
              Logout
            </button>
          ) : (
            <button 
              className={styles.adminBtn}
              onClick={() => setShowAdminLogin(true)}
              title="Admin Access"
            >
              <Shield size={18} />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.mobileMenu}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={styles.mobileLink}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AdminLogin 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
