export function exportToCSV(submissions: any[]): string {
    if (!submissions || submissions.length === 0) {
        return "";
    }

    // Extract all unique keys from all submission data payloads
    const allKeys = new Set<string>();
    submissions.forEach(sub => {
        const data = sub.data as Record<string, string>;
        Object.keys(data).forEach(key => allKeys.add(key));
    });

    const headers = ["ID", "Timestamp", "Is Spam", ...Array.from(allKeys)];

    const rows = submissions.map(sub => {
        const data = sub.data as Record<string, string>;
        
        const row = [
            sub.id,
            new Date(sub.createdAt).toISOString(),
            sub.isSpam ? "Yes" : "No",
        ];

        Array.from(allKeys).forEach(key => {
            // Wrap values in quotes and escape internal quotes to handle commas and newlines in data
            let val = data[key] || "";
            val = val.replace(/"/g, '""');
            row.push(`"${val}"`);
        });

        return row.join(",");
    });

    return [headers.join(","), ...rows].join("\n");
}

export function exportToJSON(submissions: any[]): string {
    const formatted = submissions.map(sub => ({
        id: sub.id,
        timestamp: sub.createdAt,
        isSpam: sub.isSpam,
        data: sub.data,
    }));
    return JSON.stringify(formatted, null, 2);
}
