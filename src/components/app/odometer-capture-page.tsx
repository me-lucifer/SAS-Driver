"use client";

import { useState } from 'react';
import { Camera } from 'lucide-react';
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
import { Save, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OdometerCapturePage() {
    const [captureState, setCaptureState] = useState<'capturing' | 'reviewing'>('capturing');
    const [ocrResult, setOcrResult] = useState('123456');
    const [isEdited, setIsEdited] = useState(false);

    const lastOdometer = 123180;
    const currentOdometer = parseInt(ocrResult, 10) || 0;
    const delta = currentOdometer - lastOdometer;
    const isWarning = delta < 0 || delta > 300;

    const handleCapture = (scanResult: string) => {
        // In a real app, you'd get the OCR result here
        console.log("Capture successful:", scanResult);
        setOcrResult('123456'); // Mock result
        setCaptureState('reviewing');
    };

    const handleOcrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOcrResult(e.target.value);
        if (!isEdited) {
            setIsEdited(true);
        }
    }

    if (captureState === 'capturing') {
        return (
            <div className="p-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Capture Odometer</CardTitle>
                        <CardDescription>
                            Position the camera over the odometer. Avoid glare and ensure the digits are centered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* We use the plate guide for a rectangular shape suitable for odometers */}
                        <CameraView guide="plate" onScanSuccess={handleCapture} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Review Odometer</h1>
            
            <CameraCard />

            <Card>
                <CardHeader>
                    <CardTitle>Odometer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ocr-result">OCR Result</Label>
                        <div className="flex items-center gap-2">
                            <Input id="ocr-result" value={ocrResult} onChange={handleOcrChange} />
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
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" placeholder="Add any relevant notes..." maxLength={140} />
                    </div>

                </CardContent>
                 <CardFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setCaptureState('capturing')}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake
                    </Button>
                    <Link href="/review-submission" className="w-full">
                        <Button className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            Save & Review
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
