import {
	Anchor,
	Group,
	Stack,
	Title,
	Image,
	Text,
	BackgroundImage,
	Button,
} from '@mantine/core';
import { useGuestLogin, useSetAuthCookie, useStatus } from '../hooks/api/UseAuthClient';
import IdleWithFishAnimation from '../assets/images/LoginPageImage.png';
import LilyPadBackground from '../assets/images/LilyPadBackground.png';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_POND_API_URL;

const loginButtonStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'white', // Google's button is typically white
	padding: '8px 16px',
	borderRadius: '4px',
	border: '1px solid #ddd', // Light border
	textDecoration: 'none', // Remove underline from anchor
};

export const Login = () => {
	useSetAuthCookie();
	const { mutateAsync: guestLogin } = useGuestLogin();
	const navigate = useNavigate();
	const { data: status } = useStatus();

	useEffect(() => {
		if (status?.authenticated) {
			navigate('/');
		}
	}, [status, navigate]);
	
	return (
		<BackgroundImage src={LilyPadBackground}>
			<Stack justify="center" style={{ height: '100vh' }}>
				<Group justify="center">
					<Image w="auto" src={IdleWithFishAnimation} />
					<Stack justify="space-around" align="center">
						<Title order={1} c="pondTeal.9">
							Welcome to Pond!
						</Title>
						<Anchor href={`${API_URL}/auth/google`} style={loginButtonStyle}>
							<Group align="center">
								<IconBrandGoogleFilled size={24} />
								<Text size="md" style={{ color: '#757575' }}>
									Sign in with Google
								</Text>
							</Group>
						</Anchor>
						<Button color={'pondTeal.9'} variant='outline' onClick={async () => {
							await guestLogin();
						}}>
							<Text size="md">
								Sign in as a Guest
							</Text>
						</Button>
					</Stack>
				</Group>
			</Stack>
		</BackgroundImage>
	);
};
