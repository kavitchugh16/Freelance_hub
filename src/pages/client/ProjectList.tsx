

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom"; // ✅ ADDED: Import for navigation

// const ProjectList: React.FC = () => {
//   const [projects, setProjects] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/projects", { withCredentials: true });
//         setProjects(res.data.projects || []); // Default to empty array
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-blue-700">All Projects</h2>
//       {projects.length === 0 ? (
//         <p>No projects available.</p>
//       ) : (
//         projects.map((p) => (
//           <div key={p._id} className="border rounded-md p-4 mb-3 shadow-sm bg-gray-50">
//             <h3 className="text-lg font-semibold">{p.title}</h3>
//             <p>{p.description}</p>
//             <p className="text-sm text-gray-500">Category: {p.category}</p>
//             <p className="text-sm text-gray-500">Budget: {p.budget?.minimum} - {p.budget?.maximum} {p.budget?.currency}</p>
            
//             {p.totalMilestones > 0 && (
//               <p className="text-sm font-semibold text-green-700 mt-2">
//                 Progress: {p.completedMilestones} / {p.totalMilestones} milestones completed
//               </p>
//             )}

//             {/* ✅ ADDED: Link to the view proposals page for this project */}
//             <div className="mt-4">
//               <Link to={`/project/${p._id}/proposals`}>
//                 <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm">
//                   View Proposals
//                 </button>
//               </Link>
//             </div>
            
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ProjectList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/projects", { withCredentials: true });
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">All Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((p) => (
          <div key={p._id} className="border rounded-md p-4 mb-3 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800">{p.status}</span>
            </div>
            
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">Category: {p.category}</p>
            <p className="text-sm text-gray-500">Budget: {p.budget?.minimum} - {p.budget?.maximum} {p.budget?.currency}</p>
            
            {p.totalMilestones > 0 && (
              <p className="text-sm font-semibold text-green-700 mt-2">
                Progress: {p.completedMilestones} / {p.totalMilestones} milestones completed
              </p>
            )}

            {/* --- ✅ UPDATED: Conditional button logic --- */}
            <div className="mt-4">
              {/* If project is open, show link to proposals page */}
              {p.status === 'open' && (
                <Link to={`/project/${p._id}/proposals`}>
                  <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm">
                    View Proposals
                  </button>
                </Link>
              )}

              {/* If project is in progress, show link to the new workspace page */}
              {p.status === 'in-progress' && (
                <Link to={`/project/${p._id}/workspace`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    Go to Workspace
                  </button>
                </Link>
              )}
              
              {/* If project is completed, show a message */}
              {p.status === 'completed' && (
                <p className="font-semibold text-green-600">Project Completed</p>
              )}
            </div>
            
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectList;