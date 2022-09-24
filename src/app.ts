import http from "http";
import socketIo from "./core/socketIo";
import utils from "./utils/utils";

const server = http.createServer();

utils.clearDb();

socketIo(server);

server.listen("3000", () => {
  console.log("Listening on port 3000");
});
