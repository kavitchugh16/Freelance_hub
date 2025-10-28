import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import ClientProfile from './pages/client/Profile';
import CreateProject from './pages/client/CreateProject';
import ProjectList from './pages/client/ProjectList';
import ClientWallet from './pages/client/Wallet'; 
import ClientNotifications from './pages/client/Notifications';
import ViewProposals from './pages/ViewProposals';

// Freelancer pages
import FreelancerDashboard from './pages/freelancer/Dashboard';
import FreelancerProfile from './pages/freelancer/Profile';
import BrowseProjects from './pages/freelancer/BrowseProjects';
import FreelancerWallet from './pages/freelancer/Wallet'; 
import SubmitProposal from './pages/freelancer/SubmitProposal';
import FreelancerProjects from './pages/freelancer/FreelancerProjects';
import FreelancerNotifications from './pages/freelancer/Notifications';

// Shared Project pages
import ProjectWorkspace from './pages/ProjectWorkspace'; 

// --- 1. IMPORT YOUR NEW MESSAGES PAGE ---
import MessagesPage from './pages/Messages'; // Adjust path if you placed it elsewhere

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Chatbot from './components/Chatbot';


import ProjectDetails from './pages/ProjectDetails';

const Layout = () => (
  <div>
    <Navbar />
    <main className="container mx-auto py-8" style={{ minHeight: '80vh' }}>
      <Outlet />
    </main>
    <Footer />
    <Chatbot />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Client routes */}
          <Route path="client/dashboard" element={<ClientDashboard />} />
          <Route path="client/profile" element={<ClientProfile />} />
          <Route path="client/projects/create" element={<CreateProject />} />
          <Route path="client/projects" element={<ProjectList />} />
          <Route path="client/wallet" element={<ClientWallet />} />
          <Route path="client/notifications" element={<ClientNotifications />} />
          
          {/* Freelancer routes */}
          <Route path="freelancer/dashboard" element={<FreelancerDashboard />} />
          <Route path="freelancer/profile" element={<FreelancerProfile />} />
          <Route path="freelancer/browse-projects" element={<BrowseProjects />} />
          <Route path="freelancer/wallet" element={<FreelancerWallet />} />
          <Route path="freelancer/submit-proposal/:projectId" element={<SubmitProposal />} />
          <Route path="freelancer/my-projects" element={<FreelancerProjects />} />
          <Route path="freelancer/notifications" element={<FreelancerNotifications />} />
            {/* ...other routes */}

            {/* Shared routes for specific projects */}

            {/* --- ADD THIS LINE --- */}
            <Route path="project/:projectId" element={<ProjectDetails />} />

            <Route path="project/:projectId/proposals" element={<ViewProposals />} />
            <Route path="project/:projectId/workspace" element={<ProjectWorkspace />} />

            <Route path="messages" element={<MessagesPage />} />
            {/* ... */}

          {/* Shared routes for specific projects */}
          <Route path="project/:projectId/proposals" element={<ViewProposals />} />
          <Route path="project/:projectId/workspace" element={<ProjectWorkspace />} />

          {/* --- 2. ADD THE ROUTE FOR MESSAGES --- */}
          {/* This route will be accessible to both clients and freelancers */}
          <Route path="messages" element={<MessagesPage />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;