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
    FaStar, 
    FaEye, 
    FaArrowRight, 
    FaSpinner 
} from "react-icons/fa";

// ✅ Backend (kavit) data structure adopted: Uses minimum/maximum budget
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
    // UI/Backend additional data points (maintained for UI style)
    client?: {
        username: string;
        country?: string;
    };
    createdAt?: string;
    proposalsCount?: number;
}

const BrowseProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // UI Features (main branch style)
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedExperience, setSelectedExperience] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("newest");

    const categories = ["Web Development", "Mobile Development", "Design", "Writing", "Marketing", "Data Science", "Other"];
    const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Expert"];

    // ✅ Backend Call Logic (kavit) maintained
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

    // UI Filtering Logic (main branch style)
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        const matchesExperience = !selectedExperience || project.experienceLevel === selectedExperience;
        
        return matchesSearch && matchesCategory && matchesExperience;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        // ✅ UI Logic Update: Sort based on the 'maximum' budget from the backend structure
        const aBudget = a.budget?.maximum || 0;
        const bBudget = b.budget?.maximum || 0;

        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            case "oldest":
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            case "budget-high":
                return bBudget - aBudget; // Use maximum for comparison
            case "budget-low":
                return aBudget - bBudget; // Use maximum for comparison
            default:
                return 0;
        }
    });

    // UI Rendering (main branch style)
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
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="budget-high">Budget: High to Low (Max)</option>
                            <option value="budget-low">Budget: Low to High (Max)</option>
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
                    <div className="text-center py-12 animate-fade-in">
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
                                className={`dashboard-card group cursor-pointer animate-scale-in delay-${index * 100}`}
                                onClick={() => navigate(`/project/${project._id}`)}
                            >
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{project.category}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <FaStar className="h-4 w-4" />
                                            <span className="text-sm font-medium">4.8</span>
                                        </div>
                                    </div>

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
                                                    className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {project.requiredSkills.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{project.requiredSkills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Project Details */}
                                    <div className="space-y-3 pt-2 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-emerald-600">
                                                <FaDollarSign className="h-4 w-4" />
                                                {/* ✅ UI Logic Update: Displaying the new minimum/maximum budget range */}
                                                <span className="font-bold text-lg">
                                                    {project.budget?.currency}
                                                    {project.budget?.minimum?.toLocaleString()} - {project.budget?.maximum?.toLocaleString()}
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
                                                <div className="flex items-center space-x-1 text-red-500">
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
                                                        <span>•</span>
                                                        <FaMapMarkerAlt className="h-3 w-3" />
                                                        <span>{project.client.country}</span>
                                                    </>
                                                )}
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