/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useCalendarStore } from "../_store/store";
import { CalendarDataType, DayData } from "../_utils/types";

type DayProps = { i: number; day: DayData; calendarData: CalendarDataType };
type HourAxisProps = { calendarData: CalendarDataType };

function HourAxis({ calendarData }: HourAxisProps) {
  const start = parseInt(calendarData.startTime.substring(0, 2));
  const end = parseInt(calendarData.endTime.substring(0, 2));

  const timeElapsed = end - start;
  const hoursArray = Array.from(
    { length: timeElapsed + 2 },
    (_, j) => start + j
  );

  return (
    <div>
      {hoursArray.map((hour, j) => (
        <div className="flex justify-end" key={j}>
          <div
            style={{ bottom: "10px" }}
            className="relative h-7 w-11 flex items-center"
          >
            {j > 0 && <>{hour}:00</>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Day({ i, day, calendarData }: DayProps) {
  const start = parseInt(calendarData.startTime.substring(0, 2));
  const end = parseInt(calendarData.endTime.substring(0, 2));

  const timeElapsed = end - start;
  const blocksArray = Array.from({ length: timeElapsed + 1 });

  return (
    <div className="bg-gray-400">
      <div className="h-7 w-full" style={{ backgroundColor: "#ededed" }}>
        {day.date}
      </div>
      {blocksArray.map((_, j) => (
        <div
          className="border-b border-r border-dotted border-black"
          key={`${i}-${j}`}
        >
          <div className={"h-7 w-full"}></div>
        </div>
      ))}
    </div>
  );
}

export default function Event() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    // TODO - Add logic for socket management or server data fetching
  }, []);

  const calendarData = useCalendarStore((store) => store.data);

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="flex justify-center w-full">
        <div className="flex flex-col">
          {/* Enter your name or sign in */}
          <div className="h-56 w-96 p-4 bg-white border rounded-md shadow-md">
            <h1 className="text-lg font-semibold">Sign In</h1>
            <div className="flex items-center gap-2 mt-2">
              <h2>Your Name:</h2>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-1 rounded-md w-full"
              />
            </div>
            <h1 className="text-center mt-4">Or</h1>
            <button className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Sign In
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 h-56 w-96 p-4 bg-white border rounded-md shadow-md grow">
            <h1 className="text-lg font-semibold">Prioritize</h1>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-1 rounded-md w-full"
              />
            </div>
            <h1 className="text-lg font-semibold">Remove</h1>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-1 rounded-md w-full"
              />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <div className="flex justify-center w-full h-10">
            <h1 className="justify-self-center text-xl font-bold mb-4">
              {calendarData.name}
            </h1>
          </div>
          <div
            className={`pt-1 grid gap-1`}
            style={{
              gridTemplateColumns: `100px repeat(${calendarData.days.length}, minmax(80px, 1fr))`,
            }}
          >
            {/* Hour Axis */}
            <div className="sticky left-0">
              <HourAxis calendarData={calendarData} />
            </div>

            {/* Dynamic Day Columns */}
            {calendarData.days.map((day, i) => (
              <Day i={i} calendarData={calendarData} key={day.date} day={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
