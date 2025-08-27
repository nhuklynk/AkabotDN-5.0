export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h', // 1 giờ để test
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
