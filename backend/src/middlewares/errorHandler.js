import logger from '../logger/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: errors.join(', '),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            error: 'Duplicate Field',
            message: `${field} already exists`,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(404).json({
            success: false,
            error: 'Resource not found',
            message: 'Invalid ID format',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: 'Please authenticate',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired',
            message: 'Please login again',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: err.name || 'Error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};