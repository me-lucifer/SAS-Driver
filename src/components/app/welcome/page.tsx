"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-background p-6 text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <ShieldCheck className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-2">SAS Fleet Driver App</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Your reliable partner for on-time deliveries and real-time tracking.
        </p>
        <Button size="lg" className="w-full max-w-xs" onClick={() => router.push('/login')}>
          Get Started
        </Button>
      </div>
      <footer className="text-center text-xs text-muted-foreground pb-4">
        <p>
          By continuing, you agree to our{' '}
          <Link href="#" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
