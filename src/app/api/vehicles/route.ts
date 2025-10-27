
import { NextResponse } from 'next/server';
import { mockVehicles } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');

  if (!plate) {
    return NextResponse.json({ error: 'Plate number is required' }, { status: 400 });
  }

  const vehicle = mockVehicles[plate as keyof typeof mockVehicles];

  if (vehicle) {
    return NextResponse.json(vehicle);
  } else {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }
}
