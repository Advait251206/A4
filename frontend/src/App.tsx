import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';

// Placeholder Pages (we'll implement these next)
import Home from './pages/Home.tsx';
import TeamDetail from './pages/TeamDetail.tsx';
import Team from './pages/Team.tsx';
import Gallery from './pages/Gallery.tsx';
import GalleryDetail from './pages/GalleryDetail.tsx';
import StudyHub from './pages/StudyHub.tsx';
import SubjectDetail from './pages/SubjectDetail.tsx';
import Announcements from './pages/Announcements.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="people" element={<Team />} />
          <Route path="people/:id" element={<TeamDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:eventId" element={<GalleryDetail />} />
          <Route path="study-hub" element={<StudyHub />} />
          <Route path="study-hub/:id" element={<SubjectDetail />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
