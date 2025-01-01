import {
  ProjectResponse,
  TicketCommentResponse,
  TicketResponse,
} from "./responses";

let accessToken: string | null = null;
let authConfig: AuthConfig | null = null;
let accessTokenLoaderFn: any = undefined;

const initAccesToken = async () => {
  if (!accessToken) {
    accessToken = await accessTokenLoaderFn({
      audience: authConfig?.audience,
    });
  }
};

const patch = async (url: string, body: any) => {
  await initAccesToken();

  const res = await fetch(url, {
    body: JSON.stringify(body),
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const post = async (url: string, body: any) => {
  await initAccesToken();

  const res = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const get = async (url: string) => {
  await initAccesToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Network error on URL ${url}: ${res.status}.`);
  }

  return res.json();
};

const remove = async (url: string) => {
  await initAccesToken();

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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

interface AuthConfig {
  audience: string;
}

export const api = {
  setAccessTokenLoader: (fn: () => void, config: AuthConfig) => {
    authConfig = config;
    accessTokenLoaderFn = fn;
  },
  fetchTicket: async (ticketId: string) => {
    return get(`/api/ticket/${ticketId}`);
  },
  fetchTicketComments: async (
    ticketId: string,
    { pageNumber, pageSize }: Page
  ) => {
    return get(
      `/api/ticket/${ticketId}/comment?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },
  fetchTickets: async ({ pageNumber, pageSize }: Page) => {
    return get(`/api/ticket?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },
  saveTicket: async (ticket: any) => {
    return post("/api/ticket", ticket);
  },
  saveTicketComment: async (
    ticketId: string,
    comment: any
  ): Promise<TicketCommentResponse> => {
    return post(`/api/ticket/${ticketId}/comment`, comment);
  },
  deleteTicket: async (ticket: TicketResponse) => {
    return remove("/api/ticket/" + ticket.id);
  },
  updateTicketStatus: async (ticketId: number, newStatus: any) => {
    return patch("/api/ticket/" + ticketId, {
      status: newStatus,
    });
  },
  fetchProject: async (projectId: number) => {
    return get(`/api/project/${projectId}`);
  },
  fetchProjectTickets: async (
    projectId: number,
    { pageNumber, pageSize }: Page
  ) => {
    return get(
      `/api/Project/${projectId}/tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },
  fetchProjects: async ({ pageNumber, pageSize }: Page) => {
    return get(`/api/Project?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },
  saveProject: async (project: any) => {
    return post("/api/project", project);
  },
  deleteProject: async (project: ProjectResponse) => {
    return remove("/api/project/" + project.id);
  },
  searchUsers: async (searchText: string) => {
    return post("/api/user", {
      searchText,
    });
  },
  fetchUsers: async ({ pageNumber, pageSize }: Page) => {
    return get(`/api/user?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },
};
