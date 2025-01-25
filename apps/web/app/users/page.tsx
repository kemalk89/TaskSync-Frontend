import { UsersPage } from "@app/ui-components";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <UsersPage />
    </Suspense>
  );
}
