// src/pages/Home.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) {
      // We will build this page in the next step
      navigate(`/browse-projects?search=${search.trim()}`);
    }
  };

  return (
    <div className="bg-indigo-700 text-white">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find the perfect freelance services for your project
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 mb-8">
            Connect with talented freelancers, get quotes, and manage projects all in one place.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              className="w-full px-4 py-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder='Try "UI/UX Design"'
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Popular Tags */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-semibold">Popular:</span>
            <button className="px-3 py-1 border-2 border-indigo-400 rounded-full text-sm hover:bg-white hover:text-indigo-700 transition-colors">
              Website Design
            </button>
            <button className="px-3 py-1 border-2 border-indigo-400 rounded-full text-sm hover:bg-white hover:text-indigo-700 transition-colors">
              Python API
            </button>
            <button className="px-3 py-1 border-2 border-indigo-400 rounded-full text-sm hover:bg-white hover:text-indigo-700 transition-colors">
              Logo Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;