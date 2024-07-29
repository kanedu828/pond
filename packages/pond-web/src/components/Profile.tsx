import {
	TextInput,
	Text,
	Alert,
	Button,
	Group,
	PasswordInput,
	Paper,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { BindGuestResponse } from '../../../shared/types/AuthTypes';
import { useBindGuest } from '../hooks/api/UseAuthClient';
import { useGetUser } from '../hooks/api/UseUserClient';
import { ModalContainer } from './ModalContainer';

interface ProfileProps {
  isOpen: boolean;
  close: any;
}

export const Profile = (props: ProfileProps) => {
	const { data: user, isLoading } = useGetUser();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { mutateAsync: bindGuest } = useBindGuest();

	const handleBindGuest = async () => {
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		const id = user?.id;
		if (!id) {
			setError('Error finding user ID.');
			return;
		}
		const res: BindGuestResponse = await bindGuest({ id, username, password });
		if (!res.success) {
			setError(res.message);
		}
	};

	return (
		<ModalContainer
			isOpen={props.isOpen}
			close={props.close}
			isLoading={isLoading}
			title="Profile"
		>
			<TextInput
				disabled
				label={
					<Text fw={700} c="pondTeal.9">
            Username
					</Text>
				}
				placeholder={user?.username}
			/>
			{!user?.isAccount && (
				<Paper w="30%" shadow="xs" radius="md" p="xl">
					<Text size="xl" fw={700} c="pondTeal.9">
            Link guest account
					</Text>
					{error !== '' && (
						<Alert
							variant="light"
							color="red"
							radius="lg"
							title={error}
							mb="md"
							icon={<IconInfoCircle />}
							styles={(theme) => ({
								wrapper: {
									justifyContent: 'center',
									alignItems: 'center',
									minHeight: 'unset', // Remove minimum height if any
								},
								body: {
									textAlign: 'center',
									padding: 0, // Remove padding from body
								},
								title: {
									textAlign: 'center',
									width: '100%',
									margin: 0, // Remove margin from title
									padding: 0, // Add some padding to title for spacing
								},
								icon: {
									marginRight: theme.spacing.sm, // Add some space between icon and text
									marginTop: 0, // Ensure icon is vertically centered
								},
							})}
						/>
					)}

					<TextInput
						label={
							<Text fw={700} c="pondTeal.9">
                New Username
							</Text>
						}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						mb="sm"
						radius="md"
					/>
					<PasswordInput
						label={
							<Text fw={700} c="pondTeal.9">
                New Password
							</Text>
						}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						mb="md"
						radius="md"
					/>

					<PasswordInput
						label={
							<Text fw={700} c="pondTeal.9">
                Confirm Password
							</Text>
						}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						mb="md"
						radius="md"
					/>

					<Group grow mb="md">
						<Button color="pondTeal.9" radius="md" onClick={handleBindGuest}>
							{'Link Account'}
						</Button>
					</Group>
				</Paper>
			)}
		</ModalContainer>
	);
};
