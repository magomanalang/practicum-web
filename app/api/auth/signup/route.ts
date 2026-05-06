export async function POST(request: Request) {
  const body = await request.json();
  console.log("1. Route hit, body:", body);
  console.log("2. API_URL:", process.env.API_URL);

  try {
    const res = await fetch(`${process.env.API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log("3. .NET response status:", res.status);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (e) {
    console.error("4. Fetch to .NET failed:", e);
    return Response.json({ message: "API unreachable" }, { status: 502 });
  }
}
