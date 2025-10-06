// src/components/common/Navbar.tsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              FreelancerPro
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {!user && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                  }
                >
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <>
                {user.role === 'client' ? (
                  <>
                    <NavLink
                      to="/client/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                          : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/client/profile"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                          : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      }
                    >
                      Profile
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/freelancer/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                          : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/freelancer/profile"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                          : 'text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium'
                      }
                    >
                      Profile
                    </NavLink>
                  </>
                )}

                <span className="text-gray-700 px-3 py-2">Hi, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
