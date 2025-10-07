// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom"; // ⬅️ NEW: Import useNavigate

// // interface Project {
// //   _id: string;
// //   title: string;
// //   description: string;
// //   category: string;
// //   budget: { amount: number; currency: string };
// //   experienceLevel?: string;
// //   requiredSkills?: string[];
// //   applicationDeadline?: string;
// // }

// // const BrowseProjects: React.FC = () => {
// //   const navigate = useNavigate(); // ⬅️ NEW: Initialize navigate
// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchProjects = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8080/api/projects?status=open", {
// //           withCredentials: true, // send cookies if backend uses them
// //         });

// //         // Ensure you grab the nested 'projects' array, as per your controller logic
// //         setProjects(res.data.projects || res.data); 
// //       } catch (err: any) {
// //         console.error("Error fetching projects:", err);
// //         setError("Failed to fetch projects. Please try again.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProjects();
// //   }, []);

// //   // Handlers
// //   const handleBidClick = (projectId: string) => {
// //     // ⬅️ NEW: Navigate to the proposal submission page, passing the project ID
// //     navigate(`/freelancer/submit-proposal/${projectId}`);
// //   };

// //   if (loading) return <p className="text-center mt-8">Loading projects...</p>;
// //   if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

// //   if (projects.length === 0)
// //     return <p className="text-center mt-8 text-gray-600">No open projects available.</p>;

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-2xl font-bold mb-6 text-green-700">Available Projects</h2>
// //       {projects.map((p) => (
// //         <div 
// //             key={p._id} 
// //             className="border rounded-md p-4 mb-4 bg-white shadow-md flex justify-between items-center transition hover:shadow-lg" // Added flex for button positioning
// //         >
// //             {/* Project Details */}
// //             <div className="flex-grow">
// //               <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
// //               <p className="mt-1 text-gray-600">{p.description}</p>
// //               <div className="mt-2 text-sm space-y-1">
// //                 <p className="font-medium text-blue-700">
// //                   Budget: ${p.budget?.amount} {p.budget?.currency}
// //                 </p>
// //                 <p className="text-gray-500">Category: {p.category}</p>
// //                 {p.experienceLevel && <p className="text-gray-500">Experience: {p.experienceLevel}</p>}
// //                 {p.requiredSkills && p.requiredSkills.length > 0 && (
// //                   <p className="text-gray-500">
// //                     Skills: <span className="text-indigo-600 font-medium">{p.requiredSkills.join(", ")}</span>
// //                   </p>
// //                 )}
// //                 {p.applicationDeadline && (
// //                   <p className="text-red-500">
// //                     Deadline: {new Date(p.applicationDeadline).toLocaleDateString()}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
            
// //             {/* ⬅️ NEW: Place Bid Button */}
// //             <div className="ml-6 flex-shrink-0">
// //                 <button
// //                     onClick={() => handleBidClick(p._id)}
// //                     className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
// //                 >
// //                     Place Bid
// //                 </button>
// //             </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default BrowseProjects;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // ✅ CHANGED: Updated the Project interface for the new budget structure
// interface Project {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   budget: { 
//     minimum: number; 
//     maximum: number;
//     currency: string 
//   };
//   experienceLevel?: string;
//   requiredSkills?: string[];
//   applicationDeadline?: string;
// }

// const BrowseProjects: React.FC = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/projects?status=open", {
//           withCredentials: true,
//         });
//         setProjects(res.data.projects || res.data); 
//       } catch (err: any) {
//         console.error("Error fetching projects:", err);
//         setError("Failed to fetch projects. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleBidClick = (projectId: string) => {
//     navigate(`/freelancer/submit-proposal/${projectId}`);
//   };

//   if (loading) return <p className="text-center mt-8">Loading projects...</p>;
//   if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
//   if (projects.length === 0) return <p className="text-center mt-8 text-gray-600">No open projects available.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-green-700">Available Projects</h2>
//       {projects.map((p) => (
//         <div 
//             key={p._id} 
//             className="border rounded-md p-4 mb-4 bg-white shadow-md flex justify-between items-center transition hover:shadow-lg"
//         >
//           <div className="flex-grow">
//             <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
//             <p className="mt-1 text-gray-600">{p.description}</p>
//             <div className="mt-2 text-sm space-y-1">
//               {/* ✅ CHANGED: Displaying the budget range correctly */}
//               <p className="font-medium text-blue-700">
//                 Budget: {p.budget?.minimum} - {p.budget?.maximum} {p.budget?.currency}
//               </p>
//               <p className="text-gray-500">Category: {p.category}</p>
//               {p.experienceLevel && <p className="text-gray-500">Experience: {p.experienceLevel}</p>}
//               {p.requiredSkills && p.requiredSkills.length > 0 && (
//                 <p className="text-gray-500">
//                   Skills: <span className="text-indigo-600 font-medium">{p.requiredSkills.join(", ")}</span>
//                 </p>
//               )}
//               {p.applicationDeadline && (
//                 <p className="text-red-500">
//                   Deadline: {new Date(p.applicationDeadline).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>
            
//           <div className="ml-6 flex-shrink-0">
//               <button
//                   onClick={() => handleBidClick(p._id)}
//                   className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
//               >
//                   Place Bid
//               </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BrowseProjects;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaClock,
    FaDollarSign,
    FaUser,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaEye,
    FaArrowRight,
    FaSpinner
} from "react-icons/fa";

// --- TypeScript Interface ---
interface Project {
    _id: string;
    title: string;
    description: string;
    category: string;
    budget: {
        minimum: number;
        maximum: number;
        currency: string;
    };
    experienceLevel?: string;
    requiredSkills?: string[];
    applicationDeadline?: string;
    client?: {
        username: string;
        country?: string;
    };
    createdAt?: string;
    proposalsCount?: number;
}

// --- Component ---
const BrowseProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedExperience, setSelectedExperience] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("newest");

    const categories = ["Web Development", "Mobile Development", "Design", "Writing", "Marketing", "Data Science", "Other"];
    const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Expert"];

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

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        const matchesExperience = !selectedExperience || project.experienceLevel === selectedExperience;

        return matchesSearch && matchesCategory && matchesExperience;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            case "oldest":
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            case "budget-high":
                return (b.budget?.maximum || 0) - (a.budget?.maximum || 0);
            case "budget-low":
                return (a.budget?.minimum || 0) - (b.budget?.minimum || 0);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
                        Browse Projects
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Discover amazing opportunities and find your next project
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="dashboard-card mb-8 animate-scale-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Experience Filter */}
                        <select
                            value={selectedExperience}
                            onChange={(e) => setSelectedExperience(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                            <option value="">All Experience Levels</option>
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="budget-high">Budget: High to Low</option>
                            <option value="budget-low">Budget: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 animate-fade-in">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{sortedProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> projects
                    </p>
                </div>

                {/* Projects Grid */}
                {sortedProjects.length === 0 ? (
                    <div className="text-center py-12 animate-fade-in dashboard-card">
                        <FaSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setSelectedExperience("");
                            }}
                            className="button-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedProjects.map((project, index) => (
                            <div
                                key={project._id}
                                className="dashboard-card group cursor-pointer animate-scale-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => navigate(`/project/${project._id}`)}
                            >
                                <div className="space-y-4 flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{project.category}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow space-y-4">
                                      {/* Description */}
                                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                                          {project.description}
                                      </p>

                                      {/* Skills */}
                                      {project.requiredSkills && project.requiredSkills.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                              {project.requiredSkills.slice(0, 3).map((skill, skillIndex) => (
                                                  <span
                                                      key={skillIndex}
                                                      className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium"
                                                  >
                                                      {skill}
                                                  </span>
                                              ))}
                                              {project.requiredSkills.length > 3 && (
                                                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                                                      +{project.requiredSkills.length - 3} more
                                                  </span>
                                              )}
                                          </div>
                                      )}
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-emerald-600">
                                                <FaDollarSign className="h-4 w-4" />
                                                <span className="font-bold text-lg">
                                                    ${project.budget?.minimum?.toLocaleString()} - ${project.budget?.maximum?.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-gray-500">
                                                <FaUser className="h-4 w-4" />
                                                <span className="text-sm">{project.proposalsCount || 0} proposals</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <FaClock className="h-3 w-3" />
                                                <span>{project.experienceLevel || 'Any Level'}</span>
                                            </div>
                                            {project.applicationDeadline && (
                                                <div className="flex items-center space-x-1 text-red-500 font-medium">
                                                    <FaCalendarAlt className="h-3 w-3" />
                                                    <span>{new Date(project.applicationDeadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {project.client && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaUser className="h-3 w-3" />
                                                <span>by {project.client.username}</span>
                                                {project.client.country && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <div className="flex items-center space-x-1">
                                                          <FaMapMarkerAlt className="h-3 w-3" />
                                                          <span>{project.client.country}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBidClick(project._id);
                                            }}
                                            className="flex-1 button-primary flex items-center justify-center space-x-2"
                                        >
                                            <span>Place Bid</span>
                                            <FaArrowRight className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/project/${project._id}`);
                                            }}
                                            className="button-secondary flex items-center justify-center space-x-2 px-4"
                                        >
                                            <FaEye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;


