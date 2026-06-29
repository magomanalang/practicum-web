export async function GET(request: Request) {
  const Id = await request.json();
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/Customer/get-customer?Id=${encodeURIComponent(Id)}`,
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
