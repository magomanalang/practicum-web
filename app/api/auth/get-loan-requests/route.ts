export async function GET() {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/LoanRequest/get-loan-requests`,
    );

    if (!res.ok) {
      return Response.json(
        { message: "Error fetching data from backend" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (e) {
    console.error("Proxy error:", e);
    return Response.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
