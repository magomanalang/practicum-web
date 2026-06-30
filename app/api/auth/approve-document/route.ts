import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const targetUrl = `${process.env.API_URL}/api/Kyc/approve-customer-documents`;

    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: errorText || "Error processing modification on backend" },
        { status: res.status },
      );
    }

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Proxy PATCH error:", e);
    return NextResponse.json(
      { message: "Backend unreachable during update" },
      { status: 502 },
    );
  }
}
