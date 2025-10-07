// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // ⬅️ NEW: Import useNavigate

// interface Project {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   budget: { amount: number; currency: string };
//   experienceLevel?: string;
//   requiredSkills?: string[];
//   applicationDeadline?: string;
// }

// const BrowseProjects: React.FC = () => {
//   const navigate = useNavigate(); // ⬅️ NEW: Initialize navigate
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/projects?status=open", {
//           withCredentials: true, // send cookies if backend uses them
//         });

//         // Ensure you grab the nested 'projects' array, as per your controller logic
//         setProjects(res.data.projects || res.data); 
//       } catch (err: any) {
//         console.error("Error fetching projects:", err);
//         setError("Failed to fetch projects. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Handlers
//   const handleBidClick = (projectId: string) => {
//     // ⬅️ NEW: Navigate to the proposal submission page, passing the project ID
//     navigate(`/freelancer/submit-proposal/${projectId}`);
//   };

//   if (loading) return <p className="text-center mt-8">Loading projects...</p>;
//   if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

//   if (projects.length === 0)
//     return <p className="text-center mt-8 text-gray-600">No open projects available.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-green-700">Available Projects</h2>
//       {projects.map((p) => (
//         <div 
//             key={p._id} 
//             className="border rounded-md p-4 mb-4 bg-white shadow-md flex justify-between items-center transition hover:shadow-lg" // Added flex for button positioning
//         >
//             {/* Project Details */}
//             <div className="flex-grow">
//               <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
//               <p className="mt-1 text-gray-600">{p.description}</p>
//               <div className="mt-2 text-sm space-y-1">
//                 <p className="font-medium text-blue-700">
//                   Budget: ${p.budget?.amount} {p.budget?.currency}
//                 </p>
//                 <p className="text-gray-500">Category: {p.category}</p>
//                 {p.experienceLevel && <p className="text-gray-500">Experience: {p.experienceLevel}</p>}
//                 {p.requiredSkills && p.requiredSkills.length > 0 && (
//                   <p className="text-gray-500">
//                     Skills: <span className="text-indigo-600 font-medium">{p.requiredSkills.join(", ")}</span>
//                   </p>
//                 )}
//                 {p.applicationDeadline && (
//                   <p className="text-red-500">
//                     Deadline: {new Date(p.applicationDeadline).toLocaleDateString()}
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             {/* ⬅️ NEW: Place Bid Button */}
//             <div className="ml-6 flex-shrink-0">
//                 <button
//                     onClick={() => handleBidClick(p._id)}
//                     className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
//                 >
//                     Place Bid
//                 </button>
//             </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BrowseProjects;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ CHANGED: Updated the Project interface for the new budget structure
interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: { 
    minimum: number; 
    maximum: number;
    currency: string 
  };
  experienceLevel?: string;
  requiredSkills?: string[];
  applicationDeadline?: string;
}

const BrowseProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/projects?status=open", {
          withCredentials: true,
        });
        setProjects(res.data.projects || res.data); 
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleBidClick = (projectId: string) => {
    navigate(`/freelancer/submit-proposal/${projectId}`);
  };

  if (loading) return <p className="text-center mt-8">Loading projects...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (projects.length === 0) return <p className="text-center mt-8 text-gray-600">No open projects available.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Available Projects</h2>
      {projects.map((p) => (
        <div 
            key={p._id} 
            className="border rounded-md p-4 mb-4 bg-white shadow-md flex justify-between items-center transition hover:shadow-lg"
        >
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
            <p className="mt-1 text-gray-600">{p.description}</p>
            <div className="mt-2 text-sm space-y-1">
              {/* ✅ CHANGED: Displaying the budget range correctly */}
              <p className="font-medium text-blue-700">
                Budget: {p.budget?.minimum} - {p.budget?.maximum} {p.budget?.currency}
              </p>
              <p className="text-gray-500">Category: {p.category}</p>
              {p.experienceLevel && <p className="text-gray-500">Experience: {p.experienceLevel}</p>}
              {p.requiredSkills && p.requiredSkills.length > 0 && (
                <p className="text-gray-500">
                  Skills: <span className="text-indigo-600 font-medium">{p.requiredSkills.join(", ")}</span>
                </p>
              )}
              {p.applicationDeadline && (
                <p className="text-red-500">
                  Deadline: {new Date(p.applicationDeadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
            
          <div className="ml-6 flex-shrink-0">
              <button
                  onClick={() => handleBidClick(p._id)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                  Place Bid
              </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrowseProjects;