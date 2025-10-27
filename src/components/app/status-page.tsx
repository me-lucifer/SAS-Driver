'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Coffee, ShieldAlert, CheckCircle } from 'lucide-react';

const statuses = [
  { id: 'en-route', label: 'En Route', icon: Truck, color: 'text-primary' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-success' },
  { id: 'issue', label: 'Issue Reported', icon: ShieldAlert, color: 'text-destructive' },
  { id: 'on-break', label: 'On Break', icon: Coffee, color: 'text-warning' },
];

export default function StatusPage() {
  const [selectedStatus, setSelectedStatus] = useState('en-route');

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Your Status</CardTitle>
          <CardDescription>Let dispatch know what your current delivery status is.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-3">
            {statuses.map((status) => {
              const Icon = status.icon;
              return (
                <Label
                  key={status.id}
                  htmlFor={status.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedStatus === status.id
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem value={status.id} id={status.id} className="h-5 w-5" />
                  <Icon className={`h-6 w-6 ${selectedStatus === status.id ? status.color : 'text-muted-foreground'}`} />
                  <span className="font-medium text-foreground flex-1">{status.label}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
      <div className="px-1">
        <Button size="lg" className="w-full">
          Confirm Status Change
        </Button>
      </div>
    </div>
  );
}
