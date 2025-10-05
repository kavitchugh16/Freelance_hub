import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Star, 
  CheckCircle,
  Search,
  UserPlus,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find Perfect Projects",
      description: "Browse thousands of projects that match your skills and interests"
    },
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: "Easy Profile Setup",
      description: "Create your professional profile in minutes and start applying"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Payments",
      description: "Get paid securely and quickly for your completed work"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Freelancers" },
    { number: "5K+", label: "Projects Posted" },
    { number: "$2M+", label: "Paid to Freelancers" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Freelance Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-blue-700 hover:bg-blue-50">
                For Clients
              </Button>
              <Button variant="ghost" className="text-blue-700 hover:bg-blue-50">
                How it Works
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/freelancer-details')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Find Your Next 
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Freelance </span>
              Opportunity
            </h2>
            <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
              Connect with top clients, showcase your skills, and build your freelance career. 
              Join thousands of successful freelancers on Freelance Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/freelancer-details')}
              >
                Start Freelancing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-medium"
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Why Choose Freelance Hub?
            </h3>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Everything you need to succeed as a freelancer, all in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-shadow text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-blue-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-blue-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Popular Skills in Demand
            </h3>
            <p className="text-xl text-blue-600">
              Join freelancers earning with these trending skills
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React", "Node.js", "Python", "UI/UX Design", "WordPress", 
              "Mobile Development", "Data Analysis", "Digital Marketing",
              "Content Writing", "Graphic Design", "SEO", "Machine Learning"
            ].map(skill => (
              <Badge 
                key={skill} 
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white shadow-xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Freelance Journey?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful freelancers and find your next opportunity today.
              </p>
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/freelancer-details')}
              >
                Create Your Profile Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">Freelance Hub</h4>
              <p className="text-blue-200">
                Connecting talented freelancers with amazing opportunities worldwide.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">For Freelancers</h5>
              <ul className="space-y-2 text-blue-200">
                <li>Find Projects</li>
                <li>How to Get Started</li>
                <li>Success Stories</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">For Clients</h5>
              <ul className="space-y-2 text-blue-200">
                <li>Post a Project</li>
                <li>Find Talent</li>
                <li>Enterprise</li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-blue-200">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Trust & Safety</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Freelance Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;