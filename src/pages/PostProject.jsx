// client/src/pages/PostProject.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

const PostProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = useMemo(() => searchParams.get('id'), [searchParams]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  // Prefill if editing (GET /api/projects/:id)
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/projects/${projectId}`);
        const p = res.data || {};
        setTitle(p.title || '');
        setDescription(p.description || '');
        setSkills(Array.isArray(p.skills) ? p.skills : []);
        setSkillsInput('');
        setBudget(String(p.budget || ''));
      } catch (_) {
        // ignore if project not found
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const addSkillFromInput = () => {
    const trimmed = skillsInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setSkills(prev => Array.from(new Set([...prev, ...parts])));
    setSkillsInput('');
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim() || skills.length === 0 || !budget) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        skills,
        budget: Number(budget),
        deadline: deadline || undefined
      };

      await axios.post(`${API_BASE}/projects`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/client-dashboard');
    } catch (e) {
      const msg = e?.response?.data || e?.response?.data?.message || 'Failed to post project.';
      setError(typeof msg === 'string' ? msg : 'Failed to post project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {projectId ? 'Edit Project' : 'Post a New Project'}
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm flex items-center gap-2">
              <X className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 shadow-sm transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                rows={5}
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 shadow-sm transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project in detail"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills *</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js"
                  className="flex-1 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-2 transition"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(); } }}
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
                  onClick={addSkillFromInput}
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200"
                    >
                      {s}
                      <button
                        type="button"
                        className="hover:text-indigo-900"
                        onClick={() => removeSkill(s)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 shadow-sm transition"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget in $"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 shadow-sm transition"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? 'Saving...' : projectId ? 'Save Changes' : 'Post Project'}
              </button>
              <button
                type="button"
                className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
