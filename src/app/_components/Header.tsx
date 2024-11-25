"use client";

import React from "react";
import NavItem from "./NavItem";
import { useSessionStore } from "../_store/store";

function Header() {
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);

  return (
    <header>
      <nav className="flex justify-center w-full bg-gray-300">
        <NavItem navName="About" navLink="/about" />
        {session.clientId && (
          <NavItem navName="My Events" navLink="/my-events" />
        )}
        <NavItem navName="Plan a New Event" navLink="/new-event" />
        <NavItem navName="Event" navLink="/event" />
        {!session.clientId ? <NavItem navName="Sign In" navLink="/" /> : <NavItem onClick={clearSession} navName="Log Out" navLink="/" />}
      </nav>
    </header>
  );
}

export default Header;
