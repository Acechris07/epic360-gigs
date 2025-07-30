import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Epic360 Gigs - Find the Perfect Freelancer for Your Project',
    template: '%s | Epic360 Gigs',
  },
  description:
    'Connect with skilled professionals worldwide. Get your projects done faster, better, and more affordably with Epic360 Gigs.',
  keywords: [
    'freelance',
    'gigs',
    'services',
    'freelancers',
    'remote work',
    'project management',
  ],
  authors: [{ name: 'Epic360 Gigs' }],
  creator: 'Epic360 Gigs',
  publisher: 'Epic360 Gigs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Epic360 Gigs - Find the Perfect Freelancer for Your Project',
    description:
      'Connect with skilled professionals worldwide. Get your projects done faster, better, and more affordably.',
    siteName: 'Epic360 Gigs',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Epic360 Gigs - Freelance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epic360 Gigs - Find the Perfect Freelancer for Your Project',
    description:
      'Connect with skilled professionals worldwide. Get your projects done faster, better, and more affordably.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
