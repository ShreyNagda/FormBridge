export async function verifyHCaptcha(
    token: string,
    secret: string
): Promise<boolean> {
    if (!token || !secret) {
        return false;
    }

    try {
        const response = await fetch("https://hcaptcha.com/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret,
                response: token,
            }),
        });

        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error("hCaptcha verification failed:", error);
        return false;
    }
}
