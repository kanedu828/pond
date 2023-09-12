import FishingController from '../controller/fishingController';

const fishingSocket = (io: any, fishingController: FishingController) => {
  io.on('connection', async (socket: any) => {
    const lastConnectedSocketId = fishingController.updateConnectedSocketId(socket);
    if (lastConnectedSocketId) {
      io.sockets.sockets.get(lastConnectedSocketId)?.disconnect();
    }

    fishingController.getCurrentFish(socket);

    console.log(`${socket.id} has connected`);

    socket.on('collect-fish', async () => {
      await fishingController.collectFish(socket);
    });

    while (socket.id === fishingController.getConnectedSocketId(socket)) {
      await fishingController.pollFish(socket);
    }
  });
};

export default fishingSocket;
