// Error handling utility for consistent error messages and logging

export const ErrorTypes = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred') => {
  if (!error) return fallbackMessage;

  // Handle Supabase errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    // Authentication errors
    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return 'Invalid email or password. Please try again.';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and confirm your account before signing in.';
    }
    
    if (message.includes('user not found')) {
      return 'No account found with this email address.';
    }
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Database errors
    if (message.includes('duplicate key') || message.includes('unique constraint')) {
      return 'This record already exists.';
    }
    
    if (message.includes('foreign key') || message.includes('referenced')) {
      return 'This operation cannot be completed due to related data.';
    }
    
    // File upload errors
    if (message.includes('file') || message.includes('upload')) {
      return 'File upload failed. Please try again with a different file.';
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('access denied')) {
      return 'You do not have permission to perform this action.';
    }
    
    // Return the original message if no specific pattern matches
    return error.message;
  }
  
  // Handle error objects with different structures
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.error_description) {
    return error.error_description;
  }
  
  if (error.details) {
    return error.details;
  }
  
  return fallbackMessage;
};

export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;
  
  const message = (error.message || '').toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
    return ErrorTypes.NETWORK;
  }
  
  if (message.includes('invalid login') || message.includes('email not confirmed') || message.includes('user not found')) {
    return ErrorTypes.AUTHENTICATION;
  }
  
  if (message.includes('permission') || message.includes('access denied') || message.includes('forbidden')) {
    return ErrorTypes.AUTHORIZATION;
  }
  
  if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
    return ErrorTypes.VALIDATION;
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return ErrorTypes.NOT_FOUND;
  }
  
  if (message.includes('server') || message.includes('500') || message.includes('internal')) {
    return ErrorTypes.SERVER;
  }
  
  return ErrorTypes.UNKNOWN;
};

export const logError = (error, context = '') => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    type: getErrorType(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error logged:', errorInfo);
    console.error('Original error:', error);
  }
  
  // In production, you might want to send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
  
  return errorInfo;
};

export const handleAsyncError = async (asyncFunction, errorContext = '') => {
  try {
    return await asyncFunction();
  } catch (error) {
    logError(error, errorContext);
    throw error;
  }
};

export const createErrorHandler = (context) => {
  return (error) => {
    logError(error, context);
    return getErrorMessage(error);
  };
};