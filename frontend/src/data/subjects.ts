import type { Subject } from '../types';

export const subjectsData: Subject[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence (AI)',
    faculty: 'Dr. Sharvari Deshmukh',
    studyNotes: [],
    importantTopics: [],
    externalResources: [
      { title: 'AI Playlist (Gate Smashers)', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI&si=O2aF4stOpIsfWYAN' }
    ]
  },
  {
    id: 'dbms',
    name: 'Database Management Systems (DBMS)',
    faculty: 'Prof. Kanak Kalyani',
    studyNotes: [
      { title: 'SQL Tutorial 1', url: '/DBMS_LAB_SQL_Tutorial_1.pdf' }
    ],
    importantTopics: [],
    externalResources: [
      { title: 'DBMS Playlist (Neso Academy)', url: 'https://youtube.com/playlist?list=PLBlnK6fEyqRiyryTrbKHX1Sh9luYI0dhX&si=S-cXMHaNltLiWb00' }
    ]
  },
  {
    id: 'cd',
    name: 'Compiler Design (CD)',
    faculty: 'Dr. Sunita Rawat',
    studyNotes: [],
    importantTopics: [],
    externalResources: [
      { title: 'Compiler Design Playlist (Neso Academy)', url: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjT3oJxFXRgjPNzeS-LFY-q&si=_ZLeCk5GVumQO3kH' }
    ]
  },
  {
    id: 'sl-ii',
    name: 'SL II',
    faculty: 'Multiple Faculties',
    studyNotes: [],
    importantTopics: [],
    externalResources: [
      { title: 'C Language Playlist (CodeWithHarry)', url: 'https://youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd&si=JABbLvSWGUgdNinx' },
      { title: 'C++ Playlist (CodeWithHarry)', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg' }
    ]
  }
];
