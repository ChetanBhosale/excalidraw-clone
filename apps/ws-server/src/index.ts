import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/ts-common/secret";

const wss = new WebSocketServer({ port: 8080 });
console.log("application started successfully");
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message:any) => {

    const parsedMessage = JSON.parse(message.toString());
    if(parsedMessage.token) {
      const decoded = jwt.verify(parsedMessage.token,JWT_SECRET as string)
      console.log({decoded})
      if(!decoded) {
        return ws.send(JSON.stringify({message : "Unauthorized"}))
      }
    }else{
      return ws.send(JSON.stringify({message : "Unauthorized"}))
    }
  });
  
  
});