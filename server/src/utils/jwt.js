import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token with user ID payload
 */
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'skillora_fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
}

