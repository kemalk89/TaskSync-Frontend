import { log } from "../../../../log";
import { USERS } from "../../../../constants";

export async function GET(
  request: Request,
  params: Promise<{ params: { userId: string } }>,
) {
  log("Requesting user by id...");
  const options = await params;
  const userId = options.params.userId;
  if (!userId) {
    return new Response("Bad Request: userId is null or undefined", {
      status: 400,
    });
  }

  const user = USERS.find((u) => u.id === userId);
  if (user) {
    return Response.json(user);
  }

  return new Response("Not Found", { status: 404 });
}
