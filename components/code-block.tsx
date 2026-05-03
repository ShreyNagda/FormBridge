// components/code-block.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded-lg border border-border bg-code-bg p-4 font-mono text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-gray-700/50 dark:bg-gray-600/50 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-600 dark:hover:bg-gray-500"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-200 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
}
