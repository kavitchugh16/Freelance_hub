// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// // ⚠️ IMPORTANT: These 'value' strings now EXACTLY match the Mongoose enum strings in Project.js
// const CATEGORY_OPTIONS = [
//   { display: "Web Development", value: "Web Development" }, // Match: 'Web Development'
//   { display: "Mobile Development", value: "Mobile Development" }, // Match: 'Mobile Development'
//   { display: "Graphic Design", value: "Graphic Design" }, // Match: 'Graphic Design'
//   { display: "Content Writing", value: "Content Writing" }, // Match: 'Content Writing'
//   { display: "Digital Marketing", value: "Digital Marketing" }, // Match: 'Digital Marketing'
//   { display: "Other", value: "Other" }, // Match: 'Other'
// ];

// const EXPERIENCE_OPTIONS = [
//   // IMPORTANT: Match: 'Entry-Level' (Capital E, L, HYPHEN)
//   { display: "Entry Level", value: "Entry-Level" }, 
//   { display: "Intermediate", value: "Intermediate" }, // Match: 'Intermediate'
//   { display: "Expert", value: "Expert" }, // Match: 'Expert'
// ];

// const CreateProject: React.FC = () => {
//   const { user } = useAuth(); 
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     category: "", 
//     requiredSkills: "",
//     experienceLevel: "", 
//     budgetAmount: "",
//     deadline: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       alert("❌ You are not logged in. Please log in to create a project.");
//       return;
//     }

//     // Basic validation to ensure dropdowns were selected
//     if (!form.category || !form.experienceLevel) {
//         alert("❌ Please select a Category and Experience Level.");
//         return;
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:8080/api/projects",
//         {
//           title: form.title,
//           description: form.description,
//           category: form.category, // Now sending 'Web Development' (exact match)
//           requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(s => s.length > 0),
//           experienceLevel: form.experienceLevel, // Now sending 'Entry-Level' (exact match)
//           budget: {
//             type: "fixed-price",
//             amount: Number(form.budgetAmount),
//             currency: "USD",
//           },
//           applicationDeadline: new Date(form.deadline),
//         },
//         {
//           // Using withCredentials to automatically send the httpOnly accessToken cookie
//           withCredentials: true,
//         }
//       );

//       alert("✅ Project created successfully!");
//       setForm({
//         title: "",
//         description: "",
//         category: "",
//         requiredSkills: "",
//         experienceLevel: "",
//         budgetAmount: "",
//         deadline: "",
//       });

//       navigate("/client/projects");
//     } catch (err: any) {
//       console.error("Create project error:", err.response?.data || err);
//       alert("❌ " + (err.response?.data?.message || "Error creating project. Check server console for exact enum mismatch."));
//     }
//   };

//   if (user?.role !== "client") {
//     return <h2 className="text-center text-red-600">Access Denied. Only clients can create projects.</h2>;
//   }

//   return (
//     <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-blue-700">Create New Project</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border w-full p-2 rounded-md" required />
//         <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border w-full p-2 rounded-md" required />
//         
//         {/* Category Select: Updated values to match Mongoose schema */}
//         <select 
//             name="category" 
//             value={form.category} 
//             onChange={handleChange} 
//             className="border w-full p-2 rounded-md" 
//             required
//         >
//             <option value="" disabled>Select Project Category</option>
//             {CATEGORY_OPTIONS.map(cat => (
//                 <option key={cat.value} value={cat.value}>{cat.display}</option>
//             ))}
//         </select>

//         <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Skills (comma separated)" className="border w-full p-2 rounded-md" required />
//         
//         {/* Experience Level Select: Updated values to match Mongoose schema */}
//         <select 
//             name="experienceLevel" 
//             value={form.experienceLevel} 
//             onChange={handleChange} 
//             className="border w-full p-2 rounded-md" 
//             required
//         >
//             <option value="" disabled>Select Experience Level</option>
//             {EXPERIENCE_OPTIONS.map(exp => (
//                 <option key={exp.value} value={exp.value}>{exp.display}</option>
//             ))}
//         </select>
        
//         <input name="budgetAmount" type="number" value={form.budgetAmount} onChange={handleChange} placeholder="Budget Amount" className="border w-full p-2 rounded-md" required />
//         <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="border w-full p-2 rounded-md" required />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">Create Project</button>
//       </form>
//     </div>
//   );
// };

// export default CreateProject;

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  { display: "Web Development", value: "Web Development" },
  { display: "Mobile Development", value: "Mobile Development" },
  { display: "Graphic Design", value: "Graphic Design" },
  { display: "Content Writing", value: "Content Writing" },
  { display: "Digital Marketing", value: "Digital Marketing" },
  { display: "Other", value: "Other" },
];

const EXPERIENCE_OPTIONS = [
  { display: "Entry Level", value: "Entry-Level" },
  { display: "Intermediate", value: "Intermediate" },
  { display: "Expert", value: "Expert" },
];

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    requiredSkills: "",
    experienceLevel: "",
    budgetMinimum: "",
    budgetMaximum: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("❌ You are not logged in. Please log in to create a project.");
      return;
    }

    if (!form.category || !form.experienceLevel) {
      alert("❌ Please select a Category and Experience Level.");
      return;
    }
    
    const minBudget = Number(form.budgetMinimum);
    const maxBudget = Number(form.budgetMaximum);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/projects",
        {
          title: form.title,
          description: form.description,
          category: form.category,
          requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(s => s.length > 0),
          experienceLevel: form.experienceLevel,
          budget: {
            type: "fixed-price-range",
            minimum: minBudget,
            maximum: maxBudget,
            currency: "INR",
          },
          applicationDeadline: new Date(form.deadline),
        },
        {
          withCredentials: true,
        }
      );

      alert("✅ Project created successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        requiredSkills: "",
        experienceLevel: "",
        budgetMinimum: "",
        budgetMaximum: "",
        deadline: "",
      });

      navigate("/client/projects");
    } catch (err: any) {
      console.error("Create project error:", err.response?.data || err);
      alert("❌ " + (err.response?.data?.message || "Error creating project."));
    }
  };

  if (user?.role !== "client") {
    return <h2 className="text-center text-red-600">Access Denied. Only clients can create projects.</h2>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border w-full p-2 rounded-md" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border w-full p-2 rounded-md" required />
        
        <select name="category" value={form.category} onChange={handleChange} className="border w-full p-2 rounded-md" required>
            <option value="" disabled>Select Project Category</option>
            {CATEGORY_OPTIONS.map(cat => <option key={cat.value} value={cat.value}>{cat.display}</option>)}
        </select>

        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Skills (comma separated)" className="border w-full p-2 rounded-md" required />
        
        <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="border w-full p-2 rounded-md" required>
            <option value="" disabled>Select Experience Level</option>
            {EXPERIENCE_OPTIONS.map(exp => <option key={exp.value} value={exp.value}>{exp.display}</option>)}
        </select>
        
        <div className="flex space-x-4">
            <input name="budgetMinimum" type="number" value={form.budgetMinimum} onChange={handleChange} placeholder="Minimum Budget " className="border w-full p-2 rounded-md" required />
            <input name="budgetMaximum" type="number" value={form.budgetMaximum} onChange={handleChange} placeholder="Maximum Budget " className="border w-full p-2 rounded-md" required />
        </div>
        
        {/* --- ✅ CHANGED: Added a label for clarity --- */}
        <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} className="border w-full p-2 rounded-md" required />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;