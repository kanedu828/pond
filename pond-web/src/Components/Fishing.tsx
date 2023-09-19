import { AppShell, Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FishInstance } from "../../../shared/types/types";
import { useStatus } from "../Hooks/UseAuthClient";
import { useCheckAuthentication } from "../Hooks/UseCheckAuthentication";
import FishingSocketSingleton from "../Websockets/FishingSocketSingleton";
import { Login } from "./Login";
import { Navbar } from "./Navbar";

export const Fishing = () => {

    const fishingSocket = FishingSocketSingleton.getInstance().getSocket();
    const [isConnected, setIsConnected] = useState<boolean>(fishingSocket.connected);
    const { data } = useStatus();
    // useCheckAuthentication();

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
        <>
            <AppShell>
                <Navbar/>
                <Flex style={{ height: '100%' }}direction='column' justify='space-around'>
                        <Container>
                        {String(data?.authenticated)}
                            Connected: {String(isConnected)}
                            Hello
                        </Container>
                </Flex>
            
        
            </AppShell>
            <Login/>
        </>
        
    )
};