"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useFirebaseApp } from '@/firebase';

function VerifyOtpComponent() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const phoneNumber = searchParams.get('phone');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setIsResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
        toast({
            variant: "destructive",
            title: "Invalid OTP",
            description: "Please enter a 6-digit OTP.",
        });
        return;
    }
    setIsLoading(true);
    try {
        const confirmationResult = (window as any).confirmationResult;
        if (!confirmationResult) {
            throw new Error("Verification session expired. Please go back and try again.");
        }
        await confirmationResult.confirm(otp);
        toast({
            title: "Success!",
            description: "You have been logged in.",
        });
        router.push('/');
    } catch (error: any) {
        console.error("Error verifying OTP: ", error);
        toast({
            variant: "destructive",
            title: "Verification Failed",
            description: error.message || "The OTP is incorrect. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) {
        toast({ variant: "destructive", title: "Phone number not found." });
        return;
    }
    setIsResending(true);
    try {
        const recaptchaVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        (window as any).confirmationResult = confirmationResult;

        setTimer(59);
        setIsResendDisabled(true);
        toast({
          title: 'OTP Resent',
          description: 'A new OTP has been sent to your phone.',
        });
    } catch (error: any) {
        console.error("Error resending OTP: ", error);
        toast({
            variant: "destructive",
            title: "Failed to resend OTP",
            description: error.message || "Please try again later.",
        });
    } finally {
        setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex-1 flex flex-col justify-center text-center">
        <h1 className="text-3xl font-bold mb-2">Verify Phone Number</h1>
        <p className="text-muted-foreground mb-8">
          Enter the 6-digit code sent to <br/>
          <span className="font-semibold text-foreground">{phoneNumber}</span>
        </p>
        
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button size="lg" onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Verify"}
        </Button>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {isResendDisabled ? (
            <span>Resend code in 00:{timer.toString().padStart(2, '0')}</span>
          ) : (
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={isResending}
              className="p-0 h-auto"
            >
              {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Resend OTP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpComponent />
        </Suspense>
    )
}
