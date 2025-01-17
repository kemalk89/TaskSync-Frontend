import {
  PagedResult,
  ProjectResponse,
  TicketCommentResponse,
  TicketResponse,
} from "./responses";

const patch = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  const res = await fetch(url, {
    body: JSON.stringify(body),
    method: "PATCH",
    headers: {
      ...headers,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const post = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  const res = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      ...headers,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const get = async (url: string, headers: Record<string, string> = {}) => {
  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const remove = async (url: string, headers: Record<string, string> = {}) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res;
};

interface Page {
  pageNumber: number;
  pageSize: number;
}

/**
 * This module can be used on both the server side and the client side.
 *
 * **Client Side Usage:**
 * ```javascript
 * const project = await getAPI().fetchProject(1);
 * ```
 *
 * **Server Side Usage:**
 * ```javascript
 * const project = await getAPI()
 *      .enableServerMode()
 *      .setBaseUrl(process.env.SERVICE_TASKSYNC as string)
 *      .setHeaders({
 *         Authorization: `Bearer ${accessToken}`,
 *      })
 *      .fetchProject(1);
 * ```
 */
export const getAPI = () => {
  let isServer = false;
  let baseUrl = "";
  let headers = {};
  let getBaseUrl = () => baseUrl;
  let getContext = () => (isServer ? "/api" : "/api/backend");

  return {
    setBaseUrl(url: string) {
      baseUrl = url;
      return this;
    },
    enableServerMode() {
      isServer = true;
      return this;
    },
    setHeaders(value: Record<string, string>) {
      headers = value;
      return this;
    },
    fetchTicket: async (ticketId: string) => {
      return get(`${baseUrl}${getContext()}/ticket/${ticketId}`);
    },
    fetchTicketComments: async (
      ticketId: string,
      { pageNumber, pageSize }: Page
    ) => {
      return get(
        `${getBaseUrl()}${getContext()}/ticket/${ticketId}/comment?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
    },
    fetchTickets: async ({ pageNumber, pageSize }: Page) => {
      return get(
        `${getBaseUrl()}${getContext()}/ticket?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
    },
    saveTicket: async (ticket: any) => {
      return post(`${getBaseUrl()}${getContext()}/ticket`, ticket);
    },
    saveTicketComment: async (
      ticketId: string,
      comment: any
    ): Promise<TicketCommentResponse> => {
      return post(
        `${getBaseUrl()}${getContext()}/ticket/${ticketId}/comment`,
        comment
      );
    },
    deleteTicket: async (ticket: TicketResponse) => {
      return remove(`${getBaseUrl()}${getContext()}/ticket/${ticket.id}`);
    },
    updateTicketStatus: async (ticketId: number, newStatus: any) => {
      return patch(`${getBaseUrl()}${getContext()}/ticket/${ticketId}`, {
        status: newStatus,
      });
    },
    fetchProject: async (projectId: string): Promise<ProjectResponse> => {
      return get(
        `${getBaseUrl()}${getContext()}/project/${projectId}`,
        headers
      );
    },
    fetchProjectTickets: async (
      projectId: number,
      { pageNumber, pageSize }: Page
    ) => {
      return get(
        `${getBaseUrl()}${getContext()}/Project/${projectId}/tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
    },
    fetchProjects: async ({
      pageNumber,
      pageSize,
    }: Page): Promise<PagedResult<ProjectResponse>> => {
      return get(
        `${getBaseUrl()}${getContext()}/Project?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
    },
    saveProject: async (project: any) => {
      return post(`${getBaseUrl()}${getContext()}/project`, project);
    },
    deleteProject: async (project: ProjectResponse) => {
      return remove(`${getBaseUrl()}${getContext()}/project/${project.id}`);
    },
    searchUsers: async (searchText: string) => {
      return post(`${getBaseUrl()}${getContext()}/user`, {
        searchText,
      });
    },
    fetchUsers: async ({ pageNumber, pageSize }: Page) => {
      return get(
        `${getBaseUrl()}${getContext()}/user?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
    },
  };
};
