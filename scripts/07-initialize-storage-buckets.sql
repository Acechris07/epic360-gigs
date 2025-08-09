-- Initialize Supabase Storage Buckets for file uploads
-- Run this script in your Supabase SQL Editor

-- Create storage buckets if they don't exist
-- Note: Storage buckets are created through the Supabase dashboard or API
-- This script provides the bucket names and configurations

-- The following buckets should be created in your Supabase dashboard:

-- 1. gig-images (for gig images)
-- - Public bucket
-- - File size limit: 5MB
-- - Allowed MIME types: image/*

-- 2. service-images (for service images)  
-- - Public bucket
-- - File size limit: 5MB
-- - Allowed MIME types: image/*

-- 3. profile-avatars (for user profile pictures)
-- - Public bucket
-- - File size limit: 2MB
-- - Allowed MIME types: image/*

-- 4. portfolio (for portfolio items)
-- - Public bucket
-- - File size limit: 10MB
-- - Allowed MIME types: image/*, application/pdf

-- 5. message-attachments (for message files)
-- - Public bucket
-- - File size limit: 5MB
-- - Allowed MIME types: image/*, application/pdf, text/*

-- 6. documents (for general documents)
-- - Public bucket
-- - File size limit: 10MB
-- - Allowed MIME types: application/pdf, text/*, image/*

-- Storage Policies (RLS for storage)
-- These policies control who can upload, view, and delete files

-- Allow anyone to view public files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('gig-images', 'service-images', 'profile-avatars', 'portfolio', 'message-attachments', 'documents'));

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('gig-images', 'service-images', 'profile-avatars', 'portfolio', 'message-attachments', 'documents')
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (
  auth.uid()::text = (storage.foldername(name))[1] AND
  bucket_id IN ('gig-images', 'service-images', 'profile-avatars', 'portfolio', 'message-attachments', 'documents')
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (
  auth.uid()::text = (storage.foldername(name))[1] AND
  bucket_id IN ('gig-images', 'service-images', 'profile-avatars', 'portfolio', 'message-attachments', 'documents')
);

-- Note: You'll need to create the actual storage buckets through the Supabase dashboard
-- Go to Storage > Create a new bucket for each of the above bucket names
-- Set them as public buckets with appropriate file size limits and MIME type restrictions 