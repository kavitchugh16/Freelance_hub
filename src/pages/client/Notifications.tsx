// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell, FaCheckCircle, FaProjectDiagram } from "react-icons/fa";

// interface Notification {
//     _id: string;
//     message: string;
//     isRead: boolean;
//     type: string;
//     // 🔑 FIX: Ensure projectId is treated as an object with required properties
//     projectId: { title: string, _id: string } | string; 
//     createdAt: string;
// }

// // Helper to safely get the project title from the populated field
// const getProjectTitle = (projectId: Notification['projectId']) => {
//     if (typeof projectId === 'object' && projectId !== null && 'title' in projectId) {
//         return projectId.title;
//     }
//     return 'Project Details Missing';
// };


// const ClientNotifications: React.FC = () => {
//     const [notifications, setNotifications] = useState<Notification[]>([]);
//     const [loading, setLoading] = useState(true);

//     const fetchNotifications = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get("http://localhost:8080/api/notifications");
//             setNotifications(res.data.notifications);
//         } catch (err) {
//             console.error("Error fetching notifications:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markAsRead = async (id: string) => {
//         try {
//             await axios.post(`http://localhost:8080/api/notifications/${id}/read`);
//             // Update state immediately without refetching
//             setNotifications(prev => prev.map(n => 
//                 n._id === id ? { ...n, isRead: true } : n
//             ));
//         } catch (err) {
//             console.error("Error marking as read:", err);
//         }
//     };

//     useEffect(() => {
//         fetchNotifications();
//     }, []);

//     if (loading) return <p className="text-center mt-10">Loading notifications...</p>;

//     const unreadCount = notifications.filter(n => !n.isRead).length;

//     return (
//         <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
//             <h2 className="text-3xl font-bold mb-6 text-pink-700 flex items-center">
//                 <FaBell className="mr-3" /> Notifications ({unreadCount} Unread)
//             </h2>
            
//             <div className="space-y-4">
//                 {notifications.length === 0 ? (
//                     <p className="text-gray-500 text-center p-10">You have no notifications yet.</p>
//                 ) : (
//                     notifications.map((n) => (
//                         <div key={n._id} className={`p-4 rounded-lg flex items-center justify-between transition duration-200 ${n.isRead ? 'bg-white border' : 'bg-pink-100 border-pink-300 shadow-md'}`}>
                            
//                             <div className="flex items-center space-x-4">
//                                 <FaProjectDiagram className="text-pink-500 flex-shrink-0" size={24} />
//                                 <div>
//                                     <p className={`font-semibold ${n.isRead ? 'text-gray-700' : 'text-pink-800'}`}>
//                                         {n.message}
//                                     </p>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         {/* 🔑 FIX: Use helper function to safely access the title */}
//                                         Project: {getProjectTitle(n.projectId)}
//                                         <span className="ml-4">· {new Date(n.createdAt).toLocaleString()}</span>
//                                     </p>
//                                 </div>
//                             </div>

//                             {!n.isRead && (
//                                 <button
//                                     onClick={() => markAsRead(n._id)}
//                                     className="text-sm text-green-600 hover:text-green-800 flex items-center ml-4 flex-shrink-0"
//                                 >
//                                     <FaCheckCircle className="mr-1" /> Mark Read
//                                 </button>
//                             )}
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ClientNotifications;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaCheckCircle, FaProjectDiagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ ADDED: For navigation

interface Notification {
    _id: string;
    message: string;
    isRead: boolean;
    type: string;
    proposalId: string; // ✅ ADDED: To know which proposal to approve
    projectId: { 
        title: string, 
        _id: string,
        status: 'open' | 'in-progress' | 'completed' // ✅ ADDED: To conditionally show button
    } | null; 
    createdAt: string;
}

const getProjectTitle = (project: Notification['projectId']) => project?.title || 'N/A';
const getProjectId = (project: Notification['projectId']) => project?._id || '';

const ClientNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ ADDED: For navigation

    const fetchNotifications = async () => { /* ... (function is unchanged) ... */ 
        try { setLoading(true); const res = await axios.get("http://localhost:8080/api/notifications", { withCredentials: true }); setNotifications(res.data.notifications); } catch (err) { console.error("Error fetching notifications:", err); } finally { setLoading(false); }
    };

    const markAsRead = async (id: string) => { /* ... (function is unchanged) ... */
        try { await axios.post(`http://localhost:8080/api/notifications/${id}/read`, {}, { withCredentials: true }); setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n )); } catch (err) { console.error("Error marking as read:", err); }
    };

    // ✅ ADDED: Handler for approving a bid
    const handleApproveBid = async (proposalId: string) => {
        if (!window.confirm("Are you sure you want to approve this bid and start the project? This will decline all other bids.")) return;
        try {
            await axios.post(`http://localhost:8080/api/proposals/${proposalId}/approve`, {}, { withCredentials: true });
            alert("✅ Bid approved successfully! The freelancer has been notified.");
            fetchNotifications(); // Refresh notifications to update the UI
        } catch (err: any) {
            alert("❌ " + (err.response?.data?.message || "Failed to approve bid."));
        }
    };
    
    useEffect(() => { fetchNotifications(); }, []);

    if (loading) return <p className="text-center mt-10">Loading notifications...</p>;
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-pink-700 flex items-center">
                <FaBell className="mr-3" /> Notifications ({unreadCount} Unread)
            </h2>
            <div className="space-y-4">
                {notifications.length === 0 ? ( <p>...</p> ) : (
                    notifications.map((n) => (
                        <div key={n._id} className={`p-4 rounded-lg flex items-start justify-between transition duration-200 ${n.isRead ? 'bg-white border' : 'bg-pink-100 border-pink-300 shadow-md'}`}>
                            <div className="flex items-start space-x-4">
                                <FaProjectDiagram className="text-pink-500 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <p className={`font-semibold ${n.isRead ? 'text-gray-700' : 'text-pink-800'}`}>{n.message}</p>
                                    <p className="text-sm text-gray-500 mt-1"> Project: {getProjectTitle(n.projectId)} <span className="ml-4">· {new Date(n.createdAt).toLocaleString()}</span> </p>
                                    
                                    {/* ✅ ADDED: Conditional buttons for "new_bid" notifications */}
                                    {n.type === 'new_bid' && n.projectId?.status === 'open' && (
                                        <div className="mt-3 space-x-3">
                                            <button onClick={() => handleApproveBid(n.proposalId)} className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">Approve Bid</button>
                                            <button onClick={() => navigate(`/project/${getProjectId(n.projectId)}/proposals`)} className="bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-700">View All Bids</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!n.isRead && ( <button onClick={() => markAsRead(n._id)} className="text-sm text-green-600 hover:text-green-800 flex items-center ml-4 flex-shrink-0"> <FaCheckCircle className="mr-1" /> Mark Read </button> )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientNotifications;