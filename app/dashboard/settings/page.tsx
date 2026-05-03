import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function AccountSettingsPage() {
    const session = await getSession();
    if (!session?.user) redirect("/sign-in");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input defaultValue={session.user.name || ""} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input defaultValue={session.user.email} readOnly />
                    </div>
                    <Button variant="outline" disabled>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
}
