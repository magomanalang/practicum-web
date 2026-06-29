import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    console.log(`[Proxy API] Fetching from C# backend for ID: ${id}...`);

    const res = await fetch(
      `${process.env.API_URL}/api/Customer/get-customer?id=${id}`,
      { signal: AbortSignal.timeout(5000) },
    );

    console.log(`[Proxy API] C# backend responded with status: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Proxy API] Critical Error:", error);
    return NextResponse.json(
      { message: "Backend communication failed", error: error.message },
      { status: 502 },
    );
  }
}
