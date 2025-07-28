"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { BUCKETS, UploadResult } from "@/lib/upload"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

const categories = [
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

export default function CreateGigPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    delivery_time: "",
    tags: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (files: File[]): Promise<UploadResult[]> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('bucket', BUCKETS.GIG_IMAGES)
    formData.append('path', 'gigs')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Upload failed')
      }

      // Update uploaded images state
      const newImageUrls = result.data.map((item: any) => item.url)
      setUploadedImages(prev => [...prev, ...newImageUrls])

      return result.data.map((item: any) => ({
        url: item.url,
        path: item.path
      }))
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.category || !formData.price) {
        alert("Please fill in all required fields")
      return
    }

      // Prepare gig data
      const gigData = {
        ...formData,
        price: parseFloat(formData.price),
        delivery_time: parseInt(formData.delivery_time),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: uploadedImages,
        is_active: true
      }

      // TODO: Replace with actual API call to create gig
      console.log('Creating gig:', gigData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Gig created successfully!")
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating gig:', error)
      alert("Failed to create gig. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create a New Gig</h1>
          <p className="text-gray-600 mt-2">Showcase your skills and attract clients with a compelling gig listing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
        <Card>
          <CardHeader>
              <CardTitle>Basic Information</CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Gig Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Professional House Cleaning Service"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your service in detail..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    placeholder="e.g., Deep Cleaning, Regular Cleaning"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="50.00"
                      required
                    />
                </div>

                <div>
                  <Label htmlFor="delivery_time">Delivery Time (days) *</Label>
                  <Input
                    id="delivery_time"
                    type="number"
                    min="1"
                    value={formData.delivery_time}
                    onChange={(e) => handleInputChange('delivery_time', e.target.value)}
                    placeholder="3"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="cleaning, eco-friendly, deep-clean (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add relevant tags to help clients find your gig
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gig Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={handleImageUpload}
                maxFiles={5}
                maxSize={5 * 1024 * 1024} // 5MB
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                acceptedFileTypes="image/*"
                uploadText="Upload Images"
                dragText="Drag & drop gig images here, or click to select"
              />
              
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Images ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Gig image ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                  </div>
                )}
            </CardContent>
          </Card>

              {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Gig
                </>
              )}
            </Button>
              </div>
            </form>
      </div>
    </div>
  )
}
