import data from "./data.json";
import { log } from "./../../log";

export async function GET(request: Request) {
  log("Fetching OpenID Configuration...");

  if (process.env.RESOURCE_SERVER_RUNTIME_ENGINE === "podman") {
    console.log(
      "The resource server is running in a Podman container: Updating the jwks_uri.",
    );

    data["jwks_uri"] =
      "http://host.containers.internal:3002/.well-known/jwks.json";
  }

  return Response.json(data);
}
