import { Button, Container, Flex, UnstyledButton } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "../Hooks/UseAuthClient";
import { useCheckAuthentication } from "../Hooks/UseCheckAuthentication";

export const Navbar = () => {

    const logout = useLogout();
    const queryClient = useQueryClient();

    // useCheckAuthentication();

    return (
        <Container p={15}>
            <Flex gap='xl' justify='center'>
                <Button>Collection</Button>
                <Button>Leaderboard</Button>
                <Button onClick={async () => {
                    await logout.mutate();
                }}>
                    Logout
                </Button>
            </Flex>
        </Container>
    );
}