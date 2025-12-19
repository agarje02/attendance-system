import { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { verifyJWT } from "./utils/jwt.utils";
import { handleIncomingMessage } from "./controllers/websocket";
import { EVENTS } from "./types/websocket.events";
import { createWebSocketError, WS_ERROR_MESSAGES } from "./utils/websocketError";
import { activeSession } from "./global";

let wss: WebSocketServer;
const initializeWebSocket = (server: Server) => {
    wss = new WebSocketServer({ noServer: true });
    server.on("upgrade", (request, socket, head) => {
      // @ts-ignore
       const url = new URL(request?.url || "", "http://localhost:3000");
       const token = url.searchParams.get("token");
       
       // Always upgrade first, then validate and send errors via WebSocket if needed
       wss.handleUpgrade(request, socket, head, (ws) => {
         let userData = null;
         
         if(token){
           try {
             const data = verifyJWT(token);
             if(data){
               userData = data as any;
             }
           } catch (error) {
             console.log(error,'error verifying token');
           }
         }
         
         if(!userData){
           // Send error and close for invalid/missing token
           const error = createWebSocketError(WS_ERROR_MESSAGES.UNAUTHORIZED);
           ws.send(JSON.stringify(error));
           ws.close();
           return;
         }
         
         // @ts-ignore
         ws.user = userData; // attach user info to the WebSocket connection
         console.log("Client established connection:", userData);
         wss.emit('connection', ws);
       });
    });
      // When new client connects
  wss.on("connection", (ws) => {
    // @ts-ignore
        console.log("Client connected:", ws.user);

    ws.on("message", (msg) => {
      try {
        const parsedMsg = JSON.parse(msg.toString());
        handleIncomingMessage(wss, ws, parsedMsg as EVENTS);
      } catch (error) {
        // Invalid JSON format
        const errorMsg = createWebSocketError("Invalid message format");
        ws.send(JSON.stringify(errorMsg));
      }
    });
    ws.on("close", () => {
      console.log("Client disconnected");
      activeSession.classId = null;
      activeSession.startedAt = null;
      activeSession.attendance = {};
    });

  });
  return wss;
}

const broadCastToAllClients = (data: any) => {
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });
}
export { initializeWebSocket, broadCastToAllClients };