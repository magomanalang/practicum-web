import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received from client for loan product request:", body);

    const backendUrl = `${process.env.API_URL}/api/LoanProductRequest/add-loan-product-request`;

    const payload = {
      Name: body.Name,
      Description: body.Description,
      InterestRate: body.InterestRate,
      IsPromotion: body.IsPromotion,
      LoanCategory: body.LoanCategory,
      MaximumAmount: body.MaximumAmount,
      MaximumTermMonths: body.MaximumTermMonths,
      MinimumAmount: body.MinimumAmount,
      MinimumTermMonths: body.MinimumTermMonths,
      RequestType: body.RequestType,
      CreatedBy: body.CreatedBy,
      CreatedDateTime: body.CreatedDateTime,
    };

    console.log("Sending to .NET backend:", JSON.stringify(payload, null, 2));

    const dotNetResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!dotNetResponse.ok) {
      const errorText = await dotNetResponse.text();
      console.error(".NET Backend Error status:", dotNetResponse.status);
      console.error(".NET Backend Error response:", errorText);
      return NextResponse.json(
        {
          message: "The backend server rejected the application details.",
          error: errorText,
        },
        { status: dotNetResponse.status },
      );
    }

    const resultData = await dotNetResponse.json();
    console.log("Received from .NET backend:", resultData);

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
