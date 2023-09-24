import { Anchor, Modal, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useStatus } from "../Hooks/UseAuthClient";

export const Login = () => {
    document.title = 'Pond'
    
    const apiUrl = import.meta.env.VITE_POND_API_URL;

    const { data } = useStatus();

    const [opened, { open, close }] = useDisclosure(data?.authenticated);

    useEffect(() => {
        if (!data?.authenticated) {
            open();
        } else {
            close();
        }
    }, [data])


    return (
        <Modal
            opened={opened}
            onClose={close}
            radius={0}
            fullScreen
            transitionProps={{ transition: 'fade', duration: 1000 }}
            withCloseButton={false}
        >
            <Stack justify='space-between' align='center'>
                <Title>Welcome to Pond!</Title>
                <Anchor href={`${apiUrl}/auth/google`}>
                    Login
                </Anchor>
            </Stack>
        </Modal>         
    );

};