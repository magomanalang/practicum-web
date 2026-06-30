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
      const errorBody = await res.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorBody);
      } catch {
        errorJson = {
          message: errorBody || "Error processing modification on backend",
        };
      }
      return NextResponse.json(errorJson, { status: res.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("Proxy PATCH error:", e);
    return NextResponse.json(
      { message: "Backend unreachable during update" },
      { status: 502 },
    );
  }
}
