import FishingController from "../controller/fishingController";

const registerFishingSocket = (
  io: any,
  fishingController: FishingController,
) => {
  io.on("connection", async (socket: any) => {
    const lastConnectedSocketId =
      fishingController.updateConnectedSocketId(socket);
    if (lastConnectedSocketId) {
      io.sockets.sockets.get(lastConnectedSocketId)?.disconnect();
    }

    fishingController.getCurrentFish(socket);

    console.log(`${socket.id} has connected`);

    socket.on("collect-fish", async () => {
      await fishingController.collectFish(socket);
    });

    const pollInterval = setInterval(async () => {
      if (socket.id === fishingController.getConnectedSocketId(socket)) {
        await fishingController.pollFish(socket);
      } else {
        clearInterval(pollInterval);
      }
    }, 10000);

    socket.on("disconnect", () => {
      clearInterval(pollInterval);
    });
  });
};

export default registerFishingSocket;
