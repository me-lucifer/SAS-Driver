"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useFirebaseApp } from '@/firebase';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('driver@sasfleet.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);

  const handleLogin = async () => {
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Email and password are required.",
        });
        return;
    }
    setIsLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: "Success!",
            description: "You have been logged in.",
        });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Error signing in: ", error);
        toast({
            variant: "destructive",
            title: "Failed to log in",
            description: error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
                ? "Invalid email or password."
                : "An unexpected error occurred. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Enter your credentials to log in.</p>
        
        <div className="space-y-4 mb-4">
            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="driver@sasfleet.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>
        </div>

        <Button size="lg" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Log In"}
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
