"use client";

import Link from "next/link";
import { NavbarBrand as ReactBootstrapNavbarBrand } from "react-bootstrap";
import Image from "next/image";

export const NavbarBrand = () => {
  return (
    <ReactBootstrapNavbarBrand
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
    </ReactBootstrapNavbarBrand>
  );
};
