"use client";

import { useState } from 'react';
import { Map, PackageCheck, CircleDashed, MessageSquare, LayoutGrid, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RoutePage from '@/components/app/route-page';
import DeliveryPage from '@/components/app/delivery-page';
import StatusPage from '@/components/app/status-page';
import MessagesPage from '@/components/app/messages-page';
import UIKitPage from '@/components/app/uikit-page';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFirebaseApp } from '@/firebase';

const TABS = {
  ROUTE: 'route',
  DELIVERY: 'delivery',
  STATUS: 'status',
  MESSAGES: 'messages',
  UIKIT: 'uikit',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS.ROUTE);
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const router = useRouter();


  const handleLogout = async () => {
    await auth.signOut();
    router.push('/welcome');
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case TABS.ROUTE:
        return 'Current Route';
      case TABS.DELIVERY:
        return 'Confirm Delivery';
      case TABS.STATUS:
        return 'Update Status';
      case TABS.MESSAGES:
        return 'Dispatch';
      case TABS.UIKIT:
        return 'UI Kit';
      default:
        return 'SAS Driver';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full">
        <header className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-bold text-foreground">{getHeaderTitle()}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src="https://picsum.photos/seed/driver/40/40" alt="Driver" data-ai-hint="person portrait" />
                    <AvatarFallback>{auth.currentUser?.phoneNumber?.slice(-2) || 'DR'}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto">
            <TabsContent value={TABS.ROUTE} className="mt-0 data-[state=inactive]:hidden">
              <RoutePage />
            </TabsContent>
            <TabsContent value={TABS.DELIVERY} className="mt-0 data-[state=inactive]:hidden">
              <DeliveryPage />
            </TabsContent>
            <TabsContent value={TABS.STATUS} className="mt-0 data-[state=inactive]:hidden">
              <StatusPage />
            </TabsContent>
            <TabsContent value={TABS.MESSAGES} className="mt-0 data-[state=inactive]:hidden">
              <MessagesPage />
            </TabsContent>
             <TabsContent value={TABS.UIKIT} className="mt-0 data-[state=inactive]:hidden">
              <UIKitPage />
            </TabsContent>
        </main>
        
        <TabsList className="grid w-full grid-cols-5 h-16 rounded-none mt-auto bg-card border-t p-0">
          <TabsTrigger value={TABS.ROUTE} className="h-full flex flex-col gap-1 rounded-none data-[state=active]:text-primary data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:bg-accent focus-visible:ring-inset">
            <Map className="h-5 w-5" />
            <span className="text-xs">Route</span>
          </TabsTrigger>
          <TabsTrigger value={TABS.DELIVERY} className="h-full flex flex-col gap-1 rounded-none data-[state=active]:text-primary data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:bg-accent focus-visible:ring-inset">
            <PackageCheck className="h-5 w-5" />
            <span className="text-xs">Delivery</span>
          </TabsTrigger>
          <TabsTrigger value={TABS.STATUS} className="h-full flex flex-col gap-1 rounded-none data-[state=active]:text-primary data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:bg-accent focus-visible:ring-inset">
            <CircleDashed className="h-5 w-5" />
            <span className="text-xs">Status</span>
          </TabsTrigger>
          <TabsTrigger value={TABS.MESSAGES} className="h-full flex flex-col gap-1 rounded-none data-[state=active]:text-primary data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:bg-accent focus-visible:ring-inset">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Messages</span>
          </TabsTrigger>
          <TabsTrigger value={TABS.UIKIT} className="h-full flex flex-col gap-1 rounded-none data-[state=active]:text-primary data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:bg-accent focus-visible:ring-inset">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs">UI Kit</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
