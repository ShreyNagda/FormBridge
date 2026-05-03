"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export interface ExportSubmissionData {
  id: string;
  createdAt: string;
  spam: boolean;
  data: Record<string, any>;
}

export function ExportSubmissions({
  submissions,
}: {
  submissions: ExportSubmissionData[];
}) {
  // Flatten data for tabular formats (CSV, XLSX)
  const getFlattenedData = () => {
    return submissions.map((sub) => {
      return {
        id: sub.id,
        Date: new Date(sub.createdAt).toLocaleString(),
        Status: sub.spam ? "Spam" : "Clean",
        ...sub.data, // Spread form fields directly into columns
      };
    });
  };

  const handleExportCSV = () => {
    try {
      const flatData = getFlattenedData();
      if (flatData.length === 0) return;

      const worksheet = XLSX.utils.json_to_sheet(flatData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `submissions_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportXLSX = () => {
    try {
      const flatData = getFlattenedData();
      if (flatData.length === 0) return;

      const worksheet = XLSX.utils.json_to_sheet(flatData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

      XLSX.writeFile(workbook, `submissions_${new Date().toISOString().split("T")[0]}.xlsx`);

      toast.success("Excel exported successfully");
    } catch (error) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleExportJSON = () => {
    try {
      if (submissions.length === 0) return;

      const jsonStr = JSON.stringify(submissions, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `submissions_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("JSON exported successfully");
    } catch (error) {
      toast.error("Failed to export JSON");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={submissions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportXLSX}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
