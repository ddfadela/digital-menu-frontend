import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!req)
    return NextResponse.json({ message: "No request" }, { status: 400 });

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API}/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return NextResponse.json(
        { message: "Invalid server response" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Registration successful", user: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
