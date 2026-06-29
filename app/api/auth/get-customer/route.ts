export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.API_URL}/api/Customer/get-customer?id=${encodeURIComponent(id)}`,
  );

  return Response.json(await res.json(), {
    status: res.status,
  });
}
