import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = `${process.env.API_URL}/api/Employee/login-employee`;

    const dotNetResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: body.email,
        Password: body.password,
      }),
    });

    if (!dotNetResponse.ok) {
      console.error(".NET Backend Login Error status:", dotNetResponse.status);

      const errorData = await dotNetResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData.message ?? "Invalid credentials or account missing.",
        },
        { status: dotNetResponse.status },
      );
    }

    const resultData = await dotNetResponse.json();

    return NextResponse.json(
      {
        message: "Authentication Successful",
        data: resultData,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Login Proxy error:", e);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}
