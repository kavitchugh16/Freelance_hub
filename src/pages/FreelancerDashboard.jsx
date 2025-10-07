// // client/src/pages/FreelancerDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Badge } from './ui/Badge';
// import { Briefcase, Star } from 'lucide-react';

// const statusColors = {
//   'In Progress': 'bg-blue-100 text-blue-800',
//   'Completed': 'bg-green-100 text-green-800',
//   'Submitted': 'bg-yellow-100 text-yellow-800',
// };

// const FreelancerDashboard = () => {
//   const [activeProjects, setActiveProjects] = useState([]);
//   const [bids, setBids] = useState([]);

//   useEffect(() => {
//     console.log("Fetching freelancer's data...");
//     setActiveProjects([
//       { id: 4, title: 'E-commerce Site Backend', status: 'In Progress' }
//     ]);
//     setBids([
//       { projectId: 1, projectTitle: 'Build a React Dashboard', status: 'Submitted' }
//     ]);
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Freelancer Dashboard</h1>

//       {/* Active Projects */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">My Active Projects</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {activeProjects.map(project => (
//             <div
//               key={project.id}
//               className="p-4 border rounded-lg shadow flex flex-col justify-between transition hover:shadow-lg"
//             >
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-xl font-bold">{project.title}</h3>
//                 <Badge className={`px-2 py-1 rounded ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
//                   {project.status}
//                 </Badge>
//               </div>
//               <Link
//                 to={`/project/${project.id}/milestones`}
//                 className="mt-3 text-indigo-600 hover:underline font-medium"
//               >
//                 Manage Milestones
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* My Bids */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {bids.map(bid => (
//             <div
//               key={bid.projectId}
//               className="p-4 border rounded-lg shadow flex flex-col justify-between transition hover:shadow-lg"
//             >
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-xl font-bold">{bid.projectTitle}</h3>
//                 <Badge className={`px-2 py-1 rounded ${statusColors[bid.status] || 'bg-gray-100 text-gray-800'}`}>
//                   {bid.status}
//                 </Badge>
//               </div>
//               <Link
//                 to={`/project/${bid.projectId}`}
//                 className="mt-3 text-indigo-600 hover:underline font-medium"
//               >
//                 View Project
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FreelancerDashboard;
import React, { useState, useEffect } from 'react';
// Fictional import for navigation, assuming you are using react-router-dom
// import { Link } from 'react-router-dom';
import { Briefcase, Star, Clock, CheckCircle, Eye, TrendingUp, DollarSign, Award } from 'lucide-react';

// Placeholder for a custom Badge component
const Badge = ({ className, children }) => (
  <span className={`font-semibold ${className}`}>
    {children}
  </span>
);

// Placeholder for Link component if not using react-router-dom
const Link = ({ to, className, children }) => (
    <a href={to} className={className}>{children}</a>
);

const statusColors = {
  'In Progress': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
  'Completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
  'Submitted': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
  'Under Review': 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200',
};

const FreelancerDashboard = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    console.log("Fetching freelancer's data...");
    setActiveProjects([
      { 
        id: 4, 
        title: 'E-commerce Site Backend', 
        status: 'In Progress',
        budget: '$4,200',
        deadline: 'Dec 15, 2024',
        progress: 65
      },
      { 
        id: 5, 
        title: 'Mobile App UI/UX Design', 
        status: 'In Progress',
        budget: '$2,800',
        deadline: 'Dec 20, 2024',
        progress: 30
      }
    ]);
    setBids([
      { 
        projectId: 1, 
        projectTitle: 'Build a React Dashboard', 
        status: 'Under Review',
        bidAmount: '$2,500',
        submittedDate: '2 days ago'
      },
      { 
        projectId: 2, 
        projectTitle: 'Logo Design Package', 
        status: 'Submitted',
        bidAmount: '$800',
        submittedDate: '1 week ago'
      }
    ]);
  }, []);

  // Basic styling for buttons to make the component self-contained
  const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow transition",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold shadow transition"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <style>{`
        .custom-dashboard-card {
          background-color: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07);
          transition: all 0.3s ease-in-out;
        }
        .custom-dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
        }
        .gradient-text {
          background: -webkit-linear-gradient(45deg, #3b82f6, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
          Freelancer Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your projects and track your freelance journey
        </p>
      </div>


      {/* Active Projects */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Active Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeProjects.map((project, index) => (
            <div
              key={project.id}
              className={`custom-dashboard-card animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms`}}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Budget: {project.budget}</span>
                    <span>Deadline: {project.deadline}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/project/${project.id}/milestones`}
                  className={`${buttonStyles.secondary} flex items-center justify-center space-x-2 w-full`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Manage Milestones</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Bids */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bids</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bids.map((bid, index) => (
            <div
              key={bid.projectId}
              className={`custom-dashboard-card animate-scale-in`}
              style={{ animationDelay: `${index * 100}ms`}}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{bid.projectTitle}</h3>
                  <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[bid.status] || 'bg-gray-100 text-gray-800'}`}>
                    {bid.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Bid Amount: {bid.bidAmount}</span>
                    <span>Submitted: {bid.submittedDate}</span>
                  </div>
                </div>
                
                <Link
                  to={`/project/${bid.projectId}`}
                  className={`${buttonStyles.secondary} flex items-center justify-center space-x-2 w-full`}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Project</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty States */}
      {activeProjects.length === 0 && bids.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No active projects or bids</h3>
          <p className="text-gray-600 mb-6">Start by browsing projects and submitting proposals to grow your freelance business.</p>
          <Link
            to="/freelancer/browse-projects"
            className={`${buttonStyles.primary} inline-flex items-center space-x-2`}
          >
            <Star className="h-5 w-5" />
            <span>Browse Projects</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;




