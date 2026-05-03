import { z } from "zod";

// Schema for incoming form data
// Max 100 keys, string values only
export const submissionDataSchema = z.record(z.string(), z.string()).refine(
    (data) => Object.keys(data).length <= 100,
    { message: "Too many fields submitted" }
);

export function honeypotCheck(
    data: Record<string, string>,
    honeypotField: string | null | undefined
): boolean {
    if (!honeypotField) return false;
    
    // If the honeypot field is present and has ANY value, it's a bot
    return !!data[honeypotField];
}

export function validateOrigin(
    origin: string | null,
    allowedOrigins: string[]
): boolean {
    if (!origin) return true; // Allow direct API calls/postman
    if (!allowedOrigins || allowedOrigins.length === 0) return true; // No restrictions
    if (allowedOrigins.includes("*")) return true;

    try {
        const originUrl = new URL(origin);
        return allowedOrigins.some((allowedOrigin) => {
            if (allowedOrigin.startsWith("*.")) {
                const domain = allowedOrigin.slice(2);
                return originUrl.hostname === domain || originUrl.hostname.endsWith(`.${domain}`);
            }
            return originUrl.hostname === allowedOrigin || originUrl.origin === allowedOrigin;
        });
    } catch {
        // If origin is not a valid URL, do a direct string match
        return allowedOrigins.includes(origin);
    }
}
