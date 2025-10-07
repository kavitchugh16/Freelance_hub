import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ✅ ADDED: TypeScript interface for a Milestone object
interface Milestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'submitted_for_review' | 'approved' | 'revision_requested';
}

// ✅ ADDED: TypeScript interface for the props of the MilestoneItem component
interface MilestoneItemProps {
  milestone: Milestone;
  onAction: (milestoneId: string, action: 'submit' | 'review', status?: 'approved' | 'revision_requested') => void;
}

// ✅ CHANGED: Applied the props type to the MilestoneItem component
const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, onAction }) => {
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  const handleFreelancerSubmit = () => {
    if (window.confirm('Are you sure you want to submit this milestone for review?')) {
      onAction(milestone._id, 'submit');
    }
  };

  const handleClientReview = (status: 'approved' | 'revision_requested') => {
    if (window.confirm(`Are you sure you want to ${status === 'approved' ? 'approve' : 'request revisions for'} this milestone?`)) {
      onAction(milestone._id, 'review', status);
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${milestone.status === 'approved' ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <h4 className="font-bold">{milestone.title}</h4>
        <span className="font-semibold">{milestone.amount} INR</span>
      </div>
      <p className="text-sm text-gray-600">{milestone.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800">{milestone.status.replace(/_/g, ' ')}</span>
        <div>
          {/* Freelancer Actions */}
          {isFreelancer && (milestone.status === 'pending' || milestone.status === 'revision_requested') && (
            <button onClick={handleFreelancerSubmit} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Submit for Approval</button>
          )}
          
          {/* Client Actions */}
          {isClient && milestone.status === 'submitted_for_review' && (
            <div className="space-x-2">
              <button onClick={() => handleClientReview('revision_requested')} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Request Revision</button>
              <button onClick={() => handleClientReview('approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve & Pay</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const ProjectWorkspace = () => {
    const { projectId } = useParams();
    // ✅ CHANGED: Applied the Milestone type to the useState hook
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMilestones = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/milestones/project/${projectId}`, { withCredentials: true });
            setMilestones(res.data.milestones);
        } catch (error) {
            console.error("Failed to fetch milestones", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(projectId) {
          fetchMilestones();
        }
    }, [projectId]);

    const handleMilestoneAction = async (milestoneId: string, action: 'submit' | 'review', status?: 'approved' | 'revision_requested') => {
        try {
            if (action === 'submit') {
                await axios.patch(`http://localhost:8080/api/milestones/${milestoneId}/submit`, {}, { withCredentials: true });
            } else if (action === 'review') {
                await axios.patch(`http://localhost:8080/api/milestones/${milestoneId}/review`, { approvalStatus: status }, { withCredentials: true });
            }
            fetchMilestones(); 
        } catch (err: any) {
            alert("❌ " + (err.response?.data?.message || "An error occurred."));
        }
    };

    if (loading) return <p className="text-center mt-8">Loading workspace...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Project Milestones</h2>
            {milestones.length > 0 ? (
                <div className="space-y-4">
                    {milestones.map(ms => (
                        <MilestoneItem key={ms._id} milestone={ms} onAction={handleMilestoneAction} />
                    ))}
                </div>
            ) : (
                <p>No milestones have been defined for this project yet.</p>
            )}
        </div>
    );
};

export default ProjectWorkspace;