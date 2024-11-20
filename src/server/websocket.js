import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const ECHO_MODE = true;
const port = process.env.PORT || 6969;

function onSocketPreError(e) {
  console.log(e);
}

function onSocketPostError(e) {
  console.log("error");
  console.log(e);
}

console.log(`Attempting to run server on port : ${port}`);

const s = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });

s.on("upgrade", (req, socket, head) => {
  socket.removeListener("error", onSocketPreError);

  // TODO - perform auth
  // if (bad auth) { socket.write('HTTP/1.1 401 Unauthorized'); socket.destroy(); return; }

  // Start the connection
  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws) => {
  ws.on("error", onSocketPostError);
  console.log("connection made");
  ws.on("message", (msg, isBinary) => {
   
    
    wss.clients.forEach((client) => {
      console.log((ECHO_MODE || ws !== client) + " " + (client.readyState === WebSocket.OPEN));
      if ((ECHO_MODE || ws !== client) && client.readyState === WebSocket.OPEN) {
        
        console.log("message received");
        // client.send(msg, { binary: isBinary });
        //TODO - fix dis pls
        isBinary = isBinary;
        client.send(msg.toString());
      }
    });
  });
});

wss.on("close", () => {
  console.log("Connection is closed");
});
