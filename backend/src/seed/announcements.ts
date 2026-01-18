import Announcement from '../models/Announcement';

export const seedAnnouncements = async () => {
  const count = await Announcement.countDocuments();
  
  if (count === 0) {
    const announcements = [
      {
        title: "FIT INDIA HAPPYTHON '26",
        content: `"Every mile matters. Let's walk, run, and ride together to make a difference."

🌟 RAMDEOBABA UNIVERSITY 🌟
Department of Physical Education & NSS Unit
in collaboration with Students' Sports Club, Rotaract Club RBU
and in association with our Health & Medical Partner— MAX Healthcare 

Presents

FIT INDIA HAPPYTHON '26

In the continuity of National Youth Day activities and the Birth Anniversary of Swami Vivekananda, we are delighted to organize:
" The Fit India Happython " - A Health, Fitness & Wellness Awareness Event.

Activities to Look Forward To: ✨
✅ 5 KM Walkathon 🚶♂️
✅ 3 KM Run 🏃♀️
✅ 10 KM Cycling 🚴♂️
✅ Zumba Session 💃
✅ Meditation & Mindfulness 🧘
✅ Selfie Booth 📸
✅ Exciting Prizes for Winners 🎁
✅ Participation Certificate on Completion of Activities 📃
✅ Winners to be felicitated in Pratishruti' 26

Event Details:
🗓 Date: 19th January
🕕 Reporting Time: 6:00 AM
📍 Venue: Football Ground

Registration:
📝 Google Form Link: https://forms.gle/fvebDLLSmhCUQ9FK7
🔗 WhatsApp Group Link: https://chat.whatsapp.com/HIAzE9LFZzpDgSVOKBa9Zp

Note: All activities are FREE OF COST. Regular Classes will be conducted after Happython.`,
        tag: 'Event',
        date: new Date('2026-01-19'),
        createdBy: 'system'
      },
      {
        title: 'RBU Literature Festival 2026',
        content: `Dear All,
We warmly invite you to the Inaugural Ceremony of RBU Literature Festival 2026, a spectacular celebration of literature, ideas, and creative expression, organized in association with the Vidarbha Literature Foundation (VLF) on 16th January 2026, at 10:30 AM, Main Auditorium.

RBU Literature Festival 2026 brings together acclaimed celebrity authors, influential thinkers, performers, and literary enthusiasts on one vibrant platform—promising thought-provoking conversations, poetry writing workshop, engaging interactions, and cultural brilliance.

You are requested to kindly occupy your seats by 10:15 AM for the inauguration ceremony.

'Poetry Slam' scheduled on 16th January 2026, OAT is open to all faculty members, non-teaching staff and students who love to write poetry in any language they love.

For event updates do follow the Instagram pages:
https://www.instagram.com/rbu_nagpur_official/reels/?hl=en
https://www.instagram.com/readersreverie/?hl=en
https://www.instagram.com/rbumun/`,
        tag: 'Event',
        date: new Date('2026-01-16'),
        createdBy: 'system'
      },
      {
        title: 'CSE DEPARTMENT MAGAZINE 2025',
        content: `🌟 CALL FOR SUBMISSIONS: CSE DEPARTMENT MAGAZINE 2025 🌟

This is your official invitation to be featured in the upcoming edition of our Department Magazine!

We know CSE students do more than just code. We want to showcase your hidden talent!

We are looking for:
🎨 Art & Creativity: Sketches, Paintings, Doodles, or Digital Art
✍️ Poetry Corner: Original poems in English, Hindi, or Marathi
💻 Tech Insights: Read something cool recently? Write a short article about a new tool, trend, or unique tech fact

⏳ DEADLINE: 15th Jan 10:00 am

👉 Upload your entries here: https://forms.gle/y6CAZCx7sRGDJgPx8

For any queries, contact:
Pranit Rathkanthiwar – 7058145422`,
        tag: 'Academic',
        date: new Date('2026-01-15'),
        createdBy: 'system'
      },
      {
        title: '📢 Campus Identification Card & Code of Conduct',
        content: `Dear Students,
To help us maintain a safe, organized, and welcoming environment for everyone, we would like to share a gentle reminder regarding our campus protocols.

Visible ID Cards:
For the safety of all residents and visitors, please ensure that you are visibly wearing your Student ID card at all times while on campus.

University Code of Conduct:
We take great pride in our students' character and integrity. We kindly ask that you continue to strictly follow the University Code of Conduct.

A few quick reminders:
• Please have your ID ready when entering the main gates
• Let's continue to treat our faculty, staff, and peers with the utmost respect

Thank you for being such an integral part of our university's reputation.`,
        tag: 'Urgent',
        date: new Date('2026-01-18'),
        createdBy: 'system'
      },
      {
        title: '🎬✨ TECHNOFRENZY 3.0 ✨🎬',
        content: `RBU ACM Student Chapter Production brings you a blockbuster tech experience where logic meets drama and code steals the spotlight! 💻

Get ready to step into the world of Shadows of Hollywood with Technofrenzy 3.0!

Event Segments:
🎥 ACT I – Lights Out & Logic On
🎬 ACT II – Ultimate Bid Battle
🏎️ ACT III – Fast & Furious (Code Circuit)

📅 Premieres on: 19th January
📍 Venue: Ramdeobaba University, Nagpur (DT-701)
🏆 Prize Pool: ₹8,000

🌐 Register here:
https://techno-frenzy-acm.vercel.app/

Follow us on Instagram:
https://www.instagram.com/acm_rbu`,
        tag: 'Event',
        date: new Date('2026-01-19'),
        createdBy: 'system'
      },
      {
        title: '🟩 MineQuest 🟩',
        content: `Ready to play a game and effortlessly learn Blockchain? ⛏️🚀
MineQUEST is here!

Learn Blockchain through Minecraft-themed gameplay event — no boring theory!

🟩 MineQuest 🟩
Where Blockchain meets Minecraft

🗓️ 19th Jan (Monday)
🕐 11:00 AM – 6:00 PM
📍 Dt-702
💰 Prize Pool: ₹ 3000

✨ Gameplay-based learning
🤝 Team challenges & strategy rounds
🎓 Exciting rewards

Register Now:
https://docs.google.com/forms/d/e/1FAIpQLSc1Pf-W3A-DNJe99VOfc1n7u8Y5_qQ7dCFA0YkHcYKTLWOhpA/viewform

📞 Queries:
Akshay – 7666058128
Nayan - 9359416511`,
        tag: 'Event',
        date: new Date('2026-01-19'),
        createdBy: 'system'
      }
    ];

    await Announcement.insertMany(announcements);
    console.log('✅ Seeded 6 announcements successfully');
  } else {
    console.log(`📋 Database already has ${count} announcements`);
  }
};
