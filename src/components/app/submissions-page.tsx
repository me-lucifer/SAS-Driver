
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, ListFilter, Search } from 'lucide-react';
import { EmptyState } from './empty-state';
import { FileText } from 'lucide-react';
import { StatusChip } from './status-chip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const mockSubmissions = [
    {
        id: '1',
        date: '2024-07-28',
        vehicle: 'A 12345',
        odometer: 123456,
        delta: 276,
        status: 'Verified',
    },
    {
        id: '2',
        date: '2024-07-27',
        vehicle: 'A 12345',
        odometer: 123180,
        delta: 251,
        status: 'Verified',
    },
    {
        id: '3',
        date: '2024-07-26',
        vehicle: 'B 67890',
        odometer: 89543,
        delta: -10,
        status: 'Flagged',
    },
];

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState(mockSubmissions);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const router = useRouter();


    const filteredSubmissions = submissions.filter(submission => {
        const matchesSearch = submission.vehicle.toLowerCase().includes(search.toLowerCase());
        const matchesDate = !date || submission.date === format(date, 'yyyy-MM-dd');
        return matchesSearch && matchesDate;
    });

    const handleRowClick = (id: string) => {
        router.push(`/submissions/${id}`);
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
                                                Δ {sub.delta} km
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={FileText}
                            title="No submissions yet"
                            description="Capture your first odometer reading to see it here."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
