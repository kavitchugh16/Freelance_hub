import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const MyApplications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const userId = storedUser._id || storedUser.id;

    (async () => {
      try {
        setLoading(true);
        setError('');
        // As requested; backend may not support this, handle gracefully
        const res = await axios.get(`${API_BASE}/applications`, { params: { userId }, headers });
        const list = Array.isArray(res.data) ? res.data : [];
        setApplications(list);
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load applications (endpoint may be unavailable).';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleWithdraw = async (applicationId) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      await axios.delete(`${API_BASE}/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(prev => prev.filter(a => a._id !== applicationId));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Withdraw action is not available.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-lg p-5 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your proposals.</p>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {loading ? (
          <div className="bg-white border rounded-lg p-4 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white border rounded-lg p-4 text-sm text-gray-600">No applications found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(app => (
              <div key={app._id || app.id} className="bg-white border rounded-lg p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{app.project?.title || app.projectTitle || 'Project'}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Client: {app.client?.username || app.client?.name || app.clientName || 'N/A'}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 border text-gray-700">{app.status || 'pending'}</span>
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  <p>Bid Amount: ${app.bidAmount ?? app.amount ?? '—'}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/project/${app.project?._id || app.projectId || app.project}`} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">View Project</Link>
                  <button onClick={() => handleWithdraw(app._id || app.id)} className="px-3 py-2 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700">Withdraw</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;


