// client/src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Find Your Next Project, or Your Next Star Freelancer
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Our platform connects clients and freelancers with secure bidding, milestone tracking, and transparent payments.
      </p>
      <div className="mt-8 flex gap-4">
        <Link 
          to="/browse-projects" 
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Browse Projects
        </Link>
        <Link 
          to="/register" // Assuming clients post projects after signing up
          className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          Post a Project
        </Link>
      </div>
    </div>
  );
};

export default Home;