"use client";

import Link from "next/link";
import {
  Nav,
  Navbar,
  NavbarCollapse,
  NavbarToggle,
  NavDropdown,
  NavLink,
  DropdownItem,
} from "react-bootstrap";
import Image from "next/image";
import { NewTicketDialog, useTranslation } from "@app/ui-components";
import { SignOut } from "./sign-out";
import { useSession } from "next-auth/react";

export const NavbarContent = () => {
  const { data: session } = useSession();

  const { t } = useTranslation();
  return (
    <>
      <Navbar
        className="navbar-brand d-flex align-items-center gap-1"
        as={Link}
        href="/"
      >
        <Image src={"/images/logo.svg"} width={30} height={30} alt="Logo" />
        TaskSync
      </Navbar>
      {session?.user && (
        <>
          <NavbarToggle aria-controls="basic-navbar-nav" />

          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink as={Link} href="/projects">
                {t("navbar.projects")}
              </NavLink>

              <NavLink as={Link} href="/tickets">
                {t("navbar.tickets")}
              </NavLink>

              <NavLink as={Link} href="/users">
                {t("navbar.users")}
              </NavLink>
              <div className="px-3"></div>
              <NewTicketDialog />
            </Nav>
            <Nav>
              <NavDropdown
                align="end"
                title={session.user.name ?? session.user.email}
              >
                <DropdownItem as={Link} href="/my-profile">
                  {t("navbar.my_profile")}
                </DropdownItem>
                <DropdownItem as={Link} href="/settings">
                  {t("navbar.settings")}
                </DropdownItem>
                <SignOut />
              </NavDropdown>
            </Nav>
          </NavbarCollapse>
        </>
      )}
    </>
  );
};
