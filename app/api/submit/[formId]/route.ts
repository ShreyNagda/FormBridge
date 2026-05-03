import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Form, Submission } from "@/lib/db/models";
import { checkRateLimit } from "@/lib/ratelimit";
import { honeypotCheck, validateOrigin } from "@/lib/validation/submission";
import { verifyHCaptcha } from "@/lib/validation/spam";
import { triggerDispatch } from "@/lib/dispatch";

function sanitizeValue(value: string): string {
    return value.replace(/<\/?[^>]+(>|$)/g, "");
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ formId: string }> },
) {
    const { formId } = await params;
    
    if (request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    try {
        await connectDB();
        const form = await Form.findById(formId).lean();

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        const origin = request.headers.get("origin") || request.headers.get("referer");
        if (origin && form.allowedOrigins && form.allowedOrigins.length > 0) {
            if (!validateOrigin(origin, form.allowedOrigins)) {
                return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
            }
        }

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = await checkRateLimit(formId, ip, form.rateLimit || 10);
        if (!allowed) {
            return NextResponse.json(
                { error: "Rate limit exceeded" },
                { status: 429, headers: { "Retry-After": "60" } },
            );
        }

        const contentType = request.headers.get("content-type") || "";
        let data: Record<string, string> = {};

        if (contentType.includes("application/json")) {
            const body = await request.json();
            for (const [key, val] of Object.entries(body)) {
                if (typeof val === "string") {
                    data[key] = val;
                } else {
                    data[key] = JSON.stringify(val);
                }
            }
        } else if (
            contentType.includes("application/x-www-form-urlencoded") ||
            contentType.includes("multipart/form-data")
        ) {
            const formData = await request.formData();
            for (const [key, val] of Array.from(formData.entries())) {
                if (typeof val === "string") {
                    data[key] = val;
                }
            }
        } else {
            return NextResponse.json({ error: "Unsupported Media Type" }, { status: 415 });
        }

        for (const key in data) {
            data[key] = sanitizeValue(data[key]);
        }

        let spam = false;

        if (form.honeypotField && honeypotCheck(data, form.honeypotField)) {
            spam = true;
        }

        if (form.hcaptchaSecret) {
            const token = data["h-captcha-response"];
            if (!token) {
                return NextResponse.json({ error: "Missing hCaptcha token" }, { status: 400 });
            }
            const isValid = await verifyHCaptcha(token, form.hcaptchaSecret);
            if (!isValid) {
                return NextResponse.json({ error: "Invalid hCaptcha token" }, { status: 400 });
            }
            delete data["h-captcha-response"];
        }

        const submission = await Submission.create({
            formId,
            data,
            spam,
        });

        if (!spam) {
            await triggerDispatch(submission.id, formId);
        }

        const redirectUrl = form.redirectSuccess;
        if (redirectUrl) {
            return NextResponse.redirect(redirectUrl, { status: 302 });
        }

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
