export interface CreateProjectRequest {
  title: string;
  description?: string;
  projectManagerId?: number | null;
}

export type UpdateProjectCommand = Partial<CreateProjectRequest>;

export interface CreateTicketCommand {
  projectId: number;
  title: string;
  description?: string;
  assignee?: number;
  type: string;
  labels: { labelId: string; title: string }[];
}

export type UpdateTicketCommand = Partial<CreateTicketCommand> & {
  statusId?: number;
};
