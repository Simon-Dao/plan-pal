import { create } from "zustand";

type SessionStateType = {
  clientId: string;
  credential: string;
};

type SessionStore = {
  session: SessionStateType;
  setSession: (newSession: SessionStateType) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: {
    clientId: "",
    credential: "",
  },
  setSession: (newSession) =>
    set(() => ({
      session: newSession,
    })),
  clearSession: () =>
    set(() => ({
      session: {
        clientId: "",
        credential: "",
      },
    })),
}));
