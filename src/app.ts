import express from "express";
import http from "http";
import cors from "cors";
import api from "./api/api";
import socketIo from "./socket/socketIo";

const app = express();

app.use(cors());

const server = http.createServer(app);

app.use("/", api);

server.listen("3000", () => {
  console.log("Listening on port 3000");
});

socketIo(server);
