import { auth } from "../auth";
import { Container, Navbar } from "react-bootstrap";
import { NavbarContent } from "./navbar-content";

export async function NavMenu() {
  const session = await auth();

  return (
    <Navbar expand="sm">
      <Container fluid="xl">
        <NavbarContent session={session} />
      </Container>
    </Navbar>
  );
}
