"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, X, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Form name must be at least 2 characters.",
  }),
  allowedOrigins: z.string().optional(),
  redirectUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  emailNotifications: z.boolean().default(true),
});

export default function NewFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [showAddEmail, setShowAddEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      allowedOrigins: "",
      redirectUrl: "",
      emailNotifications: true,
    },
  });

  const handleAddEmail = () => {
    const trimmed = newEmail.trim();

    if (!trimmed) {
      toast.error("Email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Invalid email format");
      return;
    }

    if (notificationEmails.includes(trimmed)) {
      toast.error("Email already added");
      return;
    }

    setNotificationEmails([...notificationEmails, trimmed]);
    setNewEmail("");
    setShowAddEmail(false);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setNotificationEmails(
      notificationEmails.filter((email) => email !== emailToRemove),
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const originsArray = values.allowedOrigins
        ? values.allowedOrigins
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          allowedOrigins: originsArray,
          redirectSuccess: values.redirectUrl || undefined,
          emailNotifications: values.emailNotifications,
          notificationEmails: values.emailNotifications
            ? notificationEmails
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create form");
      }

      const data = await response.json();
      toast.success("Form created successfully");
      router.push(`/dashboard/forms/${data.id}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Form</h1>
        <p className="text-muted-foreground">
          Set up a new endpoint to receive form submissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
          <CardDescription>
            Configure the basic details for your new form endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Contact Form" {...form.register("name")} />
              <p className="text-sm text-muted-foreground">
                A friendly name to identify this form.
              </p>
              {form.formState.errors.name && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Allowed Origins (Optional)
              </label>
              <Textarea
                placeholder="https://example.com, https://blog.example.com"
                {...form.register("allowedOrigins")}
              />
              <p className="text-sm text-muted-foreground">
                Comma-separated list of allowed domains. Leave blank to allow
                any origin.
              </p>
              {form.formState.errors.allowedOrigins && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.allowedOrigins.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Redirect URL (Optional)
              </label>
              <Input
                placeholder="https://example.com/thank-you"
                {...form.register("redirectUrl")}
              />
              <p className="text-sm text-muted-foreground">
                Users will be redirected here after a successful submission.
              </p>
              {form.formState.errors.redirectUrl && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.redirectUrl.message as string}
                </p>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold">
                Email Notifications
              </h3>

              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  {...form.register("emailNotifications")}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor="emailNotifications"
                  className="text-sm font-medium"
                >
                  Send email notifications for form submissions
                </label>
              </div>

              {form.watch("emailNotifications") && (
                <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Leave empty to use your account's default notification
                    email.
                  </p>

                  {notificationEmails.length > 0 && (
                    <div className="space-y-2">
                      {notificationEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between rounded border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950"
                        >
                          <span className="text-sm">{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(email)}
                            className="text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddEmail ? (
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddEmail();
                          } else if (e.key === "Escape") {
                            setShowAddEmail(false);
                            setNewEmail("");
                          }
                        }}
                        autoFocus
                      />
                      <Button type="button" size="sm" onClick={handleAddEmail}>
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAddEmail(false);
                          setNewEmail("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddEmail(true)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Email
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
