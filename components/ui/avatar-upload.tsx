"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, X, Upload } from 'lucide-react'
import { Button } from './button'
import { uploadFile, BUCKETS, validateFile } from '@/lib/upload'

interface AvatarUploadProps {
  currentAvatar?: string
  onUpload: (url: string) => void
  onRemove?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function AvatarUpload({
  currentAvatar,
  onUpload,
  onRemove,
  size = 'md',
  className = '',
  disabled = false
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Validate file
    const validation = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB for avatars
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    })

    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    setIsUploading(true)

    try {
      const userId = 'temp' // Replace with actual user ID
      const timestamp = Date.now()
      const fileName = `${userId}-${timestamp}-${file.name}`
      const path = `avatars/${fileName}`

      const result = await uploadFile(file, BUCKETS.PROFILE_AVATARS, path)

      if (result.error) {
        throw new Error(result.error)
      }

      onUpload(result.url)
      
      // Clean up preview
      URL.revokeObjectURL(previewUrl)
      setPreview(null)
    } catch (error) {
      console.error('Avatar upload failed:', error)
      alert('Failed to upload avatar. Please try again.')
      
      // Clean up preview on error
      if (preview) {
        URL.revokeObjectURL(preview)
        setPreview(null)
      }
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    disabled: disabled || isUploading
  })

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    onRemove?.()
  }

  const displayImage = preview || currentAvatar

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div
        {...getRootProps()}
        className={`
          ${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer
          border-2 border-dashed transition-all duration-200
          ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${displayImage ? 'border-solid' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
        )}

        {/* Upload Overlay */}
        {!disabled && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <Upload className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {displayImage && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isUploading}
          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Upload Text */}
      {!displayImage && !disabled && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Click to upload avatar
        </p>
      )}
    </div>
  )
} 