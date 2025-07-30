'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Users,
  Shield,
  CreditCard,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    name: 'Getting Started',
    icon: BookOpen,
    color: 'bg-blue-500',
    faqs: [
      {
        question: 'How do I create an account?',
        answer:
          'Click the "Sign Up" button in the top right corner. You can sign up using your email address or connect with Google/Facebook for faster registration.',
      },
      {
        question: 'How do I post my first service?',
        answer:
          'After creating an account, go to "Create Service" from your dashboard. Fill in the details about your service, set your pricing, and upload relevant images.',
      },
      {
        question: 'How do I find services to hire?',
        answer:
          'Use the search bar or browse categories to find services. You can filter by price, location, and ratings to find the perfect match.',
      },
    ],
  },
  {
    name: 'Payments & Billing',
    icon: CreditCard,
    color: 'bg-green-500',
    faqs: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.',
      },
      {
        question: 'How does the escrow system work?',
        answer:
          "When you place an order, the payment is held securely in escrow. It's only released to the freelancer once you approve the completed work.",
      },
      {
        question: 'What are the platform fees?',
        answer:
          'We charge a 5% platform fee on all transactions. This helps us maintain the platform and provide customer support.',
      },
    ],
  },
  {
    name: 'Safety & Security',
    icon: Shield,
    color: 'bg-red-500',
    faqs: [
      {
        question: 'How do you verify freelancers?',
        answer:
          'We verify freelancers through multiple methods including ID verification, portfolio review, and background checks.',
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer:
          "We offer a money-back guarantee. If you're not satisfied, contact our support team within 7 days of delivery.",
      },
      {
        question: 'How do you protect my personal information?',
        answer:
          'We use industry-standard encryption and security measures to protect all your personal and payment information.',
      },
    ],
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    color: 'bg-purple-500',
    faqs: [
      {
        question: 'How do I communicate with freelancers?',
        answer:
          'Use our built-in messaging system to communicate directly with freelancers. All messages are encrypted and secure.',
      },
      {
        question: 'Can I request revisions?',
        answer:
          'Yes, most services include revision rounds. The number of revisions depends on the service package you choose.',
      },
      {
        question: "What if a freelancer doesn't respond?",
        answer:
          "If a freelancer doesn't respond within 48 hours, you can cancel the order and get a full refund.",
      },
    ],
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  const toggleFaq = (faqId: string) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const filteredCategories = faqCategories
    .map(category => ({
      ...category,
      faqs: category.faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-green-100 mb-8">
              Find answers to your questions and get the support you need
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our support team
              </p>
              <Button variant="outline" className="w-full">
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message</p>
              <Button variant="outline" className="w-full">
                support@epic360gigs.com
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        {filteredCategories.map((category, categoryIndex) => (
          <div key={category.name} className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${category.color}`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
            </div>

            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const faqId = `${categoryIndex}-${faqIndex}`;
                const isExpanded = expandedFaqs.has(faqId);

                return (
                  <Card
                    key={faqId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => toggleFaq(faqId)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {faq.question}
                        </CardTitle>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Additional Resources */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold">Contact Us</h3>
                  <p className="text-sm text-gray-600">
                    Get in touch with our team
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/terms">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold">Terms of Service</h3>
                  <p className="text-sm text-gray-600">
                    Read our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/privacy">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold">Privacy Policy</h3>
                  <p className="text-sm text-gray-600">
                    Learn about data protection
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/support">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold">Support Team</h3>
                  <p className="text-sm text-gray-600">
                    Meet our support specialists
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
