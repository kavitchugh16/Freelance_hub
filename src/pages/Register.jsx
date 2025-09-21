// In client/src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Register.scss'; // We will create this file next

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client', // Default role is client
        country: '',
        description: '',
        skills: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert comma-separated skills string to an array if the user is a freelancer
        const payload = {
            ...formData,
            skills: formData.role === 'freelancer' ? formData.skills.split(',').map(skill => skill.trim()) : [],
        };

        try {
            await axios.post('http://localhost:8080/api/auth/register', payload);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response.data || 'Registration failed.');
        }
    };

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h1>Create a New Account</h1>
                
                <label htmlFor="username">Username</label>
                <input name="username" type="text" placeholder="johndoe" onChange={handleChange} required />

                <label htmlFor="email">Email</label>
                <input name="email" type="email" placeholder="email@example.com" onChange={handleChange} required />

                <label htmlFor="password">Password</label>
                <input name="password" type="password" onChange={handleChange} required />

                <label htmlFor="country">Country</label>
                <input name="country" type="text" placeholder="e.g., India" onChange={handleChange} required />
                
                <label htmlFor="role">I am a:</label>
                <select name="role" onChange={handleChange} value={formData.role}>
                    <option value="client">Client (looking to hire)</option>
                    <option value="freelancer">Freelancer (looking for work)</option>
                </select>

                {formData.role === 'freelancer' && (
                    <>
                        <label htmlFor="skills">Skills (comma-separated)</label>
                        <input name="skills" type="text" placeholder="e.g., React, Node.js, Graphic Design" onChange={handleChange} />
                    </>
                )}

                <label htmlFor="description">Brief Description</label>
                <textarea
                    name="description"
                    placeholder="A short description of yourself or your company"
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;