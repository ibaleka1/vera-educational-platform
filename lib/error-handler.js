export default class ErrorHandler {
  static async handle(error, context = {}) {
    // Log the technical error for developers
    console.error('VERA System Error:', {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString()
    });

    // Return VERA-style user-facing message
    const userMessage = this.getVERAErrorMessage(error, context);
    
    return {
      message: userMessage,
      status: this.getStatusCode(error),
      timestamp: new Date().toISOString()
    };
  }

  static getVERAErrorMessage(error, context) {
    // Crisis/emergency situations
    if (context.isCrisis) {
      return "I'm still here with you, even with technical difficulties. If you're in immediate danger, please call 988 or 911. Your safety matters more than any app.";
    }

    // Chat/API errors
    if (context.type === 'chat' || error.message.includes('API')) {
      return "I'm having trouble connecting right now, but I'm still here with you. Your nervous system is brilliant even when technology isn't. Try again in a moment.";
    }

    // Rate limiting
    if (error.message.includes('rate limit') || context.type === 'rate_limit') {
      return "Your nervous system needs a moment to process. That's wisdom, not limitation. Try again in a few moments.";
    }

    // Network/connection errors  
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return "Connection interrupted - just like nervous system regulation isn't always linear. I'll be here when you're ready to try again.";
    }

    // Validation errors
    if (error.message.includes('validation') || context.type === 'validation') {
      return "Something in your message needs adjusting. Your nervous system knows what it needs - try rephrasing.";
    }

    // Default VERA-style error
    return "Something shifted unexpectedly. Your nervous system handles disruption all the time - this is just technology catching up. Try again.";
  }

  static getStatusCode(error) {
    if (error.status) return error.status;
    if (error.message.includes('rate limit')) return 429;
    if (error.message.includes('validation')) return 400;
    if (error.message.includes('auth')) return 401;
    if (error.message.includes('network')) return 503;
    return 500;
  }

  // Specific error types for VERA
  static crisisError() {
    return this.handle(new Error('Crisis support needed'), { 
      isCrisis: true, 
      type: 'crisis' 
    });
  }

  static rateLimitError(retryAfter = 60) {
    const error = new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    error.status = 429;
    return this.handle(error, { 
      type: 'rate_limit', 
      retryAfter 
    });
  }

  static chatError(originalError) {
    return this.handle(originalError, { 
      type: 'chat' 
    });
  }

  static validationError(field) {
    const error = new Error(`Validation failed for ${field}`);
    error.status = 400;
    return this.handle(error, { 
      type: 'validation', 
      field 
    });
  }
}