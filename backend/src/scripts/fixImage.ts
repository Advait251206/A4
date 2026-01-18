import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Announcement from '../models/Announcement';

dotenv.config();

const fixBirthdayImage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Find and update the birthday announcement
    await Announcement.findOneAndUpdate(
      { title: '🎂 Happy Birthday Manas! 🎂' },
      { image: '/birthday.png' } // Simpler path at root
    );

    console.log('✅ Updated image path to /birthday.png');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixBirthdayImage();
