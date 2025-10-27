'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { CameraCard } from '@/components/app/camera-card';
import { StatusChip } from '@/components/app/status-chip';
import { InfoRow } from '@/components/app/info-row';
import { EmptyState } from '@/components/app/empty-state';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PackageSearch } from 'lucide-react';

export default function UIKitPage() {
  const { toast } = useToast();

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="lg">Large Primary Button</Button>
            <Button>Default Primary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="text" placeholder="Text input" />
            <Input type="number" placeholder="Number input" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <p className="text-sm text-muted-foreground mb-2">OTP Input</p>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Camera Card</CardTitle>
            </CardHeader>
            <CardContent>
                <CameraCard />
            </CardContent>
        </Card>


        <Card>
            <CardHeader>
                <CardTitle>Status Chips</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <StatusChip status="Submitted" />
                <StatusChip status="Verified" />
                <StatusChip status="Flagged" />
                <StatusChip status="Warning" />
                <StatusChip status="Offline" />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Info Row</CardTitle>
            </CardHeader>
            <CardContent>
                <InfoRow label="Tracking ID" value="123-ABC-789" />
                <InfoRow label="Status" value={<StatusChip status="Verified" />} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Empty State</CardTitle>
            </CardHeader>
            <CardContent>
                <EmptyState icon={PackageSearch} title="No Deliveries Found" description="There are no deliveries scheduled for today."/>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toasts</CardTitle>
          </CardHeader>
          <CardContent className="space-x-2">
            <Button
              onClick={() => {
                toast({
                  title: 'Success!',
                  description: 'Your action was completed.',
                });
              }}
            >
              Show Success
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  variant: 'destructive',
                  title: 'Error!',
                  description: 'Something went wrong.',
                });
              }}
            >
              Show Error
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
