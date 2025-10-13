// // src/pages/freelancer/SubmitProposal.tsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";

// const SubmitProposal: React.FC = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const { projectId } = useParams<{ projectId: string }>(); // Get project ID from URL

//     const [form, setForm] = useState({
//         coverLetter: "",
//         bidType: "fixed-price",
//         bidAmount: "",
//         estimatedCompletionDate: "",
//         proposedApproach: "",
//     });
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage("");

//         if (!projectId) {
//             setMessage("Error: Project ID is missing.");
//             setLoading(false);
//             return;
//         }

//         try {
//             const payload = {
//                 projectId,
//                 coverLetter: form.coverLetter,
//                 bid: {
//                     type: form.bidType,
//                     amount: Number(form.bidAmount),
//                     currency: "USD",
//                 },
//                 estimatedCompletionDate: form.estimatedCompletionDate,
//                 proposedApproach: form.proposedApproach,
//             };

//             const res = await axios.post("http://localhost:8080/api/proposals", payload);

//             setMessage("✅ " + res.data.message);
//             // Optionally redirect to the freelancer's proposal list or dashboard
//             setTimeout(() => navigate('/freelancer/dashboard'), 3000); 

//         } catch (err: any) {
//             console.error("Proposal submission error:", err);
//             setMessage("❌ " + (err.response?.data?.message || "Failed to submit proposal."));
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (user?.role !== "freelancer") {
//         return <h2 className="text-center text-red-600">Access Denied. Only freelancers can submit proposals.</h2>;
//     }

//     return (
//         <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
//             <h2 className="text-3xl font-bold mb-6 text-indigo-700">Submit Proposal for Project {projectId}</h2>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Bid Details */}
//                 <div className="flex space-x-4">
//                     <select
//                         name="bidType"
//                         value={form.bidType}
//                         onChange={handleChange}
//                         className="border p-3 rounded-md w-1/3"
//                         required
//                     >
//                         <option value="fixed-price">Fixed Price</option>
//                         <option value="hourly">Hourly</option>
//                     </select>
//                     <input
//                         type="number"
//                         name="bidAmount"
//                         value={form.bidAmount}
//                         onChange={handleChange}
//                         placeholder="Bid Amount (USD)"
//                         min="1"
//                         step="1"
//                         className="border p-3 rounded-md w-2/3"
//                         required
//                     />
//                 </div>

//                 {/* Cover Letter */}
//                 <textarea
//                     name="coverLetter"
//                     value={form.coverLetter}
//                     onChange={handleChange}
//                     placeholder="Cover Letter (Why are you the best fit?)"
//                     rows={5}
//                     maxLength={3000}
//                     className="border w-full p-3 rounded-md"
//                     required
//                 />

//                 {/* Estimated Date */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion Date</label>
//                     <input
//                         type="date"
//                         name="estimatedCompletionDate"
//                         value={form.estimatedCompletionDate}
//                         onChange={handleChange}
//                         className="border w-full p-3 rounded-md"
//                         required
//                     />
//                 </div>

//                 {/* Proposed Approach */}
//                 <textarea
//                     name="proposedApproach"
//                     value={form.proposedApproach}
//                     onChange={handleChange}
//                     placeholder="Briefly describe your proposed approach (optional)"
//                     rows={3}
//                     maxLength={2000}
//                     className="border w-full p-3 rounded-md"
//                 />

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 w-full disabled:bg-indigo-300"
//                 >
//                     {loading ? 'Submitting...' : 'Submit Proposal (Bid)'}
//                 </button>
//             </form>
//             {message && <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
//         </div>
//     );
// };

// export default SubmitProposal;
// src/pages/freelancer/SubmitProposal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const SubmitProposal: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [form, setForm] = useState({
        coverLetter: "",
        bidType: "fixed-price",
        bidAmount: "",
        estimatedCompletionDate: "",
        proposedApproach: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [projectDeadline, setProjectDeadline] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (projectId) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/projects/${projectId}`, { withCredentials: true });
                    if (res.data.project.applicationDeadline) {
                        const deadline = new Date(res.data.project.applicationDeadline).toLocaleDateString();
                        setProjectDeadline(deadline);
                    }
                } catch (err) {
                    console.error("Failed to fetch project details:", err);
                }
            }
        };
        fetchProjectDetails();
    }, [projectId]);
    
    // --- ✅ FIX: Added HTMLTextAreaElement to the type definition ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!projectId) {
            setMessage("Error: Project ID is missing.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                projectId,
                coverLetter: form.coverLetter,
                bid: {
                    type: form.bidType,
                    amount: Number(form.bidAmount),
                    currency: "INR",
                },
                estimatedCompletionDate: form.estimatedCompletionDate,
                proposedApproach: form.proposedApproach,
            };

            const res = await axios.post("http://localhost:8080/api/proposals", payload, {
                withCredentials: true,
            });

            setMessage("✅ " + res.data.message);
            setTimeout(() => navigate('/freelancer/dashboard'), 3000); 

        } catch (err: any) {
            console.error("Proposal submission error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Failed to submit proposal."));
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== "freelancer") {
        return <h2 className="text-center text-red-600">Access Denied. Only freelancers can submit proposals.</h2>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">Submit Proposal</h2>
            
            {projectDeadline && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-center">
                    <strong>Note:</strong> Applications for this project close on <strong>{projectDeadline}</strong>.
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex space-x-4">
                    <select
                        name="bidType"
                        value={form.bidType}
                        onChange={handleChange}
                        className="border p-3 rounded-md w-1/3"
                        required
                    >
                        <option value="fixed-price">Fixed Price</option>
                    </select>
                    <input
                        type="number"
                        name="bidAmount"
                        value={form.bidAmount}
                        onChange={handleChange}
                        placeholder="Bid Amount (INR)"
                        min="1"
                        step="1"
                        className="border p-3 rounded-md w-2/3"
                        required
                    />
                </div>

                <textarea
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={handleChange}
                    placeholder="Cover Letter (Why are you the best fit?)"
                    rows={5}
                    maxLength={3000}
                    className="border w-full p-3 rounded-md"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Estimated Completion Date</label>
                    <input
                        type="date"
                        name="estimatedCompletionDate"
                        value={form.estimatedCompletionDate}
                        onChange={handleChange}
                        className="border w-full p-3 rounded-md"
                        required
                    />
                </div>

                <textarea
                    name="proposedApproach"
                    value={form.proposedApproach}
                    onChange={handleChange}
                    placeholder="Briefly describe your proposed approach (optional)"
                    rows={3}
                    maxLength={2000}
                    className="border w-full p-3 rounded-md"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 w-full disabled:bg-indigo-300"
                >
                    {loading ? 'Submitting...' : 'Submit Proposal'}
                </button>
            </form>
            {message && <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </div>
    );
};

export default SubmitProposal;