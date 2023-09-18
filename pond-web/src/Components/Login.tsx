import { Anchor, Container, Flex, Title } from "@mantine/core";
import { useCheckAuthentication } from "../Hooks/UseCheckAuthentication";

export const Login = () => {
    document.title = 'Pond'
    
    const apiUrl = import.meta.env.VITE_POND_API_URL;

    useCheckAuthentication();

    return (
        <Container fluid>
            <Flex
                direction='column'
            >
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