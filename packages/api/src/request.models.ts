export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface CreateTicketCommand {
  projectId: number;
  title: string;
  description?: string;
  assignee?: number;
  type: string;
}
