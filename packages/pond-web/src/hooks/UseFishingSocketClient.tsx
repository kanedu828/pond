import FishingSocketSingleton from "../websockets/FishingSocketSingleton";

export const useFishingSocketClient = () => {
  const client = FishingSocketSingleton.getInstance();
  return client.getSocket();
};
