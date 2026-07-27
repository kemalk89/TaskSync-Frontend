export type ListItem<T> = {
  id: string;
  items: Array<T & { id: string }>;
};
export type Lists<T> = Array<ListItem<T>>;
export type TypeWithId = { id: string | number };
