import { Group, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useGetUserFish } from '../hooks/api/UseUserClient';
import { sortComparator } from '../util/util';
import { FishCard } from './FishCard';
import { ModalContainer } from './ModalContainer';

interface CollectionProps {
  isOpen: boolean;
  close: any;
}

export const Collection = (props: CollectionProps) => {
	const { data, isLoading } = useGetUserFish();
	const [sortValue, setSortValue] = useState<string>('Name');
	const [searchInput, setSearchInput] = useState<string>('');

	const filteredFish = data
		?.sort((a, b) => sortComparator(a, b, sortValue))
		.filter((e) => {
			return e.fish.name.toLowerCase().includes(searchInput.toLowerCase());
		});

	return (
		<ModalContainer
			isOpen={props.isOpen}
			close={props.close}
			isLoading={isLoading}
			title="Collection"
		>
			<Group justify={'center'}>
				<TextInput
					placeholder="Search by Name"
					onChange={(event: any) => setSearchInput(event.currentTarget.value)}
				/>
				<Select
					placeholder="Sort By"
					data={['Name', 'Amount Caught', 'Largest Caught', 'Rarity', 'ID']}
					defaultValue="Name"
					value={sortValue}
					onChange={(value) => {
						setSortValue(value ?? 'Name');
					}}
				/>
			</Group>
			<Group justify="center" gap="lg">
				{filteredFish?.map((e) => (
					<FishCard
						key={e.fish.id}
						fish={e.fish}
						largestCaught={e.maxLength}
						amountCaught={e.count}
					/>
				))}
			</Group>
		</ModalContainer>
	);
};
