"use client";

import { useEffect, useRef, useState } from "react";
import { useCalendarStore } from "../_store/store";
import { CalendarDataType, DayData } from "../_utils/types";

type DayProps = {
  i: number;
  day: DayData;
  calendarData: CalendarDataType;
  dragState: DragState;
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
  const start = parseInt(calendarData.startTime.substring(0, 2));
  const end = parseInt(calendarData.endTime.substring(0, 2));
  const hoursArray = Array.from({ length: end - start + 2 }, (_, j) => start + j);

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

function Day({ i, day, calendarData, dragState }: DayProps) {
  const start = parseInt(calendarData.startTime.substring(0, 2));
  const end = parseInt(calendarData.endTime.substring(0, 2));
  const blocksArray = Array.from({ length: end - start + 1 });

  const getDragRect = () => {
    const { dragStart, dragEnd } = dragState;
    if (!dragStart) return null;
    if (!dragEnd) return { left: dragStart.x, right: dragStart.x, top: dragStart.y, bottom: dragStart.y };

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
      {blocksArray.map((_, j) => (
        <div className="border-b border-r border-dotted border-black" key={`${i}-${j}`}>
          <Block
            getDragRect={getDragRect}
            dragEnd={dragState.dragEnd}
            dragging={!!dragState.dragStart}
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
}: {
  getDragRect: () => any;
  dragEnd: Point | null;
  dragging: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);
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
        setIsSelected((prev) => !prev);
        hasBeenDraggedOver.current = true;
      }
    } else {
      hasBeenDraggedOver.current = false;
    }
  }, [dragging, dragEnd, getDragRect]);

  return (
    <div
      ref={ref}
      className={`h-7 w-full select-none ${isSelected ? "bg-green-500" : ""}`}
    ></div>
  );
}

export default function Event() {
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragEnd, setDragEnd] = useState<Point | null>(null);
  const [dragging, setDragging] = useState(false);

  const calendarData = useCalendarStore((store) => store.data);

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="flex justify-center w-full">
        <div className="flex flex-col">
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

          <div className="mt-4 h-56 w-96 p-4 bg-white border rounded-md shadow-md grow">
            <h1 className="text-lg font-semibold">Prioritize</h1>
            <div className="flex items-center gap-2 mt-2">
              <input type="text" placeholder="Enter your name" className="border p-1 rounded-md w-full" />
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
              setDragging(true);
              setDragStart({ x: event.clientX, y: event.clientY });
            }}
            onMouseUp={() => {
              setDragging(false);
              setDragStart(null);
              setDragEnd(null);
            }}
            onMouseMove={(event) => {
              if (dragging) setDragEnd({ x: event.clientX, y: event.clientY });
            }}
          >
            <div className="sticky left-0">
              <HourAxis calendarData={calendarData} />
            </div>
            {calendarData.days.map((day, i) => (
              <Day
                key={day.date}
                i={i}
                day={day}
                calendarData={calendarData}
                dragState={{ dragStart, setDragStart, dragEnd, setDragEnd }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}