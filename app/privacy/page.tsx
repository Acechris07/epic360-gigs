'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Mail,
  Calendar,
} from 'lucide-react';

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100">
              Last updated: {currentDate}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Your Privacy Matters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              At Epic360 Gigs, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <span>Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Profile information and professional details</li>
                <li>Payment and billing information</li>
                <li>Communication preferences</li>
                <li>Profile pictures and portfolio content</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Platform usage patterns and interactions</li>
                <li>Search queries and browsing history</li>
                <li>Service requests and transactions</li>
                <li>Communication logs and messages</li>
                <li>Device and browser information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>IP address and location data</li>
                <li>Cookies and tracking technologies</li>
                <li>Device identifiers and browser type</li>
                <li>Log files and analytics data</li>
                <li>Performance and error information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-green-600" />
              <span>How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-600">
                  Platform Services
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>
                    Facilitate connections between clients and freelancers
                  </li>
                  <li>Process payments and manage transactions</li>
                  <li>Provide customer support and dispute resolution</li>
                  <li>Send important service notifications</li>
                  <li>Maintain account security and prevent fraud</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">
                  Improvement & Analytics
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Analyze platform usage and performance</li>
                  <li>Improve our services and user experience</li>
                  <li>Develop new features and functionality</li>
                  <li>Conduct research and market analysis</li>
                  <li>Personalize content and recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span>Information Sharing and Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information in the following
              circumstances:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm text-gray-700">
                  We may share information with trusted third-party service
                  providers who assist us in operating our platform, such as
                  payment processors, hosting providers, and analytics services.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm text-gray-700">
                  We may disclose information when required by law, court order,
                  or government request, or to protect our rights, property, or
                  safety.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-sm text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred as part of the business
                  transaction.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">User Consent</h4>
                <p className="text-sm text-gray-700">
                  We may share information with your explicit consent or as
                  otherwise described in this policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-red-600" />
              <span>Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We implement comprehensive security measures to protect your
              personal information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-800">
                  Encryption
                </h4>
                <p className="text-sm text-green-700">
                  All data is encrypted in transit and at rest using
                  industry-standard encryption protocols.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-800">
                  Access Controls
                </h4>
                <p className="text-sm text-blue-700">
                  Strict access controls and authentication measures protect
                  your information from unauthorized access.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2 text-purple-800">
                  Regular Audits
                </h4>
                <p className="text-sm text-purple-700">
                  We conduct regular security audits and assessments to identify
                  and address potential vulnerabilities.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold mb-2 text-orange-800">
                  Employee Training
                </h4>
                <p className="text-sm text-orange-700">
                  Our team receives regular training on data protection and
                  privacy best practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Your Privacy Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Access and Control</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Access your personal information</li>
                  <li>Update or correct your data</li>
                  <li>Delete your account and data</li>
                  <li>Export your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Additional Rights</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Object to data processing</li>
                  <li>Restrict data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                  <li>Lodge complaints with authorities</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>To exercise your rights:</strong> Contact us at
                privacy@epic360gigs.com or use the privacy settings in your
                account dashboard.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <span>Cookies and Tracking Technologies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience
              on our platform:
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Essential Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Required for basic platform functionality
                  </p>
                </div>
                <Badge variant="secondary">Required</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Help us understand how you use our platform
                  </p>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Used for personalized advertising
                  </p>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
            </div>

            <p className="text-gray-700 text-sm">
              You can manage your cookie preferences through your browser
              settings or our cookie consent tool.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-orange-600" />
              <span>Data Retention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to
              provide our services and fulfill the purposes outlined in this
              policy:
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Account Information</span>
                <span className="text-sm text-gray-600">
                  Until account deletion
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Transaction Data</span>
                <span className="text-sm text-gray-600">
                  7 years (legal requirement)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Communication Logs</span>
                <span className="text-sm text-gray-600">2 years</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Analytics Data</span>
                <span className="text-sm text-gray-600">3 years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-green-600" />
              <span>International Data Transfers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your data in accordance with applicable laws.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span>Children's Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If you believe we have collected information from a
              child under 13, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Changes to This Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the "Last updated" date. Your continued use
              of our platform after any changes constitutes acceptance of the
              updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-green-600" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> privacy@epic360gigs.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong> 123 Business Street, Suite 100, New
                York, NY 10001
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
