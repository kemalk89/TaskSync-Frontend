export interface CreateProjectRequest {
  title: string;
  description?: string;
  projectManagerId?: number | null;
}

export interface CreateTicketCommand {
  projectId: number;
  title: string;
  description?: string;
  assignee?: number;
  type: string;
}
