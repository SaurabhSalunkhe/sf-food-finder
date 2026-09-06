import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'] });
const display = Fraunces({ variable: '--font-display', subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bitemap-sf.saurabhsalunkhe.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BiteMap SF — Free Food & Restaurant Deals',
  description: 'Find free food, closing-time drops, and restaurant deals across San Francisco.',
  openGraph: {
    title: 'BiteMap SF — Free Food & Restaurant Deals',
    description: 'Free bites. Last-minute deals. Less food waste.',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'BiteMap SF food deal map' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BiteMap SF — Free Food & Restaurant Deals',
    description: 'Free bites. Last-minute deals. Less food waste.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
