import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}

export function Card({ children, className, icon: Icon, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-px group",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-lg bg-emerald-50 lg:bg-gray-50 flex items-center justify-center lg:group-hover:text-emerald-600 mb-4 lg:group-hover:bg-emerald-50 transition-colors duration-200">
          <Icon className="size-8" />
        </div>
      )}
      {children}
    </div>
  );
}
