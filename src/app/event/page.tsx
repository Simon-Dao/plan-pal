"use client";

import { useEffect, useState } from "react";
import { useCalendarStore } from "../_store/store";
import { CalendarDataType, DayData } from "../_utils/types";

type JsonObject = { [key: string]: unknown };

function Day({ day }: { day: DayData }) {
  return <div>{day.date}</div>;
}

export default function Event() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    //TODO - for now -> every reload grabs data from the server 
  })

  //for live updates from other users
  function openSocket() {
    const newSocket = new WebSocket("ws://localhost:6969");
    setSocket(newSocket);

    newSocket.addEventListener("error", () => {
      setOutput("Socket Error");
    });

    newSocket.addEventListener("open", () => {
      setOutput("Socket Connected");
    });

    newSocket.addEventListener("close", () => {
      setOutput("Socket Closed");
    });

    newSocket.addEventListener("message", (msg: MessageEvent<string>) => {
      // Here we assume msg.data is a string and cast it

      const messageJSON = JSON.parse(msg.data);
      setOutput(`Received message: ${messageJSON}`);
    });
  }

  function closeSocket() {
    if (socket) {
      socket.close();
    }
  }

  function socketSend(message: JsonObject) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("ready state");
      socket.send(JSON.stringify(message));
    }
  }

  //for now just use zustand storage
  const data = useCalendarStore((store) => store.data);
  const setCalendarData = useCalendarStore((store) => store.setData);
  let calendarData = useCalendarStore((store) => store.data);

  return (
    <div className="flex justify-center items-center h-full">
      {/* <button
          className="open-socket m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openSocket}
        >
          Open Socket
        </button>
        <button
          className="close-socket m-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={closeSocket}
        >
          Close Socket
        </button>
        <button
          className="socket-send m-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => socketSend({ message: "hello" })}
        >
          Send Message
        </button>
        <p>{output}</p> */}

      <div>
        <h1>Sign In</h1>
        <div className="flex">
          <h2>Your Name:</h2>
          <input type="text" />
        </div>
        <h1>Or</h1>
        <button>Sign In</button>

        <div>
          <div className="flex">
            <h1>Prioritize</h1>
            <input type="text" />
            <div>
              {/* all people in priority list */}
              priority
            </div>
          </div>
          <div>
            {/* filter */}
            filter
          </div>
          <div className="flex">
            <h1>Filter</h1>
            <input type="text" />
            <div>
              {/* all people in priority list */}
              priority
            </div>
          </div>
          <div>
            {/* filter */}
            filter
          </div>
        </div>
      </div>
      <div>
        {calendarData.startTime}
        {calendarData.endTime}
        <div className="flex">
          {calendarData.days.map((day) => {
            return <Day key={day.date} day={day} />;
          })}
        </div>
      </div>
    </div>
  );
}
