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

export default function IdentifyVehiclePage() {
    const [identifiedVehicle, setIdentifiedVehicle] = useState(null);
    const [manualPlate, setManualPlate] = useState('');

    // Mock identification logic
    const handleManualSubmit = () => {
        if (manualPlate) {
            setIdentifiedVehicle({
                plate: manualPlate,
                fleet: 'North Region',
                type: '2-Ton Pickup',
                driver: 'Ali Hassan',
            });
        }
    };
    
    // This function will be called by the camera components on successful scan
    const handleScanSuccess = (scanResult: string) => {
        // In a real app, you'd use scanResult to fetch vehicle data
        console.log("Scan successful:", scanResult);
        setIdentifiedVehicle({
            plate: 'A 12345',
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
        </div>
    );
}
