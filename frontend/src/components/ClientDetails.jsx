import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ClientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    companyName: '',
    companyId: '',
    industry: '',
    companyDescription: '',
    address: '',
    companyLogo: null
  });
  
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  // Industry options
  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
    "Marketing & Advertising", "Real Estate", "Manufacturing", "Retail",
    "Entertainment", "Non-profit", "Consulting", "Agriculture", "Energy",
    "Transportation", "Construction", "Food & Beverage", "Other"
  ];

  // Calculate profile completion progress
  useEffect(() => {
    const fields = [
      formData.companyName,
      formData.industry,
      formData.companyDescription,
      formData.address
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
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.industry) {
      setError('Please select your industry');
      return false;
    }
    if (!formData.companyDescription.trim()) {
      setError('Company description is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address/City is required');
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/clients`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update user profile completion status
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));

        setSuccess('Profile completed successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/client-dashboard');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Complete Your Company Profile</h1>
            <p className="text-blue-600">Tell us about your company to find the perfect freelancers</p>
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-blue-600 mb-2">
                <span>Profile Completion</span>
                <span>{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="h-2" />
            </div>
          </div>

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Logo */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building className="h-5 w-5" />
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Camera className="h-8 w-8 text-blue-400" />
                  </div>
                  <Button type="button" variant="outline" className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Company Logo
                  </Button>
                  <p className="text-sm text-blue-500 mt-2">Optional - You can add this later</p>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName" className="text-blue-900 font-medium">Company Name *</Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your company name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="companyId" className="text-blue-900 font-medium">Company ID</Label>
                      <div className="relative mt-1">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                        <Input
                          id="companyId"
                          type="text"
                          value={formData.companyId}
                          onChange={(e) => handleInputChange('companyId', e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Optional company ID"
                        />
                      </div>
                      <p className="text-sm text-blue-500 mt-1">Optional - Registration number or tax ID</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-blue-900 font-medium">Industry *</Label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="mt-1 w-full border border-blue-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select your industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-blue-900 font-medium">Address / City *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="City, State, Country"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Description */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <FileText className="h-5 w-5" />
                  Company Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div>
                  <Label htmlFor="companyDescription" className="text-blue-900 font-medium">Tell us about your company *</Label>
                  <Textarea
                    id="companyDescription"
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe your company's mission, values, and what kind of projects you typically work on..."
                    rows={5}
                    required
                  />
                  <p className="text-sm text-blue-500 mt-2">
                    This helps freelancers understand your company culture and project types
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
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