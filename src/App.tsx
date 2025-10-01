// src/App.tsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import Home from './pages/Home.tsx';
import BrowseProjects from './pages/BrowseProjects.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx'; // <-- Import Register
import NotFound from './pages/NotFound.tsx';

// Import common components
import Navbar from './components/common/Navbar.tsx';
import Footer from './components/common/Footer.tsx';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-8" style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse-projects" element={<BrowseProjects />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} /> {/* <-- Activate route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;