import http from "http";
import expressApp from "./core/expressApp";
import socketIo from "./core/socketIo";

const server = http.createServer(expressApp);

server.listen("3000", () => {
  console.log("Listening on port 3000");
});

socketIo(server);
