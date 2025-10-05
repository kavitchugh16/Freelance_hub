import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Upload, User, Briefcase, DollarSign, FileText, Star, Camera } from 'lucide-react';
import { skillOptions, jobRoleOptions } from '../mock';

const FreelancerDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePicture: null,
    fullName: '',
    email: 'freelancer@example.com',
    skills: [],
    experience: '',
    portfolioLinks: {
      github: '',
      linkedin: '',
      website: ''
    },
    jobRoles: [],
    bio: '',
    hourlyRate: ''
  });
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobRoles, setSelectedJobRoles] = useState([]);
  const [profileProgress, setProfileProgress] = useState(0);

  // Calculate profile completion progress
  React.useEffect(() => {
    const fields = [
      formData.fullName,
      selectedSkills.length > 0,
      formData.experience,
      formData.bio,
      formData.hourlyRate
    ];
    const completed = fields.filter(Boolean).length;
    setProfileProgress((completed / fields.length) * 100);
  }, [formData, selectedSkills]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleJobRoleToggle = (role) => {
    setSelectedJobRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile data to localStorage for demo
    const profileData = {
      ...formData,
      skills: selectedSkills,
      jobRoles: selectedJobRoles
    };
    localStorage.setItem('freelancerProfile', JSON.stringify(profileData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Complete Your Profile</h1>
            <p className="text-blue-600">Tell us about yourself to get started on Freelance Hub</p>
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-blue-600 mb-2">
                <span>Profile Completion</span>
                <span>{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="h-2" />
            </div>
          </div>

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
                      <div className="w-32 h-32 bg-blue-100 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Camera className="h-8 w-8 text-blue-400" />
                      </div>
                      <Button type="button" variant="outline" className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-50">
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

                  {/* Experience */}
                  <div>
                    <Label htmlFor="experience" className="text-blue-900 font-medium">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
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
                      <Input
                        type="url"
                        value={formData.portfolioLinks.github}
                        onChange={(e) => handleInputChange('portfolioLinks', {
                          ...formData.portfolioLinks,
                          github: e.target.value
                        })}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="GitHub Profile URL"
                      />
                      <Input
                        type="url"
                        value={formData.portfolioLinks.linkedin}
                        onChange={(e) => handleInputChange('portfolioLinks', {
                          ...formData.portfolioLinks,
                          linkedin: e.target.value
                        })}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="LinkedIn Profile URL"
                      />
                      <Input
                        type="url"
                        value={formData.portfolioLinks.website}
                        onChange={(e) => handleInputChange('portfolioLinks', {
                          ...formData.portfolioLinks,
                          website: e.target.value
                        })}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Personal Website URL"
                      />
                    </div>
                  </div>

                  {/* Job Roles */}
                  <div>
                    <Label className="text-blue-900 font-medium">Interested Job Roles</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {jobRoleOptions.map(role => (
                        <Badge
                          key={role}
                          variant={selectedJobRoles.includes(role) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedJobRoles.includes(role)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          }`}
                          onClick={() => handleJobRoleToggle(role)}
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
                    <Label htmlFor="bio" className="text-blue-900 font-medium">Short Bio / About Me *</Label>
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
                    <Label htmlFor="hourlyRate" className="text-blue-900 font-medium">Hourly Rate *</Label>
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
                disabled={profileProgress < 80}
              >
                Save Profile & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetails;