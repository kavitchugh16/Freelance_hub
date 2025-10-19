import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaFlag, FaCheckCircle, FaHourglassHalf, FaSyncAlt, FaExclamationCircle } from 'react-icons/fa';

// --- TypeScript Interfaces ---
interface Milestone {
    _id: string;
    title: string;
    description: string;
    amount: number;
    status: 'pending' | 'submitted_for_review' | 'revision_requested' | 'approved';
    createdAt: string;
}

interface Project {
    _id: string;
    title: string;
    status: string;
}

interface MilestoneItemProps {
  milestone: Milestone;
  onAction: (milestoneId: string, action: 'submit' | 'review', status?: 'approved' | 'revision_requested') => void;
}


// --- ✅ MODIFIED: Enhanced helper to get rich status info ---
const getStatusInfo = (status: Milestone['status']) => {
    switch (status) {
        case 'pending':
            return { icon: FaHourglassHalf, color: 'text-gray-500', bgColor: 'bg-gray-100', text: 'Pending' };
        case 'submitted_for_review':
            return { icon: FaFlag, color: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'Submitted for Review' };
        case 'revision_requested':
            return { icon: FaSyncAlt, color: 'text-blue-600', bgColor: 'bg-blue-100', text: 'Revision Requested' };
        case 'approved':
            return { icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', text: 'Approved & Paid' };
        default:
            return { icon: FaExclamationCircle, color: 'text-gray-500', bgColor: 'bg-gray-100', text: 'Unknown' };
    }
};


// --- ✅ MODIFIED: Enhanced MilestoneItem component with better UI ---
const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, onAction }) => {
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  const statusInfo = getStatusInfo(milestone.status);
  const StatusIcon = statusInfo.icon;

  const handleFreelancerSubmit = () => {
    if (window.confirm('Are you sure you want to submit this milestone for client approval?')) {
      onAction(milestone._id, 'submit');
    }
  };

  const handleClientReview = (status: 'approved' | 'revision_requested') => {
    const confirmText = status === 'approved' 
        ? "Are you sure you want to approve this milestone? This will release the payment to the freelancer."
        : "Are you sure you want to request a revision for this milestone?";
    if (window.confirm(confirmText)) {
      onAction(milestone._id, 'review', status);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-gray-800">{milestone.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
                <p className="text-lg font-bold text-green-600">₹{milestone.amount.toFixed(2)}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center justify-center mt-1 ${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon className="mr-1.5" />
                    {statusInfo.text}
                </span>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            {isFreelancer && (milestone.status === 'pending' || milestone.status === 'revision_requested') && (
                <button 
                    onClick={handleFreelancerSubmit}
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700">
                    Submit for Approval
                </button>
            )}

            {isClient && milestone.status === 'submitted_for_review' && (
                <>
                    <button 
                        onClick={() => handleClientReview('approved')}
                        className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700">
                        Approve & Pay
                    </button>
                    <button 
                        onClick={() => handleClientReview('revision_requested')}
                        className="bg-gray-600 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-700">
                        Request Revision
                    </button>
                </>
            )}
        </div>
    </div>
  );
};


// --- ✅ MODIFIED: Enhanced ProjectWorkspace component ---
const ProjectWorkspace: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuth(); // used in MilestoneItem

    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkspaceData = useCallback(async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const [projectRes, milestonesRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/projects/${projectId}`, { withCredentials: true }),
                axios.get(`http://localhost:8080/api/milestones/project/${projectId}`, { withCredentials: true })
            ]);
            setProject(projectRes.data.project);
            setMilestones(milestonesRes.data.milestones);
            setError(null);
        } catch (err) {
            console.error("Error fetching workspace data:", err);
            setError("Failed to load project workspace.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchWorkspaceData();
    }, [fetchWorkspaceData]);

    const handleMilestoneAction = async (milestoneId: string, action: 'submit' | 'review', status?: 'approved' | 'revision_requested') => {
        try {
            if (action === 'submit') {
                await axios.patch(`http://localhost:8080/api/milestones/${milestoneId}/submit`, {}, { withCredentials: true });
            } else if (action === 'review') {
                await axios.patch(
                    `http://localhost:8080/api/milestones/${milestoneId}/review`, 
                    { approvalStatus: status },
                    { withCredentials: true }
                );
            }
            fetchWorkspaceData();
        } catch (err: any) {
            alert("Error: " + (err.response?.data || err.message));
        }
    };

    if (loading) return <p className="text-center mt-10">Loading Workspace...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project?.title}</h1>
            <p className="text-gray-500 mb-6">Project Workspace</p>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Milestones</h2>
                {milestones.length > 0 ? (
                    milestones.map((ms) => (
                        <MilestoneItem key={ms._id} milestone={ms} onAction={handleMilestoneAction} />
                    ))
                ) : (
                    <div className="text-center p-8 bg-white rounded-lg border">
                        <p className="text-gray-600">No milestones have been defined for this project yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectWorkspace;