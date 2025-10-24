import React, { useEffect, useState } from "react";
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
import { getProjects } from "../../services/api"; // IMPORT from your api.ts file

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
    client?: { // This should be populated from your 'getProjects' controller
        _id: string;
        username: string;
        country?: string;
    };
    createdAt?: string;
    proposalsCount?: number; // You may need to add this to your backend aggregation
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
                // USE THE NEW API FUNCTION
                const res = await getProjects("status=open"); 
                
                // Your controller populates 'clientId'
                // Let's rename it to 'client' to match the interface
                const projectsWithClient = res.data.projects.map((p: any) => ({
                    ...p,
                    client: p.clientId // Rename clientId to client
                }));
                setProjects(projectsWithClient || []);

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

    // Filter and Sort Logic
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

    // --- RENDER ---
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
            
            {/* --- ADDED STYLE BLOCK TO FIX ERRORS --- */}
            <style>{`
                .dashboard-card {
                  background-color: white;
                  border-radius: 0.75rem;
                  padding: 1.5rem;
                  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07);
                  transition: all 0.3s ease-in-out;
                }
                .dashboard-card:hover {
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
                .button-primary {
                  background-color: #10b981; /* emerald-500 */
                  color: white;
                  padding: 0.6rem 1.25rem;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
                  transition: all 0.2s ease-in-out;
                }
                .button-primary:hover {
                  background-color: #059669; /* emerald-600 */
                }
                .button-secondary {
                  background-color: #f3f4f6; /* gray-100 */
                  color: #374151; /* gray-700 */
                  padding: 0.6rem 1.25rem;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  border: 1px solid #e5e7eb; /* gray-200 */
                  transition: all 0.2s ease-in-out;
                }
                .button-secondary:hover {
                  background-color: #e5e7eb; /* gray-200 */
                }
            `}</style>
            {/* --- END OF STYLE BLOCK --- */}


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

                        // ... inside your return statement ...

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="budget-high">Budget: High to Low</option>
                            
                            {/* THIS IS THE LINE WITH THE TYPO: */}
                            <option value="budget-low">Budget: Low to High</option>
                        </select>
// ...
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
                                onClick={() => navigate(`/project/${project._id}`)} // This is the link
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
                                                {/* Use client.username, not client.client.username */}
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