import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/ts-common/secret";

const wss = new WebSocketServer({ port: 8080 });
console.log("application started successfully");
wss.on("connection", (ws,request) => {
  const url = request.url;
  if(!url) {
    ws.close();
    return;
  }
  const token = url.split("/")[1];
  if(!token) {
    ws.close();
    return;
  }

  const decoded = jwt.verify(token,JWT_SECRET as string)
  if(!decoded) {
    ws.close();
    return;
  } 

  ws.on("message",(message) => {
    const parsedMessage = JSON.parse(message.toString());
    if(parsedMessage.type === "ping") {
      ws.send(JSON.stringify({type : "pong"}));
    }
  })
  
  
});