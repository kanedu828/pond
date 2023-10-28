import { AppShell, Container, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { FishInstance } from "../../../shared/types/types";
import { FishingAnimationState } from "../types/types";
import FishingSocketSingleton from "../websockets/FishingSocketSingleton";
import { AnimationManager } from "./AnimationManager";
import { Login } from "./Login";
import { Navbar } from "./Navbar";

export const Fishing = () => {

    const fishingSocket = FishingSocketSingleton.getInstance().getSocket();
    const [isConnected, setIsConnected] = useState<boolean>(fishingSocket.connected);
    const [fishingAnimationState, setFishingAnimationState] = useState<FishingAnimationState>(FishingAnimationState.Idle);

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

    function collectFish() {
        const FISH_APPEARING_ANIMATION_MS = 800;
        if (fishingAnimationState === FishingAnimationState.Idle) {
            setFishingAnimationState(FishingAnimationState.Appearing);
            setTimeout(() => setFishingAnimationState(FishingAnimationState.IdleWithFish), FISH_APPEARING_ANIMATION_MS);
        }
    }


    return (
        <>
            <AppShell>
                <Navbar/>
                <Flex style={{ height: '100%' }}direction='column' justify='space-around'>
                        <Container>
                                Connected: {String(isConnected)}
                               <AnimationManager state={fishingAnimationState} setState={setFishingAnimationState} onClick={collectFish}/>
                        </Container>
                </Flex>
            
        
            </AppShell>
            <Login/>
        </>
        
    )
};