import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { Alert, AlertDescription } from './ui/Alert';
import { 
  Upload, 
  User, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Star, 
  Camera,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import axios from 'axios';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = import.meta.env.VITE_API_URL;


const FreelancerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    profilePicture: null,
    fullName: '',
    email: '',
    skills: [],
    workExperience: '',
    portfolioLinks: {
      github: '',
      linkedin: '',
      website: ''
    },
    interestedRoles: [],
    hourlyRate: '',
    bio: ''
  });
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const fileInputRef = useRef(null);

  // Skill options
  const skillOptions = [
    "React", "Vue.js", "Angular", "Node.js", "Python", "Django", "Flask",
    "JavaScript", "TypeScript", "HTML/CSS", "PHP", "Laravel", "WordPress",
    "MongoDB", "PostgreSQL", "MySQL", "UI/UX Design", "Figma", "Photoshop",
    "Illustrator", "Graphic Design", "Mobile Development", "Flutter", "React Native",
    "Data Analysis", "Machine Learning", "DevOps", "AWS", "Docker", "Kubernetes",
    "SEO", "Content Writing", "Digital Marketing", "Social Media Management"
  ];

  // Job role options
  const roleOptions = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "UI/UX Designer", "Graphic Designer", "Mobile App Developer",
    "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
    "Content Writer", "SEO Specialist", "Digital Marketer", "Project Manager",
    "Quality Assurance", "Database Administrator", "System Administrator"
  ];

  // Load user data from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name && user.email) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email
      }));
    }
  }, []);

  // Calculate profile completion progress
  useEffect(() => {
    const fields = [
      formData.fullName,
      formData.email,
      selectedSkills.length > 0,
      formData.workExperience,
      formData.bio,
      formData.hourlyRate,
      selectedRoles.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    setProfileProgress((completed / fields.length) * 100);
  }, [formData, selectedSkills, selectedRoles]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    if (error) setError('');
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return false;
    }
    if (!formData.workExperience) {
      setError('Work experience is required');
      return false;
    }
    if (!formData.bio.trim()) {
      setError('Bio is required');
      return false;
    }
    if (!formData.hourlyRate) {
      setError('Hourly rate is required');
      return false;
    }
    if (selectedRoles.length === 0) {
      setError('Please select at least one interested role');
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

      const profileData = {
        ...formData,
        skills: selectedSkills,
        interestedRoles: selectedRoles
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/freelancers`,
        profileData,
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

        // Persist freelancer profile locally for dashboard display
        localStorage.setItem('freelancerProfile', JSON.stringify(profileData));

        setSuccess('Profile completed successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/freelancer-dashboard');
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Complete Your Freelancer Profile</h1>
            <p className="text-blue-600">Tell us about yourself to start finding amazing projects</p>
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
            {/* Profile Picture & Basic Info */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <div className="md:col-span-1">
                    <Label className="text-blue-900 font-medium">Profile Picture</Label>
                    <div className="mt-2 flex flex-col items-center">
                      <div
                        className="w-32 h-32 bg-blue-100 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                        style={formData.profilePicture ? { backgroundImage: `url(${formData.profilePicture})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                        aria-label="Upload profile picture"
                      >
                        {!formData.profilePicture && <Camera className="h-8 w-8 text-blue-400" />}
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
                          reader.onload = () => {
                            handleInputChange('profilePicture', reader.result || '');
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <Button type="button" variant="outline" className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-50" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-blue-900 font-medium">Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-blue-900 font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        className="mt-1 border-blue-200 bg-blue-50 text-blue-700"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Experience */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Star className="h-5 w-5" />
                  Skills & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Skills Selection */}
                  <div>
                    <Label className="text-blue-900 font-medium">Select Your Skills *</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skillOptions.map(skill => (
                        <Badge
                          key={skill}
                          variant={selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedSkills.includes(skill)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          }`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <Label htmlFor="workExperience" className="text-blue-900 font-medium">Years of Work Experience *</Label>
                    <Input
                      id="workExperience"
                      type="number"
                      value={formData.workExperience}
                      onChange={(e) => handleInputChange('workExperience', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500 max-w-xs"
                      placeholder="e.g. 3"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio & Job Roles */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Briefcase className="h-5 w-5" />
                  Portfolio & Job Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Portfolio Links */}
                  <div>
                    <Label className="text-blue-900 font-medium">Portfolio Links</Label>
                    <div className="mt-2 space-y-3">
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                        <Input
                          type="url"
                          value={formData.portfolioLinks.github}
                          onChange={(e) => handleInputChange('portfolioLinks.github', e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="GitHub Profile URL"
                        />
                      </div>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                        <Input
                          type="url"
                          value={formData.portfolioLinks.linkedin}
                          onChange={(e) => handleInputChange('portfolioLinks.linkedin', e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="LinkedIn Profile URL"
                        />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                        <Input
                          type="url"
                          value={formData.portfolioLinks.website}
                          onChange={(e) => handleInputChange('portfolioLinks.website', e.target.value)}
                          className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Personal Website URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interested Roles */}
                  <div>
                    <Label className="text-blue-900 font-medium">Interested Job Roles *</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {roleOptions.map(role => (
                        <Badge
                          key={role}
                          variant={selectedRoles.includes(role) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedRoles.includes(role)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          }`}
                          onClick={() => handleRoleToggle(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio & Pricing */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <FileText className="h-5 w-5" />
                  About You
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio" className="text-blue-900 font-medium">Short Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <Label htmlFor="hourlyRate" className="text-blue-900 font-medium">Hourly Rate / Expected Salary *</Label>
                    <div className="mt-1 flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 max-w-xs"
                        placeholder="50"
                        min="1"
                        required
                      />
                      <span className="ml-2 text-blue-600 font-medium">/hour</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                disabled={loading || profileProgress < 80}
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

export default FreelancerDetails;