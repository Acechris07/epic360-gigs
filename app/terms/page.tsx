'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Calendar,
  Shield,
  Users,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-green-100">
              Last updated: {currentDate}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Navigation */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span>Quick Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="#acceptance"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  1. Acceptance
                </a>
                <a
                  href="#services"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  2. Services
                </a>
                <a
                  href="#accounts"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  3. Accounts
                </a>
                <a
                  href="#payments"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  4. Payments
                </a>
                <a
                  href="#conduct"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  5. Conduct
                </a>
                <a
                  href="#intellectual"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  6. IP Rights
                </a>
                <a
                  href="#liability"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  7. Liability
                </a>
                <a
                  href="#termination"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  8. Termination
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <Card id="acceptance">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">1</Badge>
                <span>Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Epic360 Gigs ("the Platform"), you accept
                and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") govern your use of our website
                located at epic360gigs.com and any related services provided by
                Epic360 Gigs.
              </p>
            </CardContent>
          </Card>

          {/* 2. Description of Services */}
          <Card id="services">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">2</Badge>
                <span>Description of Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Epic360 Gigs is a freelance marketplace platform that connects
                clients with skilled freelancers. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Freelancer profile creation and management</li>
                <li>Service listing and discovery</li>
                <li>Secure payment processing</li>
                <li>Communication tools between clients and freelancers</li>
                <li>Dispute resolution services</li>
                <li>Escrow payment protection</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. User Accounts */}
          <Card id="accounts">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">3</Badge>
                <span>User Accounts and Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To access certain features of the Platform, you must register
                for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Important
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Payment Terms */}
          <Card id="payments">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">4</Badge>
                <span>Payment Terms and Fees</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our payment terms and fee structure are as follows:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Platform Fees</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 5% service fee on all transactions</li>
                    <li>• Payment processing fees apply</li>
                    <li>• Withdrawal fees may apply</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Methods</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Credit/Debit Cards</li>
                    <li>• PayPal</li>
                    <li>• Bank Transfers</li>
                    <li>• Digital Wallets</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed securely through our payment
                partners. We use escrow services to protect both clients and
                freelancers.
              </p>
            </CardContent>
          </Card>

          {/* 5. User Conduct */}
          <Card id="conduct">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">5</Badge>
                <span>User Conduct and Prohibited Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">
                    Prohibited Activities
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Harassing or discriminating against others</li>
                    <li>Providing false or misleading information</li>
                    <li>Attempting to circumvent payment systems</li>
                    <li>Spamming or sending unsolicited messages</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">
                    Expected Behavior
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Treat all users with respect</li>
                    <li>Provide accurate service descriptions</li>
                    <li>Meet agreed-upon deadlines</li>
                    <li>Communicate professionally</li>
                    <li>Resolve disputes amicably</li>
                    <li>Maintain high quality standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Intellectual Property */}
          <Card id="intellectual">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">6</Badge>
                <span>Intellectual Property Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Intellectual property rights are protected as follows:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Platform Content</h4>
                  <p className="text-gray-700 text-sm">
                    All content on the Platform, including text, graphics,
                    logos, and software, is owned by Epic360 Gigs and protected
                    by copyright laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">User Content</h4>
                  <p className="text-gray-700 text-sm">
                    Users retain ownership of their content but grant us a
                    license to use, display, and distribute it on the Platform.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Work Deliverables</h4>
                  <p className="text-gray-700 text-sm">
                    Upon full payment, clients receive ownership of work
                    deliverables as specified in the service agreement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Limitation of Liability */}
          <Card id="liability">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">7</Badge>
                <span>Limitation of Liability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Epic360 Gigs provides a platform for connecting clients and
                freelancers. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  The quality or accuracy of services provided by freelancers
                </li>
                <li>Disputes between clients and freelancers</li>
                <li>Loss of data or business interruption</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Maximum Liability:</strong> Our total liability to you
                  shall not exceed the amount you paid us in the 12 months
                  preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Termination */}
          <Card id="termination">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">8</Badge>
                <span>Account Termination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account at any time for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activities</li>
                <li>Non-payment of fees</li>
                <li>Repeated complaints from other users</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, you will lose access to your account and any
                remaining balance may be forfeited according to our policies.
              </p>
            </CardContent>
          </Card>

          {/* 9. Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">9</Badge>
                <span>Changes to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the Platform constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          {/* 10. Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge variant="secondary">10</Badge>
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@epic360gigs.com
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

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600 text-sm">
                This document was last updated on {currentDate}. Please review
                these terms regularly as they may change.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
