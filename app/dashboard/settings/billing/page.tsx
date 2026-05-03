import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function BillingPage() {
    const session = await getSession();
    if (!session?.user) redirect("/sign-in");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
                <p className="text-muted-foreground">
                    Manage your subscription and usage.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-indigo-500/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                            Current Plan
                        </span>
                    </div>
                    <CardHeader>
                        <CardTitle>Hobby</CardTitle>
                        <CardDescription>Perfect for small projects and side hustles.</CardDescription>
                        <div className="mt-4 flex items-baseline text-3xl font-bold">
                            $0
                            <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Up to 3 forms</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>100 submissions/month</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Basic email notifications</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pro</CardTitle>
                        <CardDescription>For growing businesses and agencies.</CardDescription>
                        <div className="mt-4 flex items-baseline text-3xl font-bold">
                            $15
                            <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Unlimited forms</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>10,000 submissions/month</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>All webhooks (Discord, Slack, WhatsApp)</span>
                            </li>
                        </ul>
                        <Button className="w-full">Upgrade to Pro</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
