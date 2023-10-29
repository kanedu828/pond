import { Button, Modal, Stack, Title } from "@mantine/core";
import { FishInstance } from "../../../shared/types/types";
import { FishCard } from "./FishCard";

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
            size='30rem'
            transitionProps={{ transition: 'fade', duration: 500 }}
        >
            <Stack align='center' justify='center'>
                <Title>New Fish!</Title>
                {props.fishInstance && <FishCard fish={props.fishInstance.fish} largestCaught={0} amountCaught={0} excludeCatchData/>}
                <Button color='teal' size='md' radius='xl' onClick={props.close}>
                    Close
                </Button>
            </Stack>
            
        </Modal>   
    );
}