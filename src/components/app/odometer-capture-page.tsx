"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Camera, ArrowLeft } from 'lucide-react';
import { CameraView } from './camera-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { StatusChip } from './status-chip';
import { Separator } from '../ui/separator';
import { CameraCard } from './camera-card';
import { Button } from '../ui/button';
import { Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OdometerCapturePage() {
    const searchParams = useSearchParams();
    const lastOdometerParam = searchParams.get('lastOdometer') || '0';

    const [captureState, setCaptureState] = useState<'capturing' | 'reviewing'>('capturing');
    const [ocrResult, setOcrResult] = useState('25650');
    const [isEdited, setIsEdited] = useState(false);

    const lastOdometer = parseInt(lastOdometerParam, 10);
    const currentOdometer = parseInt(ocrResult, 10) || 0;
    const delta = currentOdometer - lastOdometer;
    const isWarning = delta < 0 || delta > 300;

    const handleCapture = (scanResult: string) => {
        console.log("Capture successful:", scanResult);
        // Simulate OCR result based on the last odometer to show a realistic delta
        const simulatedOdometer = lastOdometer + Math.floor(Math.random() * 250) + 50;
        setOcrResult(simulatedOdometer.toString());
        setCaptureState('reviewing');
    };

    const handleOcrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOcrResult(e.target.value);
        if (!isEdited) {
            setIsEdited(true);
        }
    }

    if (captureState === 'capturing') {
        const backLink = `/identify-vehicle`;
        return (
            <div className="p-4 space-y-4">
                <header className="flex items-center mb-4 -mx-4 px-4 h-14 border-b">
                    <Link href={backLink} passHref>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold ml-2">Capture Odometer</h1>
                </header>
                <Card>
                    <CardHeader>
                        <CardTitle>Capture Odometer Reading</CardTitle>
                        <CardDescription>
                            Position the camera over the odometer. Avoid glare and ensure the digits are centered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CameraView guide="plate" onScanSuccess={handleCapture} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Build the query string for the next page
    const reviewLink = `/review-submission?${new URLSearchParams({
        odometer: currentOdometer.toString(),
        lastOdometer: lastOdometer.toString(),
        delta: delta.toString(),
        plate: searchParams.get('plate') || '',
        type: searchParams.get('type') || '',
    })}`;

    return (
        <div className="p-4 space-y-4">
            <header className="flex items-center mb-4 -mx-4 px-4 h-14 border-b">
                <Button variant="ghost" size="icon" onClick={() => setCaptureState('capturing')}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold ml-2">Review Odometer</h1>
            </header>
            
            <CameraCard />

            <Card>
                <CardHeader>
                    <CardTitle>Odometer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ocr-result">OCR Result</Label>
                        <div className="flex items-center gap-2">
                            <Input id="ocr-result" value={ocrResult} onChange={handleOcrChange} type="number" />
                            <Badge variant="secondary">98.7%</Badge>
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
                        <Textarea id="notes" placeholder="Add any relevant notes..." maxLength={140} />
                    </div>

                </CardContent>
                 <CardFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="lg" onClick={() => setCaptureState('capturing')}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake
                    </Button>
                    <Link href={reviewLink} className="w-full">
                        <Button size="lg" className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            Save & Review
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
