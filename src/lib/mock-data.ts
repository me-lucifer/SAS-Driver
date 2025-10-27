
import { format, subDays } from 'date-fns';
import { Check, Edit, FileWarning } from 'lucide-react';

export const mockVehicles: Record<string, any> = {
    'A 12345': { plate: 'A 12345', fleet: 'North Fleet', type: 'Van', driver: 'Ali Hassan', lastOdometer: 25650 },
    'B 67890': { plate: 'B 67890', fleet: 'North', type: 'Truck', driver: null, lastOdometer: 55600 },
    'C 24680': { plate: 'C 24680', fleet: 'South', type: 'Truck', driver: 'John Doe', lastOdometer: 88650 },
};

// Use a fixed year for consistent mock dates
const CURRENT_YEAR = new Date().getFullYear();

export const initialMockSubmissions: any[] = [
    {
        id: '1',
        date: format(new Date(`${CURRENT_YEAR}-10-27`), 'yyyy-MM-dd'),
        vehicle: 'A 12345',
        odometer: 25650,
        delta: 218,
        status: 'Verified',
    },
    {
        id: '2',
        date: format(new Date(`${CURRENT_YEAR}-10-26`), 'yyyy-MM-dd'),
        vehicle: 'A 12345',
        odometer: 25432,
        delta: 210,
        status: 'Submitted',
    },
    {
        id: '3',
        date: format(new Date(`${CURRENT_YEAR}-10-25`), 'yyyy-MM-dd'),
        vehicle: 'B 67890',
        odometer: 55600,
        delta: 100,
        status: 'Flagged',
    },
];

export const mockSubmissionDetails: Record<string, any> = {
    '1': {
        id: '1',
        dateTime: new Date(`${CURRENT_YEAR}-10-27T08:05:00`),
        vehicle: { plate: 'A 12345', type: 'Van' },
        odometer: 25650,
        delta: 218,
        photoUrl: 'https://picsum.photos/seed/sub1/600/400',
        location: 'Muscat, Oman',
        notes: 'Vehicle is clean.',
        ocr: { value: 25650, confidence: '99.1%' },
        edits: null,
        reviewerNotes: null,
        flags: [],
        status: 'Verified',
        history: [
            { status: 'Verified', user: 'Admin', time: new Date(`${CURRENT_YEAR}-10-27T09:15:00`), icon: Check },
            { status: 'Submitted', user: 'Driver', time: new Date(`${CURRENT_YEAR}-10-27T08:05:00`), icon: Edit },
        ]
    },
    '2': {
        id: '2',
        dateTime: new Date(`${CURRENT_YEAR}-10-26T08:10:00`),
        vehicle: { plate: 'A 12345', type: 'Van' },
        odometer: 25432,
        delta: 210,
        photoUrl: 'https://picsum.photos/seed/sub2/600/400',
        location: 'Barka, Oman',
        notes: '',
        ocr: { value: 25432, confidence: '98.5%' },
        edits: null,
        reviewerNotes: null,
        flags: [],
        status: 'Submitted',
        history: [
            { status: 'Submitted', user: 'Driver', time: new Date(`${CURRENT_YEAR}-10-26T08:10:00`), icon: Edit },
        ]
    },
     '3': {
        id: '3',
        dateTime: new Date(`${CURRENT_YEAR}-10-25T07:58:00`),
        vehicle: { plate: 'B 67890', type: 'Truck' },
        odometer: 55600,
        delta: 100,
        photoUrl: 'https://picsum.photos/seed/sub3/600/400',
        location: 'Sohar, Oman',
        notes: 'Scratched during delivery.',
        ocr: { value: 5560, confidence: '85.2%' },
        edits: { reason: "OCR missed last digit", correctedValue: 55600 },
        reviewerNotes: "Driver corrected OCR result.",
        status: 'Flagged',
        flags: ["Low OCR"],
        history: [
            { status: 'Flagged', user: 'System', time: new Date(`${CURRENT_YEAR}-10-25T07:59:00`), icon: FileWarning },
            { status: 'Submitted', user: 'Driver', time: new Date(`${CURRENT_YEAR}-10-25T07:58:00`), icon: Edit },
        ]
    }
};
