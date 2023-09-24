import { Modal, Stack } from "@mantine/core"

interface CollectionProps {
    isOpen: boolean;
    close: any;
}

export const Collection = (props: CollectionProps) => {
    return (
        <Modal
            opened={props.isOpen}
            onClose={props.close}
            radius={30}
            transitionProps={{ transition: 'fade', duration: 500 }}
        >
            <Stack justify='space-between' align='center'>
 
            </Stack>
        </Modal>   
    )
}