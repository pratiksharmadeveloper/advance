// src/app/layout.tsx - Clean root layout
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from '@/lib/constants'
import ToasterProvider from '../components/ToasterProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['hospital', 'healthcare', 'medical', 'doctor', 'Nepal', 'Lalitpur'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}