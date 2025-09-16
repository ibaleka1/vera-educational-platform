export default class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 10;
    this.requests = new Map();
  }

  async check(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const timestamps = this.requests.get(identifier).filter(t => t > windowStart);
    
    if (timestamps.length >= this.maxRequests) {
      return { 
        allowed: false, 
        remaining: 0, 
        retryAfter: Math.ceil((timestamps[0] + this.windowMs - now) / 1000) 
      };
    }
    
    timestamps.push(now);
    this.requests.set(identifier, timestamps);
    
    return { 
      allowed: true, 
      remaining: this.maxRequests - timestamps.length, 
      retryAfter: 0 
    };
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [identifier, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(t => t > windowStart);
      if (validTimestamps.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimestamps);
      }
    }
  }
}