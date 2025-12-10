"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Trash2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared/button";
import Link from "next/link";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/shared/confirm-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  emailNotifications: z.boolean(),
  notificationEmails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormSettingsProps {
  form: {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
    settings: {
      emailNotifications: boolean;
      notificationEmails?: string[];
    };
  };
}

export default function FormSettings({ form }: FormSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");

  // Dialog states
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: form.name,
      description: form.description || "",
      isActive: form.isActive,
      emailNotifications: form.settings.emailNotifications,
      notificationEmails: form.settings.notificationEmails?.join(", ") || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/forms/${form._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          settings: {
            emailNotifications: data.emailNotifications,
            notificationEmails: data.notificationEmails
              ? data.notificationEmails
                  .split(",")
                  .map((e) => e.trim())
                  .filter(Boolean)
              : [],
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update form");
      }

      toast.success("Form updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      const res = await fetch(`/api/forms/${form._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !form.isActive,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        `Form ${form.isActive ? "disabled" : "enabled"} successfully`
      );
      router.refresh();
      setShowDisableDialog(false);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/forms/${form._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete form");
      }

      toast.success("Form deleted successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete form");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferEmail) return;

    setIsTransferring(true);

    try {
      const res = await fetch(`/api/forms/${form._id}/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: transferEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to transfer form");
      }

      toast.success("Form transferred successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to transfer form");
      setIsTransferring(false);
      setShowTransferDialog(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/forms/${form._id}`}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <Button variant="ghost">
            <ArrowLeft size={16} />
            Back to Form
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Form Settings
        </h1>
        <p className="text-gray-500">Manage your form preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">General</h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Form Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Configuration</h2>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <label
                htmlFor="emailNotifications"
                className="block text-sm font-medium text-gray-900"
              >
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive an email when a new submission arrives
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="emailNotifications"
                {...register("emailNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="notificationEmails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notification Emails
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Enter email addresses separated by commas.
            </p>
            <input
              id="notificationEmails"
              {...register("notificationEmails")}
              placeholder="email@example.com, another@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="mt-12 p-6 bg-red-50 rounded-xl border border-red-100">
          <h2 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-700 mb-6">
            Deleting this form will permanently remove all associated
            submissions and data. This action cannot be undone.
          </p>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-red-900">
                {form.isActive ? "Disable Form" : "Enable Form"}
              </h3>
              <p className="text-sm text-red-700">
                {form.isActive
                  ? "Temporarily disable new submissions for this form."
                  : "Enable new submissions for this form."}
              </p>
            </div>
            <Button
              type="button"
              variant={form.isActive ? "danger" : "secondary"}
              onClick={() => setShowDisableDialog(true)}
              disabled={isToggling}
            >
              {isToggling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {form.isActive ? "Disabling..." : "Enabling..."}
                </>
              ) : form.isActive ? (
                "Disable Form"
              ) : (
                "Enable Form"
              )}
            </Button>
          </div>

          <div className="pt-6 border-t border-red-200 mb-6">
            <h3 className="text-base font-medium text-red-900 mb-2">
              Transfer Ownership
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Transfer this form to another user. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter new owner's email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
              />
              <Button
                variant="danger"
                type="button"
                onClick={() => {
                  if (!transferEmail) {
                    toast.error("Please enter an email address");
                    return;
                  }
                  setShowTransferDialog(true);
                }}
                disabled={!transferEmail}
              >
                Transfer
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-red-200">
            <h3 className="text-base font-medium text-red-900 mb-2">
              Delete Form
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Deleting this form will permanently remove all associated
              submissions and data. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Form
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDisableDialog}
        onClose={() => setShowDisableDialog(false)}
        onConfirm={handleToggleActive}
        title={form.isActive ? "Disable Form" : "Enable Form"}
        description={
          form.isActive
            ? "Are you sure you want to disable this form? New submissions will be rejected."
            : "Are you sure you want to enable this form? New submissions will be accepted."
        }
        confirmText={form.isActive ? "Disable" : "Enable"}
        variant={form.isActive ? "danger" : "primary"}
        isLoading={isToggling}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Form"
        description="Are you sure you want to delete this form? This action cannot be undone and will delete all submissions."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        onConfirm={handleTransfer}
        title="Transfer Ownership"
        description={`Are you sure you want to transfer this form to ${transferEmail}? You will lose access to it immediately.`}
        confirmText="Transfer"
        variant="danger"
        isLoading={isTransferring}
      />
    </div>
  );
}
