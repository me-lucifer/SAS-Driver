
"use client";

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Edit, QrCode, ArrowLeft } from "lucide-react";
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
import { mockVehicles, initialMockSubmissions } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function IdentifyVehiclePage() {
    const [activeTab, setActiveTab] = useState("scan-qr");
    const [identifiedVehicle, setIdentifiedVehicle] = useState<any>(null);
    const [manualPlate, setManualPlate] = useState('');
    const [existingSubmission, setExistingSubmission] = useState<any>(null);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const manualPlateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedVehicle = localStorage.getItem('sessionVehicle');
        if (storedVehicle) {
            setIdentifiedVehicle(JSON.parse(storedVehicle));
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'manual') {
            manualPlateInputRef.current?.focus();
        }
    }, [activeTab]);


    const checkForExistingSubmission = (plate: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const storedSubmissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
        const submission = [...initialMockSubmissions, ...storedSubmissions].find(s => 
            s.vehicle === plate && 
            s.date === today && 
            (s.status === 'Submitted' || s.status === 'Verified')
        );
        return submission;
    };

    const handleVehicleIdentification = (plate: string) => {
        const vehicleData = mockVehicles[plate as keyof typeof mockVehicles];
        if (!vehicleData) {
            toast({
                variant: "destructive",
                title: "Vehicle Not Found",
                description: `No vehicle with plate ${plate} found.`
            });
            return;
        }

        const existing = checkForExistingSubmission(vehicleData.plate);
        if (existing) {
            setExistingSubmission(existing);
            setShowDuplicateDialog(true);
        } else {
            toast({
                variant: "success",
                title: "Vehicle Identified",
                description: `Vehicle ${vehicleData.plate} linked to this session.`
            });
            localStorage.setItem('sessionVehicle', JSON.stringify(vehicleData));
            setIdentifiedVehicle(vehicleData);
        }
    };

    const handleManualSubmit = () => {
        if (manualPlate) {
            handleVehicleIdentification(manualPlate.toUpperCase());
        }
    };
    
    const handleScanSuccess = (scanResult: string) => {
        console.log("Scan successful:", scanResult);
        const plates = Object.keys(mockVehicles);
        const randomPlate = plates[Math.floor(Math.random() * plates.length)];
        handleVehicleIdentification(randomPlate);
    }

    const proceedWithNewSubmission = () => {
        setShowDuplicateDialog(false);
        const vehicleData = mockVehicles[existingSubmission.vehicle as keyof typeof mockVehicles]
        localStorage.setItem('sessionVehicle', JSON.stringify(vehicleData));
        setIdentifiedVehicle(vehicleData);
         toast({
            variant: "success",
            title: "Vehicle Identified",
            description: `Vehicle ${vehicleData.plate} linked to this session.`
        });
    }
    
    const handleChangeVehicle = () => {
        localStorage.removeItem('sessionVehicle');
        setIdentifiedVehicle(null);
    }

    const handleManualLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setActiveTab('manual');
    };

    if (identifiedVehicle) {
        return (
             <div className="flex flex-col h-full">
                <header className="flex items-center p-4 border-b h-16 shrink-0 gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} aria-label="Back">
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-xl font-bold ml-2">Vehicle Identified</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <VehicleCard vehicle={identifiedVehicle} onChangeVehicle={handleChangeVehicle} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 border-b h-16 shrink-0 gap-2">
                 <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} aria-label="Back">
                    <ArrowLeft />
                </Button>
                <h1 className="text-xl font-bold ml-2">Identify Vehicle</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="scan-qr"><QrCode className="mr-2 h-4 w-4" />Scan QR</TabsTrigger>
                        <TabsTrigger value="plate-ocr"><Camera className="mr-2 h-4 w-4" />Plate OCR</TabsTrigger>
                        <TabsTrigger value="manual"><Edit className="mr-2 h-4 w-4" />Manual</TabsTrigger>
                    </TabsList>
                    <TabsContent value="scan-qr" className="mt-4 flex-1">
                        <CameraView guide="qr" onScanSuccess={handleScanSuccess} />
                    </TabsContent>
                    <TabsContent value="plate-ocr" className="mt-4 flex-1">
                        <CameraView guide="plate" onScanSuccess={handleScanSuccess} />
                         <Link href="#" className="text-sm text-center block mt-4 text-primary underline" onClick={handleManualLinkClick}>
                            OCR failed? Enter manually
                        </Link>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-4 flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Plate Number</CardTitle>
                                <CardDescription>Enter the vehicle plate number below.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input 
                                    ref={manualPlateInputRef}
                                    placeholder="e.g., A 12345" 
                                    value={manualPlate}
                                    onChange={(e) => setManualPlate(e.target.value)}
                                    autoCapitalize="characters"
                                    aria-label="Plate Number"
                                />
                                <Button className="w-full" size="lg" onClick={handleManualSubmit}>Submit</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
            
            <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Duplicate Submission Warning</AlertDialogTitle>
                        <AlertDialogDescription>
                            Today’s reading for vehicle <span className="font-bold">{existingSubmission?.vehicle}</span> already exists (Δ +{existingSubmission?.delta} km). 
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
