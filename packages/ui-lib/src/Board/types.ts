export type BoardColumn<T> = {
  id: string;
  title: string;
  width: string;
  workItems: Array<T & { id: string }>;
};
