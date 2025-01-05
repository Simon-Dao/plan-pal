/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { SessionStateType, useCalendarStore, useSessionStore } from "../_store/store";
import {
  Booking,
  CalendarDataType,
  DayData,
  Time24Hour,
} from "../_utils/types";
import { SessionState } from "http2";

type DayProps = {
  i: number;
  day: DayData;
  calendarData: CalendarDataType;
  dragState: DragState;
  bookerName: string;
  blockStates: boolean[][];
  setBlockStates: Dispatch<SetStateAction<never[]>>;
};

type HourAxisProps = { calendarData: CalendarDataType };

type Point = { x: number; y: number };
type DragState = {
  dragStart: Point | null;
  setDragStart: (point: Point | null) => void;
  dragEnd: Point | null;
  setDragEnd: (point: Point | null) => void;
};

function HourAxis({ calendarData }: HourAxisProps) {
  const start = calendarData.startTime;
  const end = calendarData.endTime;
  const hoursArray = Array.from(
    { length: end - start + 2 },
    (_, j) => start + j
  );

  return (
    <div>
      {hoursArray.map((hour, j) => (
        <div className="flex justify-end" key={j}>
          <div className="relative h-7 w-11 flex items-center select-none">
            {j > 0 && <>{hour}:00</>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Day({ i, day, dragState, blockStates, setBlockStates }: DayProps) {
  const getDragRect = () => {
    const { dragStart, dragEnd } = dragState;
    if (!dragStart) return null;
    if (!dragEnd)
      return {
        left: dragStart.x,
        right: dragStart.x,
        top: dragStart.y,
        bottom: dragStart.y,
      };

    return {
      left: Math.min(dragStart.x, dragEnd.x),
      right: Math.max(dragStart.x, dragEnd.x),
      top: Math.min(dragStart.y, dragEnd.y),
      bottom: Math.max(dragStart.y, dragEnd.y),
    };
  };

  return (
    <div className="bg-gray-400">
      <div className="h-7 w-full bg-gray-200 select-none">{day.date}</div>
      {blockStates[i] &&
        blockStates[i].map((_, j) => (
          <div
            className="border-b border-r border-dotted border-black"
            key={`${i}-${j}`}
          >
            <Block
              getDragRect={getDragRect}
              dragEnd={dragState.dragEnd}
              dragging={!!dragState.dragStart}
              blockStates={blockStates}
              setBlockStates={setBlockStates}
              i={i}
              j={j}
            />
          </div>
        ))}
    </div>
  );
}

function Block({
  getDragRect,
  dragEnd,
  dragging,
  blockStates,
  setBlockStates,
  i,
  j,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDragRect: () => any;
  dragEnd: Point | null;
  dragging: boolean;
  blockStates: boolean[][];
  setBlockStates: Dispatch<SetStateAction<never[]>>;
  i: number;
  j: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasBeenDraggedOver = useRef(false);

  useEffect(() => {
    const checkBounds = () => {
      const bounds = getDragRect();
      if (!bounds || !ref.current) return false;

      const rect = ref.current.getBoundingClientRect();
      return (
        rect.right >= bounds.left &&
        rect.left <= bounds.right &&
        rect.bottom >= bounds.top &&
        rect.top <= bounds.bottom
      );
    };

    if (dragging) {
      if (checkBounds() && !hasBeenDraggedOver.current) {
        setBlockStates((prev) => {
          const newPrev = JSON.parse(JSON.stringify(prev)) as boolean[][];

          newPrev[i][j] = !newPrev[i][j];

          return newPrev as never[];
        });
        hasBeenDraggedOver.current = true;
      }
    } else {
      hasBeenDraggedOver.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, dragEnd]);

  return (
    <div
      ref={ref}
      className={`h-7 w-full select-none ${
        blockStates[i][j] ? "bg-green-500" : ""
      }`}
    ></div>
  );
}

export default function Event() {
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragEnd, setDragEnd] = useState<Point | null>(null);
  const [dragging, setDragging] = useState(false);
  const [signInInput, setSignInInput] = useState("");
  const [tempSignin, setTempSignin] = useState("");
  const [save, setSave] = useState(false);
  const [blockStates, setBlockStates] = useState([[false]]);
  const session = useSessionStore((store) => store.session)
  const setSession = useSessionStore((store) => store.setSession)
  const calendarData = useCalendarStore((store) => store.data);
  const addBookings = useCalendarStore((store) => store.addBookings);

  // Once dragging is complete, activate the save button
  useEffect(() => {
    if (dragging) setSave(true);
  }, [dragging]);

  // Once the page loads, set the blockStates to match the calendar data
  useEffect(() => {
    const numDays = calendarData.days.length;

    if (numDays == 0) return;
    const start = calendarData.startTime;
    const end = calendarData.endTime;

    const numHours = end - start + 1;

    const newBlockStates = Array.from({ length: numDays }, () => 
      Array.from({ length: numHours+1 }, () => false)
    );

    console.log(newBlockStates)
    //set new block states
    calendarData.days.forEach((day, i) => {
      day.bookings.forEach(
        (booking: { startTime: number; endTime: number }) => {
          const startIndex = booking.startTime;
          const endIndex = booking.endTime;

          console.log("start " + startIndex)
          console.log("end "+ endIndex)

          for (let j = startIndex-1; j < endIndex-1; j++) {
            newBlockStates[i][j] = true; // Mark blocks as booked
          }
        }
      );
    });

    setBlockStates(newBlockStates as never[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  const signInTemp = () => {
    session.tempId = signInInput
    setSession(session);
  };

  const saveNewBookings = () => {
    setSave(false);

    calendarData.days.forEach((day, dayI) => {
      const newBookings: Booking[] = [];
      let started = false;
      let temp: Booking | null = null;

      const blockDay = blockStates[dayI];

      for (let i = 0; i < blockDay.length; i++) {
        if (blockDay[i] && !started) {
          // Start a new booking
          started = true;
          temp = {
            name: "",
            startTime: i+1 as Time24Hour,
            endTime: i+1 as Time24Hour,
          };
        } else if (
          (!blockDay[i] && started) ||
          (started && i === blockDay.length - 1)
        ) {
          // End the current booking
          if (temp) {
            temp.endTime = i+1 as Time24Hour;
            newBookings.push(temp);
            temp = null;
          }
          started = false;
        }
      }
      addBookings(day.date, newBookings);
    });

  };

  const controlPanel =
    // sessionData.clientId === "" &&
    session.tempId === "" ? (
      <div className="h-56 w-96 p-4 bg-white border rounded-md shadow-md">
        <h1 className="text-lg font-semibold">Sign In</h1>
        <div className="flex items-center gap-2 mt-2">
          <h2>Your Name:</h2>
          <input
            type="text"
            value={signInInput}
            onChange={(event) => setSignInInput(event.target.value)}
            placeholder="Enter your name"
            className="border p-1 rounded-md w-full"
          />
        </div>
        <button
          onClick={signInTemp}
          className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Sign In
        </button>
      </div>
    ) : (
      <div className="h-56 w-96 p-4 bg-white border rounded-md shadow-md">
        <h1 className="text-lg font-semibold">{session.tempId}</h1>
        <div className="flex items-center gap-2 mt-2"></div>
        <button
          onClick={saveNewBookings}
          className={
            "w-full mt-2 text-white py-2 px-4 rounded " +
            (save ? "bg-blue-500" : "bg-gray-500")
          }
        >
          Save
        </button>
      </div>
    );

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="flex justify-center w-full">
        <div className="flex flex-col">
          {controlPanel}
          <div className="mt-4 h-56 w-96 p-4 bg-white border rounded-md shadow-md grow">
            <h1 className="text-lg font-semibold">Prioritize</h1>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-1 rounded-md w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-center w-full h-10">
            <h1 className="text-xl font-bold mb-4">{calendarData.name}</h1>
          </div>
          <div
            className="pt-1 grid gap-1"
            style={{
              gridTemplateColumns: `100px repeat(${calendarData.days.length}, minmax(80px, 1fr))`,
            }}
            onMouseDown={(event) => {
              if (session.tempId === "") return;
              setDragging(true);
              setDragStart({ x: event.clientX, y: event.clientY });
            }}
            onMouseUp={() => {
              if (session.tempId === "") return;
              setDragging(false);
              setDragStart(null);
              setDragEnd(null);
            }}
            onMouseMove={(event) => {
              if (session.tempId === "") return;
              if (dragging) setDragEnd({ x: event.clientX, y: event.clientY });
            }}
          >
            <div className="sticky left-0">
              <HourAxis calendarData={calendarData} />
            </div>
            {calendarData.days.map((day, i) => (
              <Day
                bookerName={session.tempId}
                key={day.date}
                i={i}
                day={day}
                calendarData={calendarData}
                dragState={{ dragStart, setDragStart, dragEnd, setDragEnd }}
                blockStates={blockStates}
                setBlockStates={
                  setBlockStates as Dispatch<SetStateAction<never[]>>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
