export type TicketSearchFilter = {
  pageNumber: number;
  pageSize: number;

  status?: string;
  projects?: string;
  assignees?: string;
  searchText?: string;
};
