import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import BrowseProjects from './pages/BrowseProjects';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const Layout = () => (
  <div>
    <Navbar />
    <main className="container mx-auto py-8" style={{ minHeight: '80vh' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse-projects" element={<BrowseProjects />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
