'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  Database,
} from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Security</h1>
            <p className="text-xl text-green-100">
              Protecting your data and ensuring platform security is our top
              priority
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Security Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Our Security Commitment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              At Epic360 Gigs, we understand that security is paramount when
              handling your personal and financial information. We implement
              industry-leading security measures to protect your data and ensure
              a safe platform experience.
            </p>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold">Data Encryption</h3>
              </div>
              <p className="text-gray-600 text-sm">
                All data is encrypted in transit and at rest using AES-256
                encryption, ensuring your information remains secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Secure Authentication</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Multi-factor authentication and secure login processes protect
                your account from unauthorized access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-8 w-8 text-purple-600" />
                <h3 className="text-lg font-semibold">Secure Infrastructure</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Our platform runs on secure cloud infrastructure with regular
                security updates and monitoring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-8 w-8 text-orange-600" />
                <h3 className="text-lg font-semibold">Access Controls</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Strict access controls and role-based permissions ensure only
                authorized personnel can access sensitive data.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We partner with industry-leading payment processors to ensure
                your financial information is protected:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Stripe Integration
                  </h4>
                  <p className="text-green-700 text-sm">
                    All payments are processed through Stripe, a PCI DSS Level 1
                    certified payment processor.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Escrow Protection
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Funds are held securely in escrow until work is completed
                    and approved by both parties.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Important
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">
                  We never store your full credit card information on our
                  servers. All payment data is handled securely by our payment
                  partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    GDPR Compliance
                  </h4>
                  <p className="text-sm text-gray-600">
                    We comply with GDPR requirements for data protection and
                    user privacy rights.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Regular Audits
                  </h4>
                  <p className="text-sm text-gray-600">
                    We conduct regular security audits and penetration testing
                    to identify vulnerabilities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Data Backup
                  </h4>
                  <p className="text-sm text-gray-600">
                    Regular automated backups ensure your data is safe and
                    recoverable.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Best Practices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">For Users</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use strong, unique passwords for your account</li>
                <li>Enable two-factor authentication when available</li>
                <li>Never share your login credentials with others</li>
                <li>Keep your contact information up to date</li>
                <li>Report suspicious activity immediately</li>
                <li>Log out when using shared devices</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-3 mt-6">
                For Freelancers
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Verify client identity before starting work</li>
                <li>Use secure communication channels</li>
                <li>Keep detailed records of all transactions</li>
                <li>Report any suspicious client behavior</li>
                <li>Protect your intellectual property</li>
                <li>Use secure file sharing methods</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Incident Response */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Security Incident Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                In the event of a security incident, we have a comprehensive
                response plan:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Immediate Response
                  </h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Incident assessment and containment</li>
                    <li>• User notification if necessary</li>
                    <li>• Investigation and analysis</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Recovery & Prevention
                  </h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• System restoration and recovery</li>
                    <li>• Security improvements</li>
                    <li>• Prevention measures</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Certifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Security Certifications & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">SOC 2</Badge>
                  <span className="text-sm text-gray-700">
                    Type II Compliance
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">ISO 27001</Badge>
                  <span className="text-sm text-gray-700">
                    Information Security
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">PCI DSS</Badge>
                  <span className="text-sm text-gray-700">
                    Payment Security
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">GDPR</Badge>
                  <span className="text-sm text-gray-700">Data Protection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Security Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Security Team Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you discover a security vulnerability or have security-related
              concerns, please contact our security team:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Security Email:</strong> security@epic360gigs.com
              </p>
              <p>
                <strong>Emergency Contact:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Bug Bounty Program:</strong> Available for qualified
                researchers
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Responsible Disclosure:</strong> We appreciate security
                researchers who responsibly disclose vulnerabilities. Please
                allow us time to investigate and fix issues before public
                disclosure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
