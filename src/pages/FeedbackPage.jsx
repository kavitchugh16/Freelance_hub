import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const FeedbackPage = () => {
  const location = useLocation();
  const message = location.state?.message || 'Thank you! Your submission has been received.';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Submission Received</h1>
          <p className="mt-3 text-gray-700">{message}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/freelancer-dashboard" className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Go to Dashboard</Link>
            <Link to="/explore" className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 text-sm">Explore Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;


