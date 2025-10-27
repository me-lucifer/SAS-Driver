"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useFirebaseApp } from '@/firebase';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+968');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (recaptchaContainerRef.current) {
        const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': () => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        (window as any).recaptchaVerifier = recaptchaVerifier;
    }
  }, [auth]);


  const handleSendOtp = async () => {
    if (!phoneNumber) {
        toast({
            variant: "destructive",
            title: "Phone number is required.",
        });
        return;
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setIsLoading(true);

    try {
        const recaptchaVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
        
        (window as any).confirmationResult = confirmationResult;
        router.push(`/verify-otp?phone=${encodeURIComponent(fullPhoneNumber)}`);

    } catch (error: any) {
        console.error("Error sending OTP: ", error);
        toast({
            variant: "destructive",
            title: "Failed to send OTP",
            description: error.message || "Please try again later.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Enter your phone number to log in.</p>
        
        <div className="flex gap-2 mb-4">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+968">OM (+968)</SelectItem>
              <SelectItem value="+1">US (+1)</SelectItem>
              <SelectItem value="+44">UK (+44)</SelectItem>
              <SelectItem value="+91">IN (+91)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
        </div>

        <Button size="lg" onClick={handleSendOtp} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
        </Button>
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
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
