import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "./info-row";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

type Vehicle = {
    plate: string;
    fleet: string;
    type: string;
    driver: string | null;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vehicle Identified</CardTitle>
                <CardDescription>The following vehicle details were found.</CardDescription>
            </CardHeader>
            <CardContent>
                <InfoRow label="Plate Number" value={vehicle.plate} />
                <InfoRow label="Fleet" value={vehicle.fleet} />
                <InfoRow label="Vehicle Type" value={vehicle.type} />
                <InfoRow label="Assigned Driver" value={vehicle.driver || 'None'} />
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">
                    Next: Odometer
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
