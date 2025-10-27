import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, Navigation } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const routeStops = [
  { id: 1, address: '123 Maple St, Springfield', status: 'Delivered' },
  { id: 2, address: '456 Oak Ave, Shelbyville', status: 'Next' },
  { id: 3, address: '789 Pine Ln, Capital City', status: 'Pending' },
];

const mapImage = PlaceHolderImages.find(p => p.id === 'map-placeholder');

export default function RoutePage() {
  return (
    <div className="p-4 space-y-4">
      {mapImage && (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-0 relative">
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              data-ai-hint={mapImage.imageHint}
              width={390}
              height={200}
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute bottom-4 right-4">
              <Button>
                <Navigation className="mr-2 h-4 w-4" />
                Start Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Delivery Stops</CardTitle>
          <List className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-4">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${stop.status === 'Next' ? 'bg-primary text-primary-foreground' : stop.status === 'Delivered' ? 'bg-success text-success-foreground' : 'bg-muted'}`}>
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{stop.address}</p>
                </div>
                <Badge variant={stop.status === 'Next' ? 'default' : stop.status === 'Delivered' ? 'outline' : 'secondary'} className={stop.status === 'Delivered' ? 'border-success text-success' : ''}>
                  {stop.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
