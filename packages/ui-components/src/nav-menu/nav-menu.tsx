"use client";

import { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import { NavItemUser } from "./../nav-item-user/nav-item-user";

type Props = {
  session: {
    user: {
      name: string;
      email: string;
      image: string;
    };
  };
};

export const NavMenu = ({ session }: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = { pathname: "" };

  const isAuthenticated = session?.user;

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <header>
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        container
        light
      >
        <NavbarBrand tag={Link} to="/">
          TaskSync
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse
          className="d-sm-inline-flex flex-sm-row-reverse"
          isOpen={!collapsed}
          navbar
        >
          <ul className="navbar-nav flex-grow">
            {isAuthenticated && (
              <>
                <NavItem>
                  <NavLink active={location.pathname === "/"} tag={Link} to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={location.pathname.startsWith("/project")}
                    tag={Link}
                    to="/projects"
                  >
                    Projects
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={location.pathname.startsWith("/ticket")}
                    tag={Link}
                    to="/tickets"
                  >
                    Tickets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={location.pathname.startsWith("/user-management")}
                    tag={Link}
                    to="/user-management"
                  >
                    Users
                  </NavLink>
                </NavItem>
              </>
            )}
            <NavItemUser />
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};
