"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface WebhookConfigPanelProps {
    channel: string;
    form: UseFormReturn<any>;
}

export function WebhookConfigPanel({ channel, form }: WebhookConfigPanelProps) {
    if (channel === "EMAIL") {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">To Address</label>
                    <Input placeholder="notifications@example.com" {...form.register("config.to")} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Subject (Optional)</label>
                    <Input placeholder="New Submission!" {...form.register("config.subject")} />
                </div>
            </div>
        );
    }

    if (channel === "DISCORD") {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook URL</label>
                    <Input placeholder="https://discord.com/api/webhooks/..." {...form.register("config.webhookUrl")} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Bot Username (Optional)</label>
                    <Input placeholder="StaticSend Bot" {...form.register("config.username")} />
                </div>
            </div>
        );
    }

    if (channel === "SLACK") {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook URL</label>
                    <Input placeholder="https://hooks.slack.com/services/..." {...form.register("config.webhookUrl")} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Channel Override (Optional)</label>
                    <Input placeholder="#leads" {...form.register("config.channel")} />
                    <p className="text-sm text-muted-foreground">Leave blank to use the webhook's default channel.</p>
                </div>
            </div>
        );
    }

    if (channel === "WHATSAPP") {
        const provider = form.watch("config.provider");

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">To Phone Number</label>
                    <Input placeholder="+1234567890" {...form.register("config.to")} />
                    <p className="text-sm text-muted-foreground">Include country code (e.g. +1).</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Provider</label>
                    <Select
                        onValueChange={(val) => form.setValue("config.provider", val)}
                        defaultValue={provider}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="meta">Meta Cloud API</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {provider === "twilio" && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Account SID</label>
                            <Input {...form.register("config.accountSid")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Auth Token</label>
                            <Input type="password" {...form.register("config.authToken")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">From Number</label>
                            <Input placeholder="+1234567890" {...form.register("config.from")} />
                        </div>
                    </div>
                )}

                {provider === "meta" && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number ID</label>
                            <Input {...form.register("config.phoneNumberId")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Access Token</label>
                            <Input type="password" {...form.register("config.accessToken")} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
