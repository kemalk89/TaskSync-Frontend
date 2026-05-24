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
import { NewTicketDialog } from "@app/ui-components";
import { SignOut } from "./sign-out";
import { Session } from "next-auth";

export const NavbarContent = ({ session }: { session: Session | null }) => {
  return (
    <>
      <Navbar
        as={Link}
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
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
                Projekte
              </NavLink>

              <NavLink as={Link} href="/tickets">
                Tickets
              </NavLink>

              <NavLink as={Link} href="/users">
                Users
              </NavLink>
              <div className="px-3"></div>
              <NewTicketDialog />
            </Nav>
            <Nav>
              <NavDropdown
                title={session.user.name ?? session.user.email}
                id="basic-nav-dropdown"
              >
                <DropdownItem as={Link} href="/my-profile">
                  Mein Profil
                </DropdownItem>
                <DropdownItem as={Link} href="/settings">
                  Einstellungen
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
