// src/pages/ProjectDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOrCreateConversation, getProjectById } from '../services/api';

// --- (Your UserInfo and Proposal interfaces are here) ---
interface UserInfo {
  _id: string;
  username: string;
  email?: string;
  company?: string;
  skills?: string[];
}
interface Proposal {
  _id: string;
  freelancerId: UserInfo;
  bid: {
    amount: number;
  };
  proposalText: string;
  status: string;
}

// --- 1. UPDATE THE PROJECT INTERFACE ---
interface Project {
  _id: string;
  title: string;
  description: string;
  finalAmount?: number; // finalAmount might not exist yet
  budget: { // budget is an object
    minimum: number;
    maximum: number;
    currency: string;
  };
  skills: string[];
  clientId: UserInfo;
  proposals: Proposal[];
}
// ----------------------------------------

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProjectById(projectId);
        
        if (res.data.success) {
          setProject(res.data.project);
        } else {
          setError(res.data.message || 'Project not found.');
        }
      } catch (err: any) {
        console.error('Failed to fetch project details:', err);
        setError(err.response?.data?.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  // ... (handleStartChat function is here) ...
  const handleStartChat = async (recipientId: string) => {
    if (!user) {
      alert('Please log in to send a message.');
      return navigate('/login');
    }
    if (user._id === recipientId) {
      alert("You cannot message yourself.");
      return;
    }
    try {
      const res = await getOrCreateConversation(recipientId);
      console.log('Conversation started:', res.data);
      navigate('/messages');
    } catch (err) {
      console.error('Failed to start conversation', err);
      alert('Error starting chat. Please try again.');
    }
  };

  const toggleBid = (id: string) => {
    setExpandedBids(prev => ({ ...prev, [id]: !prev[id] }));
  };


  if (loading) return <p className="text-center mt-20 text-gray-600">Loading project details...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!project) return <p className="text-center mt-20 text-gray-600">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Project Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-blue-900">{project.title}</h1>
            
            {user && user.role === 'freelancer' && user._id !== project.clientId._id && (
              <button
                onClick={() => handleStartChat(project.clientId._id)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                <MessageSquare size={18} />
                Message {project.clientId.username || 'Client'}
              </button>
            )}
          </div>
          
          <p className="mt-2 text-gray-700 text-lg">{project.description}</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(project.skills || []).map(skill => (
                <span key={skill} className="inline-block bg-indigo-50 text-indigo-800 font-semibold px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
            
            {/* --- 2. FIX THE BUDGET DISPLAY LINE --- */}
            <div className="text-xl font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-inner">
              Budget: {project.finalAmount 
                ? `$${project.finalAmount.toLocaleString()}` 
                : `$${project.budget.minimum.toLocaleString()} - $${project.budget.maximum.toLocaleString()}`}
            </div>
            {/* -------------------------------------- */}

          </div>
        </div>

        {/* Bids Section (Now 'proposals') */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">Proposals</h2>
          
          {(project.proposals || []).length === 0 && (
            <p className="text-gray-600">No proposals have been submitted yet.</p>
          )}

          {(project.proposals || []).map((proposal: Proposal) => (
            <div
              key={proposal._id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center p-4">
                <div onClick={() => toggleBid(proposal._id)} className="flex-grow cursor-pointer">
                  {/* Check if freelancerId exists before accessing username */}
                  <p className="font-semibold text-gray-800">{proposal.freelancerId?.username || 'Unknown Freelancer'}</p>
                  <p className="text-gray-600 text-sm">Bid: ${proposal.bid.amount}</p>
                </div>
                <div className="flex items-center gap-4">
                  
                  {user && user.role === 'client' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleStartChat(proposal.freelancerId._id);
                      }}
                      className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition"
                    >
                      <MessageSquare size={16} />
                      Chat
                    </button>
                  )}
                  <div onClick={() => toggleBid(proposal._id)} className="cursor-pointer">
                    {expandedBids[proposal._id] ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-indigo-600" />}
                  </div>
                </div>
              </div>
              {expandedBids[proposal._id] && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 text-gray-700 text-sm">
                  {proposal.proposalText || 'No proposal text provided.'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;