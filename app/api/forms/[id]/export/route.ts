import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { Form, Submission } from "@/lib/db/models";
import { exportToCSV, exportToJSON } from "@/lib/export";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    try {
        await connectDB();
        const form = await Form.findOne({
            _id: id,
            userId: session.user.id,
        }).lean();

        if (!form) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const submissions = await Submission.find({ formId: id })
            .sort({ createdAt: -1 })
            .lean();
        const normalized = submissions.map((submission) => ({
            ...submission,
            id: submission._id,
        }));

        const filename = `${form.name.replace(/\s+/g, "_").toLowerCase()}_submissions_${new Date().toISOString().split("T")[0]}`;

        if (format === "json") {
            const jsonString = exportToJSON(normalized);
            return new NextResponse(jsonString, {
                headers: {
                    "Content-Type": "application/json",
                    "Content-Disposition": `attachment; filename=\"${filename}.json\"`,
                },
            });
        }

        const csvString = exportToCSV(normalized);
        return new NextResponse(csvString, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename=\"${filename}.csv\"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
