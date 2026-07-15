import {
  CreateProjectRequest,
  CreateSprintCommand,
  CreateTicketCommand,
  ReorderTicketsCommand,
  UpdateProjectCommand,
  UpdateTicketCommand,
} from "./request.models";
import {
  PagedResult,
  ProjectResponse,
  ResultResponse,
  BoardResponse,
  TicketCommentResponse,
  TicketResponse,
  TicketStatusModel,
  UserResponse,
  SprintResponse,
} from "./response.models";
import { tryJson } from "./utils";
import { Validator } from "./validator";

const patch = async <T>(
  url: string,
  body: any,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  const res = await fetch(url, {
    body: JSON.stringify(body),
    method: "PATCH",
    headers: {
      ...headers,
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    return {
      status: "error",
      statusCode: res.status,
      message: `Network error on URL ${url}: ${res.status}.`,
    };
  }

  const data = await tryJson(res);
  return {
    status: "success",
    statusCode: res.status,
    data: data,
  };
};

const post = async <T>(
  url: string,
  body: any = {},
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        ...headers,
        "content-type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        status: "error",
        statusCode: res.status,
        message: `Network error on URL ${url}: ${res.status}.`,
      };
    }

    // Check if response contains data before parsing
    const responseText = await res.text();
    const data = responseText ? JSON.parse(responseText) : null;
    return {
      status: "success",
      statusCode: res.status,
      data,
    };
  } catch (err) {
    console.log("> > > Error", err);
    return {
      status: "error",
      statusCode: 500,
    };
  }
};

const get = async <T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    return {
      status: "error",
      statusCode: res.status,
      message: errorText ?? `Network error on URL ${url}: ${res.status}.`,
    };
  }

  const data = await res.json();
  return {
    status: "success",
    statusCode: res.status,
    data,
  };
};

const remove = async (url: string, headers: Record<string, string> = {}) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    return {
      status: "error",
      statusCode: res.status,
      message: `Network error on URL ${url}: ${res.status}.`,
    };
  }

  return res;
};

interface Page {
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  statusCode: number;
  message?: string;
  data?: T;
}

export type Result<T> = {
  success: boolean;
  value: T;
  error: string;
};

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
    fetchTicket: async (
      ticketId: string | number,
    ): Promise<ApiResponse<TicketResponse>> => {
      return get(`${getBaseUrl()}${getContext()}/ticket/${ticketId}`, headers);
    },
    fetchTicketComments: async (
      ticketId: string,
      { pageNumber, pageSize }: Page,
    ): Promise<ApiResponse<PagedResult<TicketCommentResponse>>> => {
      return get(
        `${getBaseUrl()}${getContext()}/ticket/${ticketId}/comment?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
    },
    fetchTickets: async (
      { pageNumber, pageSize }: Page,
      {
        searchText,
        statusIds,
        projectIds,
        assigneeIds,
      }: {
        searchText?: string;
        statusIds?: string;
        projectIds?: string;
        assigneeIds?: string;
      } = {},
    ): Promise<ApiResponse<PagedResult<TicketResponse>>> => {
      let url = `${getBaseUrl()}${getContext()}/ticket?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      if (searchText && searchText.trim().length > 0) {
        url += `&searchText=${encodeURIComponent(searchText)}`; // encoding needed because of potential white spaces
      }

      if (statusIds && statusIds.trim().length > 0) {
        url += `&status=${statusIds}`;
      }

      if (projectIds && projectIds.trim().length > 0) {
        url += `&projects=${projectIds}`;
      }

      if (assigneeIds && assigneeIds.trim().length > 0) {
        url += `&assignees=${assigneeIds}`;
      }

      return get(url);
    },
    fetchTicketStatusList: async (): Promise<
      ApiResponse<TicketStatusModel[]>
    > => {
      let url = `${getBaseUrl()}${getContext()}/ticket/status`;
      return get(url);
    },
    saveTicket: async (
      ticket: CreateTicketCommand,
    ): Promise<ApiResponse<TicketResponse>> => {
      const cleaned: CreateTicketCommand = {
        ...ticket,
      };

      if (!cleaned.assignee) {
        delete cleaned["assignee"];
      }
      return post(`${getBaseUrl()}${getContext()}/ticket`, cleaned);
    },
    deleteTicket: async (ticketId: string) => {
      return remove(`${getBaseUrl()}${getContext()}/ticket/${ticketId}`);
    },
    deleteTicketComment: async (ticketId: string, commentId: string) => {
      return remove(
        `${getBaseUrl()}${getContext()}/ticket/${ticketId}/comment/${commentId}`,
      );
    },
    fetchProject: async (
      projectId?: string | number,
    ): Promise<ApiResponse<ProjectResponse>> => {
      Validator.notEmpty(projectId, "No projectId defined");

      return get(
        `${getBaseUrl()}${getContext()}/project/${projectId}`,
        headers,
      );
    },
    fetchDraftSprint: async (
      projectId: number,
    ): Promise<ApiResponse<ResultResponse<BoardResponse>>> => {
      return get(
        `${getBaseUrl()}${getContext()}/Project/${projectId}/sprint/draft`,
      );
    },
    fetchBacklogTickets: async (
      projectId: number,
    ): Promise<ApiResponse<Array<TicketResponse>>> => {
      return get(`${getBaseUrl()}${getContext()}/Project/${projectId}/backlog`);
    },
    fetchProjectTickets: async (
      projectId: number,
      { pageNumber, pageSize }: Page,
    ): Promise<ApiResponse<PagedResult<TicketResponse>>> => {
      return get(
        `${getBaseUrl()}${getContext()}/Project/${projectId}/tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
    },
    fetchProjects: async ({
      pageNumber,
      pageSize,
    }: Page): Promise<ApiResponse<PagedResult<ProjectResponse>>> => {
      return get(
        `${getBaseUrl()}${getContext()}/Project?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
    },
    saveProject: async (project: CreateProjectRequest) => {
      return post<ProjectResponse>(
        `${getBaseUrl()}${getContext()}/project`,
        project,
      );
    },
    get: {
      fetchActiveSprint: async (
        projectId?: number,
      ): Promise<ApiResponse<SprintResponse>> => {
        Validator.notEmpty(projectId, "No projectId defined");

        return get(
          `${getBaseUrl()}${getContext()}/project/${projectId}/sprint/active`,
        );
      },
      fetchProjectSprints: async (
        projectId: number,
        { pageNumber, pageSize }: Page,
      ): Promise<ApiResponse<PagedResult<SprintResponse>>> => {
        Validator.notEmpty(projectId, "No projectId defined");

        return get(
          `${getBaseUrl()}${getContext()}/project/${projectId}/sprints?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        );
      },
    },
    post: {
      createSprint: async (projectId: number, command: CreateSprintCommand) => {
        Validator.notEmpty(projectId, "No projectId defined");

        return post(
          `${getBaseUrl()}${getContext()}/project/${projectId}/sprint`,
          command,
        );
      },
      assignTicketToSprint: async (
        projectId: number,
        sprintId: number,
        ticketId: number,
        newPosition: number,
      ): Promise<ApiResponse<Result<void>>> => {
        Validator.notEmpty(projectId, "No projectId defined");

        return post(
          `${getBaseUrl()}${getContext()}/project/${projectId}/sprint/${sprintId}/ticket/${ticketId}?newPosition=${newPosition}`,
        );
      },
      reorderBoardTickets: async (
        projectId: number,
        boardId: number,
        command: ReorderTicketsCommand,
      ): Promise<ApiResponse<TicketCommentResponse>> => {
        Validator.notEmpty(projectId, "No projectId defined");

        return post(
          `${getBaseUrl()}${getContext()}/project/${projectId}/board/${boardId}/reorder`,
          command,
        );
      },
      saveTicketComment: async (
        ticketId: string,
        comment: object,
      ): Promise<ApiResponse<TicketCommentResponse>> => {
        return post(
          `${getBaseUrl()}${getContext()}/ticket/${ticketId}/comment`,
          {
            comment: JSON.stringify(comment),
          },
        );
      },
    },
    patch: {
      updateTicket: async (
        ticketId: number,
        body: UpdateTicketCommand,
      ): Promise<ApiResponse<boolean>> => {
        return patch(`${getBaseUrl()}${getContext()}/ticket/${ticketId}`, body);
      },
      updateProject: async (
        projectId: string | number,
        body: UpdateProjectCommand,
      ): Promise<ApiResponse<Result<boolean>>> => {
        return patch(
          `${getBaseUrl()}${getContext()}/project/${projectId}`,
          body,
        );
      },
      changeCurrentUsersLanguage: async (
        newLanguage: string,
      ): Promise<ApiResponse<string>> => {
        return patch(
          `${getBaseUrl()}${getContext()}/user/changeLanguage/${newLanguage}`,
          {},
          headers,
        );
      },
    },

    deleteProject: async (project: ProjectResponse) => {
      return remove(`${getBaseUrl()}${getContext()}/project/${project.id}`);
    },
    searchUsers: async (searchText: string) => {
      return post(`${getBaseUrl()}${getContext()}/user`, {
        searchText,
      });
    },
    fetchUsers: async ({
      pageNumber,
      pageSize,
    }: Page): Promise<ApiResponse<PagedResult<UserResponse>>> => {
      return get(
        `${getBaseUrl()}${getContext()}/user?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
    },
    fetchCurrentUser: async (): Promise<
      ApiResponse<ResultResponse<UserResponse>>
    > => {
      return get(`${getBaseUrl()}${getContext()}/user/current-user`, headers);
    },
    /**
     * Should be called from server-side only after first login with external IDP
     */
    syncExternalUser: async (
      externalUserId: string,
    ): Promise<ApiResponse<void>> => {
      return post(
        `${getBaseUrl()}/api/user/external`,
        {
          externalUserId,
        },
        headers,
      );
    },
  };
};

/**
 * Helper, that represents the shape of the object returned by {@link getAPI}.
 */
export type Api = ReturnType<typeof getAPI>;
