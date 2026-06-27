import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { Name, Description, LoanCategory } = await request.json();

    if (!Name || !Description || !LoanCategory) {
      return NextResponse.json(
        { message: "Missing credentials in request body" },
        { status: 400 },
      );
    }

    const targetUrl = `${process.env.API_URL}/api/LoanProduct/delete-loan-products?name=${encodeURIComponent(Name)}&description=${encodeURIComponent(Description)}&loanCategory=${encodeURIComponent(LoanCategory)}`;

    const res = await fetch(targetUrl, {
      method: "DELETE",
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
      { message: "Backend unreachable or invalid request body" },
      { status: 502 },
    );
  }
}
