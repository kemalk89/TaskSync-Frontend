import { Api, ApiResponse, getAPI } from "@app/api";
import { auth } from "./auth";

/**
 * App Router Pages can call this function to fetch data on server side.
 *
 * This function cannot be used by client side components.
 */
export async function fetchDataById<T>(
  fetchFn: (api: Api) => Promise<ApiResponse<T>>
): Promise<{
  status: "unauthorized" | "backend_problem" | "no_data_available" | "success";
  data?: T;
}> {
  const session = await auth();
  if (!session) {
    return { status: "unauthorized" };
  }

  const accessToken = session.accessToken;
  if (!accessToken) {
    return { status: "unauthorized" };
  }

  const apiConfig = getAPI()
    .enableServerMode()
    .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
    .setHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

  const response = await fetchFn(apiConfig);

  if (response.status !== "success") {
    return { status: "backend_problem" };
  }

  const data = response.data;
  if (!data) {
    return { status: "no_data_available" };
  }

  return { status: "success", data: data as T };
}
