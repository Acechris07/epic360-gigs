import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const buckets = [
      {
        name: 'gig-images',
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      },
      {
        name: 'service-images', 
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880
      },
      {
        name: 'profile-avatars',
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 2097152 // 2MB
      },
      {
        name: 'portfolio',
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        name: 'message-attachments',
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 5242880
      },
      {
        name: 'documents',
        public: false,
        allowedMimeTypes: ['application/pdf', 'text/*'],
        fileSizeLimit: 10485760
      }
    ]

    const results: any = {}

    for (const bucketConfig of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBucket, error: checkError } = await supabase.storage.getBucket(bucketConfig.name)
        
        if (checkError && checkError.message.includes('not found')) {
          // Create bucket
          const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
            public: bucketConfig.public,
            allowedMimeTypes: bucketConfig.allowedMimeTypes,
            fileSizeLimit: bucketConfig.fileSizeLimit
          })
          
          results[bucketConfig.name] = {
            created: !error,
            error: error?.message || null
          }
        } else {
          results[bucketConfig.name] = {
            exists: true,
            error: null
          }
        }
      } catch (err) {
        results[bucketConfig.name] = {
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Storage setup complete',
      results,
      summary: {
        total_buckets: buckets.length,
        created_buckets: Object.values(results).filter((r: any) => r.created).length,
        existing_buckets: Object.values(results).filter((r: any) => r.exists).length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 