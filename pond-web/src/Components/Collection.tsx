import { LoadingOverlay, Modal, Stack } from "@mantine/core"
import { useGetUserFish } from "../Hooks/UseUserClient";

interface CollectionProps {
    isOpen: boolean;
    close: any;
}

export const Collection = (props: CollectionProps) => {

    const { data, isLoading } = useGetUserFish();

    return (
        <Modal
            opened={props.isOpen}
            onClose={props.close}
            radius={30}
            transitionProps={{ transition: 'fade', duration: 500 }}
        >
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Stack justify='space-between' align='center'>
            </Stack>
        </Modal>   
    )
}