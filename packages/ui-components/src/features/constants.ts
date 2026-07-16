import { Page } from "@app/utils";

export const DEFAULT_PAGE_SIZE = 10;

export const QUERY_KEY_FETCH_USERS = ["fetchUsers"];
export const QUERY_KEY_FETCH_PROJECT_BY_ID = ["fetchProjectById"];
export const QUERY_KEY_FETCH_TICKET_BY_ID = ["fetchTicketById"];

export const QUERY_KEY_PREFIX_FETCH_TICKETS = "fetchTickets";

export const getQueryKeyFetchActiveSprint = (projectId?: number) => {
  return ["fetchActiveSprint", projectId];
};

export const getQueryKeyFetchProjectSprints = (
  projectId: number,
  page: Page,
) => {
  return ["fetchProjectSprints", projectId, page];
};

export const PAGED_RESULT_EMPTY = {
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  items: [],
};
