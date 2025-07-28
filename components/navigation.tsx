"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { MessageNotification } from "@/components/message-notification"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { user, signOut } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">Epic360</span>
            <span className="text-gray-600 ml-1">Gigs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-600 hover:text-green-600 transition-colors">
              Browse Services
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-green-600 transition-colors">
              Categories
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-green-600 transition-colors">
              Services
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-green-600 transition-colors">
              Search
            </Link>
            {user && (
              <>
                <Link href="/orders" className="text-gray-600 hover:text-green-600 transition-colors">
                  My Orders
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-green-600 transition-colors">
                  Messages
                </Link>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search gigs and services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 focus:ring-2 focus:ring-green-500"
              />
            </form>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && <MessageNotification />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.email?.split('@')[0] || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create-gig">Create Gig</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create-service">Create Service</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search gigs and services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full focus:ring-2 focus:ring-green-500"
                />
              </form>
              
              <div className="space-y-2">
                <Link 
                  href="/browse" 
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Services
                </Link>
                <Link 
                  href="/categories" 
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link 
                  href="/services" 
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  href="/search" 
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Search
                </Link>
                {user && (
                  <>
                    <Link 
                      href="/orders" 
                      className="block text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="block text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/create-gig" 
                      className="block text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Gig
                    </Link>
                    <Link 
                      href="/create-service" 
                      className="block text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Service
                    </Link>
                  </>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                {user ? (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700" 
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 