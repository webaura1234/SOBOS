import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'RestaurantOS - Restaurant Management Platform',
    template: '%s | RestaurantOS',
  },
  description: 'Streamline orders, manage staff, track performance, and grow your restaurant business with our comprehensive restaurant management platform.',
  keywords: [
    'restaurant management',
    'restaurant pos',
    'order management',
    'staff management',
    'inventory management',
    'restaurant analytics',
    'kitchen display system',
    'table management',
  ],
  authors: [{ name: 'RestaurantOS Team' }],
  creator: 'RestaurantOS',
  publisher: 'RestaurantOS',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sobos-three.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://sobos-three.vercel.app',
    siteName: 'RestaurantOS',
    title: 'RestaurantOS - Restaurant Management Platform',
    description: 'Streamline orders, manage staff, track performance, and grow your restaurant business.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RestaurantOS Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RestaurantOS - Restaurant Management Platform',
    description: 'Streamline orders, manage staff, track performance, and grow your restaurant business.',
    images: ['/og-image.jpg'],
    creator: '@restaurantos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RestaurantOS',
  },
  applicationName: 'RestaurantOS',
  category: 'business',
  classification: 'Restaurant Management Software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
