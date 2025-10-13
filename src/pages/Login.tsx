// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import './Login.scss';

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const user = await login(formData); // Now login returns user

//     if (!user) {
//       toast.error('User does not exist.');
//       return;
//     }

//     toast.success('Login successful!');

//     // Redirect based on role
//     if (user.role === 'client') navigate('/client/dashboard');
//     else if (user.role === 'freelancer') navigate('/freelancer/dashboard');
//     else navigate('/');
//   } catch (err: any) {
//     toast.error(err.response?.data?.message || err.message || 'Login failed.');
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="login">
//       <form onSubmit={handleSubmit}>
//         <h1>Sign In</h1>

//         <label>Username</label>
//         <input name="username" type="text" value={formData.username} onChange={handleChange} required />

//         <label>Password</label>
//         <input name="password" type="password" value={formData.password} onChange={handleChange} required />

//         <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import './Login.scss';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData);
      if (!user) {
        toast.error('User does not exist.');
        return;
      }

      toast.success('Login successful!');
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'freelancer') navigate('/freelancer/dashboard');
      else navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-effect w-full max-w-md rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-lg"
      >
        <h1 className="text-3xl font-bold gradient-text text-center mb-8">Sign In</h1>

        <label className="block text-gray-700 mb-2 font-semibold">Username</label>
        <input
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
        />

        <label className="block text-gray-700 mb-2 font-semibold">Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
        />

        <button
          type="submit"
          disabled={loading}
          className="button-primary w-full text-center"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
