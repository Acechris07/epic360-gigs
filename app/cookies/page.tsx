'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Cookie, Settings, Eye, AlertTriangle } from 'lucide-react';

export default function CookiesPage() {
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
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
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
              <Cookie className="h-6 w-6 text-green-600" />
              <span>About Our Cookie Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains how Epic360 Gigs uses cookies and
              similar technologies to recognize you when you visit our platform.
              It explains what these technologies are and why we use them, as
              well as your rights to control our use of them.
            </p>
          </CardContent>
        </Card>

        {/* What are Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What are Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. They are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies set by the website owner (in this case, Epic360 Gigs) are
              called "first-party cookies". Cookies set by parties other than
              the website owner are called "third-party cookies". Third-party
              cookies enable third-party features or functionality to be
              provided on or through the website.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies are essential for the website to function and
                  cannot be switched off in our systems.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Required</Badge>
                  <span className="text-xs text-gray-500">
                    Cannot be disabled
                  </span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Authentication and security</li>
                  <li>Session management</li>
                  <li>Basic platform functionality</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies help us understand how visitors interact with
                  our platform by collecting and reporting information
                  anonymously.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Optional</Badge>
                  <span className="text-xs text-gray-500">Can be disabled</span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Page views and navigation patterns</li>
                  <li>Performance monitoring</li>
                  <li>Error tracking and debugging</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies enable the website to provide enhanced
                  functionality and personalization.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Optional</Badge>
                  <span className="text-xs text-gray-500">Can be disabled</span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Language preferences</li>
                  <li>User interface customization</li>
                  <li>Remembering user choices</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies are used to track visitors across websites to
                  display relevant and engaging advertisements.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Optional</Badge>
                  <span className="text-xs text-gray-500">Can be disabled</span>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Targeted advertising</li>
                  <li>Social media integration</li>
                  <li>Campaign tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <span>Managing Your Cookie Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Browser Settings
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Most web browsers allow you to manage cookies through their
                  settings preferences. However, if you limit the ability of
                  websites to set cookies, you may worsen your overall user
                  experience.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    How to manage cookies in your browser:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>
                      <strong>Chrome:</strong> Settings → Privacy and security →
                      Cookies and other site data
                    </li>
                    <li>
                      <strong>Firefox:</strong> Options → Privacy & Security →
                      Cookies and Site Data
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferences → Privacy → Manage
                      Website Data
                    </li>
                    <li>
                      <strong>Edge:</strong> Settings → Cookies and site
                      permissions → Cookies and site data
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cookie Consent Tool
                </h3>
                <p className="text-gray-700 text-sm">
                  We provide a cookie consent tool that allows you to manage
                  your cookie preferences directly on our platform. You can
                  access this tool through the cookie banner or in your account
                  settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various
              third-party cookies to report usage statistics of the platform,
              deliver advertisements on and through the platform, and so on.
            </p>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Important Notice
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Third-party cookies are not under our direct control. We
                  recommend reviewing the privacy policies of these third-party
                  services to understand how they use cookies and your data.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Common Third-Party Services:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>
                    <strong>Google Analytics:</strong> Website analytics and
                    performance monitoring
                  </li>
                  <li>
                    <strong>Stripe:</strong> Payment processing and security
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> Social sharing and
                    authentication
                  </li>
                  <li>
                    <strong>Advertising Networks:</strong> Targeted advertising
                    and marketing
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookie Retention Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Session Cookies</span>
                <span className="text-sm text-gray-600">
                  Until browser session ends
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Persistent Cookies</span>
                <span className="text-sm text-gray-600">Up to 2 years</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Analytics Cookies</span>
                <span className="text-sm text-gray-600">Up to 26 months</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Marketing Cookies</span>
                <span className="text-sm text-gray-600">Up to 13 months</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will notify you of any material changes by
              posting the new policy on this page and updating the "Last
              updated" date.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact
              us:
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
