"use client";

import { useState } from "react";
import { AsyncButton } from "@/components/shared/async-button";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface TestFormButtonProps {
  formId: string;
  isActive: boolean;
}

export default function TestFormButton({
  formId,
  isActive,
}: TestFormButtonProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const handleTestSubmission = async () => {
    if (!isActive) return;

    setStatus("idle");

    try {
      const response = await fetch(`/api/submit/${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          name: "Test User",
          subject: "Test Submission",
          message: "This is a test submission sent from your dashboard.",
          _test: true, // Optional flag if you want to mark it in backend
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send test submission");
      }

      setStatus("success");
      toast.success("Test submission sent!");
      router.refresh(); // Refresh to show the new submission in the table

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Test submission error:", error);
      setStatus("error");
      toast.error("Failed to send test submission");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AsyncButton
        variant="secondary"
        onClick={handleTestSubmission}
        disabled={!isActive}
        className="gap-2"
        title={!isActive ? "Form is disabled" : "Send a test submission"}
        loadingText="Send Test"
      >
        {status === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-600" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "success"
          ? "Sent!"
          : status === "error"
          ? "Failed"
          : "Send Test"}
      </AsyncButton>
    </div>
  );
}
