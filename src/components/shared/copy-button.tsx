"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "react-toastify";

export default function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg transition-colors ${
        className || "text-gray-700 hover:bg-gray-100"
      }`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={18} className="text-green-600" />
      ) : (
        <Copy size={18} />
      )}
    </button>
  );
}
