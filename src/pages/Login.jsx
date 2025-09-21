// In client/src/pages/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Login.scss'; // We will create this file next

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', 
                { username, password },
                { withCredentials: true } // Important: This allows the browser to send and receive cookies
            );
            
            // Store user data in localStorage for easy access
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            
            toast.success('Login successful!');

            // Redirect based on user role
            if (res.data.role === 'client') {
                navigate('/client-dashboard');
            } else {
                navigate('/freelancer-dashboard');
            }

        } catch (err) {
            toast.error(err.response.data || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <label htmlFor="username">Username</label>
                <input
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;