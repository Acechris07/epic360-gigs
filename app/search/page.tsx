"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, SlidersHorizontal, Star, MapPin, Clock, Briefcase } from "lucide-react"
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
]

const categories = [
  { name: "All Categories", value: "all" },
  { name: "Household Service Gigs", value: "Household Service Gigs" },
  { name: "IT Gigs", value: "IT Gigs" },
  { name: "Cleaning Gigs", value: "Cleaning Gigs" },
  { name: "Party Planning Gigs", value: "Party Planning Gigs" },
  { name: "Cooking Gigs", value: "Cooking Gigs" },
  { name: "Decor Gigs", value: "Decor Gigs" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const q = searchParams.get("q")
    const category = searchParams.get("category")
    if (q) setSearchTerm(q)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  const filteredGigs = mockGigs.filter((gig) => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || gig.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Search Results</h1>
            <p className="text-xl text-green-100 mb-8">Find the perfect gig or service</p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for gigs and services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              {filteredGigs.length} results found
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredGigs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all available gigs.</p>
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
                  <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{gig.rating}</span>
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