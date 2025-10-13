// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom"; 

// const ProjectList: React.FC = () => {
//   const [projects, setProjects] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/projects", { withCredentials: true });
//         setProjects(res.data.projects || []);
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
//             <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{p.title}</h3>
//                 <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800">{p.status}</span>
//             </div>
            
//             <p>{p.description}</p>
//             <p className="text-sm text-gray-500">Category: {p.category}</p>
//             <p className="text-sm text-gray-500">Budget: {p.budget?.minimum} - {p.budget?.maximum} {p.budget?.currency}</p>
            
//             {p.totalMilestones > 0 && (
//               <p className="text-sm font-semibold text-green-700 mt-2">
//                 Progress: {p.completedMilestones} / {p.totalMilestones} milestones completed
//               </p>
//             )}

//             {/* --- ✅ UPDATED: Conditional button logic --- */}
//             <div className="mt-4">
//               {/* If project is open, show link to proposals page */}
//               {p.status === 'open' && (
//                 <Link to={`/project/${p._id}/proposals`}>
//                   <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm">
//                     View Proposals
//                   </button>
//                 </Link>
//               )}

//               {/* If project is in progress, show link to the new workspace page */}
//               {p.status === 'in-progress' && (
//                 <Link to={`/project/${p._id}/workspace`}>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
//                     Go to Workspace
//                   </button>
//                 </Link>
//               )}
              
//               {/* If project is completed, show a message */}
//               {p.status === 'completed' && (
//                 <p className="font-semibold text-green-600">Project Completed</p>
//               )}
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
import { useAuth } from "../../contexts/AuthContext";

// It's good practice to define the shape of your data
interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'completed' | 'disputed';
  budget: {
    minimum: number;
    maximum: number;
    currency: string;
  };
  finalAmount?: number; // The new, optional field
  totalMilestones?: number;
  completedMilestones?: number;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchClientProjects = async () => {
        try {
          setLoading(true);
          const res = await axios.get("http://localhost:8080/api/projects/my-projects", { 
            withCredentials: true 
          });
          setProjects(res.data.projects || []);
        } catch (err) {
          console.error("Error fetching client projects:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchClientProjects();
    }
  }, [user]);

  if (loading) {
    return <p className="text-center p-6">Loading your projects...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">My Posted Projects</h2>
      {projects.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You haven't posted any projects yet.</p>
            <Link to="/client/projects/create">
                <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Post Your First Project
                </button>
            </Link>
        </div>
      ) : (
        <div className="space-y-4">
            {projects.map((p) => (
            <div key={p._id} className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Category: {p.category}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{p.status}</span>
                </div>
                
                <p className="mt-2 text-gray-600">{p.description}</p>

                {/* --- ✅ CHANGED: Conditional Budget/Final Price Display --- */}
                <p className="text-sm text-gray-600 mt-2 font-medium">
                    {p.finalAmount ? (
                        <><strong>Final Price:</strong> ${p.finalAmount.toFixed(2)} {p.budget?.currency}</>
                    ) : (
                        <><strong>Budget:</strong> ${p.budget?.minimum} - ${p.budget?.maximum} {p.budget?.currency}</>
                    )}
                </p>
                
                {p.totalMilestones > 0 && (
                <p className="text-sm font-semibold text-green-700 mt-2">
                    Progress: {p.completedMilestones} / {p.totalMilestones} milestones completed
                </p>
                )}

                <div className="mt-4 border-t pt-4 flex gap-4">
                    {p.status === 'open' && (
                        <Link to={`/project/${p._id}/proposals`}>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-semibold">
                            View Proposals
                        </button>
                        </Link>
                    )}

                    {p.status === 'in-progress' && (
                        <Link to={`/project/${p._id}/workspace`}>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">
                            Go to Workspace
                        </button>
                        </Link>
                    )}
                    
                    {p.status === 'completed' && (
                        <p className="font-semibold text-green-600">Project Completed</p>
                    )}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;