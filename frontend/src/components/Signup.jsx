import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Users
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
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
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.role) {
      setError('Please select your role');
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
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      });

      if (response.data.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              email: formData.email.trim().toLowerCase(),
              message: 'Account created successfully! Please log in.' 
            }
          });
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'freelancer',
      title: 'Freelancer',
      description: 'I want to find work and offer my services',
      icon: <User className="h-6 w-6" />
    },
    {
      id: 'client',
      title: 'Client',
      description: 'I want to hire talented freelancers',
      icon: <Briefcase className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <UserPlus className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Join Freelance Hub</h1>
            <p className="text-blue-600">Create your account and start your journey</p>
          </div>

          {/* Signup Form */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-blue-900 text-center">Create Account</CardTitle>
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
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-blue-900 font-medium">
                    Full Name *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-blue-900 font-medium">
                    Email Address *
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
                    Password *
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Create a strong password"
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
                  <p className="text-xs text-blue-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-blue-900 font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <Label className="text-blue-900 font-medium mb-3 block">
                    I want to join as *
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => handleInputChange('role', role.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.role === role.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            formData.role === role.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {role.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${
                              formData.role === role.id ? 'text-blue-900' : 'text-blue-800'
                            }`}>
                              {role.title}
                            </h3>
                            <p className={`text-sm ${
                              formData.role === role.id ? 'text-blue-700' : 'text-blue-600'
                            }`}>
                              {role.description}
                            </p>
                          </div>
                          {formData.role === role.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-blue-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-blue-600 text-sm mb-4">Trusted by thousands of professionals</p>
            <div className="flex justify-center space-x-6 text-blue-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Secure & Safe</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-xs">50K+ Members</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="text-xs">Global Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;