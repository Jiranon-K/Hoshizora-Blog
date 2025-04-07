// lib/error-handler.js


export const ErrorTypes = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    INTERNAL_SERVER: 'INTERNAL_SERVER',
    VALIDATION: 'VALIDATION',
    DATABASE: 'DATABASE'
  };
  
  
  export class AppError extends Error {
    constructor(type, message, details = null, originalError = null) {
      super(message);
      this.type = type;
      this.details = details;
      this.originalError = originalError;
      this.name = 'AppError';
    }
  
    
    toResponse() {
      let status = 500;
      
      switch (this.type) {
        case ErrorTypes.UNAUTHORIZED:
          status = 401;
          break;
        case ErrorTypes.FORBIDDEN:
          status = 403;
          break;
        case ErrorTypes.NOT_FOUND:
          status = 404;
          break;
        case ErrorTypes.BAD_REQUEST:
        case ErrorTypes.VALIDATION:
          status = 400;
          break;
        case ErrorTypes.DATABASE:
        case ErrorTypes.INTERNAL_SERVER:
        default:
          status = 500;
          break;
      }
  
      return {
        error: {
          type: this.type,
          message: this.message,
          details: this.details,
        },
        status
      };
    }
  }
  
  
  export function handleApiError(error) {
    console.error('API Error:', error);
    
    
    if (error instanceof AppError) {
      const { error: errorObj, status } = error.toResponse();
      return { errorObj, status };
    }
    
    
    if (error.code === 'ER_DUP_ENTRY') {
      return new AppError(
        ErrorTypes.VALIDATION,
        'ข้อมูลซ้ำกับที่มีอยู่ในระบบ',
        { field: 'unknown' },
        error
      ).toResponse();
    }
    
    if (error.code === 'ER_ROW_IS_REFERENCED') {
      return new AppError(
        ErrorTypes.VALIDATION,
        'ไม่สามารถลบข้อมูลนี้ได้เนื่องจากมีการใช้งานอยู่',
        null,
        error
      ).toResponse();
    }
    
    
    return new AppError(
      ErrorTypes.INTERNAL_SERVER,
      'เกิดข้อผิดพลาดภายในระบบ โปรดลองใหม่ภายหลัง',
      null,
      error
    ).toResponse();
  }