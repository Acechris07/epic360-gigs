'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  Shield,
  Users,
  Award,
  Clock,
  HelpCircle,
  FileText,
  Lock,
  CreditCard,
  MessageSquare,
  Star,
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">Epic360 Gigs</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting talented freelancers with clients worldwide. Your
              trusted platform for quality services and secure transactions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/create-service"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Create Service
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Help */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support & Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/disputes"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Business */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Legal & Business
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-300 hover:text-green-500 transition-colors text-sm flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-white">Secure Payments</h4>
                <p className="text-gray-400 text-sm">Protected by Stripe</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-white">24/7 Support</h4>
                <p className="text-gray-400 text-sm">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-white">Quality Guaranteed</h4>
                <p className="text-gray-400 text-sm">Verified professionals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-white">Trusted Platform</h4>
                <p className="text-gray-400 text-sm">Thousands of users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">support@epic360gigs.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white">
                  123 Business St, Suite 100
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} Epic360 Gigs. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>for freelancers</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={scrollToTop}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="ml-2">Back to Top</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
