export interface UserResponse {
  id: string;
  username: string;
  email: string;
  picture: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description?: string;
  createdBy?: {
    id: string;
    email: string;
    username: string;
    picture: string;
  };
  projectManager?: UserResponse;
  projectMembers: ProjectMemberResponse[];
  createdDate: string;
}

interface ProjectMemberResponse {
  userId: number;
  role: string;
  user: UserResponse;
}

export interface TicketResponse {
  id: string;
  title: string;
  assignee: any;
  status: any;
  type: string;
  description?: string;
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
