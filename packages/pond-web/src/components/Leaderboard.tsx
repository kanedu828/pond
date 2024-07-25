import { Modal, Stack, Title } from '@mantine/core';
import { useGetTopHundredUsersByExp } from '../hooks/api/UseUserClient';
import { LeaderboardTable } from './LeaderboardTable';

interface LeaderboardProps {
  isOpen: boolean;
  close: any;
}

export const Leaderboard = (props: LeaderboardProps) => {
	const { data } = useGetTopHundredUsersByExp();

	return (
		<Modal
			opened={props.isOpen}
			onClose={props.close}
			radius={30}
			transitionProps={{ transition: 'fade', duration: 500 }}
			size="70%"
			centered
		>
			<Stack
				justify="space-between"
				align="center"
				style={{ paddingBottom: '3%' }}
			>
				<Title order={2} c="pondTeal.9">
          Leaderboard
				</Title>
				<LeaderboardTable users={data ?? []} />
			</Stack>
		</Modal>
	);
};
