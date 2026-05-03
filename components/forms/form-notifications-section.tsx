"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, X, Plus, Copy } from "lucide-react";
import { Switch } from "../ui/switch";

interface FormNotificationsSectionProps {
  formId: string;
  emailNotifications: boolean;
  notificationEmails: string[];
  globalEmails: string[];
}

export function FormNotificationsSection({
  formId,
  emailNotifications: initialNotifications,
  notificationEmails: initialEmails,
  globalEmails,
}: FormNotificationsSectionProps) {
  const [emailNotifications, setEmailNotifications] =
    useState(initialNotifications);
  const [notificationEmails, setNotificationEmails] =
    useState<string[]>(initialEmails);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const isUsingGlobalDefaults =
    emailNotifications &&
    notificationEmails.length === 0 &&
    globalEmails.length > 0;

  const saveSettings = async (
    newNotifications: boolean,
    newEmails: string[],
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications: newNotifications,
          notificationEmails: newEmails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Email notification settings updated");
    } catch (error) {
      toast.error("Failed to save settings");
      setEmailNotifications(initialNotifications);
      setNotificationEmails(initialEmails);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (newValue: boolean) => {
    setEmailNotifications(newValue);
    let emailsToSave = notificationEmails;

    if (newValue && emailsToSave.length === 0 && globalEmails.length > 0) {
      emailsToSave = globalEmails;
      setNotificationEmails(emailsToSave);
    }

    await saveSettings(newValue, emailsToSave);
  };

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

    const newEmails = [...notificationEmails, trimmed];
    setNotificationEmails(newEmails);
    setNewEmail("");
    setShowAddEmail(false);
    saveSettings(emailNotifications, newEmails);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const newEmails = notificationEmails.filter(
      (email) => email !== emailToRemove,
    );
    setNotificationEmails(newEmails);
    saveSettings(emailNotifications, newEmails);
  };

  const handleUseGlobalDefaults = () => {
    if (globalEmails.length === 0) {
      toast.error("No global default emails configured");
      return;
    }

    setNotificationEmails(globalEmails);
    saveSettings(emailNotifications, globalEmails);
  };

  return (
    <div className="space-y-4">
      {/* Toggle Section */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Send email notifications for this form
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {emailNotifications
                ? "Enabled - Notifications will be sent to configured emails"
                : "Disabled - No emails will be sent for submissions"}
            </p>
          </div>
        </div>
        {/* <button
          onClick={() => handleToggle(!emailNotifications)}
          disabled={isLoading}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            emailNotifications ? "bg-black-600" : "bg-zinc-300 dark:bg-zinc-700"
          } disabled:opacity-50`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-700 transition-transform ${
              emailNotifications ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button> */}
        <Switch
          checked={emailNotifications}
          onCheckedChange={handleToggle}
          disabled={isLoading}
        />
      </div>

      {/* Email List Section */}
      {emailNotifications && (
        <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
              Notification Emails
            </h4>
            {notificationEmails.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseGlobalDefaults}
                disabled={isLoading || globalEmails.length === 0}
              >
                <Copy className="mr-2 h-4 w-4" />
                Use Global Defaults
              </Button>
            )}
          </div>

          {/* Empty State */}
          {notificationEmails.length === 0 && (
            <div className="rounded bg-zinc-50 p-3 text-center dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Using account defaults
              </p>
              {globalEmails.length > 0 && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  {globalEmails.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Email List */}
          {notificationEmails.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {notificationEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 rounded-full w-fit border border-zinc-200 bg-zinc-50 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                    {email}
                  </span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    disabled={isLoading}
                    className="text-zinc-400 hover:text-red-600 disabled:opacity-50 dark:text-zinc-500 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Email Input */}
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
                disabled={isLoading}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddEmail} disabled={isLoading}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddEmail(false);
                  setNewEmail("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddEmail(true)}
              disabled={isLoading}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Email
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
