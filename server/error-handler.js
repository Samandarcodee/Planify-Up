export class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
export class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
export class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new NotFoundError(message);
    }
    // Mongoose duplicate key
    if (err.name === 'MongoError' && err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ValidationError(message);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new ValidationError(message);
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new UnauthorizedError(message);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new UnauthorizedError(message);
    }
    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
// Async error wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// 404 handler
export const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};
