// client/src/pages/MyApplications.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-700'
};

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
        const res = await axios.get(`${API_BASE}/applications`, { params: { userId }, headers });
        const list = Array.isArray(res.data) ? res.data : [];
        setApplications(list);
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load applications.';
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
      const msg = e?.response?.data?.message || 'Withdraw action failed.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your project proposals.</p>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {/* Applications */}
        {loading ? (
          <div className="bg-white border rounded-lg p-4 text-center text-sm text-gray-600">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white border rounded-lg p-4 text-center text-sm text-gray-600">No applications found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map(app => {
              const status = (app.status || 'pending').toLowerCase();
              const statusClass = statusColors[status] || statusColors.default;

              return (
                <div key={app._id || app.id} className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{app.project?.title || app.projectTitle || 'Project'}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Client: {app.client?.username || app.client?.name || app.clientName || 'N/A'}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClass}`}>{status}</span>
                    </div>
                    <p className="text-sm text-gray-700">Bid Amount: ${app.bidAmount ?? app.amount ?? '—'}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/project/${app.project?._id || app.projectId || app.project}`} className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50 transition">View Project</Link>
                    <button onClick={() => handleWithdraw(app._id || app.id)} className="px-3 py-2 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700 transition">Withdraw</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
