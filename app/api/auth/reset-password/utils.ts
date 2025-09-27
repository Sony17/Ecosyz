// Storage for tokens - this will be lost on server restart
// In production with multiple instances, consider using Redis or a database
export const resetTokens = new Map();

export const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

// Function to validate a reset token
export function validateResetToken(email: string, token: string): boolean {
  const resetData = resetTokens.get(email);
  
  if (!resetData) {
    return false;
  }

  const { token: storedToken, expires } = resetData;

  // Check if token has expired
  if (Date.now() > expires) {
    resetTokens.delete(email);
    return false;
  }

  // Compare tokens
  return token === storedToken;
}