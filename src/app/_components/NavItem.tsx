"use client";

import React from "react";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

type NavItemType = {
  navName: string;
  navLink: string;
};

function NavItem({ navName, navLink }: NavItemType) {
  const router = useRouter();

  const onClick = () => {
    router.push(navLink);
  };

  return (
    <button onClick={onClick} className="m-3">
      {navName}
    </button>
  );
}

export default NavItem;
