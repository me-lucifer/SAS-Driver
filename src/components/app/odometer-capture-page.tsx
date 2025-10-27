
"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CameraView } from './camera-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { StatusChip } from './status-chip';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

function OdometerPhotoCard({ onRetake, onUse }: { onRetake: () => void; onUse: () => void; }) {
    const [imageSeed, setImageSeed] = useState(1);
    const imageUrl = `https://picsum.photos/seed/odometer${imageSeed}/800/450`;

    const handleRetake = () => {
        setImageSeed(Math.floor(Math.random() * 1000));
        onRetake();
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Image
                    src={imageUrl}
                    alt="Odometer placeholder"
                    width={800}
                    height={450}
                    className="w-full aspect-video object-cover bg-muted"
                    data-ai-hint="odometer reading"
                />
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-2 bg-card">
                <Button variant="outline" onClick={handleRetake}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake
                </Button>
                <Button onClick={onUse}>
                    Use Photo
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function OdometerCapturePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lastOdometerParam = searchParams.get('lastOdometer') || '0';
    const { toast } = useToast();

    const [captureState, setCaptureState] = useState<'capturing' | 'reviewing'>('capturing');
    const [ocrResult, setOcrResult] = useState('25650');
    const [isEdited, setIsEdited] = useState(false);
    const [notes, setNotes] = useState('');

    const lastOdometer = parseInt(lastOdometerParam, 10);
    const currentOdometer = parseInt(ocrResult, 10) || 0;
    const delta = currentOdometer - lastOdometer;
    const isWarning = delta > 300;
    const ocrConfidence = 0.987;

    const handleCaptureSuccess = (scanResult: string) => {
        console.log("Capture successful:", scanResult);
        // Simulate OCR result based on the last odometer to show a realistic delta
        const simulatedOdometer = lastOdometer + Math.floor(Math.random() * 250) + 50;
        setOcrResult(simulatedOdometer.toString());
        setCaptureState('reviewing');
    };

    const handleValidationAndSubmit = () => {
        // 1. Validation
        if (!searchParams.get('plate')) {
             toast({ variant: "destructive", title: "Validation Error", description: "No vehicle is linked to this session." });
             return;
        }
        if (!ocrResult || isNaN(currentOdometer)) {
             toast({ variant: "destructive", title: "Validation Error", description: "Odometer reading is not a valid number." });
             return;
        }
        if (currentOdometer < 0 || currentOdometer > 1000000) {
             toast({ variant: "destructive", title: "Validation Error", description: "Odometer reading is out of the reasonable range (0 - 1,000,000)." });
             return;
        }
        if (currentOdometer < lastOdometer) {
             toast({ variant: "destructive", title: "Validation Error", description: "Odometer reading cannot be less than the last verified reading." });
             return;
        }

        // 2. Flagging
        const flags = [];
        if (isWarning) flags.push("Odo Δ high");
        if (ocrConfidence < 0.6) flags.push("Low OCR");


        const submissionParams = new URLSearchParams({
            odometer: currentOdometer.toString(),
            lastOdometer: lastOdometer.toString(),
            delta: delta.toString(),
            plate: searchParams.get('plate') || '',
            type: searchParams.get('type') || '',
            notes,
            confidence: (ocrConfidence * 100).toFixed(1),
            flags: JSON.stringify(flags),
        });

        // Redirect to the final review/submit page
        router.push(`/review-submission?${submissionParams.toString()}`);
    }
    
    const handleOcrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOcrResult(e.target.value);
        if (!isEdited) {
            setIsEdited(true);
        }
    }

    if (captureState === 'capturing') {
        const backLink = `/identify-vehicle`;
        return (
            <div className="flex flex-col h-full">
                <header className="flex items-center p-4 border-b h-16 shrink-0">
                    <Link href={backLink} passHref>
                        <Button variant="ghost" size="icon" aria-label="Back">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold ml-2">Capture Odometer</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Capture Odometer Reading</CardTitle>
                            <CardDescription>
                                Position the camera over the odometer. Avoid glare and ensure the digits are centered.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CameraView guide="plate" onScanSuccess={handleCaptureSuccess} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 border-b h-16 shrink-0">
                 <Button variant="ghost" size="icon" onClick={() => setCaptureState('capturing')} aria-label="Back">
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold ml-2">Review Odometer</h1>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                <OdometerPhotoCard onRetake={() => {}} onUse={handleValidationAndSubmit} />

                <Card>
                    <CardHeader>
                        <CardTitle>Odometer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ocr-result">OCR Result</Label>
                            <div className="flex items-center gap-2">
                                <Input id="ocr-result" value={ocrResult} onChange={handleOcrChange} type="number" />
                                <Badge variant="secondary">{(ocrConfidence * 100).toFixed(1)}%</Badge>
                            </div>
                        </div>
                        
                        {isEdited && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-reason">Reason for edit</Label>
                                <Textarea id="edit-reason" placeholder="e.g., OCR missed a digit" />
                            </div>
                        )}
                        
                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Last Verified</p>
                                <p className="font-medium">{lastOdometer.toLocaleString()} km</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Delta (Δ)</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{delta.toLocaleString()} km</p>
                                    {isWarning && <StatusChip status="Warning" />}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">GPS Location (auto-tagged)</Label>
                            <Input id="location" value="Muscat, Oman" disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea id="notes" placeholder="Add any relevant notes..." maxLength={140} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
            </main>
            
            <footer className="sticky bottom-0 bg-background p-4 border-t grid grid-cols-2 gap-2">
                <Button variant="ghost" size="lg" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button size="lg" onClick={handleValidationAndSubmit}>
                    Save & Review
                </Button>
            </footer>
        </div>
    );
}
