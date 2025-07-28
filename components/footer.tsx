import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold tracking-wide text-white">Epic360</span>
              <span className="text-3xl font-['Baguet_Script'] text-green-400">Gigs</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connect with skilled freelancers and find the perfect services for your needs. Your trusted platform for
              quality gigs and professional services.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">For Freelancers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Create a Gig
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Seller Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Seller Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Safety & Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail size={16} />
                <span>support@epic360gigs.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2024 Epic360 Gigs. All rights reserved.</div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Accessibility
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Cookies
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
