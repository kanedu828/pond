import { Button, Modal, Image, Stack, Title, Text, Group } from "@mantine/core";
import { FishInstance } from "../../../shared/types/types";

interface CatchFishModalProps {
    fishInstance: FishInstance | null;
    isOpen: boolean;
    close: any;
}

export const CatchFishModal = (props: CatchFishModalProps) => {
    return (
        <Modal
            opened={props.isOpen}
            onClose={() => {
                props.close();
            }}
            radius={30}
            size='60rem'
            transitionProps={{ transition: 'fade', duration: 500 }}
        >
            <Stack align='center' justify='center'>
                <Title>You caught a {props.fishInstance?.fish.rarity} fish!</Title>
                <Image h='300px' w='300px' src='https://dummyimage.com/500x500/000/ffffff.png'/>
                <Group justify='space-between'>
                    <Title>{props.fishInstance?.fish.name}</Title>
                    <Text size="sm" c="dimmed">
                        #{props.fishInstance?.fish.id}
                    </Text>
                </Group>
                
                <Text style={{width: '50%'}}>{props.fishInstance?.fish.description}</Text>
                <Text c='dimmed'>Length: {props.fishInstance?.length}cm</Text>
                <Button color='teal' size='md' radius='xl' onClick={props.close} style={{marginBottom: '20px'}}>
                    Close
                </Button>
            </Stack>
            
        </Modal>   
    );
}