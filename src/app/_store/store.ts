import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CalendarDataType, CalendarType } from "../_utils/types";

// Custom storage adapter for zustand persist
const customStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

// Session Store
type SessionStateType = {
  clientId: string;
  credential: string;
};

type SessionStore = {
  session: SessionStateType;
  setSession: (newSession: SessionStateType) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "session-store",
      storage: customStorage, // Use custom storage
    }
  )
);

// Calendar Store
type CalendarStore = {
  data: CalendarDataType;
  setData: (newData: CalendarDataType) => void;
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      data: {
        name: "",
        type: "Specific Date" as CalendarType,
        timezone: "",
        startTime: "",
        endTime: "",
        days: [],
      },
      setData: (newData) =>
        set(() => ({
          data: newData,
        })),
    }),
    {
      name: "calendar-store",
      storage: customStorage, // Use custom storage
    }
  )
);
