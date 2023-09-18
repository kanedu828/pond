import { io, Socket } from 'socket.io-client';

export default class FishingSocketSingleton {
  private static instance: FishingSocketSingleton;
  private socket: Socket;

  private constructor() {
    const url = import.meta.env.VITE_POND_FISHING_WS_URL;
    if (!url) {
        throw new Error('Could not find pond web fishing websocket url');
    }
    this.socket = io(url);
  }

  public static getInstance(): FishingSocketSingleton {
    if (!FishingSocketSingleton.instance) {
      FishingSocketSingleton.instance = new FishingSocketSingleton();
    }
    return FishingSocketSingleton.instance;
  }

  public getSocket(): Socket {
    return this.socket;
  }
}
