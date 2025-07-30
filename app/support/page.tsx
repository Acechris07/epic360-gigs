'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Star,
  Award,
  Shield,
  Globe,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

const supportTeam = [
  {
    name: 'Sarah Johnson',
    role: 'Head of Customer Support',
    expertise: 'Account Management',
    experience: '8+ years',
    avatar: 'SJ',
    rating: 4.9,
  },
  {
    name: 'Michael Chen',
    role: 'Technical Support Specialist',
    expertise: 'Platform Issues',
    experience: '5+ years',
    avatar: 'MC',
    rating: 4.8,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Payment Support Lead',
    expertise: 'Billing & Payments',
    experience: '6+ years',
    avatar: 'ER',
    rating: 4.9,
  },
  {
    name: 'David Kim',
    role: 'Dispute Resolution Specialist',
    expertise: 'Conflict Resolution',
    experience: '7+ years',
    avatar: 'DK',
    rating: 4.7,
  },
];

const supportStats = [
  { label: 'Average Response Time', value: '2.3 hours', icon: Clock },
  { label: 'Customer Satisfaction', value: '98%', icon: Star },
  { label: 'Support Team Size', value: '25+ Experts', icon: Users },
  { label: 'Languages Supported', value: '12+', icon: Globe },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Support Team</h1>
            <p className="text-xl text-green-100">
              Meet the dedicated professionals who are here to help you succeed
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Support Specialists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTeam.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold text-lg">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-xs mb-3">
                    {member.expertise}
                  </p>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {member.rating}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {member.experience}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Support Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Customer-First Approach
                </h3>
                <p className="text-gray-600 text-sm">
                  Every interaction is focused on understanding and solving your
                  unique needs with empathy and care.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Expert Knowledge
                </h3>
                <p className="text-gray-600 text-sm">
                  Our team undergoes continuous training to stay updated with
                  the latest platform features and best practices.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quality Assurance
                </h3>
                <p className="text-gray-600 text-sm">
                  Every support interaction is monitored and reviewed to ensure
                  the highest quality of service delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Get Help Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Send Message
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get a detailed response within 24 hours
                  </p>
                  <Button className="w-full">Contact Us</Button>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Call Support
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Speak directly with our team
                </p>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>

            <Link href="/help">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Help Center
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Find answers to common questions
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse FAQ
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Support Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Support Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  General Support
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Emergency Support
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Critical Issues:</span>
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Issues:</span>
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Issues:</span>
                    <span>24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
