
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoRow } from './info-row';
import { StatusChip } from './status-chip';
import { format } from 'date-fns';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { mockSubmissionDetails } from '@/lib/mock-data';

export default function SubmissionDetailPage({ id }: { id: string }) {
    const submissionData = mockSubmissionDetails[id as keyof typeof mockSubmissionDetails];
    
    if (!submissionData) {
        return (
            <div className="p-4 space-y-4 text-center">
                 <h1 className="text-2xl font-bold">Submission Not Found</h1>
                 <p className="text-muted-foreground">The submission you are looking for does not exist or could not be loaded.</p>
                 <Link href="/submissions" passHref>
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Submissions
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Link href="/submissions" passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Submission Details</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <InfoRow label="Date & Time" value={format(new Date(submissionData.dateTime), "MMM d, yyyy 'at' h:mm a")} />
                        <InfoRow label="Vehicle" value={`${submissionData.vehicle.plate} (${submissionData.vehicle.type})`} />
                        <InfoRow label="Odometer" value={`${submissionData.odometer.toLocaleString()} km`} />
                        <InfoRow label="Delta" value={
                            <div className="flex items-center gap-2">
                                {submissionData.delta} km
                                <StatusChip status={submissionData.status as any} />
                            </div>
                        } />
                        <InfoRow label="Location" value={submissionData.location} />
                        <InfoRow label="Driver Notes" value={submissionData.notes || 'N/A'} />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Photo & OCR</CardTitle>
                </CardHeader>
                <CardContent>
                     <Image
                        src={submissionData.photoUrl}
                        alt="Odometer photo"
                        width={600}
                        height={400}
                        className="w-full aspect-[3/2] object-cover rounded-md bg-muted mb-4"
                        data-ai-hint="odometer reading"
                    />
                    <div className="space-y-1 text-sm">
                        <InfoRow label="OCR Value" value={<div className='flex items-center gap-2'>{submissionData.ocr.value.toLocaleString()} <Badge variant="secondary">{submissionData.ocr.confidence}</Badge></div>} />
                        {submissionData.edits && <InfoRow label="Edit Reason" value={submissionData.edits.reason} />}
                    </div>
                </CardContent>
            </Card>

            {submissionData.reviewerNotes && (
                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                        <CardTitle className="text-amber-900 text-lg">Reviewer Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800">{submissionData.reviewerNotes}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {submissionData.history.map((item: any, index: number) => {
                             const Icon = item.icon;
                             return (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        {index < submissionData.history.length - 1 && <div className="w-px h-8 bg-border my-1"></div>}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.status}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-4">
                                           <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{item.user}</div>
                                           <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{format(new Date(item.time), 'h:mm a')}</div>
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
