import { Redis } from '@upstash/redis'

// In-memory store for development when Redis is not available
const memoryStore = new Map<string, { count: number; resetTime: number }>()

// Initialize Redis only if environment variables are available and valid
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && 
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      !process.env.UPSTASH_REDIS_REST_URL.includes('placeholder')) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.warn('Failed to initialize Redis, falling back to in-memory storage:', error)
  redis = null
}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: any) => string // Custom key generator
}

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: any, res: any, next: any) => {
    try {
      const key = config.keyGenerator 
        ? config.keyGenerator(req) 
        : `rate_limit:${req.ip || 'unknown'}`

      if (redis) {
        // Use Redis for production
        const current = await redis.get(key)
        const requests = current ? parseInt(current as string) : 0

        if (requests >= config.maxRequests) {
          return res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.ceil(config.windowMs / 1000),
          })
        }

        // Increment request count
        await redis.setex(key, Math.ceil(config.windowMs / 1000), requests + 1)

        // Add headers
        res.setHeader('X-RateLimit-Limit', config.maxRequests)
        res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - requests - 1))
        res.setHeader('X-RateLimit-Reset', Date.now() + config.windowMs)
      } else {
        // Use in-memory store for development
        const now = Date.now()
        const record = memoryStore.get(key)
        
        if (record && now < record.resetTime) {
          if (record.count >= config.maxRequests) {
            return res.status(429).json({
              error: 'Too many requests',
              retryAfter: Math.ceil((record.resetTime - now) / 1000),
            })
          }
          record.count++
        } else {
          memoryStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
          })
        }

        // Clean up old entries periodically
        if (Math.random() < 0.01) { // 1% chance to clean up
          for (const [k, v] of memoryStore.entries()) {
            if (now > v.resetTime) {
              memoryStore.delete(k)
            }
          }
        }
      }

      next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      // If rate limiting fails, allow the request to proceed
      next()
    }
  }
}

// Predefined rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => `auth:${req.ip || 'unknown'}`,
})

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => `api:${req.ip || 'unknown'}`,
})

export const searchRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
  keyGenerator: (req) => `search:${req.ip || 'unknown'}`,
})

// Simple rate limiter for Next.js API routes
export const checkRateLimit = async (key: string, maxRequests: number, windowMs: number) => {
  if (redis) {
    // Use Redis for production
    const current = await redis.get(key)
    const requests = current ? parseInt(current as string) : 0

    if (requests >= maxRequests) {
      throw new Error("Rate limit exceeded")
    }

    // Increment request count
    await redis.setex(key, Math.ceil(windowMs / 1000), requests + 1)
  } else {
    // Use in-memory store for development
    const now = Date.now()
    const record = memoryStore.get(key)
    
    if (record && now < record.resetTime) {
      if (record.count >= maxRequests) {
        throw new Error("Rate limit exceeded")
      }
      record.count++
    } else {
      memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
    }
  }
}
