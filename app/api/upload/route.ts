import { NextRequest, NextResponse } from 'next/server'
import { uploadMultipleFiles, BUCKETS, validateFile } from '@/lib/upload'
import { createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const bucket = formData.get('bucket') as string
    const path = formData.get('path') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        createErrorResponse(new Error('No files provided')),
        { status: 400 }
      )
    }

    if (!bucket || !path) {
      return NextResponse.json(
        createErrorResponse(new Error('Bucket and path are required')),
        { status: 400 }
      )
    }

    // Validate bucket
    const validBuckets = Object.values(BUCKETS)
    if (!validBuckets.includes(bucket as any)) {
      return NextResponse.json(
        createErrorResponse(new Error('Invalid bucket specified')),
        { status: 400 }
      )
    }

    // Validate files
    const validationErrors: string[] = []
    files.forEach((file, index) => {
      const validation = validateFile(file)
      if (!validation.isValid) {
        validationErrors.push(`File ${index + 1}: ${validation.error}`)
      }
    })

    if (validationErrors.length > 0) {
      return NextResponse.json(
        createErrorResponse(new Error(`File validation failed: ${validationErrors.join(', ')}`)),
        { status: 400 }
      )
    }

    // Upload files
    const results = await uploadMultipleFiles(files, bucket, path)

    // Check for upload errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      return NextResponse.json(
        createErrorResponse(new Error(`Some files failed to upload: ${errors.map(e => e.error).join(', ')}`)),
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: results.map(result => ({
        url: result.url,
        path: result.path
      }))
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      createErrorResponse(error),
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket')
    const path = searchParams.get('path')

    if (!bucket || !path) {
      return NextResponse.json(
        createErrorResponse(new Error('Bucket and path are required')),
        { status: 400 }
      )
    }

    // Import deleteFile function
    const { deleteFile } = await import('@/lib/upload')
    const result = await deleteFile(bucket, path)

    if (result.error) {
      return NextResponse.json(
        createErrorResponse(new Error(result.error)),
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      createErrorResponse(error),
      { status: 500 }
    )
  }
} 