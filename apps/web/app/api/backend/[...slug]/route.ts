import { type NextRequest } from "next/server";
import { auth } from "../../../auth";
import { envServiceTaskSync } from "../../../environment-variables";

function buildEndpoint(searchParams: string, slug: string) {
  const baseUrl = `${envServiceTaskSync as string}/api/`;
  return searchParams
    ? `${baseUrl}${slug}?${searchParams}`
    : `${baseUrl}${slug}`;
}

async function handleResponse(res: Response) {
  const isSuccess = res.status >= 200 && res.status < 400;
  if (isSuccess) {
    const data = await res.json();
    return Response.json(data);
  }

  return new Response(res.statusText, {
    status: res.status,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const slug = (await params).slug;
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = buildEndpoint(searchParams, slug);

  const res = await fetch(endpoint, {
    method: "POST",
    body: request.body,
    duplex: "half",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  } as RequestInit);

  return handleResponse(res);
}

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

  const parts = (await params).slug as unknown as string[];
  const slug = parts.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = buildEndpoint(searchParams, slug);

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return handleResponse(res);
}
