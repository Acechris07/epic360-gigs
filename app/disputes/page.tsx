'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

export default function DisputesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Dispute Resolution</h1>
            <p className="text-xl text-green-100">
              Fair and transparent resolution for all platform disputes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Our Dispute Resolution Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              At Epic360 Gigs, we understand that disputes can arise in any
              business relationship. Our comprehensive dispute resolution
              process ensures fair and timely resolution for all parties
              involved.
            </p>
          </CardContent>
        </Card>

        {/* Dispute Types */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Types of Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Quality Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Work doesn't meet agreed specifications</li>
                  <li>Poor quality deliverables</li>
                  <li>Incomplete work</li>
                  <li>Not following project requirements</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Timeline Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Missed deadlines</li>
                  <li>Delayed delivery</li>
                  <li>Unreasonable delays</li>
                  <li>No communication about delays</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Payment Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payment disputes</li>
                  <li>Refund requests</li>
                  <li>Escrow release conflicts</li>
                  <li>Additional charges</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Communication Issues
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Poor communication</li>
                  <li>Unresponsive parties</li>
                  <li>Misunderstandings</li>
                  <li>Scope creep disputes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dispute Resolution Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Report Issue
                  </h4>
                  <p className="text-sm text-gray-600">
                    Submit a dispute through our platform with detailed
                    information
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Initial Review
                  </h4>
                  <p className="text-sm text-gray-600">
                    Our team reviews the dispute and gathers additional
                    information
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Mediation
                  </h4>
                  <p className="text-sm text-gray-600">
                    We facilitate communication between parties to reach
                    resolution
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Final Decision
                  </h4>
                  <p className="text-sm text-gray-600">
                    If mediation fails, we make a binding decision based on
                    evidence
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-orange-600" />
              <span>Resolution Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Initial Response</span>
                <span className="text-sm text-gray-600">Within 24 hours</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Evidence Collection</span>
                <span className="text-sm text-gray-600">2-3 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Mediation Period</span>
                <span className="text-sm text-gray-600">3-5 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Final Decision</span>
                <span className="text-sm text-gray-600">5-7 business days</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Complex disputes may take longer to
                resolve. We'll keep you updated throughout the process.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How to File a Dispute */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to File a Dispute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Before Filing a Dispute
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">
                  We encourage you to first try to resolve the issue directly
                  with the other party through our messaging system. Many
                  disputes can be resolved through open communication.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Steps to File a Dispute:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to your order details page</li>
                  <li>Click on "File Dispute" or "Report Issue"</li>
                  <li>Select the type of dispute</li>
                  <li>Provide detailed information and evidence</li>
                  <li>Submit the dispute for review</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Required Information
                </h4>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Order number and date</li>
                  <li>Detailed description of the issue</li>
                  <li>Evidence (screenshots, messages, files)</li>
                  <li>Desired resolution</li>
                  <li>Previous communication attempts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Possible Resolutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">For Clients</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Full or partial refund</li>
                  <li>Work revision or completion</li>
                  <li>Replacement freelancer</li>
                  <li>Escrow release to freelancer</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">For Freelancers</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payment release from escrow</li>
                  <li>Additional payment for extra work</li>
                  <li>Order completion extension</li>
                  <li>Dispute dismissal if unfounded</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appeal Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appeal Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you disagree with our dispute resolution decision, you may
                appeal within 7 days of the decision:
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Submit Appeal</p>
                    <p className="text-sm text-gray-600">
                      Provide new evidence or information not previously
                      considered
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Senior Review</p>
                    <p className="text-sm text-gray-600">
                      A senior dispute resolution specialist reviews the case
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Final Decision</p>
                    <p className="text-sm text-gray-600">
                      The appeal decision is final and binding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prevention Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preventing Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  For Clients
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide clear, detailed project requirements</li>
                  <li>Communicate regularly with your freelancer</li>
                  <li>Review work progress and provide feedback</li>
                  <li>Be realistic about timelines and budgets</li>
                  <li>Use milestone payments for large projects</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  For Freelancers
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ask clarifying questions before starting</li>
                  <li>Provide regular updates on progress</li>
                  <li>Meet agreed-upon deadlines</li>
                  <li>Deliver work that meets specifications</li>
                  <li>Communicate any issues or delays promptly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
              <span>Need Help?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Contact Dispute Resolution Team
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> disputes@epic360gigs.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Help Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
