export interface UserResponse {
  id: string;
  username: string;
  email: string;
  picture: string;
  externalSource?: string;
  selectedLanguage?: string;
  createdDate: string;
  modifiedDate?: string;
}

export interface ProjectResponse {
  id: number;
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

export interface SprintResponse {
  id: number;
  startDate: string;
  endDate: string;
}

interface ProjectMemberResponse {
  userId: number;
  role: string;
  user: UserResponse;
}

export interface TicketStatusModel {
  id: number;
  name: string;
}

export interface TicketResponse {
  id: string;
  title: string;
  assignee: any;
  Status: any;
  type: string;
  description?: string;
  createdDate: string;
  labels: TicketLabelResponse[];
  createdBy?: {
    id: string;
    email: string;
    username: string;
    picture: string;
  };
  project: ProjectResponse;
}

export interface TicketLabelResponse {
  id: number;
  text: string;
}

export interface TicketCommentResponse {
  id: string;
  createdBy: any;
  createdDate: any;
  comment: string;
  isDeleted?: boolean;
}

export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  total: number;
  items: T[];
}

export interface BoardResponse {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  tickets: TicketResponse[];
}

export interface ResultResponse<T> {
  value: T;
  success: boolean;
  error: string;
  errorDetails: string[];
  errorPayload: unknown;
}

export const ResultCodeResourceNotFound = "RESOURCE_NOT_FOUND";
export const ResultCodeNoPermissions = "NO_PERMISSIONS_FOR_THE_OPERATION";
