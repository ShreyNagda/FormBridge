"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Webhook as WebhookIcon, Loader2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { WebhookDialog } from "./webhook-dialog";

interface WebhookSectionProps {
  formId: string;
  initialWebhooks: any[];
}

export function WebhookSection({
  formId,
  initialWebhooks,
}: WebhookSectionProps) {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<any>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const refreshWebhooks = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/webhooks`);
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data);
      }
    } catch (error) {
      console.error("Failed to refresh webhooks");
    }
  };

  const handleAdd = () => {
    setSelectedWebhook(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (webhook: any) => {
    setSelectedWebhook(webhook);
    setIsDialogOpen(true);
  };

  const handleDelete = async (webhookId: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;

    setIsDeleting(webhookId);
    try {
      const response = await fetch(
        `/api/forms/${formId}/webhooks/${webhookId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Webhook deleted");
      refreshWebhooks();
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete webhook");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTest = async (webhookId: string) => {
    setIsTesting(webhookId);
    try {
      const response = await fetch(
        `/api/forms/${formId}/webhooks/${webhookId}/test`,
        {
          method: "POST",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Test notification sent successfully");
      } else {
        toast.error(`Test failed: ${result.responseBody || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Failed to trigger test");
    } finally {
      setIsTesting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      {webhooks.length === 0 ? (
        <EmptyState
          icon={WebhookIcon}
          title="No webhooks configured"
          description="Add a webhook to get notified when someone submits this form."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {webhooks.map((webhook) => (
            <Card key={String(webhook._id)} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {webhook.channel}
                </CardTitle>
                {webhook.enabled ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {(webhook.channel === "DISCORD" || webhook.channel === "SLACK") && `URL: ${webhook.config.webhookUrl}`}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(webhook)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={isTesting === String(webhook._id)}
                    onClick={() => handleTest(String(webhook._id))}
                  >
                    {isTesting === String(webhook._id) && (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    )}
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting === String(webhook._id)}
                    onClick={() => handleDelete(String(webhook._id))}
                  >
                    {isDeleting === String(webhook._id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <WebhookDialog
        formId={formId}
        webhook={selectedWebhook}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refreshWebhooks();
          router.refresh();
        }}
      />
    </div>
  );
}
