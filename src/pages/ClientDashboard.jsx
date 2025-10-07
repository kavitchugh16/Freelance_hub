// // client/src/pages/ClientDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Badge } from './ui/Badge';
// import { Building } from 'lucide-react';

// const statusColors = {
//   'Bidding Open': 'bg-yellow-100 text-yellow-800',
//   'In Progress': 'bg-blue-100 text-blue-800',
//   'Completed': 'bg-green-100 text-green-800',
// };

// const ClientDashboard = () => {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     console.log("Fetching client's projects...");
//     setProjects([
//       { id: 1, title: 'Build a React Dashboard', status: 'Bidding Open' },
//       { id: 4, title: 'E-commerce Site Backend', status: 'In Progress' },
//       { id: 5, title: 'Landing Page Design', status: 'Completed' },
//     ]);
//   }, []);

//   const total = projects.length;
//   const active = projects.filter(p => p.status === 'In Progress').length;
//   const bidding = projects.filter(p => p.status === 'Bidding Open').length;
//   const completed = projects.filter(p => p.status === 'Completed').length;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Client Dashboard</h1>
//         <Link
//           to="/post-project"
//           className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
//         >
//           Post New Project
//         </Link>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {[
//           { label: 'Total Projects', value: total, color: 'bg-gray-100 text-gray-800' },
//           { label: 'Active Projects', value: active, color: 'bg-blue-100 text-blue-800' },
//           { label: 'Bidding', value: bidding, color: 'bg-yellow-100 text-yellow-800' },
//           { label: 'Completed', value: completed, color: 'bg-green-100 text-green-800' },
//         ].map((stat, index) => (
//           <div
//             key={index}
//             className={`p-4 rounded-lg shadow flex items-center justify-between ${stat.color} transition hover:shadow-xl`}
//           >
//             <div>
//               <h3 className="text-lg font-semibold">{stat.label}</h3>
//               <p className="text-2xl font-bold mt-1">{stat.value}</p>
//             </div>
//             <Building className="h-8 w-8 text-gray-500" />
//           </div>
//         ))}
//       </div>

//       {/* Project List */}
//       <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
//       <div className="space-y-4">
//         {projects.map(project => (
//           <div
//             key={project.id}
//             className="p-4 border rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-lg"
//           >
//             <div className="flex flex-col md:flex-row md:items-center gap-4">
//               <h3 className="text-xl font-bold">{project.title}</h3>
//               <Badge className={`px-2 py-1 rounded ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
//                 {project.status}
//               </Badge>
//             </div>
//             <Link
//               to={`/project/${project.id}`}
//               className="mt-2 md:mt-0 text-indigo-600 hover:underline font-medium"
//             >
//               View Details
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;
import React, { useState, useEffect } from 'react';
// Fictional import for navigation, assuming you are using react-router-dom
// import { Link } from 'react-router-dom';
import { Building, Plus, Eye, Clock, CheckCircle, Users, BarChart2, Check, FileText } from 'lucide-react';

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
  'Bidding Open': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
  'In Progress': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
  'Completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
};

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    console.log("Fetching client's projects...");
    setProjects([
      { id: 1, title: 'Build a React Dashboard', status: 'Bidding Open', budget: '$2,500', proposals: 8 },
      { id: 4, title: 'E-commerce Site Backend', status: 'In Progress', budget: '$4,200', proposals: 12 },
      { id: 5, title: 'Landing Page Design', status: 'Completed', budget: '$1,800', proposals: 15 },
    ]);
  }, []);

  const total = projects.length;
  const active = projects.filter(p => p.status === 'In Progress').length;
  const bidding = projects.filter(p => p.status === 'Bidding Open').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  const stats = [
    { label: 'Total Projects', value: total, icon: BarChart2, color: 'text-indigo-500' },
    { label: 'In Progress', value: active, icon: Clock, color: 'text-blue-500' },
    { label: 'Bidding Open', value: bidding, icon: FileText, color: 'text-yellow-500' },
    { label: 'Completed', value: completed, icon: Check, color: 'text-green-500' },
  ];
  
  // Basic styling for buttons to make the component self-contained
  const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow transition",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold shadow transition"
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
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
          background: -webkit-linear-gradient(45deg, #4f46e5, #3b82f6);
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
      `}</style>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
            Project Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your projects and track their progress
          </p>
        </div>
        <Link
          to="/post-project"
          className={`${buttonStyles.primary} mt-4 md:mt-0 flex items-center space-x-2`}
        >
          <Plus className="h-5 w-5" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {stats.map((stat, index) => (
          <div key={index} className="custom-dashboard-card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>


      {/* Project List */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`custom-dashboard-card animate-scale-in`}
               style={{ animationDelay: `${index * 100}ms`}}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>Budget: {project.budget}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.proposals} proposals</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/project/${project.id}`}
                  className={`${buttonStyles.secondary} flex items-center space-x-2`}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first project to find talented freelancers.</p>
          <Link
            to="/post-project"
            className={`${buttonStyles.primary} inline-flex items-center space-x-2`}
          >
            <Plus className="h-5 w-5" />
            <span>Post Your First Project</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
