import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Check credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'advaitkawale@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Advait#251206';
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Verify credentials
    if (email !== adminEmail || password !== adminPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      email: adminEmail
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
