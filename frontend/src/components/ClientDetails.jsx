import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Building, 
  User, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Users,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ClientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    industry: '',
    companySize: '',
    website: '',
    description: '',
    projectTypes: [],
    budget: '',
    location: ''
  });
  
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
  const [profileProgress, setProfileProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  // Calculate profile completion progress
  React.useEffect(() => {
    const fields = [
      formData.companyName,
      formData.contactPerson,
      formData.industry,
      formData.companySize,
      formData.description,
      selectedProjectTypes.length > 0,
      formData.budget
    ];
    const completed = fields.filter(Boolean).length;
    setProfileProgress((completed / fields.length) * 100);
  }, [formData, selectedProjectTypes]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleProjectTypeToggle = (type) => {
    setSelectedProjectTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person name is required');
      return;
    }
    if (!formData.industry) {
      setError('Please select your industry');
      return;
    }
    if (!formData.description.trim()) {
      setError('Company description is required');
      return;
    }

    // Save profile data
    const profileData = {
      ...formData,
      projectTypes: selectedProjectTypes,
      profileCompleted: true
    };
    localStorage.setItem('clientProfile', JSON.stringify(profileData));
    
    // Update user profile completion status
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.profileCompleted = true;
    localStorage.setItem('user', JSON.stringify(user));

    setSuccess('Profile completed successfully! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/client-dashboard');
    }, 2000);
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
    "Marketing & Advertising", "Real Estate", "Manufacturing", "Retail",
    "Entertainment", "Non-profit", "Consulting", "Other"
  ];

  const companySizes = [
    "1-10 employees (Startup)",
    "11-50 employees (Small)",
    "51-200 employees (Medium)",
    "201-1000 employees (Large)",
    "1000+ employees (Enterprise)"
  ];

  const projectTypeOptions = [
    "Web Development", "Mobile App Development", "UI/UX Design", "Graphic Design",
    "Content Writing", "Digital Marketing", "SEO", "Data Analysis", "Machine Learning",
    "Software Development", "Database Management", "DevOps", "Quality Assurance",
    "Project Management", "Business Consulting", "Legal Services"
  ];

  const budgetRanges = [
    "Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", 
    "$10,000 - $50,000", "$50,000 - $100,000", "Over $100,000"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
            {/* Company Information */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
                    <Label htmlFor="contactPerson" className="text-blue-900 font-medium">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your name"
                      required
                    />
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
                    <Label htmlFor="companySize" className="text-blue-900 font-medium">Company Size</Label>
                    <select
                      id="companySize"
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="mt-1 w-full border border-blue-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select company size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-blue-900 font-medium">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-blue-900 font-medium">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="description" className="text-blue-900 font-medium">Company Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Tell us about your company, its mission, and what makes it unique..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Preferences */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Briefcase className="h-5 w-5" />
                  Project Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-blue-900 font-medium">Types of Projects You'll Post</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {projectTypeOptions.map(type => (
                        <Badge
                          key={type}
                          variant={selectedProjectTypes.includes(type) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedProjectTypes.includes(type)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          }`}
                          onClick={() => handleProjectTypeToggle(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-blue-900 font-medium">Typical Project Budget Range</Label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="mt-1 w-full border border-blue-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 max-w-xs"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                disabled={profileProgress < 70}
              >
                Complete Profile & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;