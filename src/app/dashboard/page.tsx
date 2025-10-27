"use client";

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Home from '@/components/app/home';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/welcome');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2">Loading...</p>
            </div>
        </div>
    );
  }

  return <Home />;
}
