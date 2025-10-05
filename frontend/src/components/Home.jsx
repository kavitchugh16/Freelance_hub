import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Star, 
  CheckCircle,
  Search,
  UserPlus,
  Zap,
  Shield,
  Clock,
  Globe
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Find Perfect Projects",
      description: "Browse thousands of projects that match your skills and interests with advanced filtering options."
    },
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Hire Top Talent",
      description: "Access a pool of verified professionals ready to bring your projects to life with quality work."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow system ensuring safe payments for both clients and freelancers."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Fast Turnaround",
      description: "Get your projects completed quickly with our network of dedicated and efficient freelancers."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Quality Assurance",
      description: "Review system and quality checks ensure you get the best results for your investment."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Network",
      description: "Connect with talent from around the world, bringing diverse perspectives to your projects."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Freelancers", icon: <Users className="h-6 w-6" /> },
    { number: "25K+", label: "Projects Completed", icon: <Briefcase className="h-6 w-6" /> },
    { number: "$5M+", label: "Paid to Freelancers", icon: <Zap className="h-6 w-6" /> },
    { number: "99%", label: "Client Satisfaction", icon: <Star className="h-6 w-6" /> }
  ];

  const popularSkills = [
    "Web Development", "Mobile Apps", "UI/UX Design", "Content Writing", 
    "Digital Marketing", "Data Analysis", "Graphic Design", "SEO",
    "WordPress", "React", "Python", "Machine Learning"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face",
      content: "Found an amazing developer through Freelance Hub. The project was completed ahead of schedule and exceeded expectations!"
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "As a freelancer, this platform has helped me find consistent, high-quality clients. The payment system is reliable and secure."
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "The quality of talent on Freelance Hub is exceptional. We've built our entire marketing team through this platform."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-900 mb-6 leading-tight">
              Where Talent Meets
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with top freelancers or find your next project. 
              Build something amazing together on the world's leading freelance platform.
            </p>
            
            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                asChild
              >
                <Link to="/find-work">
                  Find Work
                  <Search className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                asChild
              >
                <Link to="/hire-talent">
                  Hire Talent
                  <Users className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-blue-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Verified Professionals</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span className="font-medium">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-6">
              Why Choose Freelance Hub?
            </h2>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Everything you need to succeed in the freelance economy, all in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all group p-6 h-full">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-blue-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Popular Skills in High Demand
            </h2>
            <p className="text-xl text-blue-600">
              Join thousands earning with these trending skills
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {popularSkills.map((skill, index) => (
              <Badge 
                key={skill} 
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all px-6 py-3 text-base font-medium cursor-pointer hover:scale-105"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-blue-600">
              Success stories from freelancers and clients worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all p-6">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-blue-900">{testimonial.name}</h4>
                      <p className="text-blue-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join millions of freelancers and clients who trust Freelance Hub 
              to build successful projects and careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/signup">
                  Get Started Today
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-6 text-lg font-semibold transition-all"
                asChild
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;