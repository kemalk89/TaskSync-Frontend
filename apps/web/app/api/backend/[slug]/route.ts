import { type NextRequest } from "next/server";
import { auth } from "../../../auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Read Dynamic Route Segment
  const slug = (await params).slug;

  const searchParams = request.nextUrl.searchParams.toString();

  // TODO Use env instead
  const baseUrl = "https://localhost:7190/api/";
  const endpoint = searchParams
    ? `${baseUrl}${slug}?${searchParams}`
    : `${baseUrl}${slug}`;

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const isSuccess = res.status >= 200 && res.status < 400;
  if (isSuccess) {
    const data = await res.json();
    return Response.json(data);
  }

  return new Response(res.statusText, {
    status: res.status,
  });
}
