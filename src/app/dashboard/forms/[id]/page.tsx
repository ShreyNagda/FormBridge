import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Form from "@/models/Form";
import Submission from "@/models/Submission";
import { notFound } from "next/navigation";
import SubmissionsTable from "@/components/dashboard/submissions-table";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import CopyButton from "@/components/shared/copy-button";
import { Button } from "@/components/shared/button";
import TestFormButton from "@/components/dashboard/test-form-button";
import { APP_URL } from "@/lib/constants";

async function getForm(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectDB();
  const form = await Form.findOne({ _id: id, userId: session.user.id });
  return form;
}

async function getSubmissions(formId: string) {
  await connectDB();
  const submissions = await Submission.find({ formId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(submissions));
}

export default async function FormDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getForm(id);

  if (!form) {
    notFound();
  }

  const submissions = await getSubmissions(id);
  const endpointUrl = `${APP_URL}/api/submit/${form._id}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4 transition-colors"
        >
          <Button variant="ghost" className="gap-1">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {form.name}
            </h1>
            <p className="text-gray-500">{form.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <TestFormButton
              formId={form._id.toString()}
              isActive={form.isActive}
            />
            <Link
              href={`/dashboard/forms/${form._id}/settings`}
              className="p-2 text-gray-500 hover:text-black rounded-lg transition-colors"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 mb-12">
        <div className="p-6 rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Form Endpoint
          </h3>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-4 py-3 rounded-lg text-sm font-mono text-gray-800 border border-gray-100 whitespace-pre-wrap break-all">
              {endpointUrl}
            </code>
            <CopyButton text={endpointUrl} />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p className="mb-2">
              Use this URL as the{" "}
              <code className="px-1 py-0.5 rounded text-black">action</code>{" "}
              attribute in your HTML form.
            </p>
            <pre className="p-4 rounded-lg text-xs whitespace-pre-wrap break-all bg-gray-50 border border-gray-100">
              {`<form action="${endpointUrl}" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`}
            </pre>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display font-bold mb-4">Submissions</h2>
        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  );
}
