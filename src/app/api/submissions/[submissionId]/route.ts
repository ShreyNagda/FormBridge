import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Form from "@/models/Form";
import Submission from "@/models/Submission";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { submissionId } = await params;
    await connectDB();

    // Find the submission first
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    // Verify the user owns the form this submission belongs to
    const form = await Form.findOne({
      _id: submission.formId,
      userId: session.user.id,
    });

    if (!form) {
      return NextResponse.json(
        { message: "Not authorized to delete this submission" },
        { status: 403 }
      );
    }

    // Delete the submission
    await Submission.findByIdAndDelete(submissionId);

    return NextResponse.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
