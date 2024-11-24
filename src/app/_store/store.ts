import { create } from "zustand";
import { CalendarDataType, CalendarType } from "../_utils/types";

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

type CalendarStore = {
  data: CalendarDataType;
  setData: (newSession: CalendarDataType) => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  data: {
    type: "Specific Date" as CalendarType,
    timezone: "",
    startTime: "",
    endTime: "",
    days: [],
  },
  setData: (newVal) =>
    set(() => ({
      data: newVal,
    })),
}));
