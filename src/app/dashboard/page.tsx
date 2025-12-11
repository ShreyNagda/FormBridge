import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Form from "@/models/Form";
import { Plus, FileText, Calendar } from "lucide-react";
import { Card } from "@/components/shared/card";

async function getForms() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  await connectDB();
  const forms = await Form.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });
  return forms;
}

export default async function DashboardPage() {
  const forms = await getForms();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Your Forms
          </h1>
          <p className="text-gray-500">
            Manage your forms and view submissions
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 bg-zinc-900 text-white! rounded-lg font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-20  rounded-2xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No forms yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first form to start collecting submissions from your
            website.
          </p>
          <Link
            href="/dashboard/new"
            className="px-4 py-2 text-white rounded-lg font-medium  transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Link
              key={form._id.toString()}
              href={`/dashboard/forms/${form._id}`}
              className="block h-full"
            >
              <Card className="h-full" icon={FileText}>
                <div className="flex items-start justify-between mb-2">
                  <div />
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      form.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 transition-colors">
                  {form.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">
                  {form.description || "No description provided"}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
