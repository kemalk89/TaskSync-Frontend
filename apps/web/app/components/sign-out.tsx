"use client";

import { signOut } from "next-auth/react";
import { DropdownItem } from "react-bootstrap";

export function SignOut() {
  return (
    <DropdownItem as="button" onClick={() => signOut()}>
      Sign Out
    </DropdownItem>
  );
}
