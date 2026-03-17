/**
 * middleware/validate.js
 * Simple validation helper — returns 400 if required fields are missing.
 */

/**
 * validateRequired(fields)
 * Pass an array of field names. The middleware checks req.body for each.
 * Example: router.put('/profile', validateRequired(['name', 'email']), controller)
 */
export const validateRequired = (fields) => (req, res, next) => {
  const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: missing.map(f => `'${f}' is required`),
    });
  }
  next();
};

/**
 * validatePositiveIntegers(fields)
 * Ensures numeric resource fields are non-negative integers.
 */
export const validatePositiveIntegers = (fields) => (req, res, next) => {
  const errors = [];
  fields.forEach(f => {
    const val = req.body[f];
    if (val !== undefined && (isNaN(val) || parseInt(val) < 0)) {
      errors.push(`'${f}' must be a non-negative integer`);
    }
  });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }
  next();
};
