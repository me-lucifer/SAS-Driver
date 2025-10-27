"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
    const isOnline = useOnlineStatus();

    if (isOnline) {
        return null;
    }

    return (
        <div className="bg-amber-500 text-white text-xs text-center p-1 flex items-center justify-center gap-2">
            <WifiOff className="h-3 w-3" />
            <p>You are offline. Submissions will sync automatically when you reconnect.</p>
        </div>
    );
}
