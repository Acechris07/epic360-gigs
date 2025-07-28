export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: any) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    }
  }

  // Handle Supabase errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return {
          message: 'Resource not found',
          statusCode: 404,
          isOperational: true,
        }
      case '23505': // Unique violation
        return {
          message: 'Resource already exists',
          statusCode: 409,
          isOperational: true,
        }
      case '23503': // Foreign key violation
        return {
          message: 'Invalid reference',
          statusCode: 400,
          isOperational: true,
        }
      default:
        return {
          message: 'Database error occurred',
          statusCode: 500,
          isOperational: true,
        }
    }
  }

  // Handle network errors
  if (error?.message?.includes('fetch')) {
    return {
      message: 'Network error occurred',
      statusCode: 503,
      isOperational: true,
    }
  }

  // Default error
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    isOperational: false,
  }
}

export const logError = (error: any, context?: string) => {
  const errorInfo = handleError(error)
  
  console.error(`[${new Date().toISOString()}] ${context || 'Application Error'}:`, {
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    originalError: error.message,
    stack: error.stack,
  })

  // In production, you might want to send this to a logging service
  // like Sentry, LogRocket, or similar
}

export const createErrorResponse = (error: any) => {
  const errorInfo = handleError(error)
  
  return {
    success: false,
    error: {
      message: errorInfo.message,
      statusCode: errorInfo.statusCode,
    },
  }
} 