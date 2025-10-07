import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, 
  FaTools, 
  FaInfoCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

const FreelancerProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    skills: user?.skills || [],
    portfolio: user?.portfolio || '',
    country: user?.country || '',
    description: user?.description || '',
    phone: user?.phone || '',
    location: user?.location || '',
    hourlyRate: user?.hourlyRate || '',
    experience: user?.experience || '',
    newSkill: ''
  });

  const handleSave = () => {
    // Here you would typically send the updated profileData to your backend API
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the form data to the original user data
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      skills: user?.skills || [],
      portfolio: user?.portfolio || '',
      country: user?.country || '',
      description: user?.description || '',
      phone: user?.phone || '',
      location: user?.location || '',
      hourlyRate: user?.hourlyRate || '',
      experience: user?.experience || '',
      newSkill: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (profileData.newSkill.trim() && !profileData.skills.includes(profileData.newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
                Freelancer Profile
              </h1>
              <p className="text-gray-600 text-lg">
                Showcase your skills and build your professional presence
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="button-primary flex items-center space-x-2"
                >
                  <FaEdit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="button-primary flex items-center space-x-2"
                  >
                    <FaSave className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="button-secondary flex items-center space-x-2"
                  >
                    <FaTimes className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="dashboard-card animate-scale-in">
              <div className="text-center space-y-6">
                {/* Profile Picture */}
                <div className="relative mx-auto w-32 h-32">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.username?.charAt(0)?.toUpperCase() || 'F'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-medium hover:shadow-strong transition-all duration-300">
                      <FaCamera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profileData.username || 'Freelancer Name'}
                  </h2>
                  <p className="text-gray-600">{profileData.experience || 'Experience Level'}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                    <FaMapMarkerAlt className="h-3 w-3" />
                    <span>{profileData.country || 'Location'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="dashboard-card animate-scale-in delay-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FaUser className="h-5 w-5 text-emerald-600" />
                <span>Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.username || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Portfolio Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.portfolio}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.portfolio ? (
                        <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          {profileData.portfolio}
                        </a>
                      ) : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="dashboard-card animate-scale-in delay-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FaTools className="h-5 w-5 text-purple-600" />
                <span>Skills & Expertise</span>
              </h3>
              
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileData.newSkill}
                      onChange={(e) => handleInputChange('newSkill', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="Add a new skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="button-primary flex items-center space-x-2"
                    >
                      <FaPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-3 py-2 rounded-full border border-emerald-200"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {profileData.skills.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="dashboard-card animate-scale-in delay-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FaInfoCircle className="h-5 w-5 text-orange-600" />
                <span>About Me</span>
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                {isEditing ? (
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                  />
                ) : (
                  <p className="text-gray-900 leading-relaxed">
                    {profileData.description || 'No description provided yet.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;