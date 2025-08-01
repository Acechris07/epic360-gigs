'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Upload, X, Plus, DollarSign, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Household Service Gigs',
  'Party Planning Gigs',
  'Household Repair Gigs',
  'Automobile Repair Gigs',
  'Plumbing Gigs',
  'Construction Gigs',
  'Electricity Repair Gigs',
  'IT Gigs',
  'Social Media Gigs',
  'Teaching Gigs',
  'Saloon Gigs',
  'Tailoring Gigs',
  'Transportation Gigs',
  'Driving Gigs',
  'Cleaning Gigs',
  'Landscaping Gigs',
  'DJ Gigs',
  'Photography Gigs',
  'Cooking Gigs',
  'Decor Gigs',
];

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    delivery_time: '',
    tags: [] as string[],
    images: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can upload a maximum of 5 images.',
        variant: 'destructive',
      });
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Store form data in localStorage and redirect to signup
      localStorage.setItem('pendingService', JSON.stringify(formData));
      toast({
        title: 'Sign up required',
        description: 'Please sign up to create your service listing.',
      });
      router.push('/auth/signup');
      return;
    }

    setLoading(true);

    try {
      // Upload images first (in a real app, you'd upload to a storage service)
      const imageUrls: string[] = [];

      // For demo purposes, we'll use placeholder URLs
      for (let i = 0; i < imageFiles.length; i++) {
        imageUrls.push(
          `/placeholder.svg?height=300&width=400&text=Service+Image+${i + 1}`
        );
      }

      // Create the service
      const { error } = await supabase.from('services').insert({
        provider_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        price: Number.parseFloat(formData.price),
        delivery_time: Number.parseInt(formData.delivery_time),
        tags: formData.tags,
        images: imageUrls,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: 'Service created successfully!',
        description:
          'Your service is now live and available for clients to book.',
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error creating service',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Your Service
          </h1>
          <p className="text-lg text-gray-600">
            Showcase your skills and start earning by offering your services to
            clients worldwide
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Fill in the details about the service you want to offer. Be
              specific and highlight what makes your service unique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Professional House Cleaning Service"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Create a clear, descriptive title that explains what you offer
                </p>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      handleInputChange('category', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                  <Input
                    id="subcategory"
                    placeholder="e.g., Deep Cleaning, Regular Maintenance"
                    value={formData.subcategory}
                    onChange={e =>
                      handleInputChange('subcategory', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What's included? What makes it special? What can clients expect?"
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={5}
                  required
                />
                <p className="text-sm text-gray-500">
                  Minimum 100 characters. Be detailed about what you offer and
                  what's included.
                </p>
              </div>

              {/* Pricing and Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="50"
                      value={formData.price}
                      onChange={e => handleInputChange('price', e.target.value)}
                      className="pl-10"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_time">Delivery Time (Days) *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="delivery_time"
                      type="number"
                      placeholder="3"
                      value={formData.delivery_time}
                      onChange={e =>
                        handleInputChange('delivery_time', e.target.value)
                      }
                      className="pl-10"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Service Tags</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="tags"
                      placeholder="Add a tag (e.g., eco-friendly, fast, professional)"
                      value={currentTag}
                      onChange={e => setCurrentTag(e.target.value)}
                      className="pl-10"
                      onKeyPress={e =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Add relevant tags to help clients find your service
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Service Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Upload images that showcase your service
                    </p>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                    >
                      Choose Images
                    </Button>
                    <p className="text-xs text-gray-500">
                      Maximum 5 images, up to 10MB each
                    </p>
                  </div>
                </div>

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file) || '/placeholder.svg'}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    loading ||
                    !formData.title ||
                    !formData.description ||
                    !formData.category ||
                    !formData.price ||
                    !formData.delivery_time
                  }
                >
                  {loading
                    ? 'Creating Service...'
                    : user
                      ? 'Create Service'
                      : 'Sign Up & Create Service'}
                </Button>
                <Link href="/browse">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>

              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You'll need to create an account to
                    publish your service. Your service details will be saved
                    during the signup process.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
