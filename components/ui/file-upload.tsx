"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Image, File, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'
import { validateFile, UploadResult } from '@/lib/upload'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<UploadResult[]>
  onRemove?: (index: number) => void
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  acceptedFileTypes?: string
  className?: string
  disabled?: boolean
  showPreview?: boolean
  uploadText?: string
  dragText?: string
}

interface FileWithPreview extends File {
  preview?: string
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error'
  uploadProgress?: number
  uploadResult?: UploadResult
}

export function FileUpload({
  onUpload,
  onRemove,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  acceptedFileTypes = 'image/*',
  className = '',
  disabled = false,
  showPreview = true,
  uploadText = 'Upload Files',
  dragText = 'Drag & drop files here, or click to select'
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithPreview[] = acceptedFiles.map(file => {
      // Validate file
      const validation = validateFile(file, { maxSize, allowedTypes })
      if (!validation.isValid) {
        console.error(`File validation failed: ${validation.error}`)
        return Object.assign(file, {
          preview: undefined,
          uploadStatus: 'error' as const,
          uploadResult: { url: '', path: '', error: validation.error }
        })
      }

      // Create preview for images
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

      return Object.assign(file, {
        preview,
        uploadStatus: 'pending' as const
      })
    })

    setFiles(prev => {
      const combined = [...prev, ...newFiles]
      return combined.slice(0, maxFiles)
    })
  }, [maxFiles, maxSize, allowedTypes])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [acceptedFileTypes]: allowedTypes
    },
    maxFiles,
    maxSize,
    disabled: disabled || isUploading
  })

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return

    setIsUploading(true)
    
    try {
      const results = await onUpload(files)
      
      setFiles(prev => prev.map((file, index) => ({
        ...file,
        uploadStatus: results[index]?.error ? 'error' : 'success',
        uploadProgress: 100,
        uploadResult: results[index]
      })))
    } catch (error) {
      console.error('Upload failed:', error)
      setFiles(prev => prev.map(file => ({
        ...file,
        uploadStatus: 'error',
        uploadResult: { url: '', path: '', error: 'Upload failed' }
      })))
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index)
      // Revoke object URL to prevent memory leaks
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview!)
      }
      return newFiles
    })
    onRemove?.(index)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">{dragText}</p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Selected Files ({files.length}/{maxFiles})</h4>
            <Button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
              size="sm"
            >
              {isUploading ? 'Uploading...' : uploadText}
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {showPreview && file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                        <Image className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.uploadStatus || 'pending')}
                    {file.uploadStatus === 'uploading' && file.uploadProgress !== undefined && (
                      <Progress value={file.uploadProgress} className="w-16" />
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Error Messages */}
          {files.some(f => f.uploadStatus === 'error') && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Some files failed to upload. Please check the file types and sizes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 