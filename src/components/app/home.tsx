
"use client";

import { useState, useEffect } from 'react';
import { Camera, ListChecks, ShieldAlert, Link as LinkIcon, Undo2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useFirebaseApp, useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { ProfileDrawer } from './profile-drawer';
import { format } from 'date-fns';

type Vehicle = {
    plate: string;
    fleet: string;
    type: string;
    driver: string | null;
    lastOdometer: number;
}


export default function Home() {
  const firebaseApp = useFirebaseApp();
  const { user } = useUser();
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  const [odometerSubmitted, setOdometerSubmitted] = useState(false);
  const [sessionVehicle, setSessionVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    // Check for vehicle in local storage
    const storedVehicle = localStorage.getItem('sessionVehicle');
    if (storedVehicle) {
      setSessionVehicle(JSON.parse(storedVehicle));
    }

    // Check if submission for today exists
    const submissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySubmission = submissions.find((sub: any) => sub.date === today && sub.vehicle === JSON.parse(storedVehicle || '{}').plate);

    if (todaySubmission) {
      setOdometerSubmitted(true);
    }

  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('sessionVehicle');
    router.push('/welcome');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className='flex items-center gap-2'>
            <Link href="/" className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#6699CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12" stroke="#6699CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V12" stroke="#6699CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 7L12 12" stroke="#6699CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 4.5L7 9.5" stroke="#6699CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-xl font-bold text-foreground">SAS Fleet</h1>
            </Link>
            <Badge variant="outline">Driver</Badge>
        </div>
        <ProfileDrawer user={user} onLogout={handleLogout} />
      </header>

       {sessionVehicle && (
        <div className="px-4 py-3 bg-muted border-b">
          <Link href="/identify-vehicle" className="block">
            <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-card border shadow-sm cursor-pointer hover:bg-accent/50">
                <div>
                    <span className="text-muted-foreground">Vehicle: </span>
                    <span className="font-semibold text-foreground">{sessionVehicle.plate}</span>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Undo2 className="mr-1 h-3 w-3" />
                    Change
                </Button>
            </div>
          </Link>
        </div>
      )}


      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {!sessionVehicle && (
            <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <LinkIcon className="h-6 w-6 text-amber-600" />
                    <CardTitle className="text-amber-900 text-lg">Link this session to a vehicle</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4">
                    <p className="text-amber-800">
                        You must identify your vehicle to submit an odometer reading.
                    </p>
                    <Link href="/identify-vehicle" passHref>
                        <Button>Scan now</Button>
                    </Link>
                </CardContent>
            </Card>
        )}

        {!odometerSubmitted && sessionVehicle && (
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <ShieldAlert className="h-6 w-6 text-blue-500" />
                    <CardTitle className="text-blue-900 text-lg">Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-800">
                        Today’s odometer reading has not been submitted. Please submit it before starting your route.
                    </p>
                </CardContent>
            </Card>
        )}

        <Link href={sessionVehicle ? `/odometer-capture?lastOdometer=${sessionVehicle.lastOdometer}&plate=${sessionVehicle.plate}&type=${sessionVehicle.type}` : "/identify-vehicle"} passHref>
          <Card className="hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
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
                  <Button size="lg" className="w-full" disabled={!sessionVehicle}>
                      Start
                  </Button>
              </CardContent>
          </Card>
        </Link>
        
        <Link href="/submissions" passHref>
            <Card className="hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
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
                    <Button variant="secondary" size="lg" className="w-full">
                        View History
                    </Button>
                </CardContent>
            </Card>
        </Link>

      </main>
    </div>
  );
}
