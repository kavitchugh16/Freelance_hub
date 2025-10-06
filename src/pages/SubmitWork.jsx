import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const SubmitWork = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('status', 'completed');
      formData.append('notes', notes);
      if (file) formData.append('file', file);

      await axios.patch(`${API_BASE}/projects/${projectId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/feedback', { state: { message: 'Work submitted for review.' } });
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to submit work.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Submit Work</h1>
          <p className="text-sm text-gray-600 mt-1">Project ID: {projectId}</p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">File Upload</label>
              <input
                type="file"
                className="mt-1 block w-full text-sm text-gray-700"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="mt-1 text-xs text-gray-500">Attach deliverables (zip/pdf/docs, etc.).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any context or instructions for the reviewer..."
              />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-5 py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Work'}
              </button>
              <button type="button" className="ml-3 inline-flex items-center px-5 py-2.5 rounded-md border bg-white hover:bg-gray-50" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitWork;


