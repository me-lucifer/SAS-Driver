import type { Metadata } from 'next';
import './globals.css';
import { PhoneFrame } from '@/components/phone-frame';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'SAS Driver',
  description: 'SAS Fleet — Driver App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gray-200 dark:bg-slate-900 flex items-center justify-center min-h-screen p-4">
        <FirebaseClientProvider>
          <PhoneFrame>
            {children}
          </PhoneFrame>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
