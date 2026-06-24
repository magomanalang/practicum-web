import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = `${process.env.API_URL}/api/Kyc/register-customer-documents`;

    const dotNetResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CustomerId: body.CustomerId,
        FullName: body.FullName,
        DocumentType: body.DocumentType,
        Country: body.Country,
        ZipCode: body.ZipCode,
        AddressLine: body.AddressLine,
        DocumentImagePath: body.DocumentImagePath,
        SubmittedBy: body.submittedBy ?? "System",
      }),
    });

    if (!dotNetResponse.ok) {
      console.error(".NET Backend Error status:", dotNetResponse.status);
      return NextResponse.json(
        { message: "The backend server rejected the application details." },
        { status: dotNetResponse.status },
      );
    }

    const resultData = await dotNetResponse.json();

    return NextResponse.json(
      {
        message: "Data successfully saved!",
        data: resultData,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      { message: "Backend unreachable" },
      { status: 502 },
    );
  }
}
