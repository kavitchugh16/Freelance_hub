import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SubmitProposal: React.FC = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    coverLetter: "",
    bidType: "fixed-price",
    bidAmount: "",
    estimatedCompletionDate: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8080/api/proposals",
        {
          projectId: id,
          coverLetter: form.coverLetter,
          bid: {
            type: form.bidType,
            amount: Number(form.bidAmount),
            currency: "USD",
          },
          estimatedCompletionDate: new Date(form.estimatedCompletionDate),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("✅ Proposal submitted successfully!");
      console.log(res.data);
      setForm({ coverLetter: "", bidType: "fixed-price", bidAmount: "", estimatedCompletionDate: "" });
    } catch (err: any) {
      alert("❌ " + (err.response?.data?.message || "Error submitting proposal"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-700">Submit Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="coverLetter"
          value={form.coverLetter}
          onChange={handleChange}
          placeholder="Cover Letter"
          className="border w-full p-2 rounded-md"
          required
        />
        <input
          name="bidAmount"
          type="number"
          value={form.bidAmount}
          onChange={handleChange}
          placeholder="Bid Amount"
          className="border w-full p-2 rounded-md"
          required
        />
        <input
          name="estimatedCompletionDate"
          type="date"
          value={form.estimatedCompletionDate}
          onChange={handleChange}
          className="border w-full p-2 rounded-md"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full">
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default SubmitProposal;
