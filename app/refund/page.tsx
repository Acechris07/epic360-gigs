'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function RefundPage() {
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
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
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
              <CreditCard className="h-6 w-6 text-green-600" />
              <span>Our Refund Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              At Epic360 Gigs, we strive to ensure complete satisfaction with
              every transaction. This refund policy outlines the circumstances
              under which refunds may be issued and the process for requesting
              them.
            </p>
          </CardContent>
        </Card>

        {/* General Refund Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>General Refund Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We offer a 7-day money-back guarantee for all completed orders.
                This means you can request a refund within 7 days of order
                completion if you're not satisfied with the delivered work.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Money-Back Guarantee
                  </span>
                </div>
                <p className="text-green-700 text-sm">
                  If you're not satisfied with your order, you can request a
                  full refund within 7 days of delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Eligibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Eligible for Refund
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Unsatisfactory Quality
                      </p>
                      <p className="text-sm text-gray-600">
                        Work that doesn't meet the agreed-upon specifications or
                        quality standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Missed Deadlines
                      </p>
                      <p className="text-sm text-gray-600">
                        Delays beyond the agreed-upon delivery timeline without
                        prior communication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Non-Delivery</p>
                      <p className="text-sm text-gray-600">
                        Freelancer fails to deliver the work within the
                        specified timeframe
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Platform Issues
                      </p>
                      <p className="text-sm text-gray-600">
                        Technical problems on our platform that prevent order
                        completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Not Eligible for Refund
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Change of Mind
                      </p>
                      <p className="text-sm text-gray-600">
                        Simply deciding you no longer want the service after
                        work has begun
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Scope Creep</p>
                      <p className="text-sm text-gray-600">
                        Requesting additional work beyond the original agreement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Late Requests</p>
                      <p className="text-sm text-gray-600">
                        Refund requests made after the 7-day guarantee period
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Violation of Terms
                      </p>
                      <p className="text-sm text-gray-600">
                        Orders that violate our Terms of Service or community
                        guidelines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Request a Refund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Contact Support
                  </h4>
                  <p className="text-sm text-gray-600">
                    Reach out to our support team through the contact form or
                    live chat
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Provide Details
                  </h4>
                  <p className="text-sm text-gray-600">
                    Include order details and reason for the refund request
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Review & Process
                  </h4>
                  <p className="text-sm text-gray-600">
                    We'll review your request and process the refund if approved
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Required Information
                </h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>Order number and date</li>
                  <li>Detailed reason for refund request</li>
                  <li>Any communication with the freelancer</li>
                  <li>Screenshots or evidence if applicable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-orange-600" />
              <span>Refund Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Request Review</span>
                <span className="text-sm text-gray-600">1-2 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Approval & Processing</span>
                <span className="text-sm text-gray-600">1-3 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Payment Method Credit</span>
                <span className="text-sm text-gray-600">
                  3-10 business days
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  Important Note
                </span>
              </div>
              <p className="text-yellow-700 text-sm">
                The actual time for funds to appear in your account depends on
                your payment method and financial institution. Credit card
                refunds typically take 3-10 business days, while PayPal refunds
                are usually instant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Partial Refunds */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Partial Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              In some cases, we may offer partial refunds when:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Part of the work has been completed satisfactorily</li>
              <li>There are minor issues that don't warrant a full refund</li>
              <li>Both parties agree to a partial refund arrangement</li>
              <li>
                The freelancer has invested significant time in the project
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              If there's a disagreement between you and the freelancer regarding
              a refund:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Mediation</p>
                  <p className="text-sm text-gray-600">
                    Our support team will mediate between both parties to reach
                    a fair resolution
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Evidence Review</p>
                  <p className="text-sm text-gray-600">
                    We'll review all communication and evidence to make an
                    informed decision
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Final Decision</p>
                  <p className="text-sm text-gray-600">
                    Our decision is final and binding for both parties
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-green-600" />
              <span>Need Help?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our refund policy or need to request a
              refund, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> support@epic360gigs.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Live Chat:</strong> Available 24/7 on our platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
