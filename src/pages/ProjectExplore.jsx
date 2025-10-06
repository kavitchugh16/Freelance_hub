// client/src/pages/ProjectExplore.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

const ProjectExplore = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);

  // Filters
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [workMode, setWorkMode] = useState('all'); // all | remote | onsite

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/projects`);
        const list = Array.isArray(res.data) ? res.data : [];
        setProjects(list);
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load projects.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addSkillFromInput = () => {
    const trimmed = skillsInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setSkills(prev => Array.from(new Set([...prev, ...parts])));
    setSkillsInput('');
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const pSkills = (p.skills || []).map(s => String(s).toLowerCase());
      const needed = skills.map(s => s.toLowerCase());
      const hasSkills = needed.every(s => pSkills.includes(s));

      const min = budgetMin ? Number(budgetMin) : -Infinity;
      const max = budgetMax ? Number(budgetMax) : Infinity;
      const inBudget = typeof p.budget === 'number' ? (p.budget >= min && p.budget <= max) : true;

      const desc = String(p.description || '').toLowerCase();
      const inferred = desc.includes('remote') ? 'remote' : (desc.includes('onsite') || desc.includes('on-site') ? 'onsite' : 'unknown');
      const modeOk = workMode === 'all' || inferred === workMode;

      return hasSkills && inBudget && modeOk;
    });
  }, [projects, skills, budgetMin, budgetMax, workMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filters */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Explore Projects</h1>
              <p className="text-gray-600 mt-1">Find opportunities that match your skills.</p>
              {error && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  <X className="w-4 h-4" /> {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js"
                    className="flex-1 rounded-xl border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 transition"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(); } }}
                  />
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    onClick={addSkillFromInput}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-indigo-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Min */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 transition"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>

              {/* Budget Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 transition"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                <select
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 transition"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="bg-white shadow rounded-xl p-6 text-center text-gray-500">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 && (
              <div className="col-span-full bg-white shadow rounded-xl p-6 text-center text-gray-600">
                No projects match the selected filters.
              </div>
            )}
            {filtered.map(p => (
              <div key={p._id || p.id} className="bg-white shadow-md rounded-2xl p-6 flex flex-col hover:shadow-xl transition">
                <h3 className="text-lg font-semibold text-blue-900">{p.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(p.skills || []).slice(0,5).map(s => (
                    <span key={s} className="text-xs px-2 py-1 rounded-full bg-gray-100 border text-gray-700">{s}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                  <span>Budget: ${p.budget}</span>
                  <span>Status: {p.status}</span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/project/${p._id || p.id}`}
                    className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplore;
