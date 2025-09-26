// src/components/projects/BidCard.tsx

import React from 'react';

interface BidCardProps {
  freelancerName: string;
  bidAmount: number;
  proposal: string;
}

const BidCard: React.FC<BidCardProps> = ({ freelancerName, bidAmount, proposal }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-800">{freelancerName}</h4>
        <span className="text-lg font-semibold text-indigo-600">${bidAmount.toLocaleString()}</span>
      </div>
      <p className="text-gray-600">{proposal}</p>
    </div>
  );
};

export default BidCard;