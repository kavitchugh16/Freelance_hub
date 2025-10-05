import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "hello@freelancehub.com",
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      subtitle: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "123 Business Ave, Tech City, TC 12345",
      subtitle: "Schedule an appointment"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: "Monday - Friday: 9AM - 6PM EST",
      subtitle: "Weekend support available"
    }
  ];

  const faqs = [
    {
      question: "How do I get started as a freelancer?",
      answer: "Simply create your profile, showcase your skills, and start browsing available projects. Complete your profile to increase your chances of being hired."
    },
    {
      question: "How does the payment system work?",
      answer: "We use a secure escrow system. Funds are held safely until project milestones are completed, ensuring protection for both freelancers and clients."
    },
    {
      question: "What fees does Freelance Hub charge?",
      answer: "We charge a small service fee on completed projects. Our transparent pricing ensures you know exactly what you'll pay upfront."
    },
    {
      question: "How do I resolve disputes?",
      answer: "Our support team provides mediation services for any project disputes. We work to find fair solutions for all parties involved."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-700 mb-8 leading-relaxed">
              Have questions? Need help? Want to share feedback? 
              We'd love to hear from you and help you succeed.
            </p>
            <div className="flex justify-center">
              <MessageCircle className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-blue-200 shadow-md hover:shadow-lg transition-all text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-blue-700 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-blue-500 text-sm">
                    {info.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-50 border-b border-blue-200">
                  <CardTitle className="text-2xl text-blue-900 flex items-center">
                    <Send className="h-6 w-6 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-700 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-blue-900 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-blue-900 font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-blue-900 font-medium">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="What is this regarding?"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-blue-900 font-medium">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Tell us more about how we can help you..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                      >
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-blue-200 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-blue-200 shadow-md bg-blue-50 mt-6">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-blue-200 shadow-lg">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 h-96 flex items-center justify-center">
                <div className="text-center text-blue-700">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                  <p className="max-w-md">
                    123 Business Ave, Tech City, TC 12345
                  </p>
                  <p className="text-sm mt-2 text-blue-600">
                    Interactive map would be integrated here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;