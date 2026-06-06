import { LoginPage } from "@app/ui-components";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
