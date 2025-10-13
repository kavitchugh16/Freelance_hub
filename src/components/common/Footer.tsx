// client/src/components/common/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} FreelancerHub. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Built for the Software Project Management Course.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;