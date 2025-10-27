"use client"

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RefreshCw, Check } from 'lucide-react';
import { useState } from 'react';

export function CameraCard() {
    const [imageSeed, setImageSeed] = useState(1);
    const imageUrl = `https://picsum.photos/seed/${imageSeed}/600/400`;

    const handleRetake = () => {
        setImageSeed(Math.floor(Math.random() * 1000));
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Image
                    src={imageUrl}
                    alt="Camera placeholder"
                    width={600}
                    height={400}
                    className="w-full aspect-[3/2] object-cover bg-muted"
                    data-ai-hint="package delivery photo"
                />
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-2 bg-card">
                <Button variant="outline" onClick={handleRetake}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake
                </Button>
                <Button className="bg-success text-success-foreground hover:bg-success/90">
                    <Check className="mr-2 h-4 w-4" />
                    Use Photo
                </Button>
            </CardFooter>
        </Card>
    );
}
