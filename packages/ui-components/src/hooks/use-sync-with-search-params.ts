import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useSyncWithSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    searchParams,
    updateSearchParams: (params: Record<string, unknown>) => {
      const searchParamsCopy = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        searchParamsCopy.set(key, value as string);
      });

      router.push(`${pathname}?${searchParamsCopy}`);
    },
  };
};
