import { Group, LoadingOverlay, Modal, Select, Stack, TextInput, Title } from "@mantine/core"
import { useState } from "react";
import { useGetUserFish } from "../hooks/UseUserClient";
import { sortComparator } from "../util/util";
import { FishCard } from "./FishCard";

interface CollectionProps {
    isOpen: boolean;
    close: any;
}

export const Collection = (props: CollectionProps) => {

    const { data, isLoading } = useGetUserFish();
    const [sortValue, setSortValue] = useState<string>('Name');
    const [searchInput, setSearchInput] = useState<string>('');

    const filteredFish = data?.sort((a, b) => sortComparator(a, b, sortValue)).filter(e => {
        return e.fish.name.toLowerCase().includes(searchInput.toLowerCase());
    });

    return (
        <Modal
            opened={props.isOpen}
            onClose={() => {
                props.close();
                setSearchInput('');
            }}
            radius={30}
            size={'70%'}
            transitionProps={{ transition: 'fade', duration: 500 }}
        >
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Stack justify='center' align='center' gap='xl' style={{paddingBottom:'90px', paddingLeft: '1px', paddingRight: '1px'}}>
                <Title order={2} c='pondTeal.9'>Collection</Title>
                <Group justify={'center'}>
                <TextInput
                    placeholder='Search by Name'
                    onChange={(event: any) => setSearchInput(event.currentTarget.value)}
                />
                <Select
                    placeholder='Sort By'
                    data={['Name', 'Amount Caught', 'Largest Caught', 'Rarity', 'ID']}
                    defaultValue='Name'
                    value={sortValue}
                    onChange={(value) => {
                        setSortValue(value ?? 'Name')
                    }}
                />
                </Group>
                <Group justify='center' gap='lg'>
                {filteredFish?.map(e => 
                    <FishCard key={e.fish.id} fish={e.fish} largestCaught={e.maxLength} amountCaught={e.count}/>
                )}
                </Group>
            </Stack>
        </Modal>   
    )
}