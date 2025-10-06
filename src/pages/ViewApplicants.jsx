import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const ViewApplicants = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    const headers = { Authorization: `Bearer ${token}` };
    (async () => {
      try {
        setLoading(true);
        setError('');
        // Use existing backend endpoint: GET /api/bids/:projectId (client owner only)
        const res = await axios.get(`${API_BASE}/bids/${projectId}`, { headers });
        const list = Array.isArray(res.data) ? res.data : [];
        setBids(list);
      } catch (e) {
        const msg = e?.response?.data || e?.response?.data?.message || 'Failed to load applicants.';
        setError(typeof msg === 'string' ? msg : 'Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, projectId]);

  const handleAccept = async (bidId) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      await axios.patch(`${API_BASE}/projects/${projectId}/accept/${bidId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically mark accepted
      setBids(prev => prev.map(b => b._id === bidId ? { ...b, status: 'accepted' } : b));
    } catch (e) {
      const msg = e?.response?.data || e?.response?.data?.message || 'Failed to accept application.';
      setError(typeof msg === 'string' ? msg : 'Failed to accept application.');
    }
  };

  const handleReject = async (bidId) => {
    // No reject endpoint in current backend; reflect in UI only
    setBids(prev => prev.map(b => b._id === bidId ? { ...b, status: 'rejected' } : b));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-lg p-5 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-600 mt-1">Project ID: {projectId}</p>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {loading ? (
          <div className="bg-white border rounded-lg p-4 text-sm">Loading applicants...</div>
        ) : bids.length === 0 ? (
          <div className="bg-white border rounded-lg p-4 text-sm text-gray-600">No applications yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bids.map(bid => (
              <div key={bid._id} className="bg-white border rounded-lg p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{bid.freelancer?.username || 'Freelancer'}</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(bid.freelancer?.skills || []).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700">{s}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${bid.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : bid.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{bid.status}</span>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <p className="font-medium">Bid Amount: ${bid.bidAmount}</p>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-500">Proposal</p>
                  <p className="text-sm text-gray-800 whitespace-pre-line mt-1">{bid.proposalText}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleAccept(bid._id)} className="px-3 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">Accept</button>
                  <button onClick={() => handleReject(bid._id)} className="px-3 py-2 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;


