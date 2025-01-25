import React, { Suspense } from "react";
import { ProjectsPage } from "@app/ui-components";

export default function Page() {
  return (
    <Suspense>
      <ProjectsPage />
    </Suspense>
  );
}
