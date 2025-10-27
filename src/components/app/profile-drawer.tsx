
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { InfoRow } from './info-row';
import { LogOut, Globe, Camera, HelpCircle, ShieldAlert } from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProfileDrawerProps {
    user: User | null;
    onLogout: () => void;
}

export function ProfileDrawer({ user, onLogout }: ProfileDrawerProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const driverInfo = {
        name: user?.displayName || 'Ali Hassan',
        id: 'SAS-042',
        fleet: 'North Region',
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="https://picsum.photos/seed/driver/40/40" alt="Driver" data-ai-hint="person portrait" />
                        <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || 'DR'}</AvatarFallback>
                    </Avatar>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                    <SheetHeader className="text-left">
                        <SheetTitle>Profile & Settings</SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-6">
                        {/* Driver Info */}
                        <div className="space-y-2">
                            <InfoRow label="Driver Name" value={driverInfo.name} />
                            <InfoRow label="Driver ID" value={driverInfo.id} />
                            <InfoRow label="Fleet" value={driverInfo.fleet} />
                        </div>

                        {/* Language Settings */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                               <Globe className="h-4 w-4 text-muted-foreground" /> Language
                            </h3>
                            <Select defaultValue="en">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Help & Safety */}
                        <Accordion type="single" collapsible defaultValue="capture-tips" className="w-full">
                             <AccordionItem value="capture-tips">
                                <AccordionTrigger>
                                    <div className="flex items-center gap-2 font-semibold">
                                        <Camera className="h-4 w-4 text-muted-foreground" />
                                        Capture Tips
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 pt-2 text-muted-foreground">
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Ensure the odometer is well-lit.</li>
                                        <li>Avoid glare or reflections on the screen.</li>
                                        <li>Center the digits within the capture frame.</li>
                                        <li>Hold the device steady to prevent blur.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="help">
                                <AccordionTrigger>
                                    <div className="flex items-center gap-2 font-semibold">
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                        Help & Safety
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2 text-muted-foreground">
                                    <h4 className="font-semibold text-foreground flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Reporting Issues</h4>
                                    <p className="text-sm">
                                        If you encounter any issues with the app or your vehicle, please contact dispatch immediately for assistance.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    
                    <SheetFooter>
                        <Button variant="outline" className="w-full" onClick={() => setShowLogoutDialog(true)}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your session will be ended and you will be returned to the welcome screen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Log Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
