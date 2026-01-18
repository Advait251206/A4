import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import styles from './Announcements.module.css';
import ConfirmDialog from '../components/ConfirmDialog';
import FormattedContent from '../components/FormattedContent';

interface Announcement {
  _id?: string;
  title: string;
  content: string;
  tag: 'Academic' | 'Event' | 'Urgent';
  date: string;
  image?: string;
}

const Announcements = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: 'Academic' as 'Academic' | 'Event' | 'Urgent',
    date: new Date().toISOString().split('T')[0]
  });
  const [filter, setFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null
  });

  // Check if admin is logged in
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdmin(!!token);
      console.log('Admin status:', !!token);
    };
    
    checkAdmin();
    
    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', checkAdmin);
    
    // Also check periodically (in case storage event doesn't fire)
    const interval = setInterval(checkAdmin, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
      clearInterval(interval);
    };
  }, []);

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements`);
      const data = await response.json();
      setAnnouncements(data.sort((a: Announcement, b: Announcement) => {
        if (a.tag === 'Urgent' && b.tag !== 'Urgent') return -1;
        if (b.tag === 'Urgent' && a.tag !== 'Urgent') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/announcements/${editingId}`
        : `${API_BASE_URL}/api/announcements`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');

      setFormData({ title: '', content: '', tag: 'Academic', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement._id || null);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      tag: announcement.tag,
      date: announcement.date.split('T')[0]
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const filtered = filter === 'All' 
    ? announcements 
    : announcements.filter(a => a.tag === filter);

  const getMonth = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' });
  };

  const getDay = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  if (loading) return <div className="loader">Loading Announcements...</div>;

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <motion.h1 
        className={styles.pageTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Announcements
      </motion.h1>

      <div className={styles.filterContainer}>
        {['All', 'Academic', 'Event', 'Urgent'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        
        {isAdmin && (
          <button 
            className={styles.addBtn}
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', content: '', tag: 'Academic', date: new Date().toISOString().split('T')[0] });
            }}
          >
            <Plus size={18} />
            New Announcement
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <motion.form 
          className={styles.form}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
        >
          <div className={styles.formHeader}>
            <h2>{editingId ? 'Edit' : 'Create'} Announcement</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
              >
                <option value="Academic">Academic</option>
                <option value="Event">Event</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn}>
            <Save size={18} />
            {editingId ? 'Update' : 'Create'}
          </button>
        </motion.form>
      )}

      <motion.div layout className={styles.list}>
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div
              key={item._id}
              layout
              className={styles.card}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className={styles.dateBox}>
                <div className={styles.month}>{getMonth(item.date)}</div>
                <div className={styles.day}>{getDay(item.date)}</div>
              </div>
              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <h3>{item.title}</h3>
                    <span className={`${styles.tag} ${styles[`tag${item.tag}`]}`}>
                      {item.tag}
                    </span>
                  </div>
                  {isAdmin && item._id && (
                    <div className={styles.adminActions}>
                      <button onClick={() => handleEdit(item)} className={styles.editBtn}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id!)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {item.image && (
                  <div className={styles.imageContainer}>
                    <img src={item.image} alt={item.title} className={styles.announcementImage} />
                  </div>
                )}
                <FormattedContent content={item.content} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, id: null })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Announcements;
