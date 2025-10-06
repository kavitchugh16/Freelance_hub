// src/pages/freelancer/Wallet.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaMoneyBillWave } from "react-icons/fa";

const FreelancerWallet: React.FC = () => {
    const { user } = useAuth();
    // 🔑 FIX: Initialize balance to 0 instead of null.
    const [balance, setBalance] = useState<number>(0); 
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const fetchBalance = async () => {
        try {
            // NOTE: If you are using the separate Wallet schema, the endpoint should be /api/wallet (GET)
            // or confirm your backend has a dedicated /api/wallet/balance endpoint.
            const res = await axios.get("http://localhost:8080/api/wallet"); 
            setBalance(res.data.balance);
        } catch (err: any) {
            console.error("Error fetching balance:", err);
            // If fetching fails, still display 0
            setMessage("Failed to load balance. Displaying current default (0.00)."); 
            setBalance(0);
        }
};

    useEffect(() => {
        if (user) {
            fetchBalance();
        }
    }, [user]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const amount = Number(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage("Please enter a valid positive amount.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/api/wallet/withdraw", { amount });
            
            setMessage(res.data.message);
            setBalance(res.data.newBalance);
            setWithdrawAmount("");
        } catch (err: any) {
            console.error("Withdrawal error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Withdrawal failed."));
        }
    };

    if (user?.role !== "freelancer") {
        return <h2 className="text-center text-red-600">Access Denied.</h2>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
                <FaMoneyBillWave className="mr-3" /> Freelancer Wallet
            </h2>
            <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xl font-medium">
                    Current Balance: 
                    {/* 🔑 FIX: Use balance.toFixed(2) directly since balance is always a number (or 0) */}
                    <span className="text-green-800 font-bold">${balance.toFixed(2)}</span>
                </p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Withdraw Funds</h3>
                <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    min="0.01"
                    step="0.01"
                    className="border w-full p-3 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full transition duration-150"
                >
                    Withdraw Funds
                </button>
            </form>
            {message && <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </div>
    );
};

export default FreelancerWallet;