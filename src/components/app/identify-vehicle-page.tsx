
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Edit, QrCode } from "lucide-react";
import { CameraView } from './camera-view';
import { VehicleCard } from './vehicle-card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

// Mock submissions data, which would typically come from a database.
const mockSubmissions = [
    { id: '1', date: '2024-07-28', vehicle: 'A 12345', odometer: 123456, delta: 276, status: 'Verified' },
    { id: '2', date: '2024-07-27', vehicle: 'A 12345', odometer: 123180, delta: 251, status: 'Verified' },
    { id: '3', date: '2024-07-26', vehicle: 'B 67890', odometer: 89543, delta: -10, status: 'Flagged' },
];

export default function IdentifyVehiclePage() {
    const [identifiedVehicle, setIdentifiedVehicle] = useState(null);
    const [manualPlate, setManualPlate] = useState('');
    const [existingSubmission, setExistingSubmission] = useState<any>(null);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

    const checkForExistingSubmission = (plate: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const submission = mockSubmissions.find(s => 
            s.vehicle === plate && 
            s.date === today && 
            (s.status === 'Submitted' || s.status === 'Verified')
        );
        return submission;
    };

    const handleVehicleIdentification = (vehicleData: any) => {
        const existing = checkForExistingSubmission(vehicleData.plate);
        if (existing) {
            setExistingSubmission(existing);
            setShowDuplicateDialog(true);
        } else {
            setIdentifiedVehicle(vehicleData);
        }
    };

    const handleManualSubmit = () => {
        if (manualPlate) {
            handleVehicleIdentification({
                plate: manualPlate,
                fleet: 'North Region',
                type: '2-Ton Pickup',
                driver: 'Ali Hassan',
            });
        }
    };
    
    const handleScanSuccess = (scanResult: string) => {
        console.log("Scan successful:", scanResult);
        handleVehicleIdentification({
            plate: 'A 12345',
            fleet: 'North Region',
            type: '2-Ton Pickup',
            driver: 'Ali Hassan',
        });
    }

    const proceedWithNewSubmission = () => {
        setShowDuplicateDialog(false);
        setIdentifiedVehicle({
            plate: existingSubmission.vehicle,
            fleet: 'North Region',
            type: '2-Ton Pickup',
            driver: 'Ali Hassan',
        });
    }

    if (identifiedVehicle) {
        return (
            <div className="p-4">
                <VehicleCard vehicle={identifiedVehicle} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Identify Vehicle</h1>
            <Tabs defaultValue="scan-qr">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="scan-qr"><QrCode className="mr-2" />Scan QR</TabsTrigger>
                    <TabsTrigger value="plate-ocr"><Camera className="mr-2" />Plate OCR</TabsTrigger>
                    <TabsTrigger value="manual"><Edit className="mr-2" />Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="scan-qr" className="mt-4">
                    <CameraView guide="qr" onScanSuccess={handleScanSuccess}/>
                </TabsContent>
                <TabsContent value="plate-ocr" className="mt-4">
                    <CameraView guide="plate" onScanSuccess={handleScanSuccess}/>
                     <Link href="#" className="text-sm text-center block mt-4 text-primary underline">
                        OCR failed? Enter manually
                    </Link>
                </TabsContent>
                <TabsContent value="manual" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enter Plate Number</CardTitle>
                            <CardDescription>Enter the vehicle plate number below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input 
                                placeholder="e.g., A 12345" 
                                value={manualPlate}
                                onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                            />
                            <Button className="w-full" onClick={handleManualSubmit}>Submit</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {/* Duplicate Submission Dialog */}
            <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Duplicate Submission Warning</AlertDialogTitle>
                        <AlertDialogDescription>
                            Today’s reading for this vehicle already exists (Δ +{existingSubmission?.delta} km). 
                            Are you sure you want to create a new submission?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={proceedWithNewSubmission}>Continue Anyway</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
