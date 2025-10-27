"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoRow } from './info-row';
import { StatusChip } from './status-chip';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Home, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useOnlineStatus } from '@/hooks/use-online-status';


export default function ReviewSubmissionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const submissionData = {
        dateTime: new Date(),
        vehicle: {
            plate: searchParams.get('plate') || 'Unknown',
            type: searchParams.get('type') || 'Vehicle',
        },
        odometer: parseInt(searchParams.get('odometer') || '0', 10),
        delta: parseInt(searchParams.get('delta') || '0', 10),
        photoUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        location: searchParams.get('location') || 'Muscat, Oman',
        notes: searchParams.get('notes') || 'Tire pressure seems a bit low.',
    };

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const isOnline = useOnlineStatus();
    
    const handleSubmit = () => {
        if (isConfirmed) {
            const newSubmission = {
                ...submissionData,
                id: `offline-${Date.now()}`,
                date: format(submissionData.dateTime, 'yyyy-MM-dd'),
                vehicle: submissionData.vehicle.plate,
                status: isOnline ? 'Submitted' : 'Offline',
            };

            if (!isOnline) {
                const offlineSubmissions = JSON.parse(localStorage.getItem('offlineSubmissions') || '[]');
                offlineSubmissions.push(newSubmission);
                localStorage.setItem('offlineSubmissions', JSON.stringify(offlineSubmissions));
            } else {
                 const mockSubmissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
                 mockSubmissions.unshift(newSubmission);
                 localStorage.setItem('mockSubmissions', JSON.stringify(mockSubmissions));
            }
            setIsSubmitted(true);
        }
    };
    
    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-background">
                <CheckCircle2 className="w-24 h-24 text-success mb-6" />
                <h1 className="text-2xl font-bold mb-2">Submission Successful</h1>
                <p className="text-muted-foreground mb-8">
                    {isOnline ? "Your odometer reading for today has been recorded." : "Your submission is saved and will sync when you're back online."}
                </p>
                <div className="w-full space-y-3 max-w-sm">
                     <Button size="lg" className="w-full" variant="outline" onClick={() => router.push('/submissions')}>
                        <FileText className="mr-2" />
                        View Submission
                    </Button>
                    <Link href="/dashboard" className="w-full block">
                        <Button size="lg" className="w-full">
                            <Home className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const deltaStatus = submissionData.delta < 0 || submissionData.delta > 300 ? 'Warning' : 'Verified';

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Review & Submit</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Submission Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <InfoRow label="Date & Time" value={format(submissionData.dateTime, "MMM d, yyyy 'at' h:mm a")} />
                        <InfoRow label="Vehicle" value={`${submissionData.vehicle.plate} (${submissionData.vehicle.type})`} />
                        <InfoRow label="Odometer" value={`${submissionData.odometer.toLocaleString()} km`} />
                        <InfoRow label="Delta" value={
                            <div className="flex items-center gap-2">
                                {submissionData.delta.toLocaleString()} km
                                <StatusChip status={deltaStatus} />
                            </div>
                        } />
                        <InfoRow label="Location" value={submissionData.location} />
                        <InfoRow label="Notes" value={submissionData.notes || 'N/A'} />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Photo Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                     <Image
                        src={submissionData.photoUrl}
                        alt="Odometer photo"
                        width={600}
                        height={400}
                        className="w-full aspect-[3/2] object-cover rounded-md bg-muted"
                        data-ai-hint="odometer reading"
                    />
                </CardContent>
            </Card>

            <div className="p-4 space-y-4 bg-card rounded-2xl border">
                <div className="flex items-start space-x-3">
                    <Checkbox id="confirmation" className="mt-1" checked={isConfirmed} onCheckedChange={(checked) => setIsConfirmed(checked as boolean)} />
                    <Label htmlFor="confirmation" className="font-medium text-sm leading-snug cursor-pointer">
                        I confirm that this odometer reading is accurate and was taken from the assigned vehicle.
                    </Label>
                </div>
                <Button size="lg" className="w-full" disabled={!isConfirmed} onClick={handleSubmit}>
                   {isOnline ? 'Submit Reading' : 'Save for Offline'}
                </Button>
            </div>
        </div>
    );
}
