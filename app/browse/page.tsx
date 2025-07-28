"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, SlidersHorizontal, Star, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for demonstration - in real app, this would come from your database
const mockGigs = [
  {
    id: "1",
    title: "Professional House Cleaning Service",
    description:
      "Deep cleaning for your home with eco-friendly products. Includes kitchen, bathrooms, bedrooms, and living areas.",
    price: 75,
    delivery_time: 1,
    category: "Cleaning Gigs",
    tags: ["cleaning", "eco-friendly", "deep-clean"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "New York, NY",
    rating: 4.9,
    reviews: 127,
    freelancer: {
      full_name: "Sarah Johnson",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "2",
    title: "Birthday Party Planning & Coordination",
    description:
      "Complete party planning service including venue decoration, entertainment coordination, and timeline management.",
    price: 250,
    delivery_time: 7,
    category: "Party Planning Gigs",
    tags: ["birthday", "decoration", "coordination"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 89,
    freelancer: {
      full_name: "Mike Chen",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "3",
    title: "Kitchen Faucet Repair & Installation",
    description:
      "Expert plumbing service for kitchen and bathroom faucet repairs, replacements, and new installations.",
    price: 120,
    delivery_time: 1,
    category: "Plumbing Gigs",
    tags: ["faucet", "repair", "installation"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 156,
    freelancer: {
      full_name: "David Rodriguez",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "4",
    title: "Website Development & Design",
    description:
      "Custom website development using modern technologies. Includes responsive design, SEO optimization, and maintenance.",
    price: 500,
    delivery_time: 14,
    category: "IT Gigs",
    tags: ["website", "development", "design"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Austin, TX",
    rating: 4.9,
    reviews: 203,
    freelancer: {
      full_name: "Emily Davis",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "5",
    title: "Social Media Marketing Strategy",
    description:
      "Comprehensive social media strategy including content creation, posting schedule, and engagement optimization.",
    price: 300,
    delivery_time: 5,
    category: "Social Media Gigs",
    tags: ["marketing", "strategy", "content"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Miami, FL",
    rating: 4.7,
    reviews: 98,
    freelancer: {
      full_name: "Alex Thompson",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "6",
    title: "Math Tutoring for High School Students",
    description:
      "Personalized math tutoring for algebra, geometry, and calculus. Available for in-person or online sessions.",
    price: 45,
    delivery_time: 1,
    category: "Teaching Gigs",
    tags: ["math", "tutoring", "education"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Boston, MA",
    rating: 4.9,
    reviews: 165,
    freelancer: {
      full_name: "Jennifer Wilson",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "7",
    title: "Garden Design & Landscaping",
    description:
      "Complete landscape design including plant selection, garden layout, irrigation planning, and seasonal maintenance.",
    price: 400,
    delivery_time: 10,
    category: "Landscaping Gigs",
    tags: ["garden", "design", "landscaping"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Portland, OR",
    rating: 4.8,
    reviews: 142,
    freelancer: {
      full_name: "Mark Thompson",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "8",
    title: "Office Deep Cleaning Service",
    description:
      "Professional office cleaning including sanitization, carpet cleaning, window washing, and workspace organization.",
    price: 150,
    delivery_time: 1,
    category: "Cleaning Gigs",
    tags: ["office", "sanitization", "commercial"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Seattle, WA",
    rating: 4.9,
    reviews: 203,
    freelancer: {
      full_name: "Lisa Martinez",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "9",
    title: "Wedding DJ & Music Entertainment",
    description:
      "Professional DJ services for weddings including ceremony music, cocktail hour, and reception entertainment with full sound system.",
    price: 800,
    delivery_time: 1,
    category: "DJ Gigs",
    tags: ["wedding", "music", "entertainment"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Las Vegas, NV",
    rating: 4.9,
    reviews: 187,
    freelancer: {
      full_name: "Carlos Rodriguez",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "10",
    title: "Corporate Event DJ Services",
    description:
      "Professional DJ and MC services for corporate events, conferences, and company parties with background music and announcements.",
    price: 450,
    delivery_time: 1,
    category: "DJ Gigs",
    tags: ["corporate", "events", "MC"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 134,
    freelancer: {
      full_name: "DJ Marcus",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "11",
    title: "Wedding Photography Package",
    description:
      "Complete wedding photography service including engagement session, ceremony, reception, and edited digital gallery with 500+ photos.",
    price: 1200,
    delivery_time: 14,
    category: "Photography Gigs",
    tags: ["wedding", "photography", "digital"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Nashville, TN",
    rating: 4.9,
    reviews: 298,
    freelancer: {
      full_name: "Amanda Foster",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "12",
    title: "Professional Headshot Photography",
    description:
      "Corporate headshot photography session with professional lighting, multiple outfit changes, and retouched final images.",
    price: 200,
    delivery_time: 3,
    category: "Photography Gigs",
    tags: ["headshots", "corporate", "professional"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Denver, CO",
    rating: 4.8,
    reviews: 156,
    freelancer: {
      full_name: "Ryan Mitchell",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "13",
    title: "Private Chef for Special Events",
    description:
      "Professional chef services for private events, parties, and special occasions. Custom menu planning and full-service catering.",
    price: 350,
    delivery_time: 1,
    category: "Cooking Gigs",
    tags: ["private-chef", "catering", "events"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 89,
    freelancer: {
      full_name: "Maria Rodriguez",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "14",
    title: "Home Cooking Classes",
    description:
      "Learn to cook delicious meals in your own kitchen. Personalized cooking lessons for individuals or small groups.",
    price: 120,
    delivery_time: 1,
    category: "Cooking Gigs",
    tags: ["cooking-classes", "culinary", "education"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 67,
    freelancer: {
      full_name: "Chef Michael Chen",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "15",
    title: "Interior Design Consultation",
    description:
      "Professional interior design consultation to transform your space. Includes color schemes, furniture selection, and layout planning.",
    price: 250,
    delivery_time: 7,
    category: "Decor Gigs",
    tags: ["interior-design", "consultation", "styling"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Miami, FL",
    rating: 4.8,
    reviews: 134,
    freelancer: {
      full_name: "Sophia Williams",
      avatar_url: "/placeholder-user.jpg",
    },
  },
  {
    id: "16",
    title: "Home Decoration & Styling",
    description:
      "Complete home decoration services including furniture arrangement, wall art placement, and accessory styling.",
    price: 180,
    delivery_time: 3,
    category: "Decor Gigs",
    tags: ["decoration", "styling", "home-improvement"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Austin, TX",
    rating: 4.6,
    reviews: 92,
    freelancer: {
      full_name: "Emma Thompson",
      avatar_url: "/placeholder-user.jpg",
    },
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const categories = [
    "all",
    "Household Service Gigs",
    "Party Planning Gigs",
    "Household Repair Gigs",
    "Automobile Repair Gigs",
    "Plumbing Gigs",
    "Construction Gigs",
    "Electricity Repair Gigs",
    "IT Gigs",
    "Social Media Gigs",
    "Teaching Gigs",
    "Saloon Gigs",
    "Tailoring Gigs",
    "Transportation Gigs",
    "Driving Gigs",
    "Cleaning Gigs",
    "Landscaping Gigs",
    "DJ Gigs",
    "Photography Gigs",
    "Cooking Gigs",
    "Decor Gigs",
  ]

  const filteredGigs = mockGigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || gig.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategorySlug = (categoryName: string) => {
    return categoryName
      .toLowerCase()
      .replace(/\s+gigs/g, "")
      .replace(/\s+/g, "-")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Browse All Services</h1>
            <p className="text-xl text-green-100 mb-8">
              Discover talented freelancers ready to help with your projects
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Create Service Button */}
            <div className="mt-6">
              <Link href="/create-service">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-green-700"
                >
                  Create a Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  if (e.target.value !== "all") {
                    window.location.href = `/search?category=${encodeURIComponent(e.target.value)}`
                  } else {
                    setSelectedCategory(e.target.value)
                  }
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="ml-auto text-sm text-gray-600">{filteredGigs.length} services found</div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredGigs.length} services found for "{searchTerm}"
            </p>
          </div>
        )}

        {filteredGigs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all available services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGigs.map((gig) => (
              <Card
                key={gig.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-green-100 hover:border-green-300"
              >
                <div className="aspect-video relative">
                  <img
                    src={gig.images[0] || "/placeholder.svg"}
                    alt={gig.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">${gig.price}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={gig.freelancer.avatar_url || "/placeholder.svg"}
                      alt={gig.freelancer.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{gig.freelancer.full_name}</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-700">{gig.title}</h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {gig.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{gig.rating}</span>
                      <span className="text-sm text-gray-500">({gig.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {gig.delivery_time} day{gig.delivery_time > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{gig.location}</span>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      {gig.category.replace(" Gigs", "")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{filteredGigs.length.toLocaleString()}</div>
              <div className="text-gray-600">Available Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">18</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
