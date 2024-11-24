"use client";

import React, { useEffect, useState } from "react";
import DateCalendar from "../_components/DateCalendar";
import WeekCalendar from "../_components/WeekCalendar";
import {
  CalendarDataType,
  Time24Hour,
  CalendarType,
  DayData,
} from "../_utils/types";
import { useCalendarStore } from "../_store/store";
import { useRouter } from "next/navigation";

function NewEvent() {
  const [selectedCalendarType, setSelectedCalendarType] =
    useState<CalendarType>("Specific Weekdays");
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone // Default to the user's local timezone
  );
  const [selectedStartTime, setSelectedStartTime] =
    useState<Time24Hour>("00:00");
  const [selectedEndTime, setSelectedEndTime] = useState<Time24Hour>("00:00");
  const [selectedDays, setSelectedDays] = useState<DayData[]>([]);

  const setCalendarData = useCalendarStore((store) => store.setData);
  let calendarData = useCalendarStore((store) => store.data);

  const router = useRouter();

  const createEvent = () => {
    const event: CalendarDataType = {
      type: selectedCalendarType,
      timezone: selectedTimezone,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      days: selectedDays,
    };

    setCalendarData(event);
    router.push("/event");
  };

  useEffect(() => {
    calendarData.days = [];
    setCalendarData(calendarData);
  }, [selectedCalendarType]);

  const handleCalendarChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const calendarType = event.target.value as CalendarType;
    setSelectedCalendarType(calendarType);

    // Reset days data if calendar type changes
    setSelectedDays([]);
  };

  const handleTimezoneChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTimezone(event.target.value);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedStartTime(event.target.value as Time24Hour);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndTime(event.target.value as Time24Hour);
  };

  const timezones = Intl.supportedValuesOf
    ? Intl.supportedValuesOf("timeZone") // Modern browsers
    : [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
      ];

  const generateTimeOptions = () =>
    Array.from({ length: 24 }, (_, i) => {
      const hour = i < 10 ? `0${i}` : `${i}`;
      return `${hour}:00`;
    });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 space-y-4">
      {/* Header Section */}
      <div>
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold text-center">Create a New Event</h1>
        </div>

        {/* Calendar Type and View */}
        <div className="w-full max-w-md">
          <label
            htmlFor="calendar-options"
            className="block mb-2 text-sm font-medium"
          >
            What dates might work?
          </label>
          <select
            id="calendar-options"
            onChange={handleCalendarChange}
            value={selectedCalendarType}
            className="border p-2 rounded-md w-full"
          >
            <option value="Specific Weekdays">Specific Weekdays</option>
            <option value="Specific Dates">Specific Dates</option>
          </select>
          <div className="mt-4 h-40 overflow-scroll">
            {selectedCalendarType === "Specific Weekdays" ? (
              <WeekCalendar selectedState={[selectedDays, setSelectedDays]} />
            ) : (
              <DateCalendar selectedState={[selectedDays, setSelectedDays]} />
            )}
          </div>
        </div>
      </div>

      {/* Timezone Selector */}
      <div>
        <div className="w-full max-w-md">
          <label
            htmlFor="timezone-options"
            className="block mb-2 text-sm font-medium"
          >
            Select Timezone
          </label>
          <select
            id="timezone-options"
            onChange={handleTimezoneChange}
            value={selectedTimezone}
            className="border p-2 rounded-md w-full"
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selection */}
        <div className="w-full max-w-md">
          <h2 className="text-sm font-medium mb-2 text-center">
            What times might work?
          </h2>
          <div className="flex space-x-4">
            <div className="flex flex-col items-start w-1/2">
              <label htmlFor="start-hour" className="text-sm mb-1">
                No earlier than
              </label>
              <select
                id="start-hour"
                className="border p-2 rounded-md w-full"
                value={selectedStartTime}
                onChange={handleStartTimeChange}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start w-1/2">
              <label htmlFor="end-hour" className="text-sm mb-1">
                No later than
              </label>
              <select
                id="end-hour"
                className="border p-2 rounded-md w-full"
                value={selectedEndTime}
                onChange={handleEndTimeChange}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full max-w-md">
          <button
            onClick={createEvent}
            className="bg-blue-500 text-white w-full py-2 rounded-md"
          >
            Create!
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewEvent;
