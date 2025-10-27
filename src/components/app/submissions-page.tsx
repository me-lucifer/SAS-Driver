
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, ListFilter, Search, RefreshCw } from 'lucide-react';
import { EmptyState } from './empty-state';
import { FileText } from 'lucide-react';
import { StatusChip } from './status-chip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useToast } from '@/hooks/use-toast';
import { initialMockSubmissions } from '@/lib/mock-data';


export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const router = useRouter();
    const isOnline = useOnlineStatus();
    const { toast } = useToast();
    const [offlineSubmissions, setOfflineSubmissions] = useState<any[]>([]);

    useEffect(() => {
        // Initialize mock submissions in local storage if not present
        if (!localStorage.getItem('mockSubmissions')) {
            localStorage.setItem('mockSubmissions', JSON.stringify(initialMockSubmissions));
        }
        
        // Load submissions from local storage
        const storedSubmissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
        const storedOffline = JSON.parse(localStorage.getItem('offlineSubmissions') || '[]');
        
        setSubmissions(storedSubmissions);
        setOfflineSubmissions(storedOffline);

    }, []);

    const allSubmissions = [...offlineSubmissions, ...submissions];

    const filteredSubmissions = allSubmissions.filter(submission => {
        const matchesSearch = submission.vehicle.toLowerCase().includes(search.toLowerCase());
        const matchesDate = !date || submission.date === format(date, 'yyyy-MM-dd');
        return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    const handleRowClick = (id: string) => {
        if (id.startsWith('offline-')) {
            toast({
                title: 'Submission Not Synced',
                description: 'This submission is saved locally and will be available once you are online.',
                variant: 'default',
            });
            return;
        }
        router.push(`/submissions/${id}`);
    }

    const handleSync = () => {
        if (!isOnline) {
            toast({
                variant: "destructive",
                title: "Sync Failed",
                description: "You must be online to sync submissions.",
            });
            return;
        }
        
        toast({
            title: "Syncing...",
            description: `${offlineSubmissions.length} submissions are being synced.`
        });
        
        setTimeout(() => {
            const syncedSubmissions = offlineSubmissions.map(sub => ({
                ...sub,
                id: sub.id.replace('offline-', `synced-${Math.random()}`),
                status: 'Submitted'
            }));

            const updatedSubmissions = [...syncedSubmissions, ...submissions];
            setSubmissions(updatedSubmissions);
            localStorage.setItem('mockSubmissions', JSON.stringify(updatedSubmissions));

            localStorage.removeItem('offlineSubmissions');
            setOfflineSubmissions([]);

            toast({
                title: "Sync Complete!",
                description: "All offline submissions have been synced.",
            });

        }, 2000);
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">My Submissions</h1>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>History</CardTitle>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <ListFilter className="h-4 w-4"/>
                                    Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" align="end">
                               <div className="space-y-4">
                                    <h4 className="font-medium leading-none">Filter Submissions</h4>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search by plate..."
                                            className="pl-9"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    { (search || date) && (
                                        <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDate(undefined); }}>
                                            Clear Filters
                                        </Button>
                                    )}
                               </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent>
                    {offlineSubmissions.length > 0 && (
                        <div className="mb-4">
                             <Button onClick={handleSync} disabled={!isOnline} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Sync {offlineSubmissions.length} Offline Submission{offlineSubmissions.length > 1 ? 's' : ''}
                            </Button>
                        </div>
                    )}
                    {filteredSubmissions.length > 0 ? (
                        <div className="space-y-3">
                            {filteredSubmissions.map((sub) => (
                                <Card key={sub.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleRowClick(sub.id)}>
                                    <CardContent className="p-4 grid grid-cols-3 items-center gap-4">
                                        <div className="col-span-2 space-y-1">
                                            <p className="font-semibold">{format(new Date(sub.date), 'MMMM d, yyyy')}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {sub.vehicle} &middot; {sub.odometer.toLocaleString()} km
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            <StatusChip status={sub.status as any} />
                                            <p className="text-xs font-mono text-muted-foreground">
                                                Δ {sub.delta.toLocaleString()} km
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={FileText}
                            title="No submissions found"
                            description="Your vehicle logs will appear here once you submit them."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
