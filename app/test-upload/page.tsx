'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { BUCKETS, UploadResult } from '@/lib/upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function TestUploadPage() {
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const handleImageUpload = async (files: File[]): Promise<UploadResult[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('bucket', BUCKETS.SERVICE_IMAGES);
    formData.append('path', 'test');

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

      toast({
        title: 'Upload successful!',
        description: `${files.length} image(s) uploaded successfully.`,
      });

      return result.data.map((item: any) => ({
        url: item.url,
        path: item.path,
      }));
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const testUploadAPI = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: new FormData(), // Empty form data to test endpoint
      });

      const result = await response.json();

      toast({
        title: 'API Test Result',
        description: `Status: ${response.status}, Response: ${JSON.stringify(result)}`,
      });
    } catch (error) {
      toast({
        title: 'API Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const clearImages = () => {
    setUploadedImages([]);
    toast({
      title: 'Images cleared',
      description: 'Uploaded images have been cleared.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Image Upload
          </h1>
          <p className="text-lg text-gray-600">
            Test the image upload functionality for services and gigs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Test */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                onUpload={handleImageUpload}
                maxFiles={3}
                maxSize={5 * 1024 * 1024} // 5MB
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                acceptedFileTypes="image/*"
                uploadText="Upload Test Images"
                dragText="Drag & drop test images here, or click to select"
              />

              <div className="flex gap-2">
                <Button onClick={testUploadAPI} disabled={isTesting}>
                  {isTesting ? 'Testing...' : 'Test Upload API'}
                </Button>
                <Button onClick={clearImages} variant="outline">
                  Clear Images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Results</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedImages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No images uploaded yet. Try uploading some images above.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      Uploaded Images ({uploadedImages.length})
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Test image ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>
                      <strong>Note:</strong> These are test uploads to the
                      'service-images' bucket.
                    </p>
                    <p>
                      Check your Supabase dashboard to see the uploaded files.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Set Up Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Prerequisites:</h4>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>
                  Run the storage bucket initialization script in your Supabase
                  SQL Editor
                </li>
                <li>
                  Create the required storage buckets in your Supabase dashboard
                </li>
                <li>Ensure your Supabase project has storage enabled</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                Troubleshooting:
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Check browser console for any JavaScript errors</li>
                <li>Verify that the upload API endpoint is accessible</li>
                <li>
                  Ensure your Supabase storage buckets are properly configured
                </li>
                <li>Check that RLS policies allow file uploads</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
