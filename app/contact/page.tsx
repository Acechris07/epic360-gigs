"use client"

import { Phone, MessageCircle, Mail, Clock, MapPin, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help! Whether you have questions, need support, or want to share feedback, our team is ready
              to assist you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phone Support */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 group-hover:from-green-500/10 group-hover:to-green-600/20 transition-all duration-300"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Call Us</CardTitle>
              <CardDescription className="text-gray-600">
                Speak directly with our support team for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-900">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Mon-Fri: 9AM-6PM PST</span>
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open("tel:+15551234567")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Average wait time: 2 minutes
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 group-hover:from-blue-500/10 group-hover:to-blue-600/20 transition-all duration-300"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Live Chat</CardTitle>
              <CardDescription className="text-gray-600">
                Get instant help through our real-time messaging system
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Support team online</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Available 24/7</span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // In a real app, this would open a chat widget
                  alert("Live chat feature coming soon! Please use phone or email for now.")
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Instant response
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 group-hover:from-purple-500/10 group-hover:to-purple-600/20 transition-all duration-300"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Email Us</CardTitle>
              <CardDescription className="text-gray-600">
                Send us a detailed message and we'll get back to you soon
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">support@epic360gigs.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Response within 24 hours</span>
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.open("mailto:support@epic360gigs.com?subject=Support Request")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Detailed support
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Office Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Our Office</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>Epic360 Gigs Headquarters</p>
                <p>123 Innovation Drive, Suite 400</p>
                <p>San Francisco, CA 94105</p>
                <p>United States</p>
              </div>
            </div>

            {/* Support Hours */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Headphones className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Support Hours</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Emergency Support:</strong> Available 24/7 for critical issues via live chat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Prompt */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Looking for Quick Answers?</h3>
            <p className="text-lg mb-6 opacity-90">
              Check out our comprehensive FAQ section for instant solutions to common questions.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Browse FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
