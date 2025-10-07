// // src/pages/client/Profile.tsx
// import React from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { FaUser, FaEnvelope, FaBuilding, FaGlobe, FaInfoCircle } from 'react-icons/fa';

// const ClientProfile = () => {
//   const { user } = useAuth();

//   return (
//     <div className="flex justify-center mt-10">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Client Profile</h1>
        
//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <FaUser className="text-indigo-500 text-xl" />
//             <p><strong>Username:</strong> {user?.username}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaEnvelope className="text-indigo-500 text-xl" />
//             <p><strong>Email:</strong> {user?.email}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaBuilding className="text-indigo-500 text-xl" />
//             <p><strong>Company:</strong> {user?.company}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaGlobe className="text-indigo-500 text-xl" />
//             <p><strong>Country:</strong> {user?.country}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <FaInfoCircle className="text-indigo-500 text-xl" />
//             <p><strong>Description:</strong> {user?.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientProfile;
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, 
  FaBuilding, 
  FaInfoCircle, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCamera,
  FaMapMarkerAlt
} from 'react-icons/fa';

const ClientProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    company: user?.company || '',
    country: user?.country || '',
    description: user?.description || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    founded: user?.founded || ''
  });

  const handleSave = () => {
    // In a real application, you would send the updated profileData to your backend API here.
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data back to the original user state
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      company: user?.company || '',
      country: user?.country || '',
      description: user?.description || '',
      phone: user?.phone || '',
      location: user?.location || '',
      website: user?.website || '',
      founded: user?.founded || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2 text-shadow">
                Client Profile
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your profile information and company details
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
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.username?.charAt(0)?.toUpperCase() || 'C'}
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
                    {profileData.username || 'Client Name'}
                  </h2>
                  <p className="text-gray-600">{profileData.company || 'Company Name'}</p>
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
                <FaUser className="h-5 w-5 text-blue-600" />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.company || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Founded</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.founded || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profileData.website}
                        </a>
                      ) : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="dashboard-card animate-scale-in delay-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FaInfoCircle className="h-5 w-5 text-purple-600" />
                <span>About</span>
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                {isEditing ? (
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your company and what you do..."
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

export default ClientProfile;