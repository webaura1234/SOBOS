export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'RestaurantOS',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;
