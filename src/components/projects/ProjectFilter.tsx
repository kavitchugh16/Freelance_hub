// src/components/projects/ProjectFilter.tsx

import React from 'react';

const ProjectFilter: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search by keywords (e.g., React, API)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Min Budget */}
        <div>
          <input
            type="number"
            placeholder="Min Budget ($)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Max Budget */}
        <div>
          <input
            type="number"
            placeholder="Max Budget ($)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;