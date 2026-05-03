"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  honeypotField: z.string().optional(),
});

interface FormSpamSettingsProps {
  formId: string;
  initialData: {
    honeypotField?: string | null;
  };
}

export function FormSpamSettings({
  formId,
  initialData,
}: FormSpamSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      honeypotField: initialData.honeypotField || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          honeypotField: values.honeypotField || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update spam settings");
      }

      toast.success("Spam settings updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spam Protection</CardTitle>
        <CardDescription>
          Configure honeypots to prevent bot submissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Honeypot Field Name</Label>
            <Input placeholder="_honey" {...form.register("honeypotField")} />
            <p className="text-sm text-muted-foreground">
              Add a hidden field with this name to your form. If bots fill it
              out, the submission will be rejected.
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Spam Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
