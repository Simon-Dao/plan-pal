export type DateString =
  `${number}${number}/${number}${number}/${number}${number}${number}${number}`;
export type CalendarType = "Specific Weekdays" | "Specific Dates";
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Time24Hour = `${number}:${number}`;

export type DayType = DateString | DayOfWeek;

export type Booking = {
  name: string;
  account?: string;
  startTime: Time24Hour;
  endTime: Time24Hour;
};

export type DayData = {
  date: DayType;
  bookings: Booking[];
};

export type CalendarDataType = {
  type: CalendarType;
  timezone: string
  startTime: Time24Hour | "";
  endTime: Time24Hour | "";
  days: DayData[];
};
