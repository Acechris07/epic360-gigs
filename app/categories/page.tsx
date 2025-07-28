"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  Home,
  PartyPopper,
  Wrench,
  Car,
  Droplets,
  HardHat,
  Zap,
  Monitor,
  Users,
  GraduationCap,
  Scissors,
  Shirt,
  Truck,
  Navigation,
  Sparkles,
  Trees,
  Music,
  Camera,
  ChefHat,
  Palette,
} from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Household Service Gigs",
    icon: Home,
    description: "General home services and maintenance",
    href: "/categories/household-service",
    count: 245,
  },
  {
    name: "Party Planning Gigs",
    icon: PartyPopper,
    description: "Event planning and coordination services",
    href: "/categories/party-planning",
    count: 89,
  },
  {
    name: "Household Repair Gigs",
    icon: Wrench,
    description: "Home maintenance and repair services",
    href: "/categories/household-repair",
    count: 156,
  },
  {
    name: "Automobile Repair Gigs",
    icon: Car,
    description: "Car maintenance and repair services",
    href: "/categories/automobile-repair",
    count: 78,
  },
  {
    name: "Plumbing Gigs",
    icon: Droplets,
    description: "Plumbing services and repairs",
    href: "/categories/plumbing",
    count: 134,
  },
  {
    name: "Construction Gigs",
    icon: HardHat,
    description: "Building and construction work",
    href: "/categories/construction",
    count: 203,
  },
  {
    name: "Electricity Repair Gigs",
    icon: Zap,
    description: "Electrical services and repairs",
    href: "/categories/electricity-repair",
    count: 112,
  },
  {
    name: "IT Gigs",
    icon: Monitor,
    description: "Technology and computer services",
    href: "/categories/it",
    count: 298,
  },
  {
    name: "Social Media Gigs",
    icon: Users,
    description: "Digital marketing and social media management",
    href: "/categories/social-media",
    count: 187,
  },
  {
    name: "Teaching Gigs",
    icon: GraduationCap,
    description: "Educational and tutoring services",
    href: "/categories/teaching",
    count: 165,
  },
  {
    name: "Saloon Gigs",
    icon: Scissors,
    description: "Beauty and grooming services",
    href: "/categories/saloon",
    count: 92,
  },
  {
    name: "Tailoring Gigs",
    icon: Shirt,
    description: "Clothing alterations and custom tailoring",
    href: "/categories/tailoring",
    count: 67,
  },
  {
    name: "Transportation Gigs",
    icon: Truck,
    description: "Moving, delivery, and logistics services",
    href: "/categories/transportation",
    count: 143,
  },
  {
    name: "Driving Gigs",
    icon: Navigation,
    description: "Ride-sharing, chauffeur, and driving services",
    href: "/categories/driving",
    count: 198,
  },
  {
    name: "Cleaning Gigs",
    icon: Sparkles,
    description: "Professional cleaning and sanitization services",
    href: "/categories/cleaning",
    count: 276,
  },
  {
    name: "Landscaping Gigs",
    icon: Trees,
    description: "Garden design, lawn care, and outdoor maintenance",
    href: "/categories/landscaping",
    count: 189,
  },
  {
    name: "DJ Gigs",
    icon: Music,
    description: "Music entertainment and DJ services for events",
    href: "/categories/dj",
    count: 124,
  },
  {
    name: "Photography Gigs",
    icon: Camera,
    description: "Professional photography and videography services",
    href: "/categories/photography",
    count: 231,
  },
  {
    name: "Cooking Gigs",
    icon: ChefHat,
    description: "Professional cooking, catering, and culinary services",
    href: "/categories/cooking",
    count: 156,
  },
  {
    name: "Decor Gigs",
    icon: Palette,
    description: "Interior design, decoration, and styling services",
    href: "/categories/decor",
    count: 203,
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find Available Gigs by Category</h1>
            <p className="text-xl text-green-100 mb-8">
              Discover open gigs that need skilled providers across various service categories
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for gig categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Create Gig Button */}
            <div className="mt-6">
              <Link href="/create-gig">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white border-white/20 hover:border-white/30 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create a Gig
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchTerm && (
          <div className="mb-8">
            <p className="text-gray-600">
              {filteredCategories.length} categories found for "{searchTerm}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={`/search?category=${encodeURIComponent(category.name)}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-green-100 hover:border-green-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {category.count} gigs available
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all available categories.</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Gigs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">20</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
