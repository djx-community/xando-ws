import { Server as IoServer, Socket } from "socket.io";
export default {
  registerRoom: (io: IoServer, roomId: string): void => {
    console.log("Hello");
    io.sockets.on("test", (payload) => {
      console.log("Hello");
    });
  },
};
