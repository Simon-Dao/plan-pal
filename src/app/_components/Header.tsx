"use client";

import React from "react";
import NavItem from "./NavItem";
import { useSessionStore } from "../_store/store";

function Header() {
  const session = useSessionStore((state) => state.session);

  return (
    <header>
      <nav className="flex justify-center w-full bg-gray-300">
        <NavItem navName="About" navLink="/user/about" />
        {session.clientId && (
          <NavItem navName="My Events" navLink="/user/my-events" />
        )}
        <NavItem navName="Plan a New Event" navLink="/user/new-event" />

        {!session.clientId && (
          <NavItem navName="Sign In" navLink="/" />
        )}

      </nav>
    </header>
  );
}

export default Header;
