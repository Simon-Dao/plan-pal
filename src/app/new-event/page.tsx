"use client"

import React, { useState } from "react";
import DateCalendar from "../_components/DateCalendar";
import WeekCalendar from "../_components/WeekCalendar";
import { CalendarDataType, Time24Hour, CalendarType, DayData } from "../_utils/types";
import { useCalendarStore } from "../_store/store";
import { useRouter } from "next/navigation";

function NewEvent() {
  const [selectedCalendarType, setSelectedCalendarType] = useState<CalendarType>("Specific Weekdays");
  const [selectedTimezone, setSelectedTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [selectedStartTime, setSelectedStartTime] = useState<Time24Hour>("00:00");
  const [selectedEndTime, setSelectedEndTime] = useState<Time24Hour>("00:00");
  const [selectedDays, setSelectedDays] = useState<DayData[]>([]);
  const [calendarName, setCalendarName] = useState("");

  const setCalendarData = useCalendarStore((store) => store.setData);
  const router = useRouter();

  const createEvent = () => {
    const event: CalendarDataType = {
      name: calendarName,
      type: selectedCalendarType,
      timezone: selectedTimezone,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      days: selectedDays,
    };

    setCalendarData(event);
    router.push("/event");
  };

  const handleCalendarChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const calendarType = event.target.value as CalendarType;
    setSelectedCalendarType(calendarType);
    setSelectedDays([]);  // Reset days data if calendar type changes
  };

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(event.target.value);
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStartTime(event.target.value as Time24Hour);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndTime(event.target.value as Time24Hour);
  };

  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"];
  const generateTimeOptions = () => Array.from({ length: 24 }, (_, i) => `${i < 10 ? `0${i}` : `${i}`}:00`);

  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Create a New Event</h1>
        <input 
          type="text"
          placeholder="Enter event name..."
          value={calendarName}
          onChange={(event) => setCalendarName(event.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-md mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="calendar-options" className="block mb-2 text-sm font-medium">What dates might work?</label>
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
          <div>
            <label htmlFor="timezone-options" className="block mb-2 text-sm font-medium">Select Timezone</label>
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
            <div className="mt-4">
              <h2 className="text-sm font-medium mb-2">What times might work?</h2>
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="start-hour" className="mb-1">No earlier than</label>
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
                <div className="flex flex-col w-full">
                  <label htmlFor="end-hour" className="mb-1">No later than</label>
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
          </div>
          <div className="col-span-2">
            <button
              onClick={createEvent}
              className="bg-blue-500 text-white w-full py-3 rounded-md mt-4"
            >
              Create Event!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewEvent;