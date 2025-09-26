// src/App.tsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Import your page components
import NotFound from './pages/NotFound.tsx';

// import Login from './pages/Login.jsx'; // Assuming you will create these
// import Register from './pages/Register.jsx';
// import BrowseProjects from './pages/BrowseProjects.jsx'; // This file does not exist yet

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
        {/* These routes will be displayed within the Layout */}
        {/* <Route index element={<Home />} /> */}
        {/* <Route path="browse-projects" element={<BrowseProjects />} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* <Route path="register" element={<Register />} /> */}
        
        {/* Add other pages here as you create them */}
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;