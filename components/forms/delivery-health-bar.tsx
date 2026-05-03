import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeliveryHealthBarProps {
  successRate: number; // 0 to 100
}

export function DeliveryHealthBar({ successRate }: DeliveryHealthBarProps) {
  let colorClass = "bg-green-500";
  if (successRate < 90) colorClass = "bg-amber-500";
  if (successRate < 70) colorClass = "bg-red-500";
  if (successRate === 0) colorClass = "bg-muted";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
              <div
                className={`h-full ${colorClass} transition-all duration-500`}
                style={{ width: `${successRate}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {successRate.toFixed(1)}% delivery rate (last 7 days)
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Based on successful webhook deliveries vs total attempts.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
