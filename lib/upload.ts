import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface FileValidation {
  isValid: boolean
  error?: string
}

// File type validation
export const validateFile = (file: File, options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  maxFiles?: number
} = {}): FileValidation => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFiles = 10
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { isValid: true }
}

// Upload single file
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string,
  options: {
    upsert?: boolean
    cacheControl?: string
  } = {}
): Promise<UploadResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options.upsert || false,
        cacheControl: options.cacheControl || '3600'
      })

    if (error) {
      return {
        url: '',
        path: '',
        error: error.message
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  bucket: string,
  basePath: string,
  options: {
    upsert?: boolean
    cacheControl?: string
  } = {}
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now()
    const fileName = `${timestamp}-${index}-${file.name}`
    const path = `${basePath}/${fileName}`
    
    return uploadFile(file, bucket, path, options)
  })

  return Promise.all(uploadPromises)
}

// Delete file
export const deleteFile = async (bucket: string, path: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    return { error: error?.message }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Delete failed' }
  }
}

// Generate optimized image URL
export const getOptimizedImageUrl = (url: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}) => {
  if (!url) return url

  const { width, height, quality = 80, format = 'webp' } = options
  const params = new URLSearchParams()

  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  params.append('quality', quality.toString())
  params.append('format', format)

  return `${url}?${params.toString()}`
}

// Create thumbnail URL
export const getThumbnailUrl = (url: string, size: number = 300) => {
  return getOptimizedImageUrl(url, { width: size, height: size, quality: 70 })
}

// Bucket configurations
export const BUCKETS = {
  GIG_IMAGES: 'gig-images',
  SERVICE_IMAGES: 'service-images',
  PROFILE_AVATARS: 'profile-avatars',
  PORTFOLIO: 'portfolio',
  MESSAGE_ATTACHMENTS: 'message-attachments',
  DOCUMENTS: 'documents'
} as const

// Initialize buckets (run this once)
export const initializeBuckets = async () => {
  const buckets = Object.values(BUCKETS)
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.getBucket(bucket)
      
      if (error && error.message.includes('not found')) {
        // Create bucket if it doesn't exist
        await supabase.storage.createBucket(bucket, {
          public: true,
          allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
          fileSizeLimit: 5242880 // 5MB
        })
      }
    } catch (error) {
      console.error(`Failed to initialize bucket ${bucket}:`, error)
    }
  }
} 