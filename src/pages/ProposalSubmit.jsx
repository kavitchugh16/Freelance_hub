import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const ProposalSubmit = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!coverLetter.trim() || !bidAmount) {
      setError('Please provide a cover letter and bid amount.');
      return;
    }

    try {
      setLoading(true);
      // Existing backend uses /api/bids to create a bid (proposal)
      const payload = {
        projectId: projectId,
        bidAmount: Number(bidAmount),
        proposalText: deliveryTime
          ? `${coverLetter}\n\nDelivery Time: ${deliveryTime}`
          : coverLetter
      };

      await axios.post(`${API_BASE}/bids`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/freelancer-dashboard', { state: { message: 'Proposal submitted successfully.' } });
    } catch (e) {
      const msg = e?.response?.data || e?.response?.data?.message || 'Failed to submit proposal.';
      setError(typeof msg === 'string' ? msg : 'Failed to submit proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Submit Proposal</h1>
          <p className="text-sm text-gray-600 mt-1">Project ID: {projectId}</p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <textarea
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bid Amount</label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                <input
                  type="text"
                  placeholder="e.g. 7 days"
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-5 py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </button>
              <button type="button" className="ml-3 inline-flex items-center px-5 py-2.5 rounded-md border bg-white hover:bg-gray-50" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProposalSubmit;


