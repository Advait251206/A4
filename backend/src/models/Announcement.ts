import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  tag: 'Academic' | 'Event' | 'Urgent';
  date: Date;
  image?: string;
  createdBy: string;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      enum: ['Academic', 'Event', 'Urgent'],
      default: 'Academic',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
