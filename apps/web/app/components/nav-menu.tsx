import Link from "next/link";
import { auth } from "../auth";
import { SignOut } from "./sign-out";
import { SignIn } from "./sign-in";
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
        <Link href="/" passHref legacyBehavior>
          <NavbarBrand>TaskSync</NavbarBrand>
        </Link>
        {!session?.user && <SignIn provider="auth0" />}
        {session?.user && (
          <>
            <NavbarToggle aria-controls="basic-navbar-nav" />

            <NavbarCollapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link href="/projects" passHref legacyBehavior>
                  <NavLink>Projekte</NavLink>
                </Link>

                <Link href="/tickets" passHref legacyBehavior>
                  <NavLink>Tickets</NavLink>
                </Link>

                <Link href="/users" passHref legacyBehavior>
                  <NavLink>Users</NavLink>
                </Link>
                <div className="px-3"></div>
                <NewTicketDialog />
              </Nav>
              <Nav>
                <NavDropdown title={session.user.name} id="basic-nav-dropdown">
                  <Link href="/my-profile" passHref legacyBehavior>
                    <DropdownItem>Mein Profil</DropdownItem>
                  </Link>
                  <Link href="/settings" passHref legacyBehavior>
                    <DropdownItem>Einstellungen</DropdownItem>
                  </Link>
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
