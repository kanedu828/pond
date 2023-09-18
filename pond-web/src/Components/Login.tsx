import { Anchor, Container, Flex, LoadingOverlay, Title } from "@mantine/core";
import { useStatus } from "../Hooks/UseAuthClient";

export const Login = () => {
    document.title = 'Pond'
    
    const apiUrl = import.meta.env.VITE_POND_API_URL;

    const { isLoading, data } = useStatus();

    if (isLoading) {
        return (
            <LoadingOverlay visible overlayBlur={2} />
        );
    }

    return (
        <Container fluid>
            <Flex
                direction='column'
            >
            { data?.authenticated ? <Title> YOURE IN </Title> : <></>}
            <Title>
                Hello World
            </Title>
            <Anchor href={`${apiUrl}/auth/google`}>
                Login
            </Anchor>
            </Flex>
            
        </Container>
    );

};