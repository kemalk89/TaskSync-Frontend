import { Container, Navbar } from "react-bootstrap";
import { NavbarContent } from "./navbar-content";

export async function NavMenu() {
  return (
    <Navbar expand="sm">
      <Container fluid="xl">
        <NavbarContent />
      </Container>
    </Navbar>
  );
}
