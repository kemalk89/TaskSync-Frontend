export const addItemToPagedResult = (pagedResult: any, item: any) => {
    const clone = {
        ...pagedResult,
        total: pagedResult.total + 1,
        items: [...pagedResult.items, item]
    };

    return clone;
};
