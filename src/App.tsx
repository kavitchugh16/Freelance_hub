
// import React from 'react';
// import { Routes, Route, Outlet } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';

// // Pages
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import NotFound from './pages/NotFound';

// // Client pages
// import ClientDashboard from './pages/client/Dashboard';
// import ClientProfile from './pages/client/Profile';
// import CreateProject from './pages/client/CreateProject';
// import ProjectList from './pages/client/ProjectList';
// import ClientWallet from './pages/client/Wallet'; 
// import ClientNotifications from './pages/client/Notifications';
// import ViewProposals from './pages/ViewProposals';

// // Freelancer pages
// import FreelancerDashboard from './pages/freelancer/Dashboard';
// import FreelancerProfile from './pages/freelancer/Profile';
// import BrowseProjects from './pages/freelancer/BrowseProjects';
// import FreelancerWallet from './pages/freelancer/Wallet'; 
// import SubmitProposal from './pages/freelancer/SubmitProposal';

// // Shared Project pages
// import ProjectWorkspace from './pages/ProjectWorkspace'; 

// // Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';

// const Layout = () => (
//   <div>
//     <Navbar />
//     <main className="container mx-auto py-8" style={{ minHeight: '80vh' }}>
//       <Outlet />
//     </main>
//     <Footer />
//   </div>
// );

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />

//           {/* Client routes */}
//           <Route path="client/dashboard" element={<ClientDashboard />} />
//           <Route path="client/profile" element={<ClientProfile />} />
//           <Route path="client/projects/create" element={<CreateProject />} />
//           <Route path="client/projects" element={<ProjectList />} />
//           <Route path="client/wallet" element={<ClientWallet />} />
//           <Route path="client/notifications" element={<ClientNotifications />} />
          
//           {/* Freelancer routes */}
//           <Route path="freelancer/dashboard" element={<FreelancerDashboard />} />
//           <Route path="freelancer/profile" element={<FreelancerProfile />} />
//           <Route path="freelancer/browse-projects" element={<BrowseProjects />} />
//           <Route path="freelancer/wallet" element={<FreelancerWallet />} />
//           <Route path="freelancer/submit-proposal/:projectId" element={<SubmitProposal />} />

//           {/* Shared routes for specific projects */}
//           <Route path="project/:projectId/proposals" element={<ViewProposals />} />
//           <Route path="project/:projectId/workspace" element={<ProjectWorkspace />} />

//           {/* Fallback route */}
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;

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

// Shared Project pages
import ProjectWorkspace from './pages/ProjectWorkspace'; 

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

          {/* Shared routes for specific projects */}
          <Route path="project/:projectId/proposals" element={<ViewProposals />} />
          <Route path="project/:projectId/workspace" element={<ProjectWorkspace />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;