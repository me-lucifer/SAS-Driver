
import { NextResponse } from 'next/server';
import { initialMockSubmissions } from '@/lib/mock-data';

// GET /api/odometer-submissions?driver_id&from&to
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get('driver_id');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // In a real app, you would use these params to filter data from a database.
  // Here, we just return all mock submissions.
  // We can add filtering logic if needed.
  console.log('GET /api/odometer-submissions called with:', { driverId, from, to });
  
  return NextResponse.json(initialMockSubmissions);
}

// POST /api/odometer-submissions
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // (payload: ts, vehicle, photo_url, odo_value, ocr_confidence, gps, notes)
        console.log('POST /api/odometer-submissions called with payload:', body);

        const newSubmission = {
            id: `server-${Date.now()}`,
            date: new Date(body.ts).toISOString().split('T')[0],
            vehicle: body.vehicle.plate,
            odometer: body.odo_value,
            delta: body.delta, // Assuming delta is passed, or calculate it here
            status: 'Submitted',
        };

        // In a real app, you'd save this to a database.
        // Here we can prepend it to our in-memory list for subsequent GET requests if needed,
        // but for now, we'll just log it.
        
        return NextResponse.json({ success: true, submission: newSubmission }, { status: 201 });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
}
