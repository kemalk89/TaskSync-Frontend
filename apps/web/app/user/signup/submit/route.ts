import {
  envAuthUsernamePasswordUrl,
  envLocalAuthApiKey,
} from "../../../environment-variables";
import { tryJson } from "../../../utils";

export async function POST(request: Request) {
  const url = envAuthUsernamePasswordUrl + "signup";
  const data = await request.json();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": envLocalAuthApiKey ?? "",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    const responseData = await tryJson(response);
    console.error(
      `Could not submit signup. ${response.status} - ${response.statusText} - ${responseData.error}`,
    );
    return Response.json(
      { message: responseData.error ?? response.statusText },
      { status: response.status },
    );
  }

  return Response.json({ message: "Success" }, { status: response.status });
}
