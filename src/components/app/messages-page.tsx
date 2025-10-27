import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const messages = [
  { id: 1, sender: 'dispatch', text: 'Heads up, traffic is heavy on I-5. Consider an alternate route.', time: '10:30 AM' },
  { id: 2, sender: 'driver', text: 'Roger that. Rerouting through downtown.', time: '10:31 AM' },
  { id: 3, sender: 'dispatch', text: 'Good copy. Let us know if you need further assistance.', time: '10:32 AM' },
  { id: 4, sender: 'driver', text: 'Will do. Approaching the next stop now.', time: '10:45 AM' },
];

const dispatchAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1');
const driverAvatar = {imageUrl: 'https://picsum.photos/seed/driver/40/40', imageHint: "person portrait"};

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'dispatch' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {dispatchAvatar && <AvatarImage src={dispatchAvatar.imageUrl} data-ai-hint={dispatchAvatar.imageHint} />}
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                  message.sender === 'driver'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'driver' ? 'text-primary-foreground/70' : 'text-muted-foreground'} text-right`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 bg-card border-t">
        <form className="flex items-center gap-2">
          <Input placeholder="Type a message..." className="flex-1" autoComplete="off"/>
          <Button type="submit" size="icon" aria-label="Send Message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
