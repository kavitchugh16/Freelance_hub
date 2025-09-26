// src/pages/Register.tsx

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Use our API service
import './Register.scss';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client', // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.register(formData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h1>Create a New Account</h1>
                
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" placeholder="johndoe" onChange={handleChange} required />

                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="email@example.com" onChange={handleChange} required />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" onChange={handleChange} required />
                
                <label htmlFor="role">I want to:</label>
                <select id="role" name="role" onChange={handleChange} value={formData.role}>
                    <option value="client">Hire for a project</option>
                    <option value="freelancer">Work as a freelancer</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;