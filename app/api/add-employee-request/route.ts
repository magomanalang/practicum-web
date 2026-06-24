import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = `${process.env.API_URL}/api/EmployeeRequest/add-employee-request`;

    const dotNetResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: body.id || 0,
        FirstName: body.FirstName,
        MiddleName: body.MiddleName,
        LastName: body.LastName,
        Suffix: body.Suffix,
        Email: body.Email,
        Password: body.Password,
        EmployeeId: body.EmployeeId,
        EmployeeRoles: body.EmployeeRoles,
        RequestType: body.RequestType,
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
