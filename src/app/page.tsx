"use client";

import { useState } from "react";
import Link from "next/link";

type JsonObject = { [key: string]: unknown };

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [output, setOutput] = useState<string>("");

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

  return (
      <div className="flex flex-col">
        <button
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
        <p>{output}</p>
      </div>
  );
}
