import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Form from "@/models/Form";
import User from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const formId = (await params).formId;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Target email is required" },
        { status: 400 }
      );
    }

    // 1. Verify the form exists and belongs to the current user
    const form = await Form.findOne({
      _id: formId,
      userId: session.user.id,
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or unauthorized" },
        { status: 404 }
      );
    }

    // 2. Find the target user
    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // 3. Prevent transferring to self
    if (targetUser._id.toString() === session.user.id) {
      return NextResponse.json(
        { error: "You already own this form" },
        { status: 400 }
      );
    }

    // 4. Update the form ownership
    form.userId = targetUser._id;
    await form.save();

    return NextResponse.json({
      message: "Form transferred successfully",
      newOwner: targetUser.email,
    });
  } catch (error) {
    console.error("Transfer form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
