// client/src/pages/Wallet.jsx

import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch wallet details from API
    console.log("Fetching wallet data...");
    setBalance(500.75);
    setTransactions([
      { id: 1, type: 'Deposit', amount: 1000, date: '2025-09-20' },
      { id: 2, type: 'Milestone Payment', amount: -400, date: '2025-09-22', project: 'E-commerce Site' },
      { id: 3, type: 'Milestone Payment', amount: -99.25, date: '2025-09-25', project: 'E-commerce Site' },
    ]);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-semibold">Current Balance</h2>
        <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
          Deposit Funds
        </button>
        <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">
          Withdraw Funds
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{tx.type} {tx.project ? `(${tx.project})` : ''}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <p className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;