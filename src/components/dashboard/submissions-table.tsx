"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Search, Columns, Check } from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";

interface Submission {
  _id: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export default function SubmissionsTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  // Get all unique keys from all submissions to build table headers
  const allKeys = Array.from(
    new Set(submissions.flatMap((sub) => Object.keys(sub.data)))
  );

  const allKeysKey = allKeys.join(",");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allKeys);
  const [prevAllKeysKey, setPrevAllKeysKey] = useState(allKeysKey);

  // Update visible columns when allKeys changes (new submissions with new fields)
  if (allKeysKey !== prevAllKeysKey) {
    setPrevAllKeysKey(allKeysKey);
    const newKeys = allKeys.filter((key) => !visibleColumns.includes(key));
    if (newKeys.length > 0) {
      setVisibleColumns([...visibleColumns, ...newKeys]);
    } else {
      const filteredColumns = visibleColumns.filter((key) =>
        allKeys.includes(key)
      );
      if (filteredColumns.length !== visibleColumns.length) {
        setVisibleColumns(filteredColumns);
      }
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target as Node)
      ) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAllColumns = () => setVisibleColumns(allKeys);
  const deselectAllColumns = () => setVisibleColumns([]);

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
        <div className="flex gap-2">
          <div className="relative" ref={columnSelectorRef}>
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50"
            >
              <Columns size={16} />
              Columns
              {visibleColumns.length < allKeys.length && (
                <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
                  {visibleColumns.length}
                </span>
              )}
            </button>
            {showColumnSelector && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2 border-b border-gray-100 flex justify-between">
                  <button
                    onClick={selectAllColumns}
                    className="text-xs text-gray-600 hover:text-black transition-colors"
                  >
                    Select all
                  </button>
                  <button
                    onClick={deselectAllColumns}
                    className="text-xs text-gray-600 hover:text-black transition-colors"
                  >
                    Deselect all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                  {allKeys.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          visibleColumns.includes(key)
                            ? "bg-black border-black"
                            : "border-gray-300"
                        }`}
                      >
                        {visibleColumns.includes(key) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(key)}
                        onChange={() => toggleColumn(key)}
                        className="sr-only"
                      />
                      <span className="text-sm text-gray-700 capitalize truncate">
                        {key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Date</th>
                {allKeys
                  .filter((key) => visibleColumns.includes(key))
                  .map((key) => (
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
                  {allKeys
                    .filter((key) => visibleColumns.includes(key))
                    .map((key) => (
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
