import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { Email, EmployeeId } = await request.json();

    const targetUrl = `${process.env.API_URL}/api/Employee/delete-employee?email=${encodeURIComponent(Email)}&employeeId=${encodeURIComponent(EmployeeId)}`;
    const res = await fetch(targetUrl, {
      method: "DELETE",
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
