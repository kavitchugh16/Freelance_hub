import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

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
        // deadline is not in current schema; leave blank
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
        deadline: deadline || undefined // model ignores unknown fields
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{projectId ? 'Edit Project' : 'Post a New Project'}</h1>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js"
                  className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(); } }}
                />
                <button type="button" className="px-3 py-2 rounded-md bg-gray-100 border text-sm" onClick={addSkillFromInput}>Add</button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {s}
                      <button type="button" className="text-indigo-700/70 hover:text-indigo-900" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-5 py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Saving...' : (projectId ? 'Save Changes' : 'Post Project')}
              </button>
              <button type="button" className="ml-3 inline-flex items-center px-5 py-2.5 rounded-md border bg-white hover:bg-gray-50" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProject;


