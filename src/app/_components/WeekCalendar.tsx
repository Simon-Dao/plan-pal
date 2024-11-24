import React, { useState } from "react";
import { DayData, DayOfWeek } from "../_utils/types";

// Define the props type for WeekDay
type WeekDayProps = {
  day: string;
  clicked: boolean;
  onClick: () => void;
};

function WeekDay({ day, clicked, onClick }: WeekDayProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>{day}</h1>
      <button
        className={
          "h-14 w-5 mr-1 " +
          (clicked ? "bg-blue-500 text-white" : "bg-gray-300")
        }
        onClick={onClick}
      ></button>
    </div>
  );
}

// Define the type for WeekdayType
type WeekdayType = {
  day: DayOfWeek;
  key: string; // Ensure unique key values
  clicked: boolean;
};

type WeekCalendarProps = {
  selectedState: [DayData[], React.Dispatch<React.SetStateAction<DayData[]>>];
};

function WeekCalendar({ selectedState }: WeekCalendarProps) {
  const [selectedDays, setSelectedDays] = selectedState;

  // Define the default values for weekdays
  const defaultVal: WeekdayType[] = [
    { key: "S", day: "Sunday", clicked: false },
    { key: "M", day: "Monday", clicked: false },
    { key: "T", day: "Tuesday", clicked: false },
    { key: "W", day: "Wednesday", clicked: false },
    { key: "Th", day: "Thursday", clicked: false },
    { key: "F", day: "Friday", clicked: false },
    { key: "Sa", day: "Saturday", clicked: false },
  ];

  const [weekdays, setWeekdays] = useState<WeekdayType[]>(defaultVal);

  // Handle click to toggle the `clicked` state of a weekday
  const toggleClick = (day: DayOfWeek) => {
    // Toggle the clicked state in weekdays
    const newWeekdays = weekdays.map((weekday) =>
      weekday.day === day
        ? { ...weekday, clicked: !weekday.clicked }
        : weekday
    );
  
    setWeekdays(newWeekdays);
  
    // Determine if the day was clicked
    const isSelected = newWeekdays.find((weekday) => weekday.day === day)?.clicked;
  
    setSelectedDays((prev) => {
      if (isSelected) {
        // Add to selectedDays if not already present
        if (!prev.some((selectedDay) => selectedDay.date === day)) {
          return [...prev, { date: day, bookings: [] } as DayData];
        }
      } else {
        // Remove from selectedDays if unclicked
        return prev.filter((selectedDay) => selectedDay.date !== day);
      }
      return prev; // Return unchanged if no modifications are needed
    });
  };
  return (
    <div className="flex">
      {weekdays.map((weekday) => (
        <WeekDay
          key={weekday.key}
          day={weekday.day}
          clicked={weekday.clicked}
          onClick={() => toggleClick(weekday.day)}
        />
      ))}
    </div>
  );
}

export default WeekCalendar;
