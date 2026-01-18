import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import styles from './Admin.module.css';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  tag: 'Academic' | 'Event' | 'Urgent';
  date: string;
}

const Admin = () => {
  const navigate = useNavigate();
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

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/announcements');
      const data = await response.json();
      setAnnouncements(data);
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
        ? `http://localhost:5000/api/announcements/${editingId}`
        : 'http://localhost:5000/api/announcements';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');

      // Reset form and refresh
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
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      tag: announcement.tag,
      date: announcement.date.split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  if (loading) return <div className="loader">Loading Admin Panel...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Panel</h1>
        <div className={styles.headerActions}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: '', content: '', tag: 'Academic', date: new Date().toISOString().split('T')[0] });
          }}
        >
          <Plus size={20} />
          New Announcement
        </button>
      </div>

      {showForm && (
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

      <div className={styles.list}>
        {announcements.map((announcement) => (
          <motion.div
            key={announcement._id}
            className={styles.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.cardHeader}>
              <div>
                <h3>{announcement.title}</h3>
                <span className={`${styles.tag} ${styles[`tag${announcement.tag}`]}`}>
                  {announcement.tag}
                </span>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(announcement)} title="Edit">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(announcement._id)} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className={styles.cardContent}>{announcement.content}</p>
            <div className={styles.cardDate}>
              {new Date(announcement.date).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
