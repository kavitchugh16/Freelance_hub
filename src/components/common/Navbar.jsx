// client/src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  // This is a placeholder. In a real app, you'd use a context or state management
  // to determine if the user is authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userRole, setUserRole] = useState('freelancer'); // or 'client'

  const handleLogout = () => {
    // Add your logout logic here
    setIsAuthenticated(false);
    console.log("User logged out.");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              FreelancerPro
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/browse-projects" className={({ isActive }) => isActive ? "text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" : "text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"}>
                Browse Projects
              </NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink to={userRole === 'client' ? "/client-dashboard" : "/freelancer-dashboard"} className={({ isActive }) => isActive ? "text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" : "text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"}>
                    Dashboard
                  </NavLink>
                   <NavLink to="/wallet" className={({ isActive }) => isActive ? "text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" : "text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"}>
                    Wallet
                  </NavLink>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={({ isActive }) => isActive ? "text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" : "text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"}>
                    Login
                  </NavLink>
                  <Link to="/register" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;