
// // src/pages/client/Wallet.tsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { FaMoneyBillWave, FaPlusCircle, FaHistory, FaArrowCircleUp } from "react-icons/fa";

// interface Transaction {
//     _id: string; amount: number; type: 'deposit' | 'milestone_payment_release';
//     description?: string; timestamp: string;
// }

// // --- ADDED: Helper to get transaction styles ---
// const getTransactionInfo = (tx: Transaction) => {
//     switch (tx.type) {
//         case 'deposit':
//             return { icon: FaPlusCircle, color: 'text-green-600', bgColor: 'bg-green-50', sign: '+' };
//         case 'milestone_payment_release':
//             return { icon: FaArrowCircleUp, color: 'text-red-600', bgColor: 'bg-red-50', sign: '-' };
//         default:
//             return { icon: FaHistory, color: 'text-gray-600', bgColor: 'bg-gray-50', sign: '' };
//     }
// }

// const ClientWallet: React.FC = () => {
//     const { user } = useAuth();
//     const [balance, setBalance] = useState<number | null>(null);
//     const [transactions, setTransactions] = useState<Transaction[]>([]);
//     const [depositAmount, setDepositAmount] = useState<string>("");
//     const [message, setMessage] = useState<string>("");

//     const fetchWalletDetails = async () => { /* ... existing fetch logic ... */ };
//     useEffect(() => { if (user?.role === 'client') fetchWalletDetails(); }, [user]);
//     const handleDeposit = async (e: React.FormEvent) => { /* ... existing deposit logic ... */ };

//     return (
//         <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
//             {/* ... Balance and Deposit section ... */}
            
//             {/* --- MODIFIED: Transaction History Section --- */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center"><FaHistory className="mr-2 text-blue-500"/> Transaction History</h3>
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                     {transactions.length > 0 ? (
//                         transactions.map((tx) => {
//                             const { icon: Icon, color, bgColor, sign } = getTransactionInfo(tx);
//                             return (
//                                 <div key={tx._id} className={`p-3 rounded-lg border flex justify-between items-center ${bgColor}`}>
//                                     <div className="flex items-center">
//                                         <Icon className={`mr-3 ${color}`} />
//                                         <div>
//                                             <p className="font-semibold capitalize">{tx.description || tx.type.replace(/_/g, ' ')}</p>
//                                             <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
//                                         </div>
//                                     </div>
//                                     <div className={`font-bold ${color}`}>
//                                         {sign}₹{Math.abs(tx.amount).toFixed(2)}
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <p className="text-gray-500 text-center">No transactions recorded yet.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ClientWallet;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaMoneyBillWave, FaPlusCircle, FaHistory, FaArrowCircleUp } from "react-icons/fa";

// Define the structure of a transaction object
interface Transaction {
    _id: string;
    amount: number;
    type: 'deposit' | 'milestone_payment_release';
    description?: string;
    timestamp: string;
}

// Helper function to determine styling based on transaction type
const getTransactionInfo = (tx: Transaction) => {
    switch (tx.type) {
        case 'deposit':
            return { icon: FaPlusCircle, color: 'text-green-600', bgColor: 'bg-green-50', sign: '+' };
        case 'milestone_payment_release':
            return { icon: FaArrowCircleUp, color: 'text-red-600', bgColor: 'bg-red-50', sign: '-' };
        default:
            return { icon: FaHistory, color: 'text-gray-600', bgColor: 'bg-gray-50', sign: '' };
    }
};

const ClientWallet: React.FC = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    // Function to fetch the current balance and transaction history from the API
    const fetchWalletDetails = async () => {
        try {
            // The API endpoint to get wallet details
            const res = await axios.get("http://localhost:8080/api/wallet");
            setBalance(res.data.balance); //
            setTransactions(res.data.transactions); //
        } catch (err) {
            console.error("Error fetching wallet details:", err);
            setMessage("Failed to load wallet details.");
        }
    };

    // useEffect hook to fetch wallet details when the component mounts or the user changes
    useEffect(() => {
        if (user?.role === 'client') {
            fetchWalletDetails();
        }
    }, [user]);

    // Function to handle the deposit form submission
    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const amount = Number(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage("Please enter a valid positive amount.");
            return;
        }

        try {
            // The API endpoint to deposit funds
            const res = await axios.post("http://localhost:8080/api/wallet/deposit", { amount });
            
            setMessage(res.data.message);
            // Refresh wallet details after a successful deposit
            fetchWalletDetails(); 
            setDepositAmount(""); // Clear the input field
        } catch (err: any) {
            console.error("Deposit error:", err);
            setMessage("❌ " + (err.response?.data?.message || "Deposit failed."));
        }
    };

    // Prevent non-clients from viewing the page
    if (user?.role !== "client") {
        return <h2 className="text-center text-red-600">Access Denied. Only clients can access this wallet.</h2>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
                <FaMoneyBillWave className="mr-3" /> Client Wallet
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance and Deposit Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <div className="mb-6">
                        <p className="text-xl font-medium text-gray-600">Current Balance</p>
                        <p className="text-4xl font-bold text-green-800">
                            {balance !== null ? `₹${balance.toFixed(2)}` : 'Loading...'}
                        </p>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center"><FaPlusCircle className="mr-2 text-green-500"/> Add Funds</h3>
                    <form onSubmit={handleDeposit} className="space-y-4">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Amount to deposit"
                            min="1"
                            step="any"
                            className="border w-full p-3 rounded-md focus:ring-green-500 focus:border-green-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full transition duration-150"
                        >
                            Deposit Funds
                        </button>
                    </form>
                    {message && <p className={`mt-4 text-center text-sm ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                </div>
                
                {/* Transaction History Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center"><FaHistory className="mr-2 text-blue-500"/> Transaction History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => {
                                const { icon: Icon, color, bgColor, sign } = getTransactionInfo(tx);
                                return (
                                    <div key={tx._id} className={`p-3 rounded-lg border flex justify-between items-center ${bgColor}`}>
                                        <div className="flex items-center">
                                            <Icon className={`mr-3 ${color}`} />
                                            <div>
                                                <p className="font-semibold capitalize">{tx.description || tx.type.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${color}`}>
                                            {sign}₹{Math.abs(tx.amount).toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center">No transactions recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 

export default ClientWallet;