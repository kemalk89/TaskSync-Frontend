export const addItemToPagedResult = (
  pagedResult: { total: number; items: unknown[] },
  item: unknown
) => {
  const clone = {
    ...pagedResult,
    total: pagedResult.total + 1,
    items: [...pagedResult.items, item],
  };

  return clone;
};

export type Page = {
  pageNumber: number;
  pageSize: number;
};
