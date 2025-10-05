import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Trust & Transparency",
      description: "We believe in building lasting relationships through honest communication and reliable service."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology and user-focused features."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security",
      description: "Protecting our users' data and ensuring safe, secure transactions for all parties."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth",
      description: "Empowering freelancers and businesses to grow and achieve their full potential."
    }
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Former tech executive with 15+ years experience building scalable platforms."
    },
    {
      name: "Sarah Kim",
      role: "Chief Technology Officer", 
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=300&h=300&fit=crop&crop=face",
      bio: "Full-stack engineer passionate about creating seamless user experiences."
    },
    {
      name: "Marcus Johnson",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Operations expert focused on scaling businesses and optimizing processes."
    }
  ];

  const milestones = [
    { year: "2020", event: "Freelance Hub founded", description: "Started with a vision to connect talent globally" },
    { year: "2021", event: "10K+ Users", description: "Reached our first major user milestone" },
    { year: "2022", event: "$1M+ Processed", description: "Facilitated over $1 million in freelancer payments" },
    { year: "2023", event: "Global Expansion", description: "Expanded to serve 50+ countries worldwide" },
    { year: "2024", event: "50K+ Users", description: "Growing community of freelancers and clients" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              About Freelance Hub
            </h1>
            <p className="text-xl text-blue-700 mb-8 leading-relaxed">
              We're on a mission to create the world's most trusted platform where 
              talented freelancers and innovative businesses come together to build 
              extraordinary projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                <Globe className="h-4 w-4 mr-2" />
                Global Platform
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                <Users className="h-4 w-4 mr-2" />
                50K+ Active Users
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-lg">
                <Award className="h-4 w-4 mr-2" />
                Industry Leader
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                To democratize opportunity by connecting talented freelancers with 
                businesses that need their skills, regardless of geographic boundaries. 
                We believe everyone deserves access to meaningful work and the chance 
                to build something amazing.
              </p>
              <div className="flex items-start mb-4">
                <Target className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Empowerment</h3>
                  <p className="text-gray-600">Enabling freelancers to build sustainable careers on their terms</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Connection</h3>
                  <p className="text-gray-600">Bridging the gap between talent and opportunity worldwide</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
              <p className="text-lg text-blue-700 leading-relaxed">
                To become the global standard for freelance collaboration, where 
                every project is a success story and every professional has the 
                tools they need to thrive in the digital economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all text-center p-6 h-full">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-blue-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-blue-600">
              Key milestones in building Freelance Hub
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-blue-200 h-full"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}>
                    <Card className="border-blue-200 shadow-md p-6">
                      <CardContent className="pt-0">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">
                          {milestone.event}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              The passionate people building the future of freelancing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all text-center p-6">
                <CardContent className="pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                  <h3 className="text-xl font-semibold text-blue-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Whether you're a freelancer looking for opportunities or a business 
              seeking talent, we're here to help you succeed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;