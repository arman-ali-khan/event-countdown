import React from 'react';
import { FileText, Scale, AlertTriangle, Users, Shield, Gavel } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'January 15, 2025';

  return (
    <>
      <SEOHead
        title="Terms of Service - CountdownBuilder"
        description="Read CountdownBuilder's terms of service and user agreement. Understand your rights and responsibilities when using our countdown creation platform."
        keywords="terms of service, user agreement, terms and conditions, legal terms, service agreement"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
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
                  <Scale className="w-6 h-6 mr-2 text-blue-600" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your use of CountdownBuilder's website and services. 
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, then you may not access our services.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    <strong>Important:</strong> Please read these Terms carefully before using our services. 
                    Your continued use of CountdownBuilder constitutes acceptance of these Terms.
                  </p>
                </div>
              </section>

              {/* Description of Service */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description of Service</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  CountdownBuilder is a web-based platform that allows users to create, customize, and share 
                  countdown timers for various events. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Creating countdown events with custom titles, descriptions, and dates</li>
                  <li>Uploading and managing background images for countdown pages</li>
                  <li>Sharing countdown pages via unique URLs</li>
                  <li>Managing multiple countdown events through user accounts</li>
                  <li>Allowing visitors to join events and express interest</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  User Accounts and Responsibilities
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Creation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  To access certain features, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Limits</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Free accounts are limited to 50 countdown events</li>
                  <li>Image uploads are limited to 10MB per file</li>
                  <li>One account per person or organization</li>
                </ul>
              </section>

              {/* Acceptable Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Acceptable Use Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You agree not to use our services for any unlawful or prohibited activities, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Uploading content that is illegal, harmful, or offensive</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Distributing spam, malware, or malicious content</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with the proper functioning of our services</li>
                  <li>Creating fake or misleading countdown events</li>
                  <li>Harvesting user information without consent</li>
                </ul>
              </section>

              {/* Content and Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content and Intellectual Property</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Content</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You retain ownership of content you upload to our services. By uploading content, you grant us a 
                  non-exclusive, worldwide, royalty-free license to use, display, and distribute your content 
                  solely for the purpose of providing our services.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our Content</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our services, including the website design, features, and functionality, are owned by 
                  CountdownBuilder and protected by copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              {/* Privacy and Data */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy and Data Protection</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your privacy is important to us. Our collection and use of personal information is governed 
                  by our Privacy Policy, which is incorporated into these Terms by reference. By using our 
                  services, you consent to the collection and use of information as described in our Privacy Policy.
                </p>
              </section>

              {/* Service Availability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Availability and Modifications</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We strive to provide reliable services, but we cannot guarantee uninterrupted availability. 
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                  <li>Modify, suspend, or discontinue services at any time</li>
                  <li>Perform maintenance and updates</li>
                  <li>Remove content that violates these Terms</li>
                  <li>Terminate accounts for violations</li>
                </ul>
              </section>

              {/* Disclaimers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
                  Disclaimers and Limitations
                </h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                    <strong>Important Legal Notice:</strong> Please read this section carefully as it limits our liability.
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Service Disclaimer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our services are provided "as is" and "as available" without warranties of any kind, either 
                  express or implied. We do not warrant that our services will be uninterrupted, error-free, 
                  or completely secure.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  To the maximum extent permitted by law, CountdownBuilder shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited to loss of 
                  profits, data, or other intangible losses.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Termination</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Either party may terminate this agreement at any time. We may terminate or suspend your 
                  account immediately, without prior notice, for conduct that we believe violates these Terms 
                  or is harmful to other users or our services.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upon termination, your right to use our services will cease immediately. We may delete 
                  your account and all associated content, though we are not obligated to do so.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Gavel className="w-6 h-6 mr-2 text-blue-600" />
                  Governing Law and Disputes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                  in which CountdownBuilder operates, without regard to conflict of law principles.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Any disputes arising from these Terms or your use of our services shall be resolved through 
                  binding arbitration, except where prohibited by law.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of significant 
                  changes by posting a notice on our website or sending an email to registered users. Your 
                  continued use of our services after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Email:</strong> legal@countdownbuilder.com<br />
                    <strong>Address:</strong> CountdownBuilder Legal Team<br />
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

export default TermsOfService;