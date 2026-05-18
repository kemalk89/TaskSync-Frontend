import Link from "next/link";
import { auth } from "../auth";
import { SignOut } from "./sign-out";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavDropdown,
  NavLink,
  DropdownItem,
} from "react-bootstrap";
import { NewTicketDialog } from "@app/ui-components";

export async function NavMenu() {
  const session = await auth();

  return (
    <Navbar expand="sm">
      <Container fluid="xl">
        <NavbarBrand as={Link} href="/">
          TaskSync
        </NavbarBrand>
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
      </Container>
    </Navbar>
  );
}
