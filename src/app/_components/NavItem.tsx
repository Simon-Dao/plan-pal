"use client";

import React from "react";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

type NavItemType = {
  navName: string;
  navLink: string;
  onClick?: ()=> void;
};

function NavItem({ navName, navLink, onClick }: NavItemType) {
  const router = useRouter();

  const onClick_ = () => {
    if(onClick) onClick();
    router.push(navLink);
  };

  return (
    <button onClick={onClick_} className="m-3">
      {navName}
    </button>
  );
}

export default NavItem;
