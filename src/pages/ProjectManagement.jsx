import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/projects/${projectId}`);
        setProject(res.data);
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load project.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-lg p-5 mb-6">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">Manage milestones, files, messages, and status updates.</p>
              {project && (
                <p className="text-sm text-gray-500 mt-2">{project.title} • Budget: ${project.budget} • Status: {project.status}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">Project ID: {projectId}</div>
          </div>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {loading ? (
          <div className="bg-white border rounded-lg p-4 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Milestones */}
              <section className="bg-white border rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">Your backend exposes milestone submit/review endpoints. Listing milestones is not available; display here when available.</p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-gray-700">No milestones to display.</p>
                  </div>
                </div>
              </section>

              {/* File Sharing */}
              <section className="bg-white border rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900">File Sharing</h2>
                <p className="text-sm text-gray-600 mt-2">Attach and share files related to this project.</p>
                <div className="mt-4">
                  <input type="file" className="block w-full text-sm text-gray-700" />
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Upload</button>
                    <button className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">Refresh</button>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">No files yet.</div>
                </div>
              </section>

              {/* Messages */}
              <section className="bg-white border rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <div className="mt-3 border rounded-md h-48 p-3 overflow-auto bg-gray-50 text-sm text-gray-700">No messages yet.</div>
                <div className="mt-3 flex gap-2">
                  <input type="text" placeholder="Type a message" className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Send</button>
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Status Updates */}
              <section className="bg-white border rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900">Status Updates</h2>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li className="border rounded-md p-3 bg-gray-50">No updates yet.</li>
                </ul>
                <div className="mt-4">
                  <textarea rows={3} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Share a status update..." />
                  <div className="mt-2 flex justify-end">
                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Post Update</button>
                  </div>
                </div>
              </section>

              {/* Project summary */}
              <section className="bg-white border rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900">Project Summary</h2>
                <div className="mt-3 text-sm text-gray-700">
                  <p><span className="text-gray-500">Title:</span> {project?.title}</p>
                  <p><span className="text-gray-500">Budget:</span> ${project?.budget}</p>
                  <p><span className="text-gray-500">Status:</span> {project?.status}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(project?.skills || []).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700">{s}</span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;


