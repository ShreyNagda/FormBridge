"use client";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function CopyButton({
  text,
  callback,
}: {
  text: string;
  callback?: () => void;
}) {
  const [clicked, setClicked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <Button
      className="cursor-pointer transition-all duration-500"
      onClick={handleCopy}
    >
      {clicked ? <Check /> : <Copy />}
    </Button>
  );
}
