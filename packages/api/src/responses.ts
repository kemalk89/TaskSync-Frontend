export interface UserResponse {
  id: string;
  username: string;
  email: string;
  picture: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
}

export interface TicketResponse {
  id: string;
  title: string;
  assignee: any;
  status: any;
}

export interface TicketCommentResponse {
  id: string;
  createdBy: any;
  createdAt: any;
}

export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  total: number;
  items: T[];
}
