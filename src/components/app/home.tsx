
"use client";

import { useState } from 'react';
import { Camera, ListChecks, LogOut, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFirebaseApp, useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export default function Home() {
  const firebaseApp = useFirebaseApp();
  const { user } = useUser();
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  // Mock state for odometer submission
  const [odometerSubmitted, setOdometerSubmitted] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/welcome');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className='flex items-center gap-2'>
            <Link href="/" className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V12" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 7L12 12" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 4.5L7 9.5" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-xl font-bold text-foreground">SAS Fleet</h1>
            </Link>
            <Badge variant="outline">Driver</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                  <AvatarImage src="https://picsum.photos/seed/driver/40/40" alt="Driver" data-ai-hint="person portrait" />
                  <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || 'DR'}</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {!odometerSubmitted && (
            <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <ShieldAlert className="h-6 w-6 text-amber-500" />
                    <CardTitle className="text-amber-900 text-lg">Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-800">
                        Today’s odometer reading has not been submitted. Please submit it before starting your route.
                    </p>
                </CardContent>
            </Card>
        )}

        <Link href="/identify-vehicle" passHref>
          <Card className="hover:bg-accent hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                      <Camera className="h-6 w-6 text-primary" />
                      Odometer Capture
                  </CardTitle>
                  <CardDescription>
                      Capture and submit your vehicle's starting odometer reading for the day.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Button className="w-full">
                      Start
                  </Button>
              </CardContent>
          </Card>
        </Link>
        
        <Link href="/submissions" passHref>
            <Card className="hover:bg-accent hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <ListChecks className="h-6 w-6 text-primary" />
                        My Submissions
                    </CardTitle>
                    <CardDescription>
                        View your past odometer and other submissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" className="w-full">
                        View History
                    </Button>
                </CardContent>
            </Card>
        </Link>

      </main>
    </div>
  );
}
