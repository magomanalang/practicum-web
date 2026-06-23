import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${process.env.API_URL}/api/Kyc/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(".NET Backend error response:", errorText);
      return NextResponse.json(
        {
          message: "Error saving document reference metadata on backend layer.",
        },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      { message: "Backend server unreachable" },
      { status: 502 },
    );
  }
}
