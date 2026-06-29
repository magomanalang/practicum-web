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

    const targetUrl = `${process.env.API_URL}/api/Customer/get-customer?id=${encodeURIComponent(id)}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: errorText || "Error processing request on backend" },
        { status: res.status },
      );
    }

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}
