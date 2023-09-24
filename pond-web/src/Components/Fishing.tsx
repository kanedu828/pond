import { AppShell, Container, Flex, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { FishInstance } from "../../../shared/types/types";
import FishingSocketSingleton from "../Websockets/FishingSocketSingleton";
import { Login } from "./Login";
import { Navbar } from "./Navbar";

export const Fishing = () => {

    const fishingSocket = FishingSocketSingleton.getInstance().getSocket();
    const [isConnected, setIsConnected] = useState<boolean>(fishingSocket.connected);

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
                                Connected: {String(isConnected)}
                                <Image
                                    radius="md"
                                    src="https://images.unsplash.com/photo-1688920556232-321bd176d0b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
                                />
                        </Container>
                </Flex>
            
        
            </AppShell>
            <Login/>
        </>
        
    )
};