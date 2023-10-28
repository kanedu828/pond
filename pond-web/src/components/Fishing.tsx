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
    const [fish, setFish] = useState<FishInstance | null>(null);
    // This is used to clear timeouts when fish are caught
    const [fishTimeout, setFishTimeout] = useState<number>(0);

    // Initialize socket
    useEffect(() => {
        const newFish = (newFish: FishInstance) => {
            const FISH_APPEARING_ANIMATION_MS = 800;
            const millisecondsFishable = newFish.expirationDate - Date.now();
            if (fishingAnimationState === FishingAnimationState.Idle && millisecondsFishable > 0) {
                setFish(fish);
                setFishingAnimationState(FishingAnimationState.Appearing);
                setTimeout(() => setFishingAnimationState(FishingAnimationState.IdleWithFish), FISH_APPEARING_ANIMATION_MS);
                const newFishTimeout = window.setTimeout(() => {
                    setFishingAnimationState(FishingAnimationState.Idle);
                    setFish(null);
                }, millisecondsFishable);
                setFishTimeout(newFishTimeout);
                console.log(newFish);
            }
        }

        fishingSocket.on('connect', () => { setIsConnected(true) });
        fishingSocket.on('disconnect', () => { setIsConnected(false) });
        fishingSocket.on('new-fish', newFish);

        return () => {
            fishingSocket.off('connect');
            fishingSocket.off('disconnect');
            fishingSocket.off('new-fish');
        };
    }, [fishingSocket, setIsConnected, fishingAnimationState, setFishingAnimationState, fish, setFish, setFishTimeout])

    function collectFish() {
        const FISH_CATCH_ANIMATION_MS = 1600;
        const ANIMATION_DELAY_BUFFER = 50;
        if (fishingAnimationState === FishingAnimationState.IdleWithFish) {
            setFishingAnimationState(FishingAnimationState.Catch);
            setTimeout(() => setFishingAnimationState(FishingAnimationState.Idle), FISH_CATCH_ANIMATION_MS - ANIMATION_DELAY_BUFFER);
        }
        clearTimeout(fishTimeout);
        fishingSocket.emit('collect-fish');
        setFish(null);
    }

    return (
        <>
            <AppShell>
                <Navbar/>
                <Flex style={{ height: '100%' }}direction='column' justify='space-around'>
                        <Container>
                                Connected: {String(isConnected)}
                               <AnimationManager state={fishingAnimationState} onClick={collectFish}/>
                        </Container>
                </Flex>
            
        
            </AppShell>
            <Login/>
        </>
        
    )
};