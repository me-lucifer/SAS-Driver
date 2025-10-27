"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer used with email/password authentication.
// We redirect to the login page as a fallback.
export default function VerifyOtpPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return null; 
}
