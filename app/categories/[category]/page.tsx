"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Star, MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockGigs = [
  {
    id: "1",
    title: "Professional House Cleaning Service",
    description: "Deep cleaning for your home with eco-friendly products.",
    price: 75,
    delivery_time: 1,
    category: "Cleaning Gigs",
    tags: ["cleaning", "eco-friendly", "deep-clean"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "New York, NY",
    rating: 4.9,
    reviews: 127,
    freelancer: { full_name: "Sarah Johnson", avatar_url: "/placeholder-user.jpg" },
  },
  {
    id: "2",
    title: "Website Development & Design",
    description: "Custom website development using modern technologies.",
    price: 500,
    delivery_time: 14,
    category: "IT Gigs",
    tags: ["website", "development", "design"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Austin, TX",
    rating: 4.9,
    reviews: 203,
    freelancer: { full_name: "Emily Davis", avatar_url: "/placeholder-user.jpg" },
  },
  {
    id: "3",
    title: "Private Chef for Special Events",
    description: "Professional chef services for private events, parties, and special occasions. Custom menu planning and full-service catering.",
    price: 350,
    delivery_time: 1,
    category: "Cooking Gigs",
    tags: ["private-chef", "catering", "events"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 89,
    freelancer: { full_name: "Maria Rodriguez", avatar_url: "/placeholder-user.jpg" },
  },
  {
    id: "4",
    title: "Home Cooking Classes",
    description: "Learn to cook delicious meals in your own kitchen. Personalized cooking lessons for individuals or small groups.",
    price: 120,
    delivery_time: 1,
    category: "Cooking Gigs",
    tags: ["cooking-classes", "culinary", "education"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 67,
    freelancer: { full_name: "Chef Michael Chen", avatar_url: "/placeholder-user.jpg" },
  },
  {
    id: "5",
    title: "Interior Design Consultation",
    description: "Professional interior design consultation to transform your space. Includes color schemes, furniture selection, and layout planning.",
    price: 250,
    delivery_time: 7,
    category: "Decor Gigs",
    tags: ["interior-design", "consultation", "styling"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Miami, FL",
    rating: 4.8,
    reviews: 134,
    freelancer: { full_name: "Sophia Williams", avatar_url: "/placeholder-user.jpg" },
  },
  {
    id: "6",
    title: "Home Decoration & Styling",
    description: "Complete home decoration services including furniture arrangement, wall art placement, and accessory styling.",
    price: 180,
    delivery_time: 3,
    category: "Decor Gigs",
    tags: ["decoration", "styling", "home-improvement"],
    images: ["/placeholder.svg?height=200&width=300"],
    location: "Austin, TX",
    rating: 4.6,
    reviews: 92,
    freelancer: { full_name: "Emma Thompson", avatar_url: "/placeholder-user.jpg" },
  },
]

const categoryInfo = {
  "household-service": {
    name: "Household Service Gigs",
    description: "General home services and maintenance",
    icon: "🏠",
  },
  "it": {
    name: "IT Gigs",
    description: "Technology and computer services",
    icon: "💻",
  },
  "cleaning": {
    name: "Cleaning Gigs",
    description: "Professional cleaning and sanitization services",
    icon: "✨",
  },
  "party-planning": {
    name: "Party Planning Gigs",
    description: "Event planning and coordination services",
    icon: "🎉",
  },
  "household-repair": {
    name: "Household Repair Gigs",
    description: "Home maintenance and repair services",
    icon: "🔧",
  },
  "automobile-repair": {
    name: "Automobile Repair Gigs",
    description: "Car maintenance and repair services",
    icon: "🚗",
  },
  "plumbing": {
    name: "Plumbing Gigs",
    description: "Plumbing services and repairs",
    icon: "💧",
  },
  "construction": {
    name: "Construction Gigs",
    description: "Building and construction work",
    icon: "🏗️",
  },
  "electricity-repair": {
    name: "Electricity Repair Gigs",
    description: "Electrical services and repairs",
    icon: "⚡",
  },
  "social-media": {
    name: "Social Media Gigs",
    description: "Digital marketing and social media management",
    icon: "📱",
  },
  "teaching": {
    name: "Teaching Gigs",
    description: "Educational and tutoring services",
    icon: "🎓",
  },
  "saloon": {
    name: "Saloon Gigs",
    description: "Beauty and grooming services",
    icon: "✂️",
  },
  "tailoring": {
    name: "Tailoring Gigs",
    description: "Clothing alterations and custom tailoring",
    icon: "👕",
  },
  "transportation": {
    name: "Transportation Gigs",
    description: "Moving, delivery, and logistics services",
    icon: "🚚",
  },
  "driving": {
    name: "Driving Gigs",
    description: "Ride-sharing, chauffeur, and driving services",
    icon: "🚗",
  },
  "landscaping": {
    name: "Landscaping Gigs",
    description: "Garden design, lawn care, and outdoor maintenance",
    icon: "🌳",
  },
  "dj": {
    name: "DJ Gigs",
    description: "Music entertainment and DJ services for events",
    icon: "🎵",
  },
  "photography": {
    name: "Photography Gigs",
    description: "Professional photography and videography services",
    icon: "📷",
  },
  "cooking": {
    name: "Cooking Gigs",
    description: "Professional cooking, catering, and culinary services",
    icon: "👨‍🍳",
  },
  "decor": {
    name: "Decor Gigs",
    description: "Interior design, decoration, and styling services",
    icon: "🎨",
  },
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [searchTerm, setSearchTerm] = useState("")

  const category = categoryInfo[categorySlug as keyof typeof categoryInfo] || {
    name: "Unknown Category",
    description: "Category not found",
    icon: "❓",
  }

  const filteredGigs = mockGigs.filter((gig) => {
    const matchesCategory = gig.category === category.name
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <Link href="/categories" className="inline-flex items-center text-green-100 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
            </div>
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-green-100 mb-8">{category.description}</p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={`Search in ${category.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="mt-6">
              <Link href={`/search?category=${encodeURIComponent(category.name)}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-green-700"
                >
                  View All {category.name}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Gigs</h2>
          <p className="text-gray-600">{filteredGigs.length} gigs found in this category</p>
        </div>

        {filteredGigs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No gigs found for "${searchTerm}" in this category.` : "No gigs available in this category yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-gig">
                <Button>Create a Gig</Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline">Browse Other Categories</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGigs.map((gig) => (
              <Card key={gig.id} className="hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative">
                  <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover rounded-t-lg" />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">${gig.price}</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={gig.freelancer.avatar_url}
                      alt={gig.freelancer.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{gig.freelancer.full_name}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {gig.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{gig.rating}</span>
                      <span className="text-sm text-gray-500">({gig.reviews})</span>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
