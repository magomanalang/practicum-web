import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received data:", body);

    return NextResponse.json(
      {
        message: "Data received successfully!",
        receivedData: body,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON format or bad request." },
      { status: 400 },
    );
  }
}
