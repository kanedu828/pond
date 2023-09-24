import { Button, Container, Flex } from "@mantine/core";
import { useLogout } from "../Hooks/UseAuthClient";

export const Navbar = () => {

    const logout = useLogout();


    const onClickLogout = async () => {
        logout.mutate();
    }

    return (
        <Container p={15}>
            <Flex gap='xl' justify='center'>
                <Button>Collection</Button>
                <Button>Leaderboard</Button>
                <Button onClick={onClickLogout}>
                    Logout
                </Button>
            </Flex>
        </Container>
    );
}