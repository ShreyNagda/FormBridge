"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";

interface Submission {
  _id: string;
  data: Record<string, any>;
  createdAt: string;
}

export default function SubmissionsTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubmissions = submissions.filter((sub) =>
    JSON.stringify(sub.data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    try {
      const csv = Papa.unparse(
        submissions.map((sub) => ({
          ...sub.data,
          "Submission Date": new Date(sub.createdAt).toLocaleString(),
        }))
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "submissions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Submissions exported successfully");
    } catch (error) {
      toast.error("Failed to export submissions");
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-gray-200 border-dashed">
        <p className="text-gray-500">No submissions yet.</p>
      </div>
    );
  }

  // Get all unique keys from all submissions to build table headers
  const allKeys = Array.from(
    new Set(submissions.flatMap((sub) => Object.keys(sub.data)))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
          />
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Date</th>
                {allKeys.map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 whitespace-nowrap capitalize"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.map((sub) => (
                <tr key={sub._id} className="transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  {allKeys.map((key) => (
                    <td
                      key={key}
                      className="px-6 py-3 whitespace-nowrap text-gray-900"
                    >
                      {typeof sub.data[key] === "object"
                        ? JSON.stringify(sub.data[key])
                        : String(sub.data[key] || "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
