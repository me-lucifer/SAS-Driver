
"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoRow } from './info-row';
import { StatusChip } from './status-chip';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Home, FileText, ArrowLeft, TriangleAlert, Edit, User, FileWarning } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';


export default function ReviewSubmissionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const submissionData = {
        dateTime: new Date(),
        vehicle: {
            plate: searchParams.get('plate') || 'Unknown',
            type: searchParams.get('type') || 'Vehicle',
        },
        odometer: parseInt(searchParams.get('odometer') || '0', 10),
        lastOdometer: parseInt(searchParams.get('lastOdometer') || '0', 10),
        delta: parseInt(searchParams.get('delta') || '0', 10),
        photoUrl: `https://images.unsplash.com/photo-1612825175532-3a6953535249?w=600&h=400&fit=crop&q=80`,
        location: searchParams.get('location') || 'Muscat, Oman',
        notes: searchParams.get('notes') || '',
        confidence: parseFloat(searchParams.get('confidence') || '0'),
        flags: JSON.parse(searchParams.get('flags') || '[]'),
    };

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const isOnline = useOnlineStatus();
    
    const handleSubmit = () => {
        if (isConfirmed) {
            const newId = isOnline ? `synced-${Date.now()}`: `offline-${Date.now()}`;
            const newStatus = submissionData.flags.length > 0 ? 'Flagged' : (isOnline ? 'Submitted' : 'Offline');

            const newSubmissionListItem = {
                id: newId,
                date: format(submissionData.dateTime, 'yyyy-MM-dd'),
                vehicle: submissionData.vehicle.plate,
                odometer: submissionData.odometer,
                delta: submissionData.delta,
                status: newStatus,
            };

            const newSubmissionDetail = {
                id: newId,
                dateTime: submissionData.dateTime.toISOString(),
                vehicle: submissionData.vehicle,
                odometer: submissionData.odometer,
                delta: submissionData.delta,
                photoUrl: submissionData.photoUrl,
                location: submissionData.location,
                notes: submissionData.notes,
                ocr: { value: submissionData.odometer, confidence: `${submissionData.confidence}%` },
                edits: null, 
                reviewerNotes: null,
                flags: submissionData.flags,
                status: newStatus,
                history: [
                    { status: newStatus, user: 'Driver', time: submissionData.dateTime.toISOString(), icon: newStatus === 'Flagged' ? FileWarning : Edit },
                ]
            };

            // Save list item
            const listStorageKey = 'mockSubmissions';
            const existingSubmissions = JSON.parse(localStorage.getItem(listStorageKey) || '[]');
            existingSubmissions.unshift(newSubmissionListItem);
            localStorage.setItem(listStorageKey, JSON.stringify(existingSubmissions));
            
            // Save detail item
            const detailStorageKey = 'mockSubmissionDetails';
            const existingDetails = JSON.parse(localStorage.getItem(detailStorageKey) || '{}');
            existingDetails[newId] = newSubmissionDetail;
            localStorage.setItem(detailStorageKey, JSON.stringify(existingDetails));

            // Mark today's submission as done
            localStorage.setItem('submissionDate', format(new Date(), 'yyyy-MM-dd'));
            localStorage.setItem('submissionVehiclePlate', submissionData.vehicle.plate);

            setIsSubmitted(true);
            
            toast({
                variant: 'success',
                title: 'Success!',
                description: 'Your odometer reading has been submitted.',
            });
        }
    };
    
    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-background">
                <CheckCircle2 className="w-24 h-24 text-success mb-6" />
                <h1 className="text-2xl font-bold mb-2">Reading Submitted</h1>
                 <p className="text-muted-foreground mb-8 max-w-xs">
                    {submissionData.vehicle.plate} <br/>
                    {submissionData.odometer.toLocaleString()} km <br/>
                    {format(submissionData.dateTime, "MMM d, yyyy 'at' h:mm a")}
                </p>
                <div className="w-full space-y-3 max-w-sm">
                    <Link href="/dashboard" className="w-full block">
                        <Button size="lg" className="w-full">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                     <Button size="lg" className="w-full" variant="outline" onClick={() => router.push('/submissions')}>
                        <FileText className="mr-2 h-4 w-4" />
                        View All Submissions
                    </Button>
                </div>
            </div>
        );
    }

    const deltaStatus = submissionData.delta < 0 || submissionData.delta > 300 ? 'Warning' : 'Verified';

    return (
        <div className="flex flex-col h-full">
             <header className="flex items-center p-4 border-b h-16 shrink-0 gap-2">
                 <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold ml-2">Review & Submit</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {submissionData.flags.length > 0 && (
                     <Card className="bg-warning text-warning-foreground border-amber-300">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                             <TriangleAlert className="h-6 w-6" />
                             <CardTitle className="text-lg">Flags Detected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">This submission will be flagged for review due to:</p>
                            <div className="flex flex-wrap gap-2">
                                {submissionData.flags.map((flag: string) => (
                                    <Badge key={flag} variant="destructive">{flag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                            alt="odometer close-up"
                            width={600}
                            height={400}
                            className="w-full aspect-[3/2] object-cover rounded-md bg-muted"
                            data-ai-hint="odometer reading"
                        />
                    </CardContent>
                </Card>

                <div className="p-4 space-y-4 bg-card rounded-lg border">
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
            </main>
        </div>
    );
}
