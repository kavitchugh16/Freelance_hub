import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Save JWT and user info to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Redirect based on role and profile completion
        if (user.role === 'freelancer') {
          if (!user.profileCompleted) {
            navigate('/freelancer-details', { 
              state: { message: 'Please complete your profile to get started' }
            });
          } else {
            navigate('/freelancer-dashboard');
          }
        } else if (user.role === 'client') {
          if (!user.profileCompleted) {
            navigate('/client-details', { 
              state: { message: 'Please complete your profile to get started' }
            });
          } else {
            navigate('/client-dashboard');
          }
        } else {
          // Default redirect to home
          navigate('/');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('Forgot password functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <LogIn className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h1>
            <p className="text-blue-600">Sign in to continue to Freelance Hub</p>
          </div>

          {/* Login Form */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-blue-900 text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-blue-900 font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-blue-900 font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Signup Link */}
              <div className="mt-6 text-center">
                <p className="text-blue-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Create one here
                  </Link>
                </p>
              </div>

              {/* Demo Accounts Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-blue-900 font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Demo Accounts
                </h4>
                <div className="text-sm text-blue-600 space-y-1">
                  <p><strong>Freelancer:</strong> freelancer@demo.com / password123</p>
                  <p><strong>Client:</strong> client@demo.com / password123</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center text-blue-500 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Your data is protected with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;