import http from "http";
import socketIo from "./core/socketIo";

const server = http.createServer();

socketIo(server);

server.listen("3000", () => {
  console.log("Listening on port 3000");
});
