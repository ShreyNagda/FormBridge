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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Form name must be at least 2 characters."),
  redirectSuccess: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  allowedOrigins: z.string().optional(),
});

interface FormGeneralSettingsProps {
  formId: string;
  initialData: {
    name: string;
    redirectSuccess?: string | null;
    allowedOrigins?: string[];
  };
}

export function FormGeneralSettings({
  formId,
  initialData,
}: FormGeneralSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      redirectSuccess: initialData.redirectSuccess || "",
      allowedOrigins: initialData.allowedOrigins?.join(", ") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const originsArray = values.allowedOrigins
        ? values.allowedOrigins
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          redirectSuccess: values.redirectSuccess || undefined,
          allowedOrigins: originsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update form");
      }

      toast.success("General settings updated successfully");
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
        <CardTitle>General</CardTitle>
        <CardDescription>Update your form's basic information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Redirect URL (Optional)</Label>
            <Input
              placeholder="https://example.com/thank-you"
              {...form.register("redirectSuccess")}
            />
            <p className="text-sm text-muted-foreground">
              Users will be redirected here after a successful submission.
            </p>
            {form.formState.errors.redirectSuccess && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.redirectSuccess.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Allowed Origins (Optional)</Label>
            <Textarea
              placeholder="https://example.com, https://blog.example.com"
              {...form.register("allowedOrigins")}
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of allowed domains. Leave blank to allow any
              origin.
            </p>
            {form.formState.errors.allowedOrigins && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.allowedOrigins.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
