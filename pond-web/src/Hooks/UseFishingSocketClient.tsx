import FishingSocketSingleton from "../Websockets/FishingSocketSingleton"

export const useFishingSocketClient = () => {
    const client = FishingSocketSingleton.getInstance();
    return client.getSocket();
}