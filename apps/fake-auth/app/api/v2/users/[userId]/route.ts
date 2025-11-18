import { log } from "../../../../log";
import { USERS } from "../../../../constants";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  log("Requesting user by id...");
  const user = USERS.find((u) => u.id === params.userId);
  if (user) {
    return Response.json(user);
  }

  return new Response("Not Found", { status: 404 });
}
