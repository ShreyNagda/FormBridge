import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: result.error.errors[0].message,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    // 2. Connect to database
    await connectDB();

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "DUPLICATE_EMAIL",
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Register] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
