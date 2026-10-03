import { type NextRequest } from "next/server";
import { envServiceTaskSync } from "../../../environment-variables";
import { getToken } from "next-auth/jwt";

async function getSessionJwtPayload(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Cannot decrypt Session JWT because environment variable AUTH_SECRET is not defined",
    );
  }

  const payload = await getToken({
    req: request,
    secret,
  });

  return payload;
}

function buildEndpoint(searchParams: string, slug: string | string[]) {
  const baseUrl = `${envServiceTaskSync as string}/api/`;

  const path = Array.isArray(slug) ? slug.join("/") : slug;

  return searchParams
    ? `${baseUrl}${path}?${searchParams}`
    : `${baseUrl}${path}`;
}

async function handleResponse(res: Response) {
  const isSuccess = res.status >= 200 && res.status < 400;
  const isJsonResponse = res.headers
    .get("content-type")
    ?.includes("application/json");

  // Handle success
  if (isSuccess && res.status === 204) {
    return res;
  } else if (isSuccess && isJsonResponse) {
    const data = await res.json();
    return Response.json(data);
  } else if (isSuccess) {
    return res;
  }

  // Handle failure
  let serviceResponse;
  if (isJsonResponse) {
    serviceResponse = await res.json();
  }

  return new Response(
    serviceResponse?.error ?? serviceResponse?.message ?? res.statusText,
    {
      status: res.status,
    },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const sessionJwtPayload = await getSessionJwtPayload(request);
  if (!sessionJwtPayload?.accessToken) {
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
      Authorization: `Bearer ${sessionJwtPayload.accessToken}`,
    },
  } as RequestInit);

  return handleResponse(res);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const sessionJwtPayload = await getSessionJwtPayload(request);
  if (!sessionJwtPayload?.accessToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const slug = (await params).slug;
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = buildEndpoint(searchParams, slug);

  const res = await fetch(endpoint, {
    method: "PATCH",
    body: request.body,
    duplex: "half",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionJwtPayload.accessToken}`,
    },
  } as RequestInit);

  return handleResponse(res);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const sessionJwtPayload = await getSessionJwtPayload(request);
  if (!sessionJwtPayload?.accessToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const parts = (await params).slug;
  const slug = parts.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = buildEndpoint(searchParams, slug);

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionJwtPayload.accessToken}`,
    },
  });

  return handleResponse(res);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const sessionJwtPayload = await getSessionJwtPayload(request);
  if (!sessionJwtPayload?.accessToken) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const parts = (await params).slug;
  const slug = parts.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = buildEndpoint(searchParams, slug);

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionJwtPayload.accessToken}`,
    },
  });

  return handleResponse(res);
}
