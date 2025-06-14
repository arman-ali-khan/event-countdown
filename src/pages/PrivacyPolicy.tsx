import React from 'react';
import { Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'January 15, 2025';

  return (
    <>
      <SEOHead
        title="Privacy Policy - CountdownBuilder"
        description="Learn how CountdownBuilder protects your privacy and handles your personal information. Read our comprehensive privacy policy and data protection practices."
        keywords="privacy policy, data protection, personal information, GDPR, privacy rights, data security"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  At CountdownBuilder, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website and use our countdown 
                  creation services. Please read this privacy policy carefully. If you do not agree with the terms 
                  of this privacy policy, please do not access the site.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Information We Collect
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Register for an account</li>
                  <li>Create countdown events</li>
                  <li>Join events created by others</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Automatically Collected Information</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  When you visit our website, we may automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referring website</li>
                  <li>Pages viewed and time spent on our site</li>
                  <li>Device identifiers</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-blue-600" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Providing and maintaining our countdown creation services</li>
                  <li>Processing your account registration and managing your profile</li>
                  <li>Enabling you to create, edit, and share countdown events</li>
                  <li>Facilitating event join requests and communications</li>
                  <li>Sending you technical notices and support messages</li>
                  <li>Responding to your comments, questions, and customer service requests</li>
                  <li>Improving our website and services</li>
                  <li>Analyzing usage patterns and trends</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-blue-600" />
                  Information Sharing and Disclosure
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li><strong>Public Events:</strong> Information in public countdown events may be visible to other users</li>
                  <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> We may share information with your explicit consent</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Privacy Rights</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to delete your personal information</li>
                  <li>The right to restrict processing of your information</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing</li>
                  <li>The right to withdraw consent</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our services.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              {/* Changes to Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Email:</strong> privacy@countdownbuilder.com<br />
                    <strong>Address:</strong> CountdownBuilder Privacy Team<br />
                    123 Web Street, Digital City, DC 12345
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;