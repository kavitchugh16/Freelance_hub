// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import './Register.scss';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    country: '',
    description: '',
    company: '',
    skills: '',
    portfolio: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        country: formData.country,
        description: formData.description,
        company: formData.role === 'client' ? formData.company : '',
        skills:
          formData.role === 'freelancer'
            ? formData.skills.split(',').map((s) => s.trim())
            : [],
        portfolio: formData.role === 'freelancer' ? formData.portfolio : '',
      };

      const res = await register(payload); // returns res.data
      toast.success(res.message || 'Registration successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Create a New Account</h1>

        <label>Username</label>
        <input name="username" type="text" value={formData.username} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Hire for a project</option>
          <option value="freelancer">Work as a freelancer</option>
        </select>

        <label>Country</label>
        <input name="country" type="text" value={formData.country} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        {formData.role === 'client' && (
          <>
            <label>Company</label>
            <input name="company" type="text" value={formData.company} onChange={handleChange} required />
          </>
        )}

        {formData.role === 'freelancer' && (
          <>
            <label>Skills (comma separated)</label>
            <input name="skills" type="text" value={formData.skills} onChange={handleChange} required />

            <label>Portfolio URL</label>
            <input name="portfolio" type="text" value={formData.portfolio} onChange={handleChange} required />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
