import { Router, Response } from 'express';
import Announcement from '../models/Announcement';
import { verifyAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/announcements - Public route
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ date: -1 })
      .lean();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements - Admin only
router.post('/', verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tag, date } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const announcement = new Announcement({
      title,
      content,
      tag: tag || 'Academic',
      date: date || new Date(),
      createdBy: req.userEmail || 'unknown',
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PUT /api/announcements/:id - Admin only
router.put('/:id', verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tag, date } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { title, content, tag, date },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    res.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE /api/announcements/:id - Admin only
router.delete('/:id', verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
