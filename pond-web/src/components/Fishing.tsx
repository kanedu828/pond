import { AppShell, AppShellFooter, Container, Flex, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FishInstance } from "../../../shared/types/types";
import { useGetUser } from "../hooks/UseUserClient";
import { FishingAnimationState } from "../types/types";
import FishingSocketSingleton from "../websockets/FishingSocketSingleton";
import { AnimationManager } from "./AnimationManager";
import { CatchFishModal } from "./CatchFishModal";
import { ExpBar } from "./ExpBar";
import { Login } from "./Login";
import { Navbar } from "./Navbar";
import { IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';

const fishingSocket = FishingSocketSingleton.getInstance().getSocket();

export const Fishing = () => {
    const [isConnected, setIsConnected] = useState<boolean>(fishingSocket.connected);
    const [fishingAnimationState, setFishingAnimationState] = useState<FishingAnimationState>(FishingAnimationState.Idle);
    const [fish, setFish] = useState<FishInstance | null>(null);
    // This is used to clear timeouts when fish are caught
    const [fishTimeout, setFishTimeout] = useState<number>(0);
    const [isCatchFishOpen, { open: openCatchFish, close: closeCatchFish }] = useDisclosure(false);

    const { data: userData, isLoading: userIsLoading } = useGetUser();
    const [exp, setExp] = useState(0);
    
    // Set Exp
    useEffect(() => {
        if (!userIsLoading) {
            setExp(userData?.exp ?? 0);
        }
    }, [userData, userIsLoading]);

    // Initialize socket
    useEffect(() => {
        const newFish = (newFish: FishInstance) => {
            const FISH_APPEARING_ANIMATION_MS = 800;
            const millisecondsFishable = newFish.expirationDate - Date.now();
            if (fishingAnimationState === FishingAnimationState.Idle && millisecondsFishable > 0) {
                setFish(newFish);
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
            setTimeout(() => {
                setFishingAnimationState(FishingAnimationState.Idle);
                openCatchFish();
                setExp(exp + (fish?.fish.expRewarded ?? 0));
            }, FISH_CATCH_ANIMATION_MS - ANIMATION_DELAY_BUFFER);
            clearTimeout(fishTimeout);
            fishingSocket.emit('collect-fish');   
        }
    }

    return (
        <>
            <AppShell>
                <Navbar/>
                <Flex style={{ height: '100%' }}direction='column' justify='space-around'>
                        <Container>
                               <AnimationManager state={fishingAnimationState} onClick={collectFish}/>
                               <ExpBar exp={exp}/>
                        </Container>
                </Flex>
                <AppShellFooter>
                    <Group justify='flex-end' style={{padding:'5px'}} align='center'>
                        <Text>
                            v0.0.1
                        </Text>   
                        {isConnected ? <IconPlugConnected/> : <IconPlugConnectedX/>}       
                    </Group>
                    
                </AppShellFooter>
            
        
            </AppShell>
            <Login/>
            <CatchFishModal fishInstance={fish} isOpen={isCatchFishOpen} close={closeCatchFish}/>
        </>
        
    )
};