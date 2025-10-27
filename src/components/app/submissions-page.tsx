"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, ListFilter, Search, RefreshCw, ArrowLeft, Check, X } from 'lucide-react';
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
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

type Status = "Submitted" | "Verified" | "Flagged" | "Offline";

const statusOptions: Status[] = ["Submitted", "Verified", "Flagged", "Offline"];


export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
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
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(submission.status);
        return matchesSearch && matchesDate && matchesStatus;
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
    
    const handleStatusChange = (status: Status) => {
        setSelectedStatuses(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status) 
                : [...prev, status]
        );
    };

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
    
    const clearFilters = () => {
        setSearch('');
        setDate(undefined);
        setSelectedStatuses([]);
    };

    const hasFilters = search || date || selectedStatuses.length > 0;

    return (
        <div className="flex flex-col h-full bg-background">
             <header className="flex items-center p-4 border-b h-16 shrink-0 gap-2">
                 <Link href="/dashboard" passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold flex-1">My Submissions</h1>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="relative">
                            <ListFilter className="h-4 w-4"/>
                            {hasFilters && <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-primary" />}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                       <div className="space-y-4">
                            <h4 className="font-medium leading-none">Filter Submissions</h4>
                            
                            <div className="space-y-2">
                                <Label>Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by plate..."
                                        className="pl-9 h-10"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
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
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {statusOptions.map(status => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`status-${status}`} 
                                                checked={selectedStatuses.includes(status)}
                                                onCheckedChange={() => handleStatusChange(status)}
                                            />
                                            <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                                                {status}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {hasFilters && (
                                <>
                                    <Separator />
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                                        Clear Filters
                                    </Button>
                                </>
                            )}
                       </div>
                    </PopoverContent>
                </Popover>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {offlineSubmissions.length > 0 && (
                    <div className="mb-4">
                         <Button onClick={handleSync} disabled={!isOnline} className="w-full" size="lg">
                            <RefreshCw className={`mr-2 h-4 w-4 ${!isOnline ? '' : 'animate-spin'}`} />
                            Sync {offlineSubmissions.length} Offline Submission{offlineSubmissions.length > 1 ? 's' : ''}
                        </Button>
                    </div>
                )}
                {filteredSubmissions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredSubmissions.map((sub) => (
                            <Card key={sub.id} className="rounded-2xl hover:bg-muted/50 cursor-pointer shadow-sm" onClick={() => handleRowClick(sub.id)}>
                                <CardContent className="p-4 grid grid-cols-3 items-center gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <p className="font-semibold text-foreground">{format(new Date(sub.date), 'MMMM d, yyyy')}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {sub.vehicle} &middot; {sub.odometer.toLocaleString()} km
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1.5">
                                        <StatusChip status={sub.status as any} />
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            Δ {sub.delta.toLocaleString()} km
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className='pt-16'>
                        <EmptyState 
                            icon={FileText}
                            title={allSubmissions.length === 0 ? "No submissions yet" : "No Submissions Found"}
                            description={allSubmissions.length === 0 ? "Capture your first odometer reading to see it here." : "Your submissions for the selected filters will appear here."}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
