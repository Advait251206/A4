import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';


const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '4.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
