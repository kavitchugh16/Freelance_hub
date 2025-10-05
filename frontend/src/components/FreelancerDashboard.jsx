import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Search, 
  Filter,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  Bell,
  MessageSquare,
  LogOut,
  Settings
} from 'lucide-react';
import { mockProjects, mockApplications, mockFreelancerProfile } from '../mock';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [freelancerProfile, setFreelancerProfile] = useState(mockFreelancerProfile);
  const [projects, setProjects] = useState(mockProjects);
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');

  useEffect(() => {
    // Load profile from localStorage if available
    const savedProfile = localStorage.getItem('freelancerProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFreelancerProfile(prev => ({
        ...prev,
        name: parsed.fullName || prev.name,
        email: parsed.email || prev.email,
        skills: parsed.skills || prev.skills,
        hourlyRate: parsed.hourlyRate ? `$${parsed.hourlyRate}` : prev.hourlyRate,
        bio: parsed.bio || prev.bio
      }));
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkillFilter === '' || 
                        project.skills.some(skill => skill.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  const handleApplyToProject = (projectId) => {
    // Mock application - in real app this would open a modal or navigate to application form
    alert(`Applied to project ${projectId}! (This is a demo - would normally open application form)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Freelance Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            Welcome back, {freelancerProfile.name}!
          </h2>
          <p className="text-blue-600">
            Ready to take on new challenges? Browse projects below or check your applications.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">Projects Applied</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium">Active Projects</p>
                  <p className="text-3xl font-bold">{freelancerProfile.activeProjects}</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold">{freelancerProfile.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="browse" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Browse Projects
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              My Applications
            </TabsTrigger>
          </TabsList>

          {/* Browse Projects Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-blue-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                      <Input
                        placeholder="Search projects by title or client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="md:w-48">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                      <Input
                        placeholder="Filter by skill..."
                        value={selectedSkillFilter}
                        onChange={(e) => setSelectedSkillFilter(e.target.value)}
                        className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Cards */}
            <div className="grid gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="border-blue-200 shadow-md hover:shadow-lg transition-all hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-1">{project.title}</h3>
                            <p className="text-blue-600">by {project.client}</p>
                          </div>
                          <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">{project.posted}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <div className="flex items-center text-blue-700">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium">{project.budget}</span>
                          </div>
                          <div className="flex items-center text-blue-700">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{project.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="border-blue-300 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:ml-6">
                        <Button 
                          variant="outline" 
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleApplyToProject(project.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {applications.map(application => (
                <Card key={application.id} className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="text-lg font-semibold text-blue-900">{application.projectTitle}</h3>
                        </div>
                        <p className="text-blue-600 mb-2">Client: {application.client}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Applied: {application.appliedDate}</span>
                          <span>Proposed Budget: {application.proposedBudget}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusBadgeColor(application.status)}>
                          {application.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerDashboard;