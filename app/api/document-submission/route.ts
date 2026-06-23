export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();

    const res = await fetch(`${process.env.API_URL}/api/Kyc/documents`, {
      method: "POST",

      body: incomingFormData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(".NET Backend error response:", errorText);
      return Response.json(
        { message: "Error saving document metadata on server layer." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (e) {
    console.error("Proxy error during upload processing:", e);
    return Response.json(
      { message: "Backend destination server unreachable" },
      { status: 502 },
    );
  }
}
