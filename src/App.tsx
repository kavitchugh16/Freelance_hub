// src/App.tsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Import your page components
import Home from './pages/Home.tsx';
import BrowseProjects from './pages/BrowseProjects.tsx';
import NotFound from './pages/NotFound.tsx';

// Import your common components
import Navbar from './components/common/Navbar.tsx';
import Footer from './components/common/Footer.tsx';

// This Layout component includes elements that appear on every page
const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-8" style={{ minHeight: '80vh' }}>
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* These routes are now active */}
        <Route index element={<Home />} />
        <Route path="browse-projects" element={<BrowseProjects />} />
        
        {/* We can add login/register routes later */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* <Route path="register" element={<Register />} /> */}
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;