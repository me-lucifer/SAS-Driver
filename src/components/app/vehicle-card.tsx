
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "./info-row";
import { Button } from "../ui/button";
import { ArrowRight, Undo2 } from "lucide-react";
import Link from "next/link";

type Vehicle = {
    plate: string;
    fleet: string;
    type: string;
    driver: string | null;
    lastOdometer: number;
}

export function VehicleCard({ vehicle, onChangeVehicle }: { vehicle: Vehicle, onChangeVehicle: () => void }) {
    
    const odometerLink = `/odometer-capture?${new URLSearchParams({
        lastOdometer: vehicle.lastOdometer.toString(),
        plate: vehicle.plate,
        type: vehicle.type,
    })}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>The following vehicle details were found.</CardDescription>
            </CardHeader>
            <CardContent>
                <InfoRow label="Plate Number" value={vehicle.plate} />
                <InfoRow label="Fleet" value={vehicle.fleet} />
                <InfoRow label="Vehicle Type" value={vehicle.type} />
                <InfoRow label="Assigned Driver" value={vehicle.driver || 'None'} />
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                <Link href={odometerLink} className="w-full">
                    <Button className="w-full" size="lg">
                        Next: Odometer
                        <ArrowRight className="ml-auto" />
                    </Button>
                </Link>
                <Button variant="link" className="text-muted-foreground" onClick={onChangeVehicle}>
                    <Undo2 className="mr-2"/>
                    Change vehicle
                </Button>
            </CardFooter>
        </Card>
    )
}
