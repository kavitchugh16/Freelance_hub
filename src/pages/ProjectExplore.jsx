import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      // Skills filter: all selected must be included
      const pSkills = (p.skills || []).map(s => String(s).toLowerCase());
      const needed = skills.map(s => s.toLowerCase());
      const hasSkills = needed.every(s => pSkills.includes(s));

      // Budget filter
      const min = budgetMin ? Number(budgetMin) : -Infinity;
      const max = budgetMax ? Number(budgetMax) : Infinity;
      const inBudget = typeof p.budget === 'number' ? (p.budget >= min && p.budget <= max) : true;

      // Work mode (backend has no explicit field; infer from description)
      const desc = String(p.description || '').toLowerCase();
      const inferred = desc.includes('remote') ? 'remote' : (desc.includes('onsite') || desc.includes('on-site') ? 'onsite' : 'unknown');
      const modeOk = workMode === 'all' || inferred === workMode;

      return hasSkills && inBudget && modeOk;
    });
  }, [projects, skills, budgetMin, budgetMax, workMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header + Filters */}
        <div className="bg-white border rounded-lg p-5 mb-6">
          <div className="flex items-start justify-between gap-4 flex-col lg:flex-row">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explore Projects</h1>
              <p className="text-gray-600 mt-1">Find opportunities that match your skills.</p>
              {error && (
                <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
              )}
            </div>
            <div className="w-full lg:w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
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

              {/* Budget Min */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Budget</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>

              {/* Budget Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Budget</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Mode</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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

        {/* Results */}
        {loading ? (
          <div className="bg-white border rounded-lg p-4 text-sm">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p._id || p.id} className="bg-white border rounded-lg p-4 flex flex-col">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(p.skills || []).slice(0,5).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700">{s}</span>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-700 flex items-center justify-between">
                  <span>Budget: ${p.budget}</span>
                  <span>Status: {p.status}</span>
                </div>
                <div className="mt-4">
                  <Link to={`/project/${p._id || p.id}`} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">View Details</Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full bg-white border rounded-lg p-4 text-sm text-gray-600">No projects match the selected filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplore;


