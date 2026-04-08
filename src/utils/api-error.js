class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    if (this.stack) {
        this.stack = this.stack
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}   

export default ApiError; 