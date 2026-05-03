"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface TestSubmissionButtonProps {
  formId: string;
}

export function TestSubmissionButton({ formId }: TestSubmissionButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runTestSubmission = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/submit/${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "Test submission from dashboard button.",
        }),
      });

      if (!response.ok) {
        let message = "Failed to send test submission.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) {
            message = data.error;
          }
        } catch {
          // Ignore non-JSON responses and keep default message.
        }
        throw new Error(message);
      }

      toast.success(
        "Test submission sent. Check your email inbox and webhook delivery logs.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send test submission.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button onClick={runTestSubmission} disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Test Submission
    </Button>
  );
}
