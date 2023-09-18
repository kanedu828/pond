import { Button, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FishInstance } from "../../../shared/types/types";
import { useLogout } from "../Hooks/UseAuthClient";
import { useCheckAuthentication } from "../Hooks/UseCheckAuthentication";
import FishingSocketSingleton from "../Websockets/FishingSocketSingleton";

export const Fishing = () => {

    const fishingSocket = FishingSocketSingleton.getInstance().getSocket();
    const [isConnected, setIsConnected] = useState<boolean>(fishingSocket.connected);
    const logout = useLogout();

    const navigate = useNavigate();

    useCheckAuthentication();

    // Initialize socket
    useEffect(() => {

        const newFish = (newFish: FishInstance) => {
            console.log(newFish)
        }

        fishingSocket.on('connect', () => { setIsConnected(true) });
        fishingSocket.on('disconnect', () => { setIsConnected(false) });
        fishingSocket.on('new-fish', newFish);

        return () => {
            fishingSocket.off('connect');
            fishingSocket.off('disconnect');
            fishingSocket.off('new-fish');
        }
    }, [])


    return (
        <Container>
            Connected: {String(isConnected)}
            <Button onClick={async () => {
                await logout.mutate();
                navigate('/login')
            }}>
                Logout
            </Button>
        </Container>
    )
};