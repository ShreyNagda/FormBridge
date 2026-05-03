export async function triggerDispatch(
  submissionId: string,
  formId: string,
): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/dispatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ submissionId, formId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dispatch request failed:", response.status, errorText);
    }
  } catch (err) {
    console.error("Failed to trigger dispatch:", err);
  }
}
