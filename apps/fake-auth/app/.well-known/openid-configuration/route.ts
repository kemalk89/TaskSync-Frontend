import data from "./data.json";
import { log } from "./../../log";

export async function GET(request: Request) {
  log("Fetching OpenID Configuration...");
  return Response.json(data);
}
