import type { HomeData } from '../types';

export const homeData: HomeData = {
  sectionName: 'Section A4',
  tagline: 'Where Innovation Meets Collaboration',
  definitions: [
    {
      title: 'Culture',
      description: 'A vibrant community that celebrates diversity, creativity, and individual expression. We foster an environment where every voice matters.',
      icon: '🎨'
    },
    {
      title: 'Collaboration',
      description: 'Working together to solve complex problems and build lasting connections. Our strength lies in our collective intelligence.',
      icon: '🤝'
    },
    {
      title: 'Events',
      description: 'Dynamic workshops, hackathons, and social gatherings that create memorable experiences and learning opportunities.',
      icon: '🎯'
    },
    {
      title: 'Academics',
      description: 'Excellence in education through peer support, shared resources, and a commitment to continuous learning.',
      icon: '📚'
    }
  ],
  stats: [
    { label: 'Total Students', value: 60 },
    { label: 'Events Conducted', value: 24 },
    { label: 'Photos Captured', value: 450 },
    { label: 'Subjects', value: 8 }
  ]
};
