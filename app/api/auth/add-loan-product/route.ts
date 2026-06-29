import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = `${process.env.API_URL}/api/LoanProduct/add-loan-product`;

    const dotNetResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: body.Name,
        Description: body.Description,
        LoanCategory: body.LoanCategory,
        InterestRate: body.InterestRate,
        MinimumAmount: body.MinimumAmount,
        MaximumAmount: body.MaximumAmount,
        MinimumTermMonths: body.MinimumTermMonths,
        MaximumTermMonths: body.MaximumTermMonths,
        IsPromotion: body.IsPromotion,
        CreatedBy: body.CreatedBy,
        CreatedDateTime: body.CreatedDateTime,
        ApprovedBy: body.ApprovedBy,
        ApprovedDateTime: body.ApprovedDateTime,
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
