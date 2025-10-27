import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Package, ShieldAlert, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DeliveryPage() {
  const currentStop = {
    address: '456 Oak Ave, Shelbyville',
    recipient: 'Jane Smith',
    packageId: 'PKG-54321',
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Stop</CardTitle>
          <CardDescription>Details for the next delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Truck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold">{currentStop.address}</p>
              <p className="text-sm text-muted-foreground">Recipient: {currentStop.recipient}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Package className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="font-mono text-sm text-muted-foreground">{currentStop.packageId}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
            <Button size="lg" className="w-full bg-success text-success-foreground hover:bg-success/90">
                Confirm Successful Delivery
            </Button>
            <Button size="lg" variant="secondary" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Upload Photo
            </Button>
            <Separator className="my-1" />
            <Button size="lg" variant="destructive" className="w-full">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Report Delivery Issue
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
