export type ListItem<T> = {
  id: string;
  items: ListItems<T>;
};
export type ListItems<T> = Array<T & { id: string }>;
export type Lists<T> = Array<ListItem<T>>;
export type TypeWithId = { id: string | number };
