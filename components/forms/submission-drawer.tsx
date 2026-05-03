"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubmissionDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submission: any;
    deliveries?: any[];
}

export function SubmissionDrawer({
    open,
    onOpenChange,
    submission,
    deliveries = [],
}: SubmissionDrawerProps) {
    if (!submission) return null;

    const dataObj = submission.data as Record<string, string>;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px] lg:w-[900px] sm:max-w-none flex flex-col gap-0 p-0">
                <div className="p-6 border-b">
                    <SheetHeader>
                        <div className="flex items-center justify-between">
                            <SheetTitle>Submission Details</SheetTitle>
                            {submission.isSpam && <Badge variant="destructive">Spam</Badge>}
                        </div>
                        <SheetDescription className="flex items-center gap-2">
                            ID: {submission.id}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => copyToClipboard(submission.id)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </SheetDescription>
                        <SheetDescription>
                            Received on {format(new Date(submission.createdAt), "PPpp")}
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                    {/* Left Side: Payload */}
                    <div className="border-r h-full flex flex-col">
                        <div className="p-4 bg-muted/30 font-semibold border-b">Payload Data</div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {Object.entries(dataObj).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div className="text-sm font-medium text-muted-foreground">{key}</div>
                                        <div className="text-sm bg-muted/50 p-3 rounded-md break-all whitespace-pre-wrap">
                                            {value || <span className="text-muted-foreground italic">empty</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Side: Webhooks Timeline */}
                    <div className="h-full flex flex-col">
                        <div className="p-4 bg-muted/30 font-semibold border-b">Delivery Logs</div>
                        <ScrollArea className="flex-1 p-4">
                            {deliveries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No webhook deliveries found.</p>
                            ) : (
                                <div className="space-y-6">
                                    {deliveries.map((delivery) => (
                                        <div key={delivery.id} className="space-y-2 border-l-2 pl-4 pb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{delivery.webhook?.channel}</Badge>
                                                <Badge
                                                    variant={
                                                        delivery.status === "SUCCESS"
                                                            ? "default"
                                                            : delivery.status === "FAILED"
                                                            ? "destructive"
                                                            : "secondary"
                                                    }
                                                >
                                                    {delivery.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Attempt {delivery.attempt}
                                                </span>
                                            </div>
                                            {delivery.completedAt && (
                                                <p className="text-xs text-muted-foreground">
                                                    Completed: {format(new Date(delivery.completedAt), "PPpp")}
                                                </p>
                                            )}
                                            {delivery.httpStatus && (
                                                <p className="text-xs">
                                                    HTTP Status: <strong>{delivery.httpStatus}</strong>
                                                </p>
                                            )}
                                            {delivery.responseBody && (
                                                <div className="mt-2 text-xs bg-muted p-2 rounded-md font-mono max-h-32 overflow-y-auto">
                                                    {delivery.responseBody}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
