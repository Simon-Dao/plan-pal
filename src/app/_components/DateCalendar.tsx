import React, { useState } from "react";
import { DayData } from "../_utils/types";
type CalendarDateProps = {
  day: number | null; // `null` for empty days (padding)
  clicked: boolean;
  onClick: () => void;
};
type SelectedStateType = {
  [key: string]: DayData[] | any;
};
function CalendarDate({ day, clicked, onClick }: CalendarDateProps) {
  return (
    <button
      onClick={onClick}
      className={
        "flex flex-col justify-center items-center h-8 w-8 border " +
        (clicked ? "bg-blue-500 text-white" : "bg-gray-300")
      }
    >
      {day}
    </button>
  );
}
function MonthlyCalendar(selectedState: SelectedStateType) {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  ); // 0 = January
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [clickedDates, setClickedDates] = useState<{ [key: string]: boolean }>(
    {}
  ); // Map for clicked dates
  const [selectedDays, setSelectedDays] = selectedState.selectedState;

  // Generate the days for the selected month and year
  const generateCalendar = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the starting day of the month (0 = Sunday)
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7; // Total cells to render (full weeks)

    const calendar: (number | null)[] = Array(totalCells).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      calendar[firstDayOfMonth + i - 1] = i;
    }

    return calendar;
  };

  const calendarDays = generateCalendar(selectedMonth, selectedYear);

  const toggleClick = (day: number | null) => {
    if (!day) return;

    const key = `${selectedYear}-${selectedMonth + 1}-${day}`;
    const dateData = {
      date: `${selectedMonth + 1}/${day}/${selectedYear}`, // MM/DD/YYYY format
      bookings: [],
    };

    setClickedDates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Update selectedDays
    setSelectedDays((prev : DayData[]) => {
      if (clickedDates[key]) {
        // Remove the day if it was already clicked
        return prev.filter((selectedDay) => selectedDay.date !== dateData.date);
      } else {
        // Add the day if it's newly clicked, avoiding duplicates
        if (!prev.some((selectedDay) => selectedDay.date === dateData.date)) {
          return [...prev, dateData];
        }
        return prev;
      }
    });
  };

  const deleteSelectedDate = (key: string) => {
    const [year, month, day] = key.split("-");

    const formattedKey = `${parseInt(month)}/${parseInt(day)}/${year}`; // MM/DD/YYYY
    setClickedDates((prev) => {
      const updatedDates = { ...prev };
      delete updatedDates[key];
      return updatedDates;
    });

    setSelectedDays((prev : DayData[]) =>
      prev.filter((selectedDay) => selectedDay.date !== formattedKey)
    );
  };

  const getFormattedDates = () => {
    return Object.keys(clickedDates)
      .filter((key) => clickedDates[key]) // Filter only clicked dates
      .map((key) => {
        const [year, month, day] = key.split("-");
        return { key, formatted: `${parseInt(month)}/${parseInt(day)}/${year}` }; // MM/DD/YYYY
      });
  };

  const formattedDates = getFormattedDates();

  return (
    <div className="flex flex-col items-center">
      {/* Month and Year Selector */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2 mx-2"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 mx-2"
        />
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Weekday Headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="flex justify-center items-center font-bold">
            {day}
          </div>
        ))}
        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <CalendarDate
            key={index}
            day={day}
            clicked={!!clickedDates[`${selectedYear}-${selectedMonth + 1}-${day}`]}
            onClick={() => toggleClick(day)}
          />
        ))}
      </div>

      {/* List of Selected Dates */}
      <h2 className="text-lg font-bold mb-2">Selected Dates:</h2>
      <div className="w-full max-h-40 overflow-y-auto p-4 border">
        {formattedDates.length > 0 ? (
          <ul>
            {formattedDates.map(({ key, formatted }) => (
              <li
                key={key}
                className="mb-1 cursor-pointer text-blue-600 underline hover:text-blue-800"
                onClick={() => deleteSelectedDate(key)} // Remove date on click
              >
                {formatted}
              </li>
            ))}
          </ul>
        ) : (
          <p>No dates selected</p>
        )}
      </div>
    </div>
  );
}

export default MonthlyCalendar;