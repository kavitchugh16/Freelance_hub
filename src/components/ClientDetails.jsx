// src/pages/ClientDetails.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Progress } from './ui/Progress';
import { Alert, AlertDescription } from './ui/Alert';
import { 
  Building, 
  Upload, 
  Camera,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Hash
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL;

const ClientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyId: '',
    industry: '',
    companyDescription: '',
    address: '',
    companyLogo: null,
    website: '',
    contactEmail: ''
  });
  
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const fileInputRef = useRef(null);

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
    "Marketing & Advertising", "Real Estate", "Manufacturing", "Retail",
    "Entertainment", "Non-profit", "Consulting", "Agriculture", "Energy",
    "Transportation", "Construction", "Food & Beverage", "Other"
  ];

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        contactEmail: user.email || prev.contactEmail
      }));
    } catch (_) {}

    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/clients/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = res.data || {};
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          companyName: data.companyName || prev.companyName,
          industry: data.industry || prev.industry,
          companyDescription: data.companyDescription || prev.companyDescription,
          address: data.address || prev.address,
          website: data.website || prev.website,
          contactEmail: data.contactEmail || prev.contactEmail
        }));
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const fields = [
      formData.fullName,
      formData.companyName,
      formData.industry,
      formData.companyDescription,
      formData.address,
      formData.contactEmail
    ];
    const completed = fields.filter(field => field && field.trim()).length;
    setProfileProgress((completed / fields.length) * 100);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) { setError('Full name is required'); return false; }
    if (!formData.companyName.trim()) { setError('Company name is required'); return false; }
    if (!formData.industry) { setError('Please select your industry'); return false; }
    if (!formData.companyDescription.trim()) { setError('Company description is required'); return false; }
    if (!formData.address.trim()) { setError('Address/City is required'); return false; }
    if (!formData.contactEmail.trim()) { setError('Contact email is required'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('Please login first'); navigate('/login'); return; }

      const response = await axios.post(
        `${BACKEND_URL}/api/clients`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('clientProfile', JSON.stringify(formData));

        setSuccess('Profile completed successfully! Redirecting to dashboard...');
        setTimeout(() => { navigate('/client-dashboard'); }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 drop-shadow-md">
              Complete Your Company Profile
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-4">
              Tell us about your company to find the perfect freelancers
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2 font-medium">
                <span>Profile Completion</span>
                <span>{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="h-3 rounded-full bg-gray-200" />
            </div>
          </div>

          {success && (
            <Alert className="mb-6 border-green-300 bg-green-50 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-300 bg-red-50 shadow-sm hover:shadow-md transition-shadow">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Company Logo */}
            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                  <Building className="h-5 w-5" /> Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center">
                <div
                  className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 cursor-pointer transition-transform hover:scale-105 overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                  style={formData.companyLogo ? { backgroundImage: `url(${formData.companyLogo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!formData.companyLogo && <Camera className="h-8 w-8 text-gray-400" />}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => { handleInputChange('companyLogo', reader.result || ''); };
                    reader.readAsDataURL(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 text-blue-700 border-blue-300 hover:bg-blue-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Company Logo
                </Button>
                <p className="text-sm text-gray-500 mt-2">Optional - You can add this later</p>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                  <Building className="h-5 w-5" /> Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-900 font-semibold">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName" className="text-gray-900 font-semibold">Company Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Description */}
            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                  <FileText className="h-5 w-5" /> Company Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Label htmlFor="companyDescription" className="text-gray-900 font-semibold">
                  Tell us about your company *
                </Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription}
                  onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  placeholder="Describe your company's mission, values, and projects..."
                  rows={5}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  This helps freelancers understand your company culture and project types
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all rounded-xl"
                disabled={loading || profileProgress < 75}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Completing Profile...
                  </div>
                ) : (
                  'Complete Profile & Continue'
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
