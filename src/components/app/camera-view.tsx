
"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Camera, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';

interface CameraViewProps {
    guide: 'qr' | 'plate';
    onScanSuccess: (result: string) => void;
}

export function CameraView({ guide, onScanSuccess }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('Camera not supported on this browser.');
                setHasCameraPermission(false);
                toast({
                  variant: 'destructive',
                  title: 'Camera Not Supported',
                  description: 'Your browser does not support camera access.',
                });
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                // No toast here, we show an inline error message now.
            }
        };

        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [toast]);

    const handleCapture = () => {
        setIsScanning(true);
        // Simulate a scan
        setTimeout(() => {
            onScanSuccess(`scanned-${guide}-result`);
            setIsScanning(false);
        }, 1500);
    }
    
    const captureLabel = guide === 'qr' ? 'Capture QR Code' : 'Capture Plate Photo';

    return (
        <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted title="Camera feed" />

            {guide === 'qr' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/5 aspect-square border-4 border-dashed border-white/80 rounded-2xl bg-black/20" />
                </div>
            )}
            
            {guide === 'plate' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4/5 h-1/4 border-4 border-dashed border-white/80 rounded-lg bg-black/20" />
                </div>
            )}

            {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                    <Alert variant="destructive" className="flex flex-col items-center justify-center text-center">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription className='mb-4'>
                            Please allow camera access in your browser settings to use this feature.
                        </AlertDescription>
                        {/* The "Open Settings" button is a suggestion and might not work on all platforms/browsers.
                            For a real app, platform-specific code would be needed. This is a progressive enhancement.
                        */}
                        <Button variant="secondary" onClick={() => toast({ title: "Please open browser settings" })}>
                            <Settings className="mr-2 h-4 w-4" />
                            Open Settings
                        </Button>
                    </Alert>
                </div>
            )}
            
            {hasCameraPermission && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <Button size="lg" onClick={handleCapture} disabled={isScanning} aria-label={captureLabel}>
                        {isScanning ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="mr-2 h-4 w-4" />
                        )}
                        {isScanning ? 'Scanning...' : 'Capture'}
                    </Button>
                </div>
            )}
        </div>
    );
}
