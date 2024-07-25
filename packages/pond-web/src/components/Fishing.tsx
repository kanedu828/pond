import {
	AppShell,
	AppShellFooter,
	BackgroundImage,
	Container,
	Flex,
	Group,
	LoadingOverlay,
	Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { FishInstance } from '../../../shared/types/types';
import { useGetUser } from '../hooks/api/UseUserClient';
import { FishingAnimationState } from '../types/types';
import FishingSocketSingleton from '../websockets/FishingSocketSingleton';
import { AnimationManager } from './AnimationManager';
import { CatchFishModal } from './CatchFishModal';
import { ExpBar } from './ExpBar';
import { Navbar } from './Navbar';
import { IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';
import SplashAudio from '../assets/audio/splash.mp3';
import AlertAudio from '../assets/audio/alert.mp3';
import { UpdateUsernameModal } from './UpdateUsernameModal';
import LilyPadFullBackground from '../assets/images/LilyPadBackground.png';

const splashAudio = new Audio(SplashAudio);
const alertAudio = new Audio(AlertAudio);

export const Fishing = () => {
	const fishingSocket = FishingSocketSingleton.getInstance().getSocket();
	const [isConnected, setIsConnected] = useState<boolean>(
		fishingSocket.connected,
	);
	const [fishingAnimationState, setFishingAnimationState] =
    useState<FishingAnimationState>(FishingAnimationState.Idle);
	const [fish, setFish] = useState<FishInstance | null>(null);
	// This is used to clear timeouts when fish are caught
	const [fishTimeout, setFishTimeout] = useState<number>(0);
	const [isCatchFishOpen, { open: openCatchFish, close: closeCatchFish }] =
    useDisclosure(false);

	const { data: userData, isLoading: isUserLoading } = useGetUser();
	const [exp, setExp] = useState(0);

	const [
		isUpdateUsernameOpen,
		{ open: openUpdateUsername, close: closeUpdateUsername },
	] = useDisclosure(false);

	// User Data
	useEffect(() => {
		if (!isUserLoading) {
			setExp(userData?.exp ?? 0);

			if (userData?.username.startsWith('guest-') && userData.isAccount) {
				openUpdateUsername();
			}
		}
	}, [userData, isUserLoading, openUpdateUsername]);

	// Initialize socket
	useEffect(() => {
		const newFish = (newFish: FishInstance) => {
			const FISH_APPEARING_ANIMATION_MS = 800;
			const millisecondsFishable = newFish.expirationDate - Date.now();
			alertAudio.play();
			if (
				fishingAnimationState === FishingAnimationState.Idle &&
        millisecondsFishable > 0
			) {
				document.title = 'New Fish!';
				setFish(newFish);
				setFishingAnimationState(FishingAnimationState.Appearing);
				setTimeout(
					() => setFishingAnimationState(FishingAnimationState.IdleWithFish),
					FISH_APPEARING_ANIMATION_MS,
				);
				const newFishTimeout = window.setTimeout(() => {
					setFishingAnimationState(FishingAnimationState.Idle);
					setFish(null);
					document.title = 'Pond';
				}, millisecondsFishable);
				setFishTimeout(newFishTimeout);
			}
		};

		fishingSocket.on('connect', () => {
			setIsConnected(true);
			notifications.hide('disconnected-from-server');
		});
		fishingSocket.on('disconnect', () => {
			setIsConnected(false);
			notifications.show({
				id: 'disconnected-from-server',
				title: 'Disconnected from the server!',
				message:
          'You cannot have more than one client connected to the server at a time. (e.g multiple browser tabs/windows)',
				autoClose: false,
				icon: <IconPlugConnectedX />,
				color: 'red',
			});
		});
		fishingSocket.on('new-fish', newFish);

		return () => {
			fishingSocket.off('connect');
			fishingSocket.off('disconnect');
			fishingSocket.off('new-fish');
		};
	}, [
		setIsConnected,
		fishingAnimationState,
		setFishingAnimationState,
		fish,
		setFish,
		setFishTimeout,
		fishingSocket,
		notifications,
		alertAudio,
	]);

	const collectFish = () => {
		const FISH_CATCH_ANIMATION_MS = 1600;
		const ANIMATION_DELAY_BUFFER = 50;
		document.title = 'Pond';
		if (fishingAnimationState === FishingAnimationState.IdleWithFish) {
			splashAudio.play();
			setFishingAnimationState(FishingAnimationState.Catch);
			setTimeout(() => {
				setFishingAnimationState(FishingAnimationState.Idle);
				openCatchFish();
				setExp(exp + (fish?.fish.expRewarded ?? 0));
			}, FISH_CATCH_ANIMATION_MS - ANIMATION_DELAY_BUFFER);
			clearTimeout(fishTimeout);
			fishingSocket.emit('collect-fish');
		}
	};

	if (!userData || isUserLoading) {
		return (
			<LoadingOverlay
				visible={true}
				zIndex={1000}
				loaderProps={{ color: 'pondTeal.9', size: 'xl' }}
			/>
		);
	}

	return (
		<BackgroundImage src={LilyPadFullBackground} w="100vw" h="100vh">
			<AppShell>
				<Navbar />
				<Flex
					style={{ height: '100%', marginBottom: '3em' }}
					direction="column"
					justify="space-around"
				>
					<Container>
						<AnimationManager
							state={fishingAnimationState}
							onClick={collectFish}
						/>
						<ExpBar name={userData?.username ?? ''} exp={exp} />
					</Container>
				</Flex>
				<AppShellFooter>
					<Group justify="flex-end" style={{ padding: '5px' }} align="center">
						<Text>v0.0.1</Text>
						{isConnected ? <IconPlugConnected /> : <IconPlugConnectedX />}
					</Group>
				</AppShellFooter>
			</AppShell>
			<CatchFishModal
				fishInstance={fish}
				isOpen={isCatchFishOpen}
				close={closeCatchFish}
			/>
			<UpdateUsernameModal
				isOpen={isUpdateUsernameOpen}
				close={closeUpdateUsername}
			/>
		</BackgroundImage>
	);
};
