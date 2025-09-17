export const routeErrorHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global Error handling middleware
export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || false;
  const message = error.message;
 res.status(statusCode).json({ status, message });
};