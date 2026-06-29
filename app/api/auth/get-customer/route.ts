import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing required 'id' query parameter" },
        { status: 400 },
      );
    }
    const res = await fetch(
      `${process.env.API_URL}/api/Customer/get-customer?id=${encodeURIComponent(id)}`,
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: res.status });
    }
    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}
