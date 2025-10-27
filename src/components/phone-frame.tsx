import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-[390px] h-[844px] bg-black rounded-[54px] p-3 shadow-2xl border-4 border-gray-800">
      <div className="w-full h-full bg-black rounded-[42px] relative overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-8 bg-black rounded-b-2xl z-20">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gray-700 rounded-full"></div>
        </div>

        {/* Screen content with safe area */}
        <div className="bg-background text-foreground w-full h-full pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
