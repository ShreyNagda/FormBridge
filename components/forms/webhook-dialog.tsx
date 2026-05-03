"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WEBHOOK_CHANNELS, type WebhookChannel } from "@/lib/db/models";

const webhookSchema = z.object({
  channel: z.enum(WEBHOOK_CHANNELS),
  enabled: z.boolean().default(true),
  config: z.record(z.any()),
});

type WebhookFormValues = z.infer<typeof webhookSchema>;

interface WebhookDialogProps {
  formId: string;
  webhook?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WebhookDialog({
  formId,
  webhook,
  open,
  onOpenChange,
  onSuccess,
}: WebhookDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!webhook;

  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      channel: "DISCORD",
      enabled: true,
      config: {},
    },
  });

  const channel = form.watch("channel");

  useEffect(() => {
    if (webhook) {
      form.reset({
        channel: webhook.channel,
        enabled: webhook.enabled,
        config: webhook.config || {},
      });
    } else {
      form.reset({
        channel: "DISCORD",
        enabled: true,
        config: {},
      });
    }
  }, [webhook, form, open]);

  async function onSubmit(values: WebhookFormValues) {
    setIsLoading(true);
    try {
      const url = isEditing
        ? `/api/forms/${formId}/webhooks/${webhook._id}`
        : `/api/forms/${formId}/webhooks`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to save webhook");
      }

      toast.success(isEditing ? "Webhook updated" : "Webhook created");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Webhook" : "Add Webhook"}
          </DialogTitle>
          <DialogDescription>
            Configure how you want to be notified of new submissions.{" "}
            <Link
              href="/docs?tab=webhooks"
              target="_blank"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn how to set up <ExternalLink className="h-3 w-3" />
            </Link>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Channel</Label>
              <Select
                disabled={isEditing}
                onValueChange={(val) =>
                  form.setValue("channel", val as WebhookChannel)
                }
                value={channel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  {WEBHOOK_CHANNELS.map((ch) => (
                    <SelectItem key={ch} value={ch}>
                      {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={form.watch("enabled")}
                onCheckedChange={(val) => form.setValue("enabled", val)}
              />
              <Label>Enabled</Label>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <Label className="text-base">Configuration</Label>

              {(channel === "DISCORD" || channel === "SLACK") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      {...form.register("config.webhookUrl")}
                      required
                    />
                  </div>
                  {channel === "DISCORD" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Bot Name</Label>
                        <Input
                          placeholder="StaticSend"
                          {...form.register("config.username")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Avatar URL</Label>
                        <Input
                          placeholder="https://..."
                          {...form.register("config.avatarUrl")}
                        />
                      </div>
                    </div>
                  )}
                  {channel === "SLACK" && (
                    <div className="space-y-2">
                      <Label>Channel (Optional)</Label>
                      <Input
                        placeholder="#notifications"
                        {...form.register("config.channel")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
