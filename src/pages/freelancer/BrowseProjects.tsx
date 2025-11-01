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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 text-shadow">
                        Browse Projects
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Discover amazing opportunities and find your next project
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="dashboard-card mb-8 animate-scale-in">
                    <div className="space-y-4">
                        {/* Search Bar - Full Width */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search projects by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white text-gray-700 cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience Filter */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Experience Level
                                </label>
                                <select
                                    value={selectedExperience}
                                    onChange={(e) => setSelectedExperience(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white text-gray-700 cursor-pointer"
                                >
                                    <option value="">All Experience Levels</option>
                                    {experienceLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white text-gray-700 cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="budget-high">Budget: High to Low</option>
                                    <option value="budget-low">Budget: Low to High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 animate-fade-in flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        <p className="text-gray-600 font-medium">
                            Showing <span className="font-bold text-emerald-600">{sortedProjects.length}</span> of <span className="font-bold text-gray-900">{projects.length}</span> projects
                        </p>
                    </div>
                    {(searchTerm || selectedCategory || selectedExperience) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setSelectedExperience("");
                            }}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1"
                        >
                            <span>Clear all filters</span>
                            <span>×</span>
                        </button>
                    )}
                </div>

                {/* Projects Grid */}
                {sortedProjects.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in dashboard-card max-w-2xl mx-auto">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                                <FaSearch className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-600 text-lg mb-8">Try adjusting your search criteria or filters to find more opportunities.</p>
                        </div>
                        {(searchTerm || selectedCategory || selectedExperience) && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("");
                                    setSelectedExperience("");
                                }}
                                className="button-primary inline-flex items-center gap-2 px-6 py-3"
                            >
                                <span>Clear All Filters</span>
                                <span>×</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedProjects.map((project, index) => (
                            <div
                                key={project._id}
                                className="dashboard-card group cursor-pointer animate-scale-in hover:shadow-xl transition-all duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => navigate(`/project/${project._id}`)}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Category Badge & Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full">
                                                {project.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                <FaEye className="h-3 w-3" />
                                                <span>{project.proposalsCount || 0}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight mb-2">
                                            {project.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="flex-grow mb-4">
                                      <p className="text-gray-600 line-clamp-3 leading-relaxed text-sm">
                                          {project.description}
                                      </p>
                                    </div>

                                    {/* Skills */}
                                    {project.requiredSkills && project.requiredSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.requiredSkills.slice(0, 3).map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium border border-emerald-100"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {project.requiredSkills.length > 3 && (
                                                <span className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    +{project.requiredSkills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Project Details */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100 mb-4">
                                        {/* Budget */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-emerald-600">
                                                <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                    <FaDollarSign className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-lg">
                                                    ${project.budget?.minimum?.toLocaleString()} - ${project.budget?.maximum?.toLocaleString()} {project.budget?.currency || 'USD'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Experience & Deadline */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <FaClock className="h-3.5 w-3.5" />
                                                <span className="font-medium">{project.experienceLevel || 'Any Level'}</span>
                                            </div>
                                            {project.applicationDeadline && (
                                                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg font-medium">
                                                    <FaCalendarAlt className="h-3.5 w-3.5" />
                                                    <span className="text-xs">{new Date(project.applicationDeadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Client Info */}
                                        {project.client && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {project.client.username?.charAt(0)?.toUpperCase() || 'C'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-medium">{project.client.username}</span>
                                                        {project.client.country && (
                                                            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                                                                <FaMapMarkerAlt className="h-3 w-3" />
                                                                <span>{project.client.country}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBidClick(project._id);
                                            }}
                                            className="flex-1 button-primary flex items-center justify-center space-x-2 py-3 text-base font-semibold"
                                        >
                                            <span>Place Bid</span>
                                            <FaArrowRight className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/project/${project._id}`);
                                            }}
                                            className="button-secondary flex items-center justify-center px-5 py-3 border-2 hover:border-emerald-300"
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