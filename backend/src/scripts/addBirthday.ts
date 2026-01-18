import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Announcement from '../models/Announcement';

dotenv.config();

const addBirthdayAnnouncement = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected');

    const announcement = {
      title: '🎂 Happy Birthday Manas! 🎂',
      content: `"Count your life by smiles, not tears. Count your age by friends, not years. Happy Birthday!"

Wishing you a fantastic year ahead filled with joy, success, and amazing moments! 
From all of us at Section A4 🚀`,
      tag: 'Urgent',
      date: new Date(),
      image: '/people/Manas.png',
      createdBy: 'admin'
    };

    await Announcement.create(announcement);
    console.log('✅ Added Manas birthday announcement');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addBirthdayAnnouncement();
