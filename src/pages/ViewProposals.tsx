// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// // Define interfaces for our data structures for better type safety
// interface Freelancer {
//   _id: string;
//   username: string;
//   skills: string[];
// }

// interface Proposal {
//   _id: string;
//   freelancerId: Freelancer;
//   coverLetter: string;
//   bid: {
//     amount: number;
//     currency: string;
//   };
//   status: string;
// }

// interface Project {
//   _id: string;
//   title: string;
// }

// interface MilestoneInput {
//   title: string;
//   description: string;
// }

// const ViewProposals: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>();
//   const navigate = useNavigate();

//   const [project, setProject] = useState<Project | null>(null);
//   const [proposals, setProposals] = useState<Proposal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // State for handling the acceptance modal/form
//   const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
//   const [milestoneInputs, setMilestoneInputs] = useState<MilestoneInput[]>([{ title: '', description: '' }]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!projectId) return;
//       try {
//         // Fetch project details and proposals in parallel
//         const [projectRes, proposalsRes] = await Promise.all([
//           axios.get(`http://localhost:8080/api/projects/${projectId}`, { withCredentials: true }),
//           axios.get(`http://localhost:8080/api/proposals/project/${projectId}`, { withCredentials: true })
//         ]);
//         setProject(projectRes.data.project);
//         setProposals(proposalsRes.data.proposals);
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to fetch project data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [projectId]);

//   // --- Milestone Form Handlers ---
//   const handleAddMilestone = () => {
//     setMilestoneInputs([...milestoneInputs, { title: '', description: '' }]);
//   };

//   const handleMilestoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const newMilestones = [...milestoneInputs];
//     newMilestones[index] = { ...newMilestones[index], [e.target.name]: e.target.value };
//     setMilestoneInputs(newMilestones);
//   };
  
//   // --- Accept Proposal Handler ---
//   const handleAcceptProposal = async () => {
//     if (milestoneInputs.some(m => !m.title.trim())) {
//       alert('❌ Please provide a title for every milestone.');
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:8080/api/projects/${projectId}/accept-proposal`,
//         {
//           proposalId: selectedProposalId,
//           milestoneInputs: milestoneInputs,
//         },
//         { withCredentials: true }
//       );
//       alert('✅ Freelancer hired and project started successfully!');
//       navigate(`/client/projects`); // Navigate to the client's dashboard or project page
//     } catch (err: any) {
//       alert('❌ ' + (err.response?.data?.message || 'Failed to start the project.'));
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading proposals...</p>;
//   if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold mb-6 text-blue-800">Proposals for: "{project?.title}"</h2>
      
//       {proposals.length === 0 ? (
//         <p>No proposals have been submitted for this project yet.</p>
//       ) : (
//         <div className="space-y-6">
//           {proposals.map((proposal) => (
//             <div key={proposal._id} className="bg-white p-6 rounded-xl shadow-md border">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">{proposal.freelancerId.username}</h3>
//                   <p className="text-gray-600">Skills: {proposal.freelancerId.skills.join(', ')}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xl font-semibold text-green-600">{proposal.bid.amount} {proposal.bid.currency}</p>
//                   <span className={`px-3 py-1 text-sm rounded-full ${
//                       proposal.status === 'accepted' ? 'bg-green-200 text-green-800' : 
//                       proposal.status === 'declined' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
//                     }`}>
//                     {proposal.status}
//                   </span>
//                 </div>
//               </div>
//               <p className="mt-4 text-gray-700 whitespace-pre-wrap">{proposal.coverLetter}</p>
              
//               {/* --- Accept Button & Milestone Form --- */}
//               {selectedProposalId !== proposal._id && (
//                 <button 
//                   onClick={() => setSelectedProposalId(proposal._id)}
//                   className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Accept Proposal & Define Milestones
//                 </button>
//               )}

//               {/* --- Milestone Definition Form (conditionally rendered) --- */}
//               {selectedProposalId === proposal._id && (
//                 <div className="mt-6 border-t pt-4">
//                   <h4 className="text-lg font-semibold mb-2">Define Project Milestones</h4>
//                   <p className="text-sm text-gray-600 mb-4">Split the project into smaller, payable steps. The total budget of {proposal.bid.amount} {proposal.bid.currency} will be divided among them.</p>
//                   <div className="space-y-3">
//                     {milestoneInputs.map((milestone, index) => (
//                       <div key={index} className="flex space-x-3">
//                         <input
//                           name="title"
//                           value={milestone.title}
//                           onChange={(e) => handleMilestoneChange(index, e)}
//                           placeholder={`Milestone ${index + 1} Title`}
//                           className="border w-1/3 p-2 rounded-md"
//                         />
//                         <input
//                           name="description"
//                           value={milestone.description}
//                           onChange={(e) => handleMilestoneChange(index, e)}
//                           placeholder="Brief description (optional)"
//                           className="border w-2/3 p-2 rounded-md"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                   <button onClick={handleAddMilestone} className="text-sm text-blue-600 mt-2">+ Add another milestone</button>
                  
//                   <div className="mt-4 space-x-3">
//                     <button onClick={handleAcceptProposal} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">Confirm & Hire Freelancer</button>
//                     <button onClick={() => setSelectedProposalId(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewProposals;
// The only change is adding a check for `project?.status === 'open'`

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// ... (Interfaces remain the same) ...
interface Freelancer { _id: string; username: string; skills: string[]; }
interface Proposal { _id: string; freelancerId: Freelancer; coverLetter: string; bid: { amount: number; currency: string; }; status: string; }
interface Project { _id: string; title: string; status: string; } // Added status to Project interface
interface MilestoneInput { title: string; description: string; }


const ViewProposals: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [milestoneInputs, setMilestoneInputs] = useState<MilestoneInput[]>([{ title: '', description: '' }]);

  useEffect(() => {
    // ... (useEffect hook for fetching data remains exactly the same) ...
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const [projectRes, proposalsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/projects/${projectId}`, { withCredentials: true }),
          axios.get(`http://localhost:8080/api/proposals/project/${projectId}`, { withCredentials: true })
        ]);
        setProject(projectRes.data.project);
        setProposals(proposalsRes.data.proposals);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);
  
  // ... (All handler functions: handleAddMilestone, handleMilestoneChange, handleAcceptProposal remain the same) ...
  const handleAddMilestone = () => { setMilestoneInputs([...milestoneInputs, { title: '', description: '' }]); };
  const handleMilestoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => { const newMilestones = [...milestoneInputs]; newMilestones[index] = { ...newMilestones[index], [e.target.name]: e.target.value }; setMilestoneInputs(newMilestones); };
  const handleAcceptProposal = async () => { if (milestoneInputs.some(m => !m.title.trim())) { alert('❌ Please provide a title for every milestone.'); return; } try { await axios.post(`http://localhost:8080/api/projects/${projectId}/accept-proposal`, { proposalId: selectedProposalId, milestoneInputs: milestoneInputs, }, { withCredentials: true } ); alert('✅ Freelancer hired and project started successfully!'); navigate(`/client/projects`); } catch (err: any) { alert('❌ ' + (err.response?.data?.message || 'Failed to start the project.')); } };


  if (loading) return <p className="text-center mt-10">Loading proposals...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-2 text-blue-800">Proposals for: "{project?.title}"</h2>
      
      {/* --- NEW LOGIC: Show a message if a proposal is already accepted --- */}
      {project?.status !== 'open' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">This project is now in progress.</p>
          <p>A freelancer has been selected, and milestone work can begin.</p>
        </div>
      )}

      {proposals.length === 0 ? (
        <p>No proposals have been submitted for this project yet.</p>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal._id} className="bg-white p-6 rounded-xl shadow-md border">
              {/* ... (Proposal details display remains the same) ... */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{proposal.freelancerId.username}</h3>
                  <p className="text-gray-600">Skills: {proposal.freelancerId.skills.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-green-600">{proposal.bid.amount} {proposal.bid.currency}</p>
                  <span className={`px-3 py-1 text-sm rounded-full ${ proposal.status === 'accepted' ? 'bg-green-200 text-green-800' : proposal.status === 'declined' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800' }`}> {proposal.status} </span>
                </div>
              </div>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{proposal.coverLetter}</p>
              
              {/* --- NEW LOGIC: Only show the "Accept" button if the project is still 'open' --- */}
              {project?.status === 'open' && (
                <>
                  {selectedProposalId !== proposal._id && (
                    <button onClick={() => setSelectedProposalId(proposal._id)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Accept Proposal & Define Milestones
                    </button>
                  )}
                  {selectedProposalId === proposal._id && (
                    <div className="mt-6 border-t pt-4">
                      {/* ... (The milestone definition form remains exactly the same) ... */}
                      <h4 className="text-lg font-semibold mb-2">Define Project Milestones</h4>
                      <p className="text-sm text-gray-600 mb-4">Split the project into smaller, payable steps. The total budget of {proposal.bid.amount} {proposal.bid.currency} will be divided among them.</p>
                      <div className="space-y-3"> {milestoneInputs.map((milestone, index) => ( <div key={index} className="flex space-x-3"> <input name="title" value={milestone.title} onChange={(e) => handleMilestoneChange(index, e)} placeholder={`Milestone ${index + 1} Title`} className="border w-1/3 p-2 rounded-md" /> <input name="description" value={milestone.description} onChange={(e) => handleMilestoneChange(index, e)} placeholder="Brief description (optional)" className="border w-2/3 p-2 rounded-md" /> </div> ))} </div>
                      <button onClick={handleAddMilestone} className="text-sm text-blue-600 mt-2">+ Add another milestone</button>
                      <div className="mt-4 space-x-3"> <button onClick={handleAcceptProposal} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">Confirm & Hire Freelancer</button> <button onClick={() => setSelectedProposalId(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button> </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProposals;