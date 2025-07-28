import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Shield,
  Zap,
  Home,
  PartyPopper,
  Wrench,
  Car,
  Droplets,
  HardHat,
  BellElectricIcon as ElectricIcon,
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

export default function HomePage() {
  const categories = [
    { name: "Household Service Gigs", icon: Home },
    { name: "Party Planning Gigs", icon: PartyPopper },
    { name: "Household Repair Gigs", icon: Wrench },
    { name: "Automobile Repair Gigs", icon: Car },
    { name: "Plumbing Gigs", icon: Droplets },
    { name: "Construction Gigs", icon: HardHat },
    { name: "Electricity Repair Gigs", icon: ElectricIcon },
    { name: "IT Gigs", icon: Monitor },
    { name: "Social Media Gigs", icon: Users },
    { name: "Teaching Gigs", icon: GraduationCap },
    { name: "Saloon Gigs", icon: Scissors },
    { name: "Tailoring Gigs", icon: Shirt },
    { name: "Transportation Gigs", icon: Truck },
    { name: "Driving Gigs", icon: Navigation },
    { name: "Cleaning Gigs", icon: Sparkles },
    { name: "Landscaping Gigs", icon: Trees },
    { name: "DJ Gigs", icon: Music },
    { name: "Photography Gigs", icon: Camera },
    { name: "Cooking Gigs", icon: ChefHat },
    { name: "Decor Gigs", icon: Palette },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find the Perfect Freelancer for Your Project</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect with skilled professionals worldwide. Get your projects done faster, better, and more affordably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Browse Services
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white hover:text-green-700"
              >
                Browse Gigs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Epic360 Gigs?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to connect, collaborate, and get work done.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Easy Discovery</h3>
                <p className="text-gray-600">
                  Find the right freelancer for your project with our advanced search and filtering system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
                <p className="text-gray-600">
                  Your payments are protected with our secure escrow system until work is completed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your projects completed quickly with our network of professional freelancers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular Categories</h2>
            <p className="text-xl text-green-100">Explore services in these trending categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.name}
                  href={`/search?category=${encodeURIComponent(category.name)}`}
                >
                  <Card className="bg-white/95 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border-0">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients who trust Epic360 Gigs for their projects.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Join Epic360 Gigs Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
