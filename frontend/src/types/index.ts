// Shared types matching backend
// Team Member
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  interest: string;
  photo: string;
  bio: string;
  quote: string;
  skills: string[];
  hobbies?: string[];
  linkedin?: string;
  github?: string;
}

// Event
export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage: string;
  coordinatorIds: string[];
  whatWeLearned: string[];
  galleryPreview: string[];
}

// Gallery Image
export interface GalleryImage {
  id: string;
  eventId: string;
  url: string;
  caption: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  faculty: string;
  studyNotes: ResourceLink[];
  importantTopics: string[];
  externalResources: ResourceLink[];
}

export interface ResourceLink {
  title: string;
  url: string;
}

// Timetable
export interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
}

// Announcement
export type AnnouncementTag = 'Academic' | 'Event' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: AnnouncementTag;
}

// Home Page Data
export interface SectionDefinition {
  title: string;
  description: string;
  icon: string;
}

export interface SectionStat {
  label: string;
  value: number;
}

export interface HomeData {
  sectionName: string;
  tagline: string;
  definitions: SectionDefinition[];
  stats: SectionStat[];
}
