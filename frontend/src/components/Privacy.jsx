import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  FileText, 
  Globe,
  Mail,
  Calendar
} from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <FileText className="h-5 w-5" />,
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This may include your name, email address, phone number, and payment information."
        },
        {
          subtitle: "Usage Information", 
          text: "We automatically collect information about how you use our platform, including your IP address, browser type, device information, and pages visited."
        },
        {
          subtitle: "Professional Information",
          text: "For freelancers, we collect information about your skills, experience, portfolio, and work history to help match you with relevant projects."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <Eye className="h-5 w-5" />,
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our platform, including facilitating connections between freelancers and clients."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you updates about our services, respond to your inquiries, and provide customer support."
        },
        {
          subtitle: "Security & Safety",
          text: "We use your information to verify identities, prevent fraud, and maintain the safety and security of our platform."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <Users className="h-5 w-5" />,
      content: [
        {
          subtitle: "With Other Users",
          text: "Your public profile information is visible to other users to facilitate professional connections and project matching."
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with third-party service providers who assist us in operating our platform, such as payment processors and hosting services."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, court order, or to protect the rights and safety of our users and the public."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your personal information during transmission and storage."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and regularly audit our systems to ensure only authorized personnel can access your information."
        },
        {
          subtitle: "Regular Updates",
          text: "We continuously update our security practices and systems to protect against new threats and vulnerabilities."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: <Shield className="h-5 w-5" />,
      content: [
        {
          subtitle: "Access & Updates",
          text: "You can access and update your personal information at any time through your account settings."
        },
        {
          subtitle: "Data Deletion",
          text: "You may request deletion of your personal information, subject to certain legal and contractual obligations."
        },
        {
          subtitle: "Communication Preferences",
          text: "You can opt out of marketing communications at any time by following the unsubscribe instructions in our emails."
        }
      ]
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Globe className="h-5 w-5" />,
      content: [
        {
          subtitle: "Global Operations",
          text: "As a global platform, your information may be transferred to and processed in countries other than your own."
        },
        {
          subtitle: "Adequate Protection",
          text: "We ensure that any international transfers comply with applicable data protection laws and provide adequate protection for your information."
        }
      ]
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      value: "privacy@freelancehub.com"
    },
    {
      icon: <Globe className="h-4 w-4" />,
      label: "Address", 
      value: "123 Business Ave, Tech City, TC 12345"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Last Updated",
      value: "January 1, 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-700 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information when you use Freelance Hub.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-blue-200 shadow-md text-center p-4">
                <CardContent className="pt-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="text-blue-600">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-1">{info.label}</h3>
                  <p className="text-blue-600 text-sm">{info.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents */}
            <Card className="border-blue-200 shadow-lg mb-8">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle className="text-blue-900">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors text-blue-700 hover:text-blue-900"
                    >
                      <div className="mr-3 text-blue-600">
                        {section.icon}
                      </div>
                      <span className="font-medium">{section.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={section.id} id={section.id} className="border-blue-200 shadow-lg">
                  <CardHeader className="bg-blue-50 border-b border-blue-200">
                    <CardTitle className="flex items-center text-blue-900">
                      <div className="mr-3 text-blue-600">
                        {section.icon}
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h3 className="text-lg font-semibold text-blue-900 mb-3">
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <Card className="border-blue-200 shadow-lg mt-12 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Questions About This Policy?
                </h2>
                <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact us. We're here to help and ensure your 
                  privacy is protected.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:privacy@freelancehub.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Our Privacy Team
                  </a>
                  <a 
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated Notice */}
            <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm">
                <Calendar className="h-4 w-4 inline mr-2" />
                This Privacy Policy was last updated on January 1, 2024. 
                We may update this policy from time to time, and we will notify you of any significant changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;