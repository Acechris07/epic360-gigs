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
import { FileUpload } from '@/components/ui/file-upload';
import { BUCKETS, UploadResult } from '@/lib/upload';
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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

  const handleImageUpload = async (files: File[]): Promise<UploadResult[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('bucket', BUCKETS.SERVICE_IMAGES);
    formData.append('path', 'services');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Upload failed');
      }

      // Update uploaded images state
      const newImageUrls = result.data.map((item: any) => item.url);
      setUploadedImages(prev => [...prev, ...newImageUrls]);

      return result.data.map((item: any) => ({
        url: item.url,
        path: item.path,
      }));
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
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
      // Create the service with uploaded image URLs
      const { error } = await supabase.from('services').insert({
        provider_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        price: Number.parseFloat(formData.price),
        delivery_time: Number.parseInt(formData.delivery_time),
        tags: formData.tags,
        images: uploadedImages,
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
      console.error('Error creating service:', error);
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
            Create a New Service
          </h1>
          <p className="text-lg text-gray-600">
            Showcase your skills and attract clients with a compelling service
            listing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Fill in the details below to create your service listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Professional House Cleaning Service"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Describe your service in detail..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={e =>
                        handleInputChange('subcategory', e.target.value)
                      }
                      placeholder="e.g., Deep Cleaning, Regular Cleaning"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Delivery */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={e =>
                          handleInputChange('price', e.target.value)
                        }
                        placeholder="50.00"
                        className="pl-10"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="delivery_time">
                      Delivery Time (days) *
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="delivery_time"
                        type="number"
                        value={formData.delivery_time}
                        onChange={e =>
                          handleInputChange('delivery_time', e.target.value)
                        }
                        placeholder="3"
                        className="pl-10"
                        min="1"
                        required
                      />
                    </div>
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
                <FileUpload
                  onUpload={handleImageUpload}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  acceptedFileTypes="image/*"
                  uploadText="Upload Images"
                  dragText="Drag & drop service images here, or click to select"
                />

                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Uploaded Images ({uploadedImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Service image ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
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
