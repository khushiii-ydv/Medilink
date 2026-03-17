/**
 * middleware/errorHandler.js
 * Global error-handling middleware — catches any unhandled errors from controllers.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message, err.stack);

  // Prisma-specific errors
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Duplicate entry - a record with this value already exists' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({ success: false, error: message });
};

/**
 * middleware/notFound.js
 * Returns a structured 404 for any unmatched route.
 */
export const notFound = (req, res) => {
  return res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
};
