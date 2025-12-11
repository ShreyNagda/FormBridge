import { cn } from "@/lib/utils";
import CopyButton from "./copy-button";
import { Card } from "./card";

interface TerminalCodeProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showCopy?: boolean;
}

export default function TerminalCode({
  code,
  language = "bash",
  title = "bash",
  className,
  showCopy = true,
}: TerminalCodeProps) {
  return (
    <Card
      className={cn(
        "p-0 hover:-translate-y-1 duration-500 rounded-lg shadow-2xl overflow-hidden bg-gray-900 text-white",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          {title && (
            <span className="text-xs text-gray-400 ml-2 font-mono">
              {title}
            </span>
          )}
        </div>
        {showCopy && (
          <div className="flex items-center">
            <CopyButton
              text={code}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            />
          </div>
        )}
      </div>
      <div className="p-6">
        <pre className="font-mono text-white/60! text-sm leading-relaxed whitespace-pre-wrap break-all">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </Card>
  );
}
