import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  UncontrolledDropdown,
} from "reactstrap";
import { UserName } from "../user-name/user-name";

type Props = {};

export const NavItemUser = ({}: Props) => {
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <NavItem>
        <NavLink to="/components/">Login</NavLink>
      </NavItem>
    );
  }

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <UserName user={user} />
        {user?.name}
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem onClick={() => navigate("/profile")}>
          Profil anzeigen
        </DropdownItem>
        <DropdownItem>Einstellungen</DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
