"use client"

import React from "react";
import { redirect } from "next/navigation";

type NavItemType = {
  navName: string;
  navLink: string;
};

function NavItem({ navName, navLink }: NavItemType) {
  const onClick = () => {
    redirect(navLink);
  };

  return (
    <button onClick={onClick} className="m-3">
      {navName}
    </button>
  );
}

export default NavItem;
