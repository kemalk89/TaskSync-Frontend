import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  defaultPageSize: number;
};

export const useSyncPaginationWithPathParams = ({
  defaultPageSize,
}: Params) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageNumber, setPageNumber] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();

  useEffect(() => {
    if (searchParams.has("pageNumber")) {
      setPageNumber(
        (searchParams.get("pageNumber") ?? DEFAULT_PAGE_NUMBER) as number
      );
    }
    if (searchParams.has("pageSize")) {
      setPageSize((searchParams.get("pageSize") ?? defaultPageSize) as number);
    }
  }, [searchParams, defaultPageSize]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  return {
    pageNumber,
    pageSize,
    onPageNumberChanged: (pageNumber: number) => {
      router.replace(
        `${pathname}?${createQueryString("pageNumber", pageNumber.toString())}`
      );
    },
    onPageSizeChanged: (pageSize: number) => {
      router.replace(
        `${pathname}?${createQueryString("pageSize", pageSize.toString())}`
      );
    },
  };
};
