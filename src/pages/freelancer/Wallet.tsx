// // src/pages/freelancer/Wallet.tsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { FaMoneyBillWave } from "react-icons/fa";

// const FreelancerWallet: React.FC = () => {
//     const { user } = useAuth();
//     // 🔑 FIX: Initialize balance to 0 instead of null.
//     const [balance, setBalance] = useState<number>(0); 
//     const [withdrawAmount, setWithdrawAmount] = useState<string>("");
//     const [message, setMessage] = useState<string>("");

//     const fetchBalance = async () => {
//         try {
//             // NOTE: If you are using the separate Wallet schema, the endpoint should be /api/wallet (GET)
//             // or confirm your backend has a dedicated /api/wallet/balance endpoint.
//             const res = await axios.get("http://localhost:8080/api/wallet"); 
//             setBalance(res.data.balance);
//         } catch (err: any) {
//             console.error("Error fetching balance:", err);
//             // If fetching fails, still display 0
//             setMessage("Failed to load balance. Displaying current default (0.00)."); 
//             setBalance(0);
//         }
// };

//     useEffect(() => {
//         if (user) {
//             fetchBalance();
//         }
//     }, [user]);

//     const handleWithdraw = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage("");

//         const amount = Number(withdrawAmount);
//         if (isNaN(amount) || amount <= 0) {
//             setMessage("Please enter a valid positive amount.");
//             return;
//         }

//         try {
//             const res = await axios.post("http://localhost:8080/api/wallet/withdraw", { amount });
//             
//             setMessage(res.data.message);
//             setBalance(res.data.newBalance);
//             setWithdrawAmount("");
//         } catch (err: any) {
//             console.error("Withdrawal error:", err);
//             setMessage("❌ " + (err.response?.data?.message || "Withdrawal failed."));
//         }
//     };

//     if (user?.role !== "freelancer") {
//         return <h2 className="text-center text-red-600">Access Denied.</h2>;
//     }

//     return (
//         <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
//             <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
//                 <FaMoneyBillWave className="mr-3" /> Freelancer Wallet
//             </h2>
//             <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
//                 <p className="text-xl font-medium">
//                     Current Balance: 
//                     {/* 🔑 FIX: Use balance.toFixed(2) directly since balance is always a number (or 0) */}
//                     <span className="text-green-800 font-bold">${balance.toFixed(2)}</span>
//                 </p>
//             </div>

//             <form onSubmit={handleWithdraw} className="space-y-4">
//                 <h3 className="text-xl font-semibold text-gray-700">Withdraw Funds</h3>
//                 <input
//                     type="number"
//                     value={withdrawAmount}
//                     onChange={(e) => setWithdrawAmount(e.target.value)}
//                     placeholder="Enter amount to withdraw"
//                     min="0.01"
//                     step="0.01"
//                     className="border w-full p-3 rounded-md focus:ring-green-500 focus:border-green-500"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full transition duration-150"
//                 >
//                     Withdraw Funds
//                 </button>
//             </form>
//             {message && <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
//         </div>
//     );
// };

// export default FreelancerWallet;
// src/pages/freelancer/Wallet.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaMoneyBillWave, FaMinusCircle, FaHistory } from "react-icons/fa";

interface Transaction {
    _id: string;
    amount: number;
    type: string;
    description?: string;
    timestamp: string;
}

const FreelancerWallet: React.FC = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const fetchWalletDetails = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/wallet");
            setBalance(res.data.balance);
            setTransactions(res.data.transactions);
        } catch (err) {
            console.error("Error fetching wallet details:", err);
            setMessage("Failed to load wallet details.");
        }
    };

    useEffect(() => {
        if (user?.role === 'freelancer') {
            fetchWalletDetails();
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
            // Refresh details after successful withdrawal
            fetchWalletDetails(); 
            setWithdrawAmount("");
        } catch (err: any) {
            console.error("Withdrawal error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Withdrawal failed."));
        }
    };

    if (user?.role !== "freelancer") {
        return <h2 className="text-center text-red-600">Access Denied. Only freelancers can access this wallet.</h2>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
                <FaMoneyBillWave className="mr-3" /> Freelancer Wallet
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance and Withdrawal Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <div className="mb-6">
                        <p className="text-xl font-medium text-gray-600">Current Balance</p>
                        <p className="text-4xl font-bold text-green-800">
                            ${balance !== null ? balance.toFixed(2) : 'Loading...'}
                        </p>
                        {balance !== null && balance < 0 && (
                            <p className="text-red-500 mt-2 text-sm">Error: Balance is negative!</p>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center"><FaMinusCircle className="mr-2 text-red-500"/> Withdraw Funds</h3>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Amount to withdraw"
                            min="0.01"
                            step="0.01"
                            className="border w-full p-3 rounded-md focus:ring-red-500 focus:border-red-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full transition duration-150"
                        >
                            Withdraw Funds
                        </button>
                    </form>
                    {message && <p className={`mt-4 text-center text-sm ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                </div>
                
                {/* Transaction History Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center"><FaHistory className="mr-2 text-blue-500"/> Transaction History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <div key={tx._id} className={`p-3 rounded-lg border flex justify-between items-center ${tx.type.includes('deposit') || tx.type.includes('release') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div>
                                        <p className="font-semibold capitalize">{tx.type.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className={`font-bold ${tx.type.includes('deposit') || tx.type.includes('release') ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type.includes('deposit') || tx.type.includes('release') ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No transactions recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerWallet;