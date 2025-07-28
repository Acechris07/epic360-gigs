import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Services - Epic360 Gigs",
  description: "Browse and discover professional services from skilled freelancers worldwide.",
}

// Sample services data - in a real app, this would come from the database
const sampleServices = [
  {
    id: "1",
    title: "Professional Web Development",
    description: "Custom websites and web applications built with modern technologies.",
    provider: "John Developer",
    price: 500,
    deliveryTime: 7,
    rating: 4.8,
    reviews: 24,
    category: "IT",
    tags: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "2",
    title: "Logo Design & Branding",
    description: "Creative logo design and complete branding solutions for your business.",
    provider: "Sarah Designer",
    price: 200,
    deliveryTime: 3,
    rating: 4.9,
    reviews: 156,
    category: "Design",
    tags: ["Logo", "Branding", "Illustration"],
  },
  {
    id: "3",
    title: "Content Writing & SEO",
    description: "High-quality content writing with SEO optimization for better rankings.",
    provider: "Mike Writer",
    price: 150,
    deliveryTime: 5,
    rating: 4.7,
    reviews: 89,
    category: "Marketing",
    tags: ["Content", "SEO", "Blog"],
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Services
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover skilled professionals offering high-quality services for your projects.
          From web development to creative design, find exactly what you need.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">All Categories</option>
            <option value="it">IT & Technology</option>
            <option value="design">Design & Creative</option>
            <option value="marketing">Marketing</option>
            <option value="writing">Writing & Translation</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">Sort by</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-xs">
                  {service.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {service.rating} ({service.reviews})
                </div>
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription className="text-sm">
                by {service.provider}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.deliveryTime} days
                </div>
                <div className="flex items-center font-semibold text-green-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${service.price}
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/services/${service.id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Can't find what you're looking for?
        </h2>
        <p className="text-gray-600 mb-6">
          Post a request and let freelancers come to you with custom offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/browse">
              Browse All Services
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/create-service">
              Offer a Service
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 