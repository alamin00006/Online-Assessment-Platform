import { Clock3, X } from "lucide-react";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimeoutOverlayProps {
  description: string;
  onBack: () => void;
}

// Shows the timeout dialog over the active exam screen.
export const TimeoutOverlay = ({ description, onBack }: TimeoutOverlayProps) => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 px-4">
    <Card className="w-full max-w-[560px] rounded-[18px] border border-[#e5ebf3] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
      <CardContent className="space-y-4 px-6 py-10 text-center sm:px-10">
        <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] border-2 border-[#ff4fb3] bg-[#eaf6ff]">
          <Clock3 className="h-8 w-8 text-[#3ba7ff]" strokeWidth={2.4} />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef476f] text-white ring-2 ring-white">
            <X className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>
        <h2 className="font-display text-[22px] font-semibold text-[#334155]">
          Timeout!
        </h2>
        <p className="text-[13px] text-[#718096] sm:text-sm">{description}</p>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-[38px] rounded-[10px] border-[#d7dee7] px-5 text-sm font-medium text-[#475569]"
        >
          Back to Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);


