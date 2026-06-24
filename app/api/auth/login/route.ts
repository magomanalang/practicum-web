import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

export async function POST(request: Request) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "127.0.0.1";

  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

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
