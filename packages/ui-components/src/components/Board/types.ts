export type BoardColumn = {
  id: string;
  title: string;
  width: string;
};

export type WorkItem = {
  id: string;
  title: string;
  columnId?: string;
};
