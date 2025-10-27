
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function RestrictedFeaturePage() {
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "This feature is available to Bowser Operators or Admins.",
        });
        router.replace('/dashboard');
    }, [router, toast]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2">Redirecting...</p>
            </div>
        </div>
    );
}
