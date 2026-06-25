export async function POST(request: Request) {
  const body = await request.json();
  console.log("1. Route hit, body:", body);
  console.log("2. API_URL:", process.env.API_URL);

  if (!process.env.API_URL) {
    return Response.json(
      { message: "Server configuration missing (API_URL)" },
      { status: 500 },
    );
  }
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/Employee/login-employee​`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    console.log("3. .NET response status:", res.status);

    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textFallback = await res.text();
      data = {
        message: textFallback || `Backend responded with status ${res.status}`,
      };
    }

    return Response.json(data, { status: res.status });
  } catch (e) {
    console.error("4. Fetch to .NET failed:", e);
    return Response.json(
      { message: "API server is unreachable" },
      { status: 502 },
    );
  }
}
